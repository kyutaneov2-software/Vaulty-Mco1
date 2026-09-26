import { createClient } from "npm:@supabase/supabase-js@2";

/* =========================================================
   CONSTANT: CORS HEADERS

   Allows the Edge Function to respond correctly to
   requests originating from application clients.
========================================================= */

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers":
        "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const RECOVERY_CODE_COUNT = 8;

const RECOVERY_CODE_LENGTH = 16;

const RECOVERY_CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

/* =========================================================
   FUNCTION: jsonResponse

   Creates a JSON response with the required CORS headers.
========================================================= */

function jsonResponse(body: unknown, status = 200) {
    return new Response(JSON.stringify(body), {
        status,
        headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
        },
    });
}

/* =========================================================
   FUNCTION: getSupabaseKeys

   Reads the current Supabase publishable and secret keys
   provided to the Edge Function runtime.
========================================================= */

function getSupabaseKeys() {
    const publishableKeysRaw = Deno.env.get("SUPABASE_PUBLISHABLE_KEYS");

    const secretKeysRaw = Deno.env.get("SUPABASE_SECRET_KEYS");

    if (!publishableKeysRaw || !secretKeysRaw) {
        throw new Error("Supabase function keys are not configured.");
    }

    const publishableKeys = JSON.parse(publishableKeysRaw);

    const secretKeys = JSON.parse(secretKeysRaw);

    const publishableKey = publishableKeys.default;

    const secretKey = secretKeys.default;

    if (!publishableKey || !secretKey) {
        throw new Error("Default Supabase function keys are missing.");
    }

    return {
        publishableKey,
        secretKey,
    };
}

/* =========================================================
   FUNCTION: createAdminClient

   Creates the privileged Supabase client used only for
   server-side recovery-code database operations.
========================================================= */

function createAdminClient() {
    const { secretKey } = getSupabaseKeys();

    return createClient(Deno.env.get("SUPABASE_URL")!, secretKey, {
        auth: {
            autoRefreshToken: false,
            persistSession: false,
        },
    });
}

/* =========================================================
   FUNCTION: createUserClient

   Creates an RLS-aware client representing the currently
   authenticated Vaulty user.
========================================================= */

function createUserClient(accessToken: string) {
    const { publishableKey } = getSupabaseKeys();

    return createClient(Deno.env.get("SUPABASE_URL")!, publishableKey, {
        global: {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        },
        auth: {
            autoRefreshToken: false,
            persistSession: false,
        },
    });
}

/* =========================================================
   FUNCTION: generateRawRecoveryCode

   Generates one cryptographically random 16-character
   recovery code using an alphabet without ambiguous
   characters such as 0, O, 1, and I.
========================================================= */

function generateRawRecoveryCode() {
    const result: string[] = [];

    while (result.length < RECOVERY_CODE_LENGTH) {
        const bytes = new Uint8Array(32);

        crypto.getRandomValues(bytes);

        const limit = 256 - (256 % RECOVERY_CODE_ALPHABET.length);

        for (const byte of bytes) {
            if (byte >= limit) {
                continue;
            }

            result.push(
                RECOVERY_CODE_ALPHABET[byte % RECOVERY_CODE_ALPHABET.length],
            );

            if (result.length === RECOVERY_CODE_LENGTH) {
                break;
            }
        }
    }

    return result.join("");
}

/* =========================================================
   FUNCTION: formatRecoveryCode

   Formats a raw recovery code into readable groups of
   four characters.
========================================================= */

function formatRecoveryCode(rawCode: string) {
    return rawCode.match(/.{1,4}/g)?.join("-") ?? rawCode;
}

/* =========================================================
   FUNCTION: hashRecoveryCode

   Produces a SHA-256 hash of the normalized recovery
   code before it is stored in PostgreSQL.
========================================================= */

async function hashRecoveryCode(rawCode: string) {
    const encoded = new TextEncoder().encode(rawCode);

    const digest = await crypto.subtle.digest("SHA-256", encoded);

    return Array.from(new Uint8Array(digest))
        .map((byte) => byte.toString(16).padStart(2, "0"))
        .join("");
}

/* =========================================================
   FUNCTION: generateRecoveryCodes

   Creates a fresh set of one-time recovery codes and
   replaces the user's previous recovery-code set.
========================================================= */

async function generateRecoveryCodes() {
    const rawCodes = Array.from(
        {
            length: RECOVERY_CODE_COUNT,
        },
        generateRawRecoveryCode,
    );

    const formattedCodes = rawCodes.map(formatRecoveryCode);

    const codeHashes = await Promise.all(rawCodes.map(hashRecoveryCode));

    const adminClient = createAdminClient();

    const expiration = new Date();

    expiration.setDate(expiration.getDate() + 90);

    return {
        formattedCodes,
        codeHashes,
        expiresAt: expiration.toISOString(),
        adminClient,
    };
}

/* =========================================================
   FUNCTION: handleRequest

   Authenticates the AAL2 user, generates the recovery
   codes, stores only their hashes, and returns the raw
   codes exactly once to the authenticated client.
========================================================= */

async function handleRequest(request: Request) {
    if (request.method === "OPTIONS") {
        return new Response("ok", {
            headers: corsHeaders,
        });
    }

    if (request.method !== "POST") {
        return jsonResponse(
            {
                error: "Method not allowed.",
            },
            405,
        );
    }

    const authorization = request.headers.get("Authorization");

    if (!authorization || !authorization.startsWith("Bearer ")) {
        return jsonResponse(
            {
                error: "Authentication required.",
            },
            401,
        );
    }

    const accessToken = authorization.slice(7);

    const userClient = createUserClient(accessToken);

    const {
        data: { user },
        error: userError,
    } = await userClient.auth.getUser(accessToken);

    if (userError || !user) {
        return jsonResponse(
            {
                error: "Authentication required.",
            },
            401,
        );
    }

    const { data: assurance, error: assuranceError } =
        await userClient.auth.mfa.getAuthenticatorAssuranceLevel(accessToken);

    if (assuranceError || assurance?.currentLevel !== "aal2") {
        return jsonResponse(
            {
                error: "A fully verified account session is required.",
            },
            403,
        );
    }

    try {
        const { formattedCodes, codeHashes, expiresAt, adminClient } =
            await generateRecoveryCodes();

        const { error: replacementError } = await adminClient.rpc(
            "replace_recovery_codes",
            {
                p_user_id: user.id,
                p_code_hashes: codeHashes,
                p_expires_at: expiresAt,
            },
        );

        if (replacementError) {
            throw replacementError;
        }

        return jsonResponse({
            success: true,
            codes: formattedCodes,
            expiresAt,
        });
    } catch (error) {
        console.error("Recovery-code generation failed:", error);

        return jsonResponse(
            {
                error: "Unable to create recovery codes. Please try again.",
            },
            500,
        );
    }
}

/* =========================================================
   EDGE FUNCTION: generate-recovery-codes

   Entry point for generating a fresh recovery-code set
   after successful AAL2 authentication.
========================================================= */

Deno.serve(handleRequest);
