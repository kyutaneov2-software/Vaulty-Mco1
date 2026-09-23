import { supabase } from "../lib/supabase";

import { Wallet, WalletTransaction } from "../types";

export async function getMyWallet(): Promise<Wallet> {
    const {
        data: { user },
        error: userError,
    } = await supabase.auth.getUser();

    if (userError) {
        throw userError;
    }

    if (!user) {
        throw new Error("You must be logged in to view your wallet.");
    }

    const { data, error } = await supabase
        .from("wallets")
        .select("id, user_id, balance, created_at")
        .eq("user_id", user.id)
        .single();

    if (error) {
        throw error;
    }

    return {
        id: data.id,
        userId: data.user_id,
        balance: data.balance,
        createdAt: data.created_at,
    };
}

export async function getMyTransactions(): Promise<WalletTransaction[]> {
    const {
        data: { user },
        error: userError,
    } = await supabase.auth.getUser();

    if (userError) {
        throw userError;
    }

    if (!user) {
        throw new Error("You must be logged in to view your transactions.");
    }

    const { data: wallet, error: walletError } = await supabase
        .from("wallets")
        .select("id")
        .eq("user_id", user.id)
        .single();

    if (walletError) {
        throw walletError;
    }

    const { data, error } = await supabase
        .from("wallet_transactions")
        .select(
            `
        id,
        wallet_id,
        type,
        amount,
        balance_after,
        reference,
        description,
        created_at
      `,
        )
        .eq("wallet_id", wallet.id)
        .order("created_at", {
            ascending: false,
        });

    if (error) {
        throw error;
    }

    return data.map((transaction) => ({
        id: transaction.id,
        walletId: transaction.wallet_id,
        type: transaction.type,
        amount: transaction.amount,
        balanceAfter: transaction.balance_after,
        reference: transaction.reference,
        description: transaction.description,
        createdAt: transaction.created_at,
    }));
}

export async function devTopUp(amount: number): Promise<{
    newBalance: number;
    transactionId: string;
}> {
    const allowedAmounts = [100, 250, 500, 1000, 5000];

    if (!allowedAmounts.includes(amount)) {
        throw new Error("Invalid top-up amount.");
    }

    const { data, error } = await supabase.rpc("dev_top_up_points", {
        p_amount: amount,
    });

    if (error) {
        throw error;
    }

    if (!data || data.length === 0) {
        throw new Error("Top-up failed.");
    }

    return {
        newBalance: data[0].new_balance,
        transactionId: data[0].transaction_id,
    };
}