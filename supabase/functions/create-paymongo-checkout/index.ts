import { withSupabase } from "npm:@supabase/server@^1";

/* =========================================================
   TYPE: CreateCheckoutRequest

   Defines the information Vaulty sends when a payment
   checkout is requested.
========================================================= */
type CreateCheckoutRequest = {
    amount: number;
    paymentType?: "rental" | "wallet_top_up";
    rentalId?: string | null;
};

/* =========================================================
   FUNCTION: createRequestReference

   Creates a unique reference used to connect the Vaulty
   payment record with the PayMongo checkout session.
========================================================= */
function createRequestReference() {
    return `VAULTY-${crypto.randomUUID()}`;
}

/* =========================================================
   FUNCTION: createPayMongoAuthorization

   Creates the Basic Authentication header required by
   the PayMongo API.
========================================================= */
function createPayMongoAuthorization(secretKey: string) {
    return `Basic ${btoa(`${secretKey}:`)}`;
}

/* =========================================================
   FUNCTION: jsonResponse

   Returns a consistent JSON response.
========================================================= */
function jsonResponse(body: Record<string, unknown>, status = 200) {
    return Response.json(body, { status });
}

/* =========================================================
   COMPONENT: createPayMongoCheckout

   Authenticates the signed-in Vaulty user, creates a pending
   payment record, creates a PayMongo Checkout Session, and
   returns the hosted checkout URL.
========================================================= */
export default {
    fetch: withSupabase({ auth: "user" }, async (req, ctx) => {
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
                   PAYMONGO SECRET
                ================================================= */

            const payMongoSecretKey = Deno.env.get("PAYMONGO_SECRET_KEY");

            if (!payMongoSecretKey) {
                console.error("PAYMONGO_SECRET_KEY is missing.");

                return jsonResponse(
                    {
                        error: "Payment service is not configured.",
                    },
                    500,
                );
            }

            /* =================================================
                   AUTHENTICATED USER
                ================================================= */

            const userId = ctx.userClaims?.id;
            const userEmail = ctx.userClaims?.email ?? null;

            if (!userId) {
                return jsonResponse(
                    {
                        error: "Unable to determine the signed-in user.",
                    },
                    401,
                );
            }

            /* =================================================
                   REQUEST BODY
                ================================================= */

            let body: CreateCheckoutRequest;

            try {
                body = (await req.json()) as CreateCheckoutRequest;
            } catch {
                return jsonResponse(
                    {
                        error: "Invalid request body.",
                    },
                    400,
                );
            }

            const amount = Number(body.amount);

            const paymentType = body.paymentType ?? "rental";

            const rentalId = body.rentalId ?? null;

            /* =================================================
                   VALIDATE PAYMENT TYPE
                ================================================= */

            if (paymentType !== "rental" && paymentType !== "wallet_top_up") {
                return jsonResponse(
                    {
                        error: "Invalid payment type.",
                    },
                    400,
                );
            }

            /* =================================================
                   VALIDATE AMOUNT
                ================================================= */

            if (!Number.isFinite(amount) || amount <= 0) {
                return jsonResponse(
                    {
                        error: "Payment amount must be greater than zero.",
                    },
                    400,
                );
            }

            /*
             * Keep two decimal places for PHP.
             */
            const normalizedAmount = Math.round(amount * 100) / 100;

            /*
             * PayMongo expects amounts in the smallest
             * currency unit.
             *
             * Example:
             * ₱100.00 -> 10000
             */
            const amountInCentavos = Math.round(normalizedAmount * 100);

            /* =================================================
                   REQUEST REFERENCE
                ================================================= */

            const requestReferenceNumber = createRequestReference();

            /* =================================================
                   CREATE PENDING PAYMENT

                   ctx.supabaseAdmin bypasses RLS and allows the
                   server to create the payment record.
                ================================================= */

            const { data: payment, error: paymentError } =
                await ctx.supabaseAdmin
                    .from("payments")
                    .insert({
                        user_id: userId,
                        rental_id: rentalId,
                        provider: "paymongo",
                        payment_type: paymentType,
                        amount: normalizedAmount,
                        currency: "PHP",
                        status: "pending",
                        request_reference_number: requestReferenceNumber,
                    })
                    .select("id, request_reference_number")
                    .single();

            if (paymentError) {
                console.error("Payment record creation failed:", paymentError);

                return jsonResponse(
                    {
                        error: "Unable to create the payment record.",
                    },
                    500,
                );
            }

            /* =================================================
                   PAYMONGO CHECKOUT PAYLOAD
                ================================================= */

                const checkoutPayload = {
                    data: {
                        attributes: {
                            line_items: [
                                {
                                    name: "Vaulty Wallet Top Up",
                                    amount: amountInCentavos,
                                    currency: "PHP",
                                    quantity: 1,
                                },
                            ],

                            payment_method_types: ["card"],

                            success_url:
                                "https://example.com/vaulty/payment/success",

                            cancel_url:
                                "https://example.com/vaulty/payment/cancel",

                            reference_number: requestReferenceNumber,
                        },
                    },
                };

            /* =================================================
                   CREATE PAYMONGO CHECKOUT
                ================================================= */

            const payMongoResponse = await fetch(
                "https://api.paymongo.com/v2/checkout_sessions",
                {
                    method: "POST",

                    headers: {
                        Authorization:
                            createPayMongoAuthorization(payMongoSecretKey),

                        "Content-Type": "application/json",
                    },

                    body: JSON.stringify(checkoutPayload),
                },
            );

            const payMongoJson = await payMongoResponse.json();

            /* =================================================
                   HANDLE PAYMONGO ERROR
                ================================================= */

            if (!payMongoResponse.ok) {
                console.error(
                    "PayMongo checkout creation failed:",
                    payMongoJson,
                );

                await ctx.supabaseAdmin
                    .from("payments")
                    .update({
                        status: "failed",
                        failure_reason: "PayMongo checkout creation failed.",
                        metadata: payMongoJson,
                        updated_at: new Date().toISOString(),
                    })
                    .eq("id", payment.id);

                return jsonResponse(
                    {
                        error: "Unable to create the PayMongo checkout.",
                    },
                    502,
                );
            }

            /* =================================================
                   READ PAYMONGO RESPONSE
                ================================================= */

            const checkoutSession = payMongoJson?.data;

            const checkoutId = checkoutSession?.id;

            const checkoutUrl = checkoutSession?.attributes?.checkout_url;

            if (!checkoutId || !checkoutUrl) {
                console.error(
                    "PayMongo returned an incomplete response:",
                    payMongoJson,
                );

                await ctx.supabaseAdmin
                    .from("payments")
                    .update({
                        status: "failed",
                        failure_reason:
                            "PayMongo returned an incomplete checkout response.",
                        metadata: payMongoJson,
                        updated_at: new Date().toISOString(),
                    })
                    .eq("id", payment.id);

                return jsonResponse(
                    {
                        error: "PayMongo returned an incomplete checkout response.",
                    },
                    502,
                );
            }

            /* =================================================
                   SAVE CHECKOUT INFORMATION
                ================================================= */

            const { error: updateError } = await ctx.supabaseAdmin
                .from("payments")
                .update({
                    provider_checkout_id: checkoutId,

                    status: "processing",

                    metadata: payMongoJson,

                    updated_at: new Date().toISOString(),
                })
                .eq("id", payment.id);

            if (updateError) {
                console.error("Failed to update payment:", updateError);

                return jsonResponse(
                    {
                        error: "Checkout was created, but Vaulty could not save its payment state.",
                    },
                    500,
                );
            }

            /* =================================================
                   RETURN CHECKOUT
                ================================================= */

            return jsonResponse({
                paymentId: payment.id,

                checkoutId,

                checkoutUrl,

                referenceNumber: requestReferenceNumber,

                email: userEmail,
            });
        } catch (error) {
            console.error("create-paymongo-checkout failed:", error);

            return jsonResponse(
                {
                    error:
                        error instanceof Error
                            ? error.message
                            : "Unable to create the payment checkout.",
                },
                500,
            );
        }
    }),
};
