import AsyncStorage from '@react-native-async-storage/async-storage';
import { PropsWithChildren, createContext, useContext, useEffect, useMemo, useState } from 'react';
import { User } from '../types';

const SESSION_KEY = '@srv/session';

type AuthContextValue = {
    user: User | null;
    isLoading: boolean;
    signIn: (email: string, password: string) => Promise<void>;
    signUp: (name: string, email: string, password: string) => Promise<void>;
    signOut: () => Promise<void>;
    };

    const AuthContext = createContext<AuthContextValue | undefined>(undefined);

    export function AuthProvider({ children }: PropsWithChildren) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const restoreSession = async () => {
        try {
            const stored = await AsyncStorage.getItem(SESSION_KEY);
            if (stored) setUser(JSON.parse(stored));
        } catch {
            // Ignore corrupted mock session data; a future backend will own session validity.
        } finally {
            setIsLoading(false);
        }
        };

        restoreSession();
    }, []);

    const saveUser = async (nextUser: User) => {
        setUser(nextUser);
        await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(nextUser));
    };

    const signIn = async (email: string) => {
        const nextUser: User = {
        id: 'demo-user-001',
        name: email.split('@')[0] || 'SRV User',
        email,
        points: 350,
        };

        await saveUser(nextUser);
    };

    const signUp = async (name: string, email: string) => {
        const nextUser: User = {
        id: `demo-${Date.now()}`,
        name,
        email,
        points: 350,
        };

        await saveUser(nextUser);
    };

    const signOut = async () => {
        setUser(null);
        await AsyncStorage.removeItem(SESSION_KEY);
    };

    const value = useMemo(() => ({ user, isLoading, signIn, signUp, signOut }), [user, isLoading]);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const context = useContext(AuthContext);
        if (!context) throw new Error('useAuth must be used inside AuthProvider');
    return context;
}
