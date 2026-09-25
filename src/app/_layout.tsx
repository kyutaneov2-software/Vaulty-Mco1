import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ActivityIndicator, StyleSheet, View } from "react-native";

import SRVSplash from "../components/SRVSplash";
import { colors } from "../constants/theme";
import { AuthProvider, useAuth } from "../context/AuthContext";

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
                {/* =================================================
                    AUTHENTICATED USERS
                ================================================= */}
                <Stack.Protected guard={!!user}>
                    {/* FULL APP — ONLY AAL2 */}
                    <Stack.Protected guard={mfaStage === "ready"}>
                        <Stack.Screen name="(app)" />
                    </Stack.Protected>

                    {/* FIRST-TIME TOTP SETUP */}
                    <Stack.Protected guard={mfaStage === "setup"}>
                        <Stack.Screen name="setup-mfa" />
                    </Stack.Protected>

                    {/* EXISTING TOTP USER */}
                    <Stack.Protected guard={mfaStage === "challenge"}>
                        <Stack.Screen name="mfa-challenge" />
                    </Stack.Protected>
                </Stack.Protected>

                {/* =================================================
                    SIGNED-OUT USERS
                ================================================= */}
                <Stack.Protected guard={!user}>
                    <Stack.Screen name="login" />
                    <Stack.Screen name="register" />
                </Stack.Protected>
            </Stack>
        </>
    );
}

export default function RootLayout() {
    return (
        <AuthProvider>
            <RootNavigator />
        </AuthProvider>
    );
}
