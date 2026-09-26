import { FunctionsHttpError } from "@supabase/supabase-js";

import { supabase } from "../lib/supabase";

/* =========================================================
   VARIABLE: pendingRecoveryCodes

   Holds newly generated raw recovery codes temporarily in
   application memory. They are never persisted to disk.
========================================================= */

let pendingRecoveryCodes: string[] | null = null;

/* =========================================================
   FUNCTION: generateRecoveryCodes

   Requests a fresh recovery-code set from the secure
   server-side Edge Function.
========================================================= */

export async function generateRecoveryCodes(): Promise<string[]> {
    const { data, error } = await supabase.functions.invoke(
        "generate-recovery-codes",
        {
            body: {},
        },
    );

    if (error) {
        throw error;
    }

    const codes = data?.codes;

    if (
        !Array.isArray(codes) ||
        codes.length !== 8 ||
        !codes.every((code: unknown) => typeof code === "string")
    ) {
        throw new Error("The recovery codes could not be created correctly.");
    }

    pendingRecoveryCodes = codes;

    return codes;
}

/* =========================================================
   FUNCTION: getPendingRecoveryCodes

   Returns the currently displayed recovery codes from
   application memory.
========================================================= */

export function getPendingRecoveryCodes() {
    return pendingRecoveryCodes;
}

/* =========================================================
   FUNCTION: clearPendingRecoveryCodes

   Removes raw recovery codes from application memory after
   the user finishes saving them.
========================================================= */

export function clearPendingRecoveryCodes() {
    pendingRecoveryCodes = null;
}

/* =========================================================
   FUNCTION: getFunctionErrorMessage

   Extracts a user-friendly error message returned by a
   Supabase Edge Function.
========================================================= */

async function getFunctionErrorMessage(error: unknown) {
    if (error instanceof FunctionsHttpError) {
        try {
            const body = await error.context.json();

            if (typeof body?.error === "string") {
                return body.error;
            }
        } catch {
            // Fall back to the generic message below.
        }
    }

    return error instanceof Error
        ? error.message
        : "Unable to complete password recovery.";
}

/* =========================================================
   FUNCTION: recoverPassword

   Sends the user's email, recovery code, and new password
   to the secure recovery Edge Function.
========================================================= */

export async function recoverPassword(
    email: string,
    recoveryCode: string,
    newPassword: string,
) {
    const { data, error } = await supabase.functions.invoke(
        "recover-password",
        {
            body: {
                email: email.trim().toLowerCase(),

                recoveryCode: recoveryCode.trim().toUpperCase(),

                newPassword,
            },
        },
    );

    if (error) {
        throw new Error(await getFunctionErrorMessage(error));
    }

    if (!data?.success) {
        throw new Error("Unable to reset your password.");
    }

    return true;
}
