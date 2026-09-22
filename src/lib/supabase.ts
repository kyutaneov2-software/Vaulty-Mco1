import "react-native-url-polyfill/auto";

import AsyncStorage from "@react-native-async-storage/async-storage";

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;

const supabasePublishableKey = process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl) {
    throw new Error("Missing EXPO_PUBLIC_SUPABASE_URL");
}

if (!supabasePublishableKey) {
    throw new Error("Missing EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY");
}

/*
 * Development session preference.
 */
let rememberSession = true;

/*
 * In-memory storage used when
 * "Remember me" is disabled.
 */
const memoryStorage = new Map<string, string>();

export function setRememberSession(remember: boolean) {
    rememberSession = remember;

    if (!remember) {
        memoryStorage.clear();
    }
}

const authStorage = {
    async getItem(key: string) {
        if (rememberSession) {
            return AsyncStorage.getItem(key);
        }

        return memoryStorage.get(key) ?? null;
    },

    async setItem(key: string, value: string) {
        if (rememberSession) {
            await AsyncStorage.setItem(key, value);

            return;
        }

        memoryStorage.set(key, value);
    },

    async removeItem(key: string) {
        memoryStorage.delete(key);

        await AsyncStorage.removeItem(key);
    },
};

export const supabase = createClient(supabaseUrl, supabasePublishableKey, {
    auth: {
        storage: authStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
    },
});
