import {
    PropsWithChildren,
    createContext,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";

import type { Session } from "@supabase/supabase-js";

import { setRememberSession, supabase } from "../lib/supabase";

import { User } from "../types";

type AuthContextValue = {
    user: User | null;
    isLoading: boolean;

    signIn: (
        email: string,
        password: string,
        rememberMe: boolean,
    ) => Promise<void>;

    signUp: (
        name: string,
        email: string,
        password: string,
        rememberMe: boolean,
    ) => Promise<void>;

    signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const normalizeEmail = (email: string) => email.trim().toLowerCase();

async function getProfile(session: Session): Promise<User> {
    const { data, error } = await supabase
        .from("profiles")
        .select("id, name, points")
        .eq("id", session.user.id)
        .single();

    if (error) {
        throw error;
    }

    return {
        id: data.id,
        name: data.name,
        email: session.user.email ?? "",
        points: data.points,
    };
}

export function AuthProvider({ children }: PropsWithChildren) {
    const [user, setUser] = useState<User | null>(null);

    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let mounted = true;

        const loadInitialSession = async () => {
            try {
                const {
                    data: { session },
                } = await supabase.auth.getSession();

                if (!mounted) {
                    return;
                }

                if (!session) {
                    setUser(null);
                    return;
                }

                const profile = await getProfile(session);

                if (mounted) {
                    setUser(profile);
                }
            } catch (error) {
                console.error("Failed to restore session:", error);

                if (mounted) {
                    setUser(null);
                }
            } finally {
                if (mounted) {
                    setIsLoading(false);
                }
            }
        };

        loadInitialSession();

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((event, session) => {
            if (!mounted) {
                return;
            }

            if (!session) {
                setUser(null);
                return;
            }

            /*
             * Do not make the profile request directly
             * inside onAuthStateChange.
             *
             * Defer it so Supabase can finish its
             * internal auth operation first.
             */
            setTimeout(() => {
                if (!mounted) {
                    return;
                }

                getProfile(session)
                    .then((profile) => {
                        if (mounted) {
                            setUser(profile);
                        }
                    })
                    .catch((error) => {
                        console.error(
                            `Failed to load profile after ${event}:`,
                            error,
                        );
                    });
            }, 0);
        });

        return () => {
            mounted = false;
            subscription.unsubscribe();
        };
    }, []);

    /*
     * REGISTER
     */
    const signUp = async (
        name: string,
        email: string,
        password: string,
        rememberMe: boolean,
    ) => {
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

        /*
         * Tell the local session storage whether
         * this registration should persist the session.
         */
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

        /*
         * Confirm Email is disabled in our current
         * development configuration, so a session
         * should be returned immediately.
         */
        if (!data.session) {
            throw new Error(
                "Account created. Please verify your email before logging in.",
            );
        }
    };

    /*
     * LOGIN
     */
    const signIn = async (
        email: string,
        password: string,
        rememberMe: boolean,
    ) => {
        const cleanEmail = normalizeEmail(email);

        if (!cleanEmail || !password) {
            throw new Error("Please enter your email and password.");
        }

        const emailIsValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail);

        if (!emailIsValid) {
            throw new Error("Please enter a valid email address.");
        }

        /*
         * Configure session persistence before
         * Supabase creates the new session.
         */
        setRememberSession(rememberMe);

        const { error } = await supabase.auth.signInWithPassword({
            email: cleanEmail,
            password,
        });

        if (error) {
            /*
             * Don't expose unnecessary auth details.
             */
            throw new Error("Invalid email or password.");
        }
    };

    /*
     * LOGOUT
     */
    const signOut = async () => {
        const { error } = await supabase.auth.signOut({
            scope: "local",
        });

        if (error) {
            throw new Error(error.message);
        }

        setUser(null);
    };

    const value = useMemo(
        () => ({
            user,
            isLoading,
            signIn,
            signUp,
            signOut,
        }),
        [user, isLoading],
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
