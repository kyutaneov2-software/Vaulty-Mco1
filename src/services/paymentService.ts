import {
    FunctionsHttpError,
    FunctionsFetchError,
    FunctionsRelayError,
} from "@supabase/supabase-js";

import { supabase } from "../lib/supabase";

/* =========================================================
   TYPE: CreateCheckoutOptions

   Defines the information sent when Vaulty requests a
   PayMongo Hosted Checkout Session.
========================================================= */
type CreateCheckoutOptions = {
    amount: number;
    paymentType?: "rental" | "wallet_top_up";
    rentalId?: string | null;
};

/* =========================================================
   TYPE: CheckoutResult

   Defines the successful response returned by the
   create-paymongo-checkout Edge Function.
========================================================= */
export type CheckoutResult = {
    paymentId: string;
    checkoutId: string;
    checkoutUrl: string;
    referenceNumber: string;
    email: string | null;
};

/* =========================================================
   FUNCTION: getFunctionErrorMessage

   Extracts the actual error response returned by the
   Supabase Edge Function.
========================================================= */
async function getFunctionErrorMessage(error: unknown): Promise<string> {
    if (error instanceof FunctionsHttpError) {
        try {
            const responseBody = await error.context.json();

            console.error("Vaulty Edge Function response:", responseBody);

            if (responseBody?.error && typeof responseBody.error === "string") {
                return responseBody.error;
            }

            if (
                responseBody?.message &&
                typeof responseBody.message === "string"
            ) {
                return responseBody.message;
            }

            return JSON.stringify(responseBody);
        } catch {
            return error.message;
        }
    }

    if (error instanceof FunctionsRelayError) {
        return `Supabase relay error: ${error.message}`;
    }

    if (error instanceof FunctionsFetchError) {
        return `Supabase network error: ${error.message}`;
    }

    if (error instanceof Error) {
        return error.message;
    }

    return String(error ?? "Unknown payment error.");
}

/* =========================================================
   FUNCTION: createPayMongoCheckout

   Creates a PayMongo Hosted Checkout Session through the
   authenticated Supabase Edge Function.
========================================================= */
export async function createPayMongoCheckout(
    options: CreateCheckoutOptions,
): Promise<CheckoutResult> {
    const { data, error } = await supabase.functions.invoke(
        "create-paymongo-checkout",
        {
            body: {
                amount: options.amount,
                paymentType: options.paymentType ?? "wallet_top_up",
                rentalId: options.rentalId ?? null,
            },
        },
    );

    if (error) {
        const message = await getFunctionErrorMessage(error);

        console.error("createPayMongoCheckout failed:", message);

        throw new Error(message);
    }

    if (!data?.checkoutUrl) {
        console.error("Invalid checkout response:", data);

        throw new Error("PayMongo did not return a checkout URL.");
    }

    return {
        paymentId: data.paymentId,
        checkoutId: data.checkoutId,
        checkoutUrl: data.checkoutUrl,
        referenceNumber: data.referenceNumber,
        email: data.email ?? null,
    };
}
