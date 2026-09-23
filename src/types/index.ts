export type User = {
    id: string;
    name: string;
    email: string;
};

export type Wallet = {
    id: string;
    userId: string;
    balance: number;
    createdAt: string;
};

export type WalletTransactionType =
    | "top_up"
    | "rental"
    | "refund"
    | "promo"
    | "adjustment";

export type WalletTransaction = {
    id: string;
    walletId: string;
    type: WalletTransactionType;
    amount: number;
    balanceAfter: number;
    reference: string | null;
    description: string | null;
    createdAt: string;
};
