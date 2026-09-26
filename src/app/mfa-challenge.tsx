import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    Text,
    TextInput,
    View,
} from "react-native";

import { AppButton } from "../components/AppButton";
import SRVBackground from "../components/SRVBackground";
import { colors } from "../constants/theme";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabase";
import { authStyles as styles } from "../styles/auth.styles";
import { useNotice } from "../context/NoticeContext";

/* =========================================================
   FUNCTION: MFAChallengeScreen

   Renders the Vaulty MFA verification screen for users
   who already have a verified TOTP authenticator.
========================================================= */
export default function MFAChallengeScreen() {
    const { refreshAuthState, signOut } = useAuth();
    const { showSuccessNotice } = useNotice();

    const [factorId, setFactorId] = useState("");

    const [code, setCode] = useState("");

    const [loading, setLoading] = useState(true);

    const [verifying, setVerifying] = useState(false);

    const [error, setError] = useState("");

    /* =========================================================
       FUNCTION: loadFactor

       Retrieves the user's verified TOTP factor from
       Supabase Auth.
    ========================================================= */
    useEffect(() => {
        const loadFactor = async () => {
            try {
                setLoading(true);
                setError("");

                const { data, error: listError } =
                    await supabase.auth.mfa.listFactors();

                if (listError) {
                    throw listError;
                }

                const factor = data.totp?.find(
                    (item) => item.status === "verified",
                );

                if (!factor) {
                    console.warn(
                        "No verified TOTP factor was found. Returning to setup.",
                    );

                    router.replace("/setup-mfa");

                    return;
                }

                console.log("Vaulty MFA factor loaded:", factor.id);

                setFactorId(factor.id);
            } catch (error) {
                console.error("Failed to load MFA factor:", error);

                setError(
                    error instanceof Error
                        ? error.message
                        : "Unable to load your authenticator.",
                );
            } finally {
                setLoading(false);
            }
        };

        loadFactor();
    }, []);

    /* =========================================================
       FUNCTION: handleCodeChange

       Accepts numeric MFA input and limits the value
       to exactly six characters.
    ========================================================= */
    const handleCodeChange = (value: string) => {
        setCode(value.replace(/\D/g, "").slice(0, 6));

        setError("");
    };

    /* =========================================================
       FUNCTION: handleVerify

       Verifies the user's current TOTP code and upgrades
       the Supabase session to AAL2.
    ========================================================= */
    const handleVerify = async () => {
        const cleanCode = code.replace(/\D/g, "").slice(0, 6);

        setError("");

        if (!factorId) {
            setError("Your authenticator is not ready.");

            return;
        }

        if (!/^\d{6}$/.test(cleanCode)) {
            setError("Enter the 6-digit code from your authenticator app.");

            return;
        }

        try {
            setVerifying(true);

            /*
             * Supabase creates the MFA challenge and
             * verifies the TOTP code.
             */
            const { error: verifyError } =
                await supabase.auth.mfa.challengeAndVerify({
                    factorId,
                    code: cleanCode,
                });

            if (verifyError) {
                throw verifyError;
            }

            /*
             * Refresh the application authentication
             * state after successful MFA verification.
             */
            const stage = await refreshAuthState();

            if (stage === "ready") {
                showSuccessNotice(
                    "Login successful",
                    "Welcome back to Vaulty. Your identity has been verified.",
                );

                router.replace("/(app)");
                return;
            }

            setError(
                "Verification succeeded, but your session is not ready yet.",
            );
        } catch (error) {
            console.error("MFA challenge failed:", error);

            const message =
                error instanceof Error
                    ? error.message
                    : "Unable to verify your code.";

            const normalized = message.toLowerCase();

            if (normalized.includes("expired")) {
                setError(
                    "That verification attempt expired. Enter the current code and try again.",
                );
            } else if (
                normalized.includes("invalid") ||
                normalized.includes("incorrect")
            ) {
                setError(
                    "The verification code is incorrect. Check your authenticator and try again.",
                );
            } else {
                setError(message);
            }
        } finally {
            setVerifying(false);
        }
    };

    /* =========================================================
       FUNCTION: handleSignOut

       Signs the current user out locally and returns them
       to the unauthenticated authentication flow.
    ========================================================= */
    const handleSignOut = async () => {
        try {
            await signOut();
        } catch (error) {
            console.error("Failed to sign out:", error);
        }
    };

    return (
        <SRVBackground>
            <KeyboardAvoidingView
                style={styles.container}
                behavior={Platform.OS === "ios" ? "padding" : undefined}
            >
                <View style={styles.mfaContent}>
                    {/* =================================================
                        TOP BAR
                    ================================================= */}
                    <View style={styles.mfaTopBar}>
                        <View>
                            <Text style={styles.mfaEyebrow}>
                                VAULTY SECURITY
                            </Text>

                            <Text style={styles.mfaTopTitle}>
                                Verify your identity
                            </Text>
                        </View>

                        <Pressable
                            onPress={handleSignOut}
                            style={styles.mfaSignOutButton}
                        >
                            <Ionicons
                                name="log-out-outline"
                                size={18}
                                color={colors.muted}
                            />
                        </Pressable>
                    </View>

                    {/* =================================================
                        VERIFICATION CONTENT
                    ================================================= */}
                    <View style={styles.mfaCenterContent}>
                        <View style={styles.mfaIconBox}>
                            <Ionicons
                                name="shield-checkmark"
                                size={32}
                                color={colors.primaryLight}
                            />
                        </View>

                        <Text style={styles.mfaTitle}>
                            Enter your verification code
                        </Text>

                        <Text style={styles.mfaSubtitle}>
                            Open your authenticator app and enter the current
                            6-digit Vaulty code.
                        </Text>

                        {/* =================================================
                            VERIFICATION CARD
                        ================================================= */}
                        <View style={styles.mfaCard}>
                            <View style={styles.mfaCardHeader}>
                                <View style={styles.mfaCardIcon}>
                                    <Ionicons
                                        name="key-outline"
                                        size={17}
                                        color={colors.primaryLight}
                                    />
                                </View>

                                <View>
                                    <Text style={styles.mfaCardTitle}>
                                        Authenticator code
                                    </Text>

                                    <Text style={styles.mfaCardSubtitle}>
                                        Enter the 6-digit code
                                    </Text>
                                </View>
                            </View>

                            {loading ? (
                                <View style={styles.mfaLoadingBox}>
                                    <ActivityIndicator
                                        size="large"
                                        color={colors.primary}
                                    />

                                    <Text style={styles.mfaLoadingText}>
                                        Loading authenticator...
                                    </Text>
                                </View>
                            ) : (
                                <TextInput
                                    value={code}
                                    onChangeText={handleCodeChange}
                                    placeholder="000000"
                                    placeholderTextColor={colors.mutedDark}
                                    keyboardType="number-pad"
                                    maxLength={6}
                                    textAlign="center"
                                    autoFocus
                                    editable={!verifying}
                                    style={styles.mfaCodeInput}
                                />
                            )}

                            {/* =================================================
                                ERROR
                            ================================================= */}
                            {error ? (
                                <View style={styles.mfaErrorBox}>
                                    <View style={styles.mfaErrorIcon}>
                                        <Ionicons
                                            name="alert-circle"
                                            size={16}
                                            color={colors.danger}
                                        />
                                    </View>

                                    <Text style={styles.mfaErrorText}>
                                        {error}
                                    </Text>
                                </View>
                            ) : null}

                            {/* =================================================
                                VERIFY BUTTON
                            ================================================= */}
                            <View style={styles.mfaButtonWrapper}>
                                <AppButton
                                    title="Verify and continue"
                                    onPress={handleVerify}
                                    loading={verifying}
                                />
                            </View>
                        </View>

                        {/* =================================================
                            INFORMATION
                        ================================================= */}
                        <View style={styles.mfaInfoBox}>
                            <Ionicons
                                name="time-outline"
                                size={17}
                                color={colors.primaryLight}
                            />

                            <Text style={styles.mfaInfoText}>
                                Authenticator codes change automatically every
                                30 seconds.
                            </Text>
                        </View>

                        <View style={styles.mfaSecurityFooter}>
                            <Ionicons
                                name="lock-closed-outline"
                                size={13}
                                color={colors.mutedDark}
                            />

                            <Text style={styles.mfaSecurityFooterText}>
                                Your authentication is protected by Vaulty's
                                secure MFA system.
                            </Text>
                        </View>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </SRVBackground>
    );
}
