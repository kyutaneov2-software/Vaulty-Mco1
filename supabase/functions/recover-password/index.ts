import { createClient } from "npm:@supabase/supabase-js@2";

/* =========================================================
   CONSTANT: CORS HEADERS
========================================================= */

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers":
        "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
};

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
   FUNCTION: getSecretKey

   Reads the server-side Supabase secret key from the
   Edge Function environment.
========================================================= */

function getSecretKey() {
    const raw = Deno.env.get("SUPABASE_SECRET_KEYS");

    if (!raw) {
        throw new Error("Supabase secret key is not configured.");
    }

    const keys = JSON.parse(raw);

    const secretKey = keys.default;

    if (!secretKey) {
        throw new Error("Default Supabase secret key is missing.");
    }

    return secretKey;
}

/* =========================================================
   FUNCTION: createAdminClient

   Creates the privileged Supabase client used for
   password recovery.
========================================================= */

function createAdminClient() {
    return createClient(Deno.env.get("SUPABASE_URL")!, getSecretKey(), {
        auth: {
            autoRefreshToken: false,
            persistSession: false,
        },
    });
}

/* =========================================================
   FUNCTION: normalizeEmail

   Normalizes the user's email before comparison.
========================================================= */

function normalizeEmail(email: string) {
    return email.trim().toLowerCase();
}

/* =========================================================
   FUNCTION: normalizeRecoveryCode

   Removes spaces and separators and normalizes the
   recovery code before hashing.
========================================================= */

function normalizeRecoveryCode(code: string) {
    return code.toUpperCase().replace(/[^A-Z0-9]/g, "");
}

/* =========================================================
   FUNCTION: hashRecoveryCode

   Creates the same SHA-256 hash format used during
   recovery-code generation.
========================================================= */

async function hashRecoveryCode(rawCode: string) {
    const encoded = new TextEncoder().encode(rawCode);

    const digest = await crypto.subtle.digest("SHA-256", encoded);

    return Array.from(new Uint8Array(digest))
        .map((byte) => byte.toString(16).padStart(2, "0"))
        .join("");
}

/* =========================================================
   FUNCTION: isStrongPassword

   Applies the same minimum password rules used by the
   Vaulty registration flow.
========================================================= */

function isStrongPassword(password: string) {
    return (
        password.length >= 8 &&
        /[A-Z]/.test(password) &&
        /\d/.test(password) &&
        /[^A-Za-z0-9]/.test(password)
    );
}

/* =========================================================
   FUNCTION: releaseClaim

   Releases a temporary recovery-code claim after a
   validation or password-update failure.
========================================================= */

async function releaseClaim(
    adminClient: ReturnType<typeof createAdminClient>,
    claimToken: string,
) {
    await adminClient.rpc("release_recovery_code", {
        p_claim_token: claimToken,
    });
}

/* =========================================================
   FUNCTION: completeClaim

   Permanently marks a successfully used recovery code
   as consumed.
========================================================= */

async function completeClaim(
    adminClient: ReturnType<typeof createAdminClient>,
    claimToken: string,
) {
    const { data, error } = await adminClient.rpc("complete_recovery_code", {
        p_claim_token: claimToken,
    });

    if (error || data !== true) {
        throw new Error("Unable to finalize recovery code.");
    }
}

/* =========================================================
   FUNCTION: recoverPassword

   Verifies the recovery code and email combination and
   updates the Supabase Auth password.
========================================================= */

async function recoverPassword(
    email: string,
    recoveryCode: string,
    newPassword: string,
) {
    const adminClient = createAdminClient();

    const normalizedCode = normalizeRecoveryCode(recoveryCode);

    const codeHash = await hashRecoveryCode(normalizedCode);

    const { data: claimRows, error: claimError } = await adminClient.rpc(
        "claim_recovery_code",
        {
            p_code_hash: codeHash,
        },
    );

    if (claimError) {
        throw new Error("Recovery information is invalid.");
    }

    const claim = Array.isArray(claimRows) ? claimRows[0] : null;

    if (!claim?.user_id || !claim?.claim_token) {
        throw new Error("Recovery information is invalid.");
    }

    const claimToken = claim.claim_token;

    try {
        const { data: userData, error: userError } =
            await adminClient.auth.admin.getUserById(claim.user_id);

        if (userError || !userData?.user) {
            throw new Error("Recovery information is invalid.");
        }

        const accountEmail = normalizeEmail(userData.user.email ?? "");

        if (accountEmail !== email) {
            throw new Error("Recovery information is invalid.");
        }

        const { error: passwordError } =
            await adminClient.auth.admin.updateUserById(claim.user_id, {
                password: newPassword,
            });

        if (passwordError) {
            throw new Error("Unable to update your password.");
        }

        /* =================================================
           COMPLETE RECOVERY CODE
        ================================================= */

        try {
            await completeClaim(adminClient, claimToken);
        } catch (finalizeError) {
            /*
             * Retry the finalization once more before giving
             * up. The claim remains locked temporarily if the
             * first finalization request fails.
             */
            console.error(
                "First recovery-code finalization failed:",
                finalizeError,
            );

            await completeClaim(adminClient, claimToken);
        }

        return true;
    } catch (error) {
        await releaseClaim(adminClient, claimToken);

        throw error;
    }
}

/* =========================================================
   FUNCTION: handleRequest

   Receives a password-recovery request, validates the
   input, verifies the recovery code, and updates the
   user's password.
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

    try {
        const body = await request.json();

        const email = normalizeEmail(String(body?.email ?? ""));

        const recoveryCode = String(body?.recoveryCode ?? "");

        const newPassword = String(body?.newPassword ?? "");

        if (!email || !recoveryCode || !newPassword) {
            return jsonResponse(
                {
                    error: "Please complete all recovery fields.",
                },
                400,
            );
        }

        const normalizedCode = normalizeRecoveryCode(recoveryCode);

        if (normalizedCode.length !== 16) {
            return jsonResponse(
                {
                    error: "Recovery information is invalid.",
                },
                400,
            );
        }

        if (!isStrongPassword(newPassword)) {
            return jsonResponse(
                {
                    error: "Password must contain at least 8 characters, one uppercase letter, one number, and one special character.",
                },
                400,
            );
        }

        await recoverPassword(email, normalizedCode, newPassword);

        return jsonResponse({
            success: true,
            message: "Your password has been reset successfully.",
        });
    } catch (error) {
        console.error("Password recovery failed:", error);

        const message = error instanceof Error ? error.message : "";

        if (message === "Recovery information is invalid.") {
            return jsonResponse(
                {
                    error: "The email or recovery code is invalid.",
                },
                400,
            );
        }

        return jsonResponse(
            {
                error: "Unable to reset your password. Please try again.",
            },
            500,
        );
    }
}

/* =========================================================
   EDGE FUNCTION: recover-password

   Public recovery endpoint. JWT verification is disabled
   at the gateway because the user has forgotten the
   password and therefore does not have an authenticated
   session.
========================================================= */

Deno.serve(handleRequest);
