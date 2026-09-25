import {
    PropsWithChildren,
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";

import type { Session } from "@supabase/supabase-js";

import { setRememberSession, supabase } from "../lib/supabase";
import { User } from "../types";

export type MfaStage = "signed_out" | "setup" | "challenge" | "ready";

type AuthContextValue = {
    user: User | null;
    isLoading: boolean;
    mfaStage: MfaStage;

    signUp: (
        name: string,
        email: string,
        password: string,
        rememberMe: boolean,
    ) => Promise<MfaStage>;

    signIn: (
        email: string,
        password: string,
        rememberMe: boolean,
    ) => Promise<MfaStage>;

    signOut: () => Promise<void>;

    refreshAuthState: () => Promise<MfaStage>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const normalizeEmail = (email: string) => email.trim().toLowerCase();

/**
 * Load the user's profile.
 *
 * maybeSingle() prevents PGRST116 when the profile
 * does not exist.
 */
async function getProfile(session: Session): Promise<User | null> {
    const { data, error } = await supabase
        .from("profiles")
        .select("id, name")
        .eq("id", session.user.id)
        .maybeSingle();

    if (error) {
        throw error;
    }

    if (!data) {
        return null;
    }

    return {
        id: data.id,
        name: data.name,
        email: session.user.email ?? "",
    };
}

/**
 * Determine whether the current session needs:
 *
 * setup    → no verified TOTP factor
 * challenge → TOTP exists but current session is only AAL1
 * ready     → current session is AAL2
 */
async function getMfaStage(): Promise<"setup" | "challenge" | "ready"> {
    const { data: factors, error: factorsError } =
        await supabase.auth.mfa.listFactors();

    if (factorsError) {
        throw factorsError;
    }

    const verifiedTotp = factors.totp?.some(
        (factor) => factor.status === "verified",
    );

    if (!verifiedTotp) {
        return "setup";
    }

    const { data: aal, error: aalError } =
        await supabase.auth.mfa.getAuthenticatorAssuranceLevel();

    if (aalError) {
        throw aalError;
    }

    if (aal.currentLevel === "aal2") {
        return "ready";
    }

    return "challenge";
}

export function AuthProvider({ children }: PropsWithChildren) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const [mfaStage, setMfaStage] = useState<MfaStage>("signed_out");

    /**
     * Synchronize application authentication state
     * with the current Supabase session.
     */
    const syncSession = useCallback(
        async (session: Session | null): Promise<MfaStage> => {
            if (!session) {
                setUser(null);
                setMfaStage("signed_out");
                return "signed_out";
            }

            try {
                const profile = await getProfile(session);

                /**
                 * Session exists but its profile does not.
                 * This handles stale sessions after manually
                 * deleting users from Supabase.
                 */
                if (!profile) {
                    console.log("Session has no profile. Signing out locally.");

                    await supabase.auth.signOut({
                        scope: "local",
                    });

                    setUser(null);
                    setMfaStage("signed_out");

                    return "signed_out";
                }

                const stage = await getMfaStage();

                setUser(profile);
                setMfaStage(stage);

                return stage;
            } catch (error) {
                console.error("Failed to synchronize auth state:", error);

                try {
                    await supabase.auth.signOut({
                        scope: "local",
                    });
                } catch (signOutError) {
                    console.error(
                        "Failed to clear local session:",
                        signOutError,
                    );
                }

                setUser(null);
                setMfaStage("signed_out");

                return "signed_out";
            }
        },
        [],
    );

    /**
     * Initial session restoration.
     */
    useEffect(() => {
        let mounted = true;

        const loadInitialSession = async () => {
            try {
                const {
                    data: { session },
                    error,
                } = await supabase.auth.getSession();

                if (error) {
                    throw error;
                }

                if (!mounted) {
                    return;
                }

                await syncSession(session);
            } catch (error) {
                console.error("Failed to restore session:", error);

                if (mounted) {
                    setUser(null);
                    setMfaStage("signed_out");
                }
            } finally {
                if (mounted) {
                    setIsLoading(false);
                }
            }
        };

        loadInitialSession();

        /**
         * Listen for auth changes.
         *
         * The profile/MFA queries are deferred so we don't
         * execute additional Supabase requests directly
         * inside the auth callback.
         */
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            if (!mounted) {
                return;
            }

            setTimeout(() => {
                if (!mounted) {
                    return;
                }

                syncSession(session).catch((error) => {
                    console.error("Failed after auth state change:", error);
                });
            }, 0);
        });

        return () => {
            mounted = false;
            subscription.unsubscribe();
        };
    }, [syncSession]);

    /**
     * REGISTER
     *
     * Confirm Email must be disabled for this flow.
     *
     * signUp()
     *    ↓
     * authenticated AAL1 session
     *    ↓
     * TOTP setup
     */
    const signUp = useCallback(
        async (
            name: string,
            email: string,
            password: string,
            rememberMe: boolean,
        ): Promise<MfaStage> => {
            const cleanName = name.trim();
            const cleanEmail = normalizeEmail(email);

            if (!cleanName) {
                throw new Error("Please enter your full name.");
            }

            if (!cleanEmail) {
                throw new Error("Please enter your email.");
            }

            if (password.length < 8) {
                throw new Error("Password must be at least 8 characters.");
            }

            const emailIsValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail);

            if (!emailIsValid) {
                throw new Error("Please enter a valid email address.");
            }

            setRememberSession(rememberMe);

            const { data, error } = await supabase.auth.signUp({
                email: cleanEmail,
                password,
                options: {
                    data: {
                        name: cleanName,
                    },
                },
            });

            if (error) {
                throw new Error(error.message);
            }

            if (!data.user) {
                throw new Error("Unable to create your account.");
            }

            if (!data.session) {
                throw new Error(
                    "Account created, but no session was created. Please make sure Confirm Email is disabled in Supabase.",
                );
            }

            return await syncSession(data.session);
        },
        [syncSession],
    );

    /**
     * LOGIN
     */
    const signIn = useCallback(
        async (
            email: string,
            password: string,
            rememberMe: boolean,
        ): Promise<MfaStage> => {
            const cleanEmail = normalizeEmail(email);

            if (!cleanEmail || !password) {
                throw new Error("Please enter your email and password.");
            }

            const emailIsValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail);

            if (!emailIsValid) {
                throw new Error("Please enter a valid email address.");
            }

            setRememberSession(rememberMe);

            const { data, error } = await supabase.auth.signInWithPassword({
                email: cleanEmail,
                password,
            });

            if (error) {
                throw new Error("Invalid email or password.");
            }

            if (!data.session) {
                throw new Error("Unable to create an authenticated session.");
            }

            return await syncSession(data.session);
        },
        [syncSession],
    );

    /**
     * Refresh the current authentication state.
     *
     * Used after successful TOTP enrollment or verification.
     */
    const refreshAuthState = useCallback(async (): Promise<MfaStage> => {
        const {
            data: { session },
            error,
        } = await supabase.auth.getSession();

        if (error) {
            throw error;
        }

        return await syncSession(session);
    }, [syncSession]);

    /**
     * LOGOUT
     */
    const signOut = useCallback(async () => {
        const { error } = await supabase.auth.signOut({
            scope: "local",
        });

        if (error) {
            throw new Error(error.message);
        }

        setUser(null);
        setMfaStage("signed_out");
    }, []);

    const value = useMemo<AuthContextValue>(
        () => ({
            user,
            isLoading,
            mfaStage,
            signUp,
            signIn,
            signOut,
            refreshAuthState,
        }),
        [user, isLoading, mfaStage, signUp, signIn, signOut, refreshAuthState],
    );

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("useAuth must be used inside AuthProvider.");
    }

    return context;
}
