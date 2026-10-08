import { createClient } from "npm:@supabase/supabase-js@2";

/* =========================================================
   TYPE: PayMongoPayment

   Represents a payment attempt contained inside a
   PayMongo Checkout Session.
========================================================= */
type PayMongoPayment = {
    id?: string;
    attributes?: {
        status?: string;
        amount?: number;
        fee?: number;
        net_amount?: number;
        currency?: string;
        source?: {
            type?: string;
        };
    };
};

/* =========================================================
   TYPE: PayMongoCheckoutSession

   Represents the Checkout Session included in the
   checkout_session.payment.paid webhook.
========================================================= */
type PayMongoCheckoutSession = {
    id?: string;
    type?: string;
    attributes?: {
        reference_number?: string;
        metadata?: Record<string, string>;
        payments?: PayMongoPayment[];
    };
};

/* =========================================================
   TYPE: PayMongoWebhook

   Represents the current PayMongo webhook envelope used
   by Hosted Checkout.
========================================================= */
type PayMongoWebhook = {
    event_type?: string;

    data?: {
        type?: string;
        resource?: string;
        livemode?: boolean;
        organization_id?: string;
        created_at?: string;
        updated_at?: string;
        data?: PayMongoCheckoutSession;
    };
};

/* =========================================================
   FUNCTION: jsonResponse

   Returns a JSON response to PayMongo.
========================================================= */
function jsonResponse(body: Record<string, unknown>, status = 200) {
    return new Response(JSON.stringify(body), {
        status,
        headers: {
            "Content-Type": "application/json",
        },
    });
}

/* =========================================================
   FUNCTION: bytesToHex

   Converts binary HMAC output into hexadecimal text.
========================================================= */
function bytesToHex(bytes: Uint8Array) {
    return Array.from(bytes)
        .map((byte) => byte.toString(16).padStart(2, "0"))
        .join("");
}

/* =========================================================
   FUNCTION: createHmacSha256

   Generates the SHA-256 HMAC used to verify the
   PayMongo webhook signature.
========================================================= */
async function createHmacSha256(payload: string, secret: string) {
    const encoder = new TextEncoder();

    const key = await crypto.subtle.importKey(
        "raw",
        encoder.encode(secret),
        {
            name: "HMAC",
            hash: "SHA-256",
        },
        false,
        ["sign"],
    );

    const signature = await crypto.subtle.sign(
        "HMAC",
        key,
        encoder.encode(payload),
    );

    return bytesToHex(new Uint8Array(signature));
}

/* =========================================================
   FUNCTION: safeCompare

   Performs a constant-time comparison of two strings.
========================================================= */
function safeCompare(left: string, right: string) {
    if (left.length !== right.length) {
        return false;
    }

    let result = 0;

    for (let index = 0; index < left.length; index += 1) {
        result |= left.charCodeAt(index) ^ right.charCodeAt(index);
    }

    return result === 0;
}

/* =========================================================
   FUNCTION: parseSignatureHeader

   Parses PayMongo's:
   t=...,te=...,li=...
   signature header.
========================================================= */
function parseSignatureHeader(header: string) {
    const values: Record<string, string> = {};

    for (const part of header.split(",")) {
        const separator = part.indexOf("=");

        if (separator === -1) {
            continue;
        }

        const key = part.slice(0, separator).trim();

        const value = part.slice(separator + 1).trim();

        values[key] = value;
    }

    return {
        timestamp: values.t ?? "",
        testSignature: values.te ?? "",
        liveSignature: values.li ?? "",
    };
}

/* =========================================================
   FUNCTION: verifyPayMongoSignature

   Validates the Paymongo-Signature header against the
   endpoint's webhook secret.
========================================================= */
async function verifyPayMongoSignature(
    rawBody: string,
    signatureHeader: string,
    webhookSecret: string,
    livemode: boolean,
) {
    const { timestamp, testSignature, liveSignature } =
        parseSignatureHeader(signatureHeader);

    if (!timestamp) {
        return false;
    }

    const timestampNumber = Number(timestamp);

    if (!Number.isFinite(timestampNumber)) {
        return false;
    }

    /* =====================================================
       REPLAY PROTECTION
    ===================================================== */

    const currentTimestamp = Math.floor(Date.now() / 1000);

    const difference = Math.abs(currentTimestamp - timestampNumber);

    if (difference > 300) {
        console.error("Rejected stale PayMongo webhook.");

        return false;
    }

    /* =====================================================
       CREATE SIGNED PAYLOAD
    ===================================================== */

    const signedPayload = `${timestamp}.${rawBody}`;

    const expectedSignature = await createHmacSha256(
        signedPayload,
        webhookSecret,
    );

    const receivedSignature = livemode ? liveSignature : testSignature;

    if (!receivedSignature) {
        return false;
    }

    return safeCompare(expectedSignature, receivedSignature);
}

/* =========================================================
   FUNCTION: processPaidCheckout

   Locates the Vaulty payment represented by a successful
   PayMongo Checkout Session and marks it as paid.
========================================================= */
async function processPaidCheckout(
    supabaseAdmin: ReturnType<typeof createClient>,
    checkoutSession: PayMongoCheckoutSession,
) {
    const sessionId = checkoutSession.id;

    const attributes = checkoutSession.attributes;

    if (!attributes) {
        throw new Error("PayMongo Checkout Session attributes are missing.");
    }

    const referenceNumber = attributes.reference_number ?? null;

    const metadata = attributes.metadata ?? {};

    const vaultyPaymentId = metadata.vaulty_payment_id ?? null;

    const payments = Array.isArray(attributes.payments)
        ? attributes.payments
        : [];

    const paidPayment =
        payments.find((payment) => payment.attributes?.status === "paid") ??
        payments[payments.length - 1];

    const providerPaymentId = paidPayment?.id ?? null;

    const paymentStatus = paidPayment?.attributes?.status ?? null;

    const paymentMethod = paidPayment?.attributes?.source?.type ?? null;

    console.log("Vaulty PayMongo payment:", {
        sessionId,
        referenceNumber,
        vaultyPaymentId,
        providerPaymentId,
        paymentStatus,
        paymentMethod,
    });

    if (paymentStatus !== "paid") {
        console.log("Ignoring Checkout Session without a paid payment.");

        return;
    }

    /* =====================================================
       FIND PAYMENT
    ===================================================== */

    let query = supabaseAdmin
        .from("payments")
        .select("id, status, amount, currency")
        .limit(1);

    if (vaultyPaymentId) {
        query = query.eq("id", vaultyPaymentId);
    } else if (sessionId) {
        query = query.eq("provider_checkout_id", sessionId);
    } else if (referenceNumber) {
        query = query.eq("request_reference_number", referenceNumber);
    } else {
        throw new Error("Unable to identify the Vaulty payment.");
    }

    const { data: payment, error: paymentError } = await query.single();

    if (paymentError || !payment) {
        throw new Error("Vaulty payment record was not found.");
    }

    /* =====================================================
       IDEMPOTENCY
    ===================================================== */

    if (payment.status === "paid") {
        console.log("Payment already processed:", payment.id);

        return;
    }

    /* =====================================================
       UPDATE PAYMENT
    ===================================================== */

    const { error: updateError } = await supabaseAdmin
        .from("payments")
        .update({
            status: "paid",

            provider_payment_id: providerPaymentId,

            payment_method: paymentMethod,

            paid_at: new Date().toISOString(),

            metadata: checkoutSession,

            updated_at: new Date().toISOString(),
        })
        .eq("id", payment.id);

    if (updateError) {
        throw updateError;
    }

    console.log("Vaulty payment marked as paid:", payment.id);
}

/* =========================================================
   COMPONENT: PayMongoWebhook

   Receives, authenticates, and processes PayMongo
   Checkout Session webhook events.
========================================================= */
Deno.serve(async (req) => {
    if (req.method !== "POST") {
        return jsonResponse(
            {
                error: "Method not allowed.",
            },
            405,
        );
    }

    try {
        /* =================================================
               ENVIRONMENT
            ================================================= */

        const supabaseUrl = Deno.env.get("SUPABASE_URL");

        const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

        const webhookSecret = Deno.env.get("PAYMONGO_WEBHOOK_SECRET");

        if (!supabaseUrl || !serviceRoleKey || !webhookSecret) {
            console.error("Webhook environment configuration is incomplete.");

            return jsonResponse(
                {
                    error: "Webhook service is not configured.",
                },
                500,
            );
        }

        /* =================================================
               SUPABASE ADMIN CLIENT
            ================================================= */

        const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);

        /* =================================================
               RAW BODY
            ================================================= */

        const rawBody = await req.text();

        let payload: PayMongoWebhook;

        try {
            payload = JSON.parse(rawBody) as PayMongoWebhook;
        } catch {
            return jsonResponse(
                {
                    error: "Invalid JSON payload.",
                },
                400,
            );
        }

        /* =================================================
               CURRENT PAYMONGO EVENT
            ================================================= */

        const event = payload.data;

        if (!event) {
            return jsonResponse(
                {
                    received: true,
                },
                200,
            );
        }

        const eventType = event.type ?? payload.event_type ?? null;

        const livemode = event.livemode === true;

        console.log("PayMongo webhook received:", {
            eventType,
            livemode,
        });

        /* =================================================
               SIGNATURE
            ================================================= */

        const signatureHeader = req.headers.get("Paymongo-Signature");

        if (!signatureHeader) {
            console.error("Missing Paymongo-Signature header.");

            return jsonResponse(
                {
                    error: "Missing webhook signature.",
                },
                401,
            );
        }

        const signatureValid = await verifyPayMongoSignature(
            rawBody,
            signatureHeader,
            webhookSecret,
            livemode,
        );

        if (!signatureValid) {
            console.error("Invalid PayMongo webhook signature.");

            return jsonResponse(
                {
                    error: "Invalid webhook signature.",
                },
                401,
            );
        }

        /* =================================================
               IGNORE LIVE EVENTS IN OUR TEST ENVIRONMENT
            ================================================= */

        if (livemode) {
            console.warn("Ignoring live PayMongo event in test environment.");

            return jsonResponse(
                {
                    received: true,
                    ignored: true,
                },
                200,
            );
        }

        /* =================================================
               CHECK EVENT
            ================================================= */

        if (eventType !== "checkout_session.payment.paid") {
            console.log("Ignoring PayMongo event:", eventType);

            return jsonResponse(
                {
                    received: true,
                    ignored: true,
                },
                200,
            );
        }

        /* =================================================
               CHECKOUT SESSION RESOURCE
            ================================================= */

        const checkoutSession = event.data;

        if (!checkoutSession) {
            throw new Error("Checkout Session resource is missing.");
        }

        /* =================================================
               PROCESS PAYMENT
            ================================================= */

        await processPaidCheckout(supabaseAdmin, checkoutSession);

        /* =================================================
               ACKNOWLEDGE
            ================================================= */

        return jsonResponse(
            {
                received: true,
                processed: true,
            },
            200,
        );
    } catch (error) {
        console.error("paymongo-webhook failed:", error);

        return jsonResponse(
            {
                error:
                    error instanceof Error
                        ? error.message
                        : "Unable to process PayMongo webhook.",
            },
            500,
        );
    }
});
