import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

import SRVSplash from "../components/SRVSplash";

import { colors } from "../constants/theme";

import { AuthProvider, useAuth } from "../context/AuthContext";
import { NoticeProvider } from "../context/NoticeContext";

/* =========================================================
   COMPONENT: RootNavigator

   Controls the application's authentication and MFA
   navigation guards.
========================================================= */
function RootNavigator() {
    const { user, isLoading, mfaStage } = useAuth();

    if (isLoading) {
        return <SRVSplash />;
    }

    return (
        <>
            <StatusBar style="light" />

            <Stack
                screenOptions={{
                    headerShown: false,
                    contentStyle: {
                        backgroundColor: colors.background,
                    },
                }}
            >
                <Stack.Protected guard={!!user}>
                    <Stack.Protected guard={mfaStage === "setup"}>
                        <Stack.Screen
                            name="setup-mfa"
                            options={{ headerShown: false }}
                        />
                    </Stack.Protected>

                    <Stack.Protected guard={mfaStage === "challenge"}>
                        <Stack.Screen
                            name="mfa-challenge"
                            options={{ headerShown: false }}
                        />
                    </Stack.Protected>

                    <Stack.Protected guard={mfaStage === "ready"}>
                        <Stack.Screen name="(app)" />

                        <Stack.Screen
                            name="recovery-codes"
                            options={{ headerShown: false }}
                        />
                    </Stack.Protected>
                </Stack.Protected>

                <Stack.Protected guard={!user}>
                    <Stack.Screen
                        name="login"
                        options={{ headerShown: false }}
                    />

                    <Stack.Screen
                        name="register"
                        options={{ headerShown: false }}
                    />

                    <Stack.Screen
                        name="recover-password"
                        options={{ headerShown: false }}
                    />
                </Stack.Protected>
            </Stack>
        </>
    );
}

/* =========================================================
   COMPONENT: RootLayout

   Provides authentication and global notice contexts
   to the entire Vaulty application.
========================================================= */
export default function RootLayout() {
    return (
        <NoticeProvider>
            <AuthProvider>
                <RootNavigator />
            </AuthProvider>
        </NoticeProvider>
    );
}
