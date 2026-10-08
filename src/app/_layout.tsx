import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

import SRVSplash from "../components/SRVSplash";
import { colors } from "../constants/theme";
import { AuthProvider, useAuth } from "../context/AuthContext";
import { NoticeProvider } from "../context/NoticeContext";
import { WalletProvider } from "../context/WalletContext";

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
                        <Stack.Screen name="setup-mfa" />
                    </Stack.Protected>

                    <Stack.Protected guard={mfaStage === "challenge"}>
                        <Stack.Screen name="mfa-challenge" />
                    </Stack.Protected>

                    <Stack.Protected guard={mfaStage === "ready"}>
                        <Stack.Screen name="(app)" />
                        <Stack.Screen name="vaults" />
                        <Stack.Screen name="settings" />
                        <Stack.Screen name="notifications" />
                        <Stack.Screen
                            name="recovery-codes"
                            options={{ headerShown: false }}
                        />
                    </Stack.Protected>
                </Stack.Protected>

                <Stack.Protected guard={!user}>
                    <Stack.Screen name="login" />
                    <Stack.Screen name="register" />
                    <Stack.Screen name="recover-password" />
                </Stack.Protected>
            </Stack>
        </>
    );
}

export default function RootLayout() {
    return (
        <NoticeProvider>
            <AuthProvider>
                <WalletProvider>
                    <RootNavigator />
                </WalletProvider>
            </AuthProvider>
        </NoticeProvider>
    );
}
