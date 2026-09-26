import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

import SRVSplash from "../components/SRVSplash";
import { colors } from "../constants/theme";
import { AuthProvider, useAuth } from "../context/AuthContext";

/* =========================================================
   COMPONENT: RootNavigator

   Controls Vaulty's top-level navigation according to
   authentication and MFA state.
========================================================= */

function RootNavigator() {
    const { user, isLoading, mfaStage } = useAuth();

    /* =====================================================
       LOADING STATE

       Keep the splash screen visible while the initial
       authentication state is being restored.
    ===================================================== */

    if (isLoading) {
        return <SRVSplash />;
    }

    return (
        <>
            {/* =================================================
                STATUS BAR
            ================================================= */}

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
                    {/* =============================================
                        FIRST-TIME TOTP SETUP

                        User has authenticated with their password
                        but does not have a verified TOTP factor yet.
                    ============================================= */}

                    <Stack.Protected guard={mfaStage === "setup"}>
                        <Stack.Screen
                            name="setup-mfa"
                            options={{
                                headerShown: false,
                            }}
                        />
                    </Stack.Protected>

                    {/* =============================================
                        EXISTING TOTP USER

                        User has a verified authenticator and must
                        complete the MFA challenge before accessing
                        the main application.
                    ============================================= */}

                    <Stack.Protected guard={mfaStage === "challenge"}>
                        <Stack.Screen
                            name="mfa-challenge"
                            options={{
                                headerShown: false,
                            }}
                        />
                    </Stack.Protected>

                    {/* =============================================
                        FULLY VERIFIED USERS

                        The session has reached the ready/AAL2
                        state. Recovery-code display also belongs
                        here because TOTP setup has already been
                        successfully verified.
                    ============================================= */}

                    <Stack.Protected guard={mfaStage === "ready"}>
                        <Stack.Screen name="(app)" />

                        <Stack.Screen
                            name="recovery-codes"
                            options={{
                                headerShown: false,
                            }}
                        />
                    </Stack.Protected>
                </Stack.Protected>

                {/* =================================================
                    SIGNED-OUT USERS
                ================================================= */}

                <Stack.Protected guard={!user}>
                    {/* =============================================
                        LOGIN
                    ============================================= */}

                    <Stack.Screen
                        name="login"
                        options={{
                            headerShown: false,
                        }}
                    />

                    {/* =============================================
                        REGISTER
                    ============================================= */}

                    <Stack.Screen
                        name="register"
                        options={{
                            headerShown: false,
                        }}
                    />

                    {/* =============================================
                        PASSWORD RECOVERY

                        This must remain outside the authenticated
                        guard because forgotten-password recovery
                        starts without an active session.
                    ============================================= */}

                    <Stack.Screen
                        name="recover-password"
                        options={{
                            headerShown: false,
                        }}
                    />
                </Stack.Protected>
            </Stack>
        </>
    );
}

/* =========================================================
   COMPONENT: RootLayout

   Provides the authentication context to the entire
   application and renders the root navigation tree.
========================================================= */

export default function RootLayout() {
    return (
        <AuthProvider>
            <RootNavigator />
        </AuthProvider>
    );
}
