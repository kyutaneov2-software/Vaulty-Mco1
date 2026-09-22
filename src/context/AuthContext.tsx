import {
    PropsWithChildren,
    createContext,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";

import type { Session } from "@supabase/supabase-js";

import { supabase } from "../lib/supabase";

import { User } from "../types";

type AuthContextValue = {
    user: User | null;
    isLoading: boolean;

    signIn: (email: string, password: string) => Promise<void>;

    signUp: (name: string, email: string, password: string) => Promise<void>;

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
             * Don't make another Supabase API call
             * directly inside the auth callback.
             *
             * Supabase documents a possible deadlock
             * when async Supabase calls are made from
             * inside onAuthStateChange.
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

    const signUp = async (name: string, email: string, password: string) => {
        const cleanName = name.trim();
        const cleanEmail = normalizeEmail(email);

        if (!cleanName) {
            throw new Error("Please enter your full name.");
        }

        if (!cleanEmail) {
            throw new Error("Please enter your email.");
        }

        if (password.length < 6) {
            throw new Error("Password must be at least 6 characters.");
        }

        const emailIsValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail);

        if (!emailIsValid) {
            throw new Error("Please enter a valid email address.");
        }

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
            throw error;
        }

        if (!data.session) {
            throw new Error(
                "Account created. Please verify your email before logging in.",
            );
        }
    };

    const signIn = async (email: string, password: string) => {
        const cleanEmail = normalizeEmail(email);

        if (!cleanEmail || !password) {
            throw new Error("Please enter your email and password.");
        }

        const { error } = await supabase.auth.signInWithPassword({
            email: cleanEmail,
            password,
        });

        if (error) {
            throw new Error("Invalid email or password.");
        }
    };

    const signOut = async () => {
        const { error } = await supabase.auth.signOut({
            scope: "local",
        });

        if (error) {
            throw error;
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
