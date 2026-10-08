import {
    PropsWithChildren,
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";

import { getMyWallet } from "../services/walletService";
import { useAuth } from "./AuthContext";

/* =========================================================
   TYPES
========================================================= */

type WalletContextValue = {
    balance: number;
    walletId: string | null;
    loading: boolean;
    refresh: () => Promise<void>;
};

const WalletContext = createContext<WalletContextValue | undefined>(undefined);

/* =========================================================
   PROVIDER
========================================================= */

export function WalletProvider({ children }: PropsWithChildren) {
    const { user } = useAuth();

    const [balance, setBalance] = useState(0);
    const [walletId, setWalletId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    /* ---------------------------------------------------------
       FUNCTION: refresh

       Reloads the wallet from Supabase. Called on mount,
       when the user changes, and by any screen that performs
       a wallet mutation (rental, top-up).
    --------------------------------------------------------- */
    const refresh = useCallback(async () => {
        if (!user) {
            setBalance(0);
            setWalletId(null);
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            const wallet = await getMyWallet();

            if (wallet) {
                setBalance(wallet.balance);
                setWalletId((wallet as any).id ?? null);
            } else {
                setBalance(0);
                setWalletId(null);
            }
        } catch (error) {
            console.error("Wallet refresh failed:", error);
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        refresh();
    }, [refresh]);

    const value = useMemo<WalletContextValue>(
        () => ({ balance, walletId, loading, refresh }),
        [balance, walletId, loading, refresh],
    );

    return (
        <WalletContext.Provider value={value}>
            {children}
        </WalletContext.Provider>
    );
}

/* =========================================================
   HOOK
========================================================= */

export function useWallet() {
    const context = useContext(WalletContext);

    if (!context) {
        throw new Error("useWallet must be used inside WalletProvider.");
    }

    return context;
}
