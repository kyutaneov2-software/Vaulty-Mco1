import { router, useLocalSearchParams } from "expo-router";

import { useEffect, useRef, useState } from "react";

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

import Ionicons from "@expo/vector-icons/Ionicons";

import SRVBackground from "../components/SRVBackground";

import { colors, radius, spacing } from "../constants/theme";

import { useAuth } from "../context/AuthContext";

export default function VerifyEmailScreen() {
    const { verifySignupCode, resendSignupCode } = useAuth();

    const params = useLocalSearchParams<{
        email?: string;
    }>();

    const email = typeof params.email === "string" ? params.email : "";

    const inputRef = useRef<TextInput>(null);

    const [code, setCode] = useState("");

    const [verifying, setVerifying] = useState(false);

    const [resending, setResending] = useState(false);

    const [error, setError] = useState("");

    const [success, setSuccess] = useState("");

    const [resendCooldown, setResendCooldown] = useState(0);

    /*
     * Countdown after sending a code.
     */
    useEffect(() => {
        if (resendCooldown <= 0) {
            return;
        }

        const timer = setInterval(() => {
            setResendCooldown((current) => Math.max(current - 1, 0));
        }, 1000);

        return () => clearInterval(timer);
    }, [resendCooldown]);

    /*
     * Automatically verify once all six digits
     * have been entered.
     */
    useEffect(() => {
        if (code.length !== 6) {
            return;
        }

        handleVerify(code);
    }, [code]);

    const handleVerify = async (verificationCode = code) => {
        if (verifying) {
            return;
        }

        if (!/^\d{6}$/.test(verificationCode)) {
            setError("Please enter the 6-digit verification code.");

            return;
        }

        try {
            setError("");
            setSuccess("");
            setVerifying(true);

            await verifySignupCode(email, verificationCode);

            setSuccess("Email verified successfully.");

            /*
             * Give AuthContext a moment to receive the
             * auth state change, then go to Home.
             */
            setTimeout(() => {
                router.replace("/");
            }, 400);
        } catch (error) {
            console.error("Email verification failed:", error);

            setCode("");

            setError(
                error instanceof Error
                    ? error.message
                    : "The verification code is invalid or expired.",
            );

            inputRef.current?.focus();
        } finally {
            setVerifying(false);
        }
    };

    const handleResend = async () => {
        if (resending || resendCooldown > 0) {
            return;
        }

        try {
            setError("");
            setSuccess("");
            setResending(true);

            await resendSignupCode(email);

            setSuccess("A new verification code has been sent.");

            setResendCooldown(60);
        } catch (error) {
            console.error("Resend verification failed:", error);

            setError(
                error instanceof Error
                    ? error.message
                    : "Unable to resend the verification code.",
            );
        } finally {
            setResending(false);
        }
    };

    return (
        <SRVBackground>
            <KeyboardAvoidingView
                style={styles.screen}
                behavior={Platform.OS === "ios" ? "padding" : undefined}
            >
                <View style={styles.container}>
                    {/* LOGO */}

                    <View style={styles.logoContainer}>
                        <View style={styles.logoCircle}>
                            <Ionicons
                                name="mail-outline"
                                size={30}
                                color={colors.gold}
                            />
                        </View>

                        <Text style={styles.brand}>VAULTY</Text>

                        <Text style={styles.brandSubtitle}>
                            SMART RENTAL VAULT
                        </Text>
                    </View>

                    {/* CONTENT */}

                    <View style={styles.card}>
                        <Text style={styles.title}>Verify your email</Text>

                        <Text style={styles.description}>
                            We sent a 6-digit verification code to:
                        </Text>

                        <Text style={styles.email}>
                            {email || "your email address"}
                        </Text>

                        {/* CODE INPUT */}

                        <Pressable
                            onPress={() => inputRef.current?.focus()}
                            style={styles.codeContainer}
                        >
                            <TextInput
                                ref={inputRef}
                                value={code}
                                onChangeText={(value) => {
                                    const digits = value
                                        .replace(/\D/g, "")
                                        .slice(0, 6);

                                    setError("");
                                    setSuccess("");
                                    setCode(digits);
                                }}
                                keyboardType="number-pad"
                                inputMode="numeric"
                                maxLength={6}
                                autoFocus
                                editable={!verifying}
                                style={styles.hiddenInput}
                            />

                            {Array.from({
                                length: 6,
                            }).map((_, index) => {
                                const digit = code[index];

                                const active = index === code.length;

                                return (
                                    <View
                                        key={index}
                                        style={[
                                            styles.codeBox,
                                            active && styles.codeBoxActive,
                                            digit && styles.codeBoxFilled,
                                        ]}
                                    >
                                        <Text style={styles.codeDigit}>
                                            {digit || ""}
                                        </Text>
                                    </View>
                                );
                            })}
                        </Pressable>

                        {/* LOADING */}

                        {verifying ? (
                            <View style={styles.statusRow}>
                                <ActivityIndicator
                                    size="small"
                                    color={colors.gold}
                                />

                                <Text style={styles.statusText}>
                                    Verifying...
                                </Text>
                            </View>
                        ) : null}

                        {/* ERROR */}

                        {error ? (
                            <View style={styles.messageCard}>
                                <Ionicons
                                    name="alert-circle-outline"
                                    size={18}
                                    color={colors.danger}
                                />

                                <Text style={styles.errorText}>{error}</Text>
                            </View>
                        ) : null}

                        {/* SUCCESS */}

                        {success ? (
                            <View
                                style={[styles.messageCard, styles.successCard]}
                            >
                                <Ionicons
                                    name="checkmark-circle-outline"
                                    size={18}
                                    color={colors.success}
                                />

                                <Text style={styles.successText}>
                                    {success}
                                </Text>
                            </View>
                        ) : null}

                        {/* RESEND */}

                        <Pressable
                            onPress={handleResend}
                            disabled={resending || resendCooldown > 0}
                            style={({ pressed }) => [
                                styles.resendButton,
                                pressed && styles.resendPressed,
                                (resending || resendCooldown > 0) &&
                                    styles.resendDisabled,
                            ]}
                        >
                            {resending ? (
                                <ActivityIndicator
                                    size="small"
                                    color={colors.gold}
                                />
                            ) : (
                                <Ionicons
                                    name="refresh-outline"
                                    size={17}
                                    color={colors.gold}
                                />
                            )}

                            <Text style={styles.resendText}>
                                {resendCooldown > 0
                                    ? `Resend code in ${resendCooldown}s`
                                    : "Resend verification code"}
                            </Text>
                        </Pressable>

                        {/* BACK */}

                        <Pressable
                            onPress={() => router.replace("/register")}
                            style={styles.backButton}
                        >
                            <Ionicons
                                name="arrow-back"
                                size={17}
                                color={colors.muted}
                            />

                            <Text style={styles.backText}>
                                Back to registration
                            </Text>
                        </Pressable>
                    </View>

                    <Text style={styles.footer}>
                        Secure storage. Simplified.
                    </Text>
                </View>
            </KeyboardAvoidingView>
        </SRVBackground>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
    },

    container: {
        flex: 1,

        padding: spacing.lg,

        alignItems: "center",

        justifyContent: "center",
    },

    logoContainer: {
        alignItems: "center",

        marginBottom: 28,
    },

    logoCircle: {
        width: 74,
        height: 74,

        borderRadius: 24,

        backgroundColor: colors.surface,

        borderWidth: 1,
        borderColor: colors.gold,

        alignItems: "center",
        justifyContent: "center",

        marginBottom: 12,
    },

    brand: {
        color: colors.textStrong,

        fontSize: 25,
        fontWeight: "900",

        letterSpacing: 5,
    },

    brandSubtitle: {
        color: colors.gold,

        fontSize: 9,
        fontWeight: "800",

        letterSpacing: 2,

        marginTop: 2,
    },

    card: {
        width: "100%",

        maxWidth: 430,

        backgroundColor: colors.surface,

        borderWidth: 1,
        borderColor: colors.borderStrong,

        borderRadius: radius.lg,

        padding: spacing.lg,
    },

    title: {
        color: colors.textStrong,

        fontSize: 27,
        fontWeight: "900",

        textAlign: "center",
    },

    description: {
        color: colors.muted,

        fontSize: 14,

        textAlign: "center",

        lineHeight: 21,

        marginTop: 12,
    },

    email: {
        color: colors.goldLight,

        fontSize: 14,
        fontWeight: "800",

        textAlign: "center",

        marginTop: 5,
    },

    codeContainer: {
        flexDirection: "row",

        justifyContent: "center",

        gap: 8,

        marginTop: 28,
    },

    hiddenInput: {
        position: "absolute",

        width: 1,
        height: 1,

        opacity: 0,
    },

    codeBox: {
        width: 42,
        height: 52,

        borderRadius: 12,

        backgroundColor: colors.surfaceElevated,

        borderWidth: 1,
        borderColor: colors.border,

        alignItems: "center",
        justifyContent: "center",
    },

    codeBoxActive: {
        borderColor: colors.gold,
    },

    codeBoxFilled: {
        backgroundColor: colors.goldSoft,

        borderColor: colors.gold,
    },

    codeDigit: {
        color: colors.textStrong,

        fontSize: 22,
        fontWeight: "900",
    },

    statusRow: {
        flexDirection: "row",

        alignItems: "center",
        justifyContent: "center",

        gap: 8,

        marginTop: 18,
    },

    statusText: {
        color: colors.muted,

        fontSize: 13,
    },

    messageCard: {
        flexDirection: "row",

        alignItems: "center",

        gap: 8,

        backgroundColor: colors.dangerSoft,

        borderWidth: 1,
        borderColor: colors.danger,

        borderRadius: radius.md,

        padding: spacing.md,

        marginTop: 18,
    },

    errorText: {
        flex: 1,

        color: colors.danger,

        fontSize: 13,

        lineHeight: 18,
    },

    successCard: {
        backgroundColor: colors.successSoft,

        borderColor: colors.success,
    },

    successText: {
        flex: 1,

        color: colors.success,

        fontSize: 13,

        lineHeight: 18,
    },

    resendButton: {
        flexDirection: "row",

        alignItems: "center",
        justifyContent: "center",

        gap: 7,

        marginTop: 22,

        paddingVertical: 12,
    },

    resendPressed: {
        opacity: 0.7,
    },

    resendDisabled: {
        opacity: 0.45,
    },

    resendText: {
        color: colors.goldLight,

        fontSize: 13,
        fontWeight: "800",
    },

    backButton: {
        flexDirection: "row",

        alignItems: "center",
        justifyContent: "center",

        gap: 7,

        marginTop: 4,

        paddingVertical: 10,
    },

    backText: {
        color: colors.muted,

        fontSize: 13,
        fontWeight: "700",
    },

    footer: {
        color: colors.mutedDark,

        fontSize: 11,

        textAlign: "center",

        marginTop: 28,

        letterSpacing: 0.5,
    },
});
