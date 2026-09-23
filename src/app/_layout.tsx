import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";


import { AuthProvider, useAuth } from "../context/AuthContext";
import { colors } from "../constants/theme";
import SRVSplash from "../components/SRVSplash";

function RootNavigator() {
    const { user, isLoading } = useAuth();

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
                    <Stack.Screen name="(app)" />
                </Stack.Protected>

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
