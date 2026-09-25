import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";

import SRVBackground from "../components/SRVBackground";
import { AppButton } from "../components/AppButton";
import { colors, radius, spacing } from "../constants/theme";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabase";

export default function MFAChallengeScreen() {
    const { refreshAuthState, signOut } = useAuth();

    const [factorId, setFactorId] = useState("");
    const [code, setCode] = useState("");

    const [loading, setLoading] = useState(true);
    const [verifying, setVerifying] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadFactor = async () => {
            try {
                const { data, error } = await supabase.auth.mfa.listFactors();

                if (error) {
                    throw error;
                }

                const factor = data.totp?.find(
                    (item) => item.status === "verified",
                );

                if (!factor) {
                    throw new Error("No verified authenticator was found.");
                }

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

    const handleVerify = async () => {
        const cleanCode = code.replace(/\D/g, "");

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

            /**
             * Supabase creates the challenge and verifies
             * the authenticator code.
             */
            const { error: verifyError } =
                await supabase.auth.mfa.challengeAndVerify({
                    factorId,
                    code: cleanCode,
                });

            if (verifyError) {
                throw verifyError;
            }

            const stage = await refreshAuthState();

            if (stage === "ready") {
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

            if (message.toLowerCase().includes("expired")) {
                setError(
                    "That verification attempt expired. Enter the current code and try again.",
                );
            } else {
                setError(message);
            }
        } finally {
            setVerifying(false);
        }
    };

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
                <View style={styles.content}>
                    <View style={styles.topBar}>
                        <View>
                            <Text style={styles.eyebrow}>VAULTY SECURITY</Text>

                            <Text style={styles.topTitle}>
                                Verify your identity
                            </Text>
                        </View>

                        <Pressable
                            onPress={handleSignOut}
                            style={styles.signOutButton}
                        >
                            <Ionicons
                                name="log-out-outline"
                                size={18}
                                color={colors.muted}
                            />
                        </Pressable>
                    </View>

                    <View style={styles.centerContent}>
                        <View style={styles.iconBox}>
                            <Ionicons
                                name="shield-checkmark"
                                size={34}
                                color={colors.goldLight}
                            />
                        </View>

                        <Text style={styles.title}>
                            Enter your verification code
                        </Text>

                        <Text style={styles.subtitle}>
                            Open your authenticator app and enter the current
                            6-digit Vaulty code.
                        </Text>

                        <View style={styles.card}>
                            <Text style={styles.label}>AUTHENTICATOR CODE</Text>

                            {loading ? (
                                <View style={styles.loadingBox}>
                                    <ActivityIndicator
                                        size="large"
                                        color={colors.primary}
                                    />
                                </View>
                            ) : (
                                <TextInput
                                    value={code}
                                    onChangeText={(value) => {
                                        setCode(
                                            value
                                                .replace(/\D/g, "")
                                                .slice(0, 6),
                                        );
                                        setError("");
                                    }}
                                    placeholder="000000"
                                    placeholderTextColor={colors.mutedDark}
                                    keyboardType="number-pad"
                                    maxLength={6}
                                    textAlign="center"
                                    autoFocus
                                    style={styles.codeInput}
                                />
                            )}

                            {error ? (
                                <View style={styles.errorBox}>
                                    <Ionicons
                                        name="alert-circle-outline"
                                        size={18}
                                        color={colors.danger}
                                    />

                                    <Text style={styles.errorText}>
                                        {error}
                                    </Text>
                                </View>
                            ) : null}

                            <View style={styles.buttonWrapper}>
                                <AppButton
                                    title="Verify and continue"
                                    onPress={handleVerify}
                                    loading={verifying}
                                />
                            </View>
                        </View>

                        <View style={styles.infoBox}>
                            <Ionicons
                                name="time-outline"
                                size={17}
                                color={colors.goldLight}
                            />

                            <Text style={styles.infoText}>
                                Authenticator codes change automatically every
                                30 seconds.
                            </Text>
                        </View>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </SRVBackground>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    content: {
        flex: 1,
        padding: spacing.lg,
        paddingTop: 34,
    },

    topBar: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },

    eyebrow: {
        color: colors.gold,
        fontSize: 10,
        fontWeight: "900",
        letterSpacing: 2.2,
    },

    topTitle: {
        color: colors.textStrong,
        fontSize: 17,
        fontWeight: "900",
        marginTop: 3,
    },

    signOutButton: {
        width: 42,
        height: 42,
        borderRadius: 14,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
    },

    centerContent: {
        flex: 1,
        justifyContent: "center",
        paddingBottom: 30,
    },

    iconBox: {
        width: 72,
        height: 72,
        borderRadius: 24,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: colors.goldSoft,
        borderWidth: 1,
        borderColor: "rgba(212,175,55,0.32)",
        marginBottom: 20,
    },

    title: {
        color: colors.textStrong,
        fontSize: 29,
        lineHeight: 37,
        fontWeight: "900",
    },

    subtitle: {
        color: colors.muted,
        fontSize: 14,
        lineHeight: 22,
        marginTop: 8,
        marginBottom: 22,
    },

    card: {
        backgroundColor: "rgba(21,17,31,0.94)",
        borderWidth: 1,
        borderColor: colors.borderStrong,
        borderRadius: 28,
        padding: spacing.md,
        shadowColor: colors.black,
        shadowOffset: {
            width: 0,
            height: 18,
        },
        shadowOpacity: 0.36,
        shadowRadius: 28,
        elevation: 12,
    },

    label: {
        color: colors.gold,
        fontSize: 10,
        fontWeight: "900",
        letterSpacing: 1.8,
        marginBottom: 10,
    },

    loadingBox: {
        height: 74,
        borderRadius: 18,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: colors.surfaceElevated,
        borderWidth: 1,
        borderColor: colors.border,
    },

    codeInput: {
        height: 74,
        borderRadius: 18,
        borderWidth: 1,
        borderColor: colors.borderStrong,
        backgroundColor: colors.surfaceElevated,
        color: colors.textStrong,
        fontSize: 29,
        fontWeight: "900",
        letterSpacing: 9,
    },

    errorBox: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        marginTop: 14,
        padding: spacing.md,
        borderRadius: 16,
        backgroundColor: colors.dangerSoft,
        borderWidth: 1,
        borderColor: "rgba(251,113,133,0.45)",
    },

    errorText: {
        flex: 1,
        color: colors.danger,
        fontSize: 12,
        fontWeight: "700",
        lineHeight: 18,
    },

    buttonWrapper: {
        marginTop: 18,
    },

    infoBox: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        marginTop: 18,
    },

    infoText: {
        flex: 1,
        color: colors.mutedDark,
        fontSize: 10,
        lineHeight: 15,
    },
});
