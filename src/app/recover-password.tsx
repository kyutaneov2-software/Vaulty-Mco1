import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import { useMemo, useState } from "react";
import {
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    Text,
    View,
} from "react-native";

import { AppButton } from "../components/AppButton";
import { AppInput } from "../components/AppInput";
import { PasswordInput } from "../components/PasswordInput";
import SRVBackground from "../components/SRVBackground";
import { colors } from "../constants/theme";
import { recoverPassword } from "../services/recoveryService";
import { recoveryStyles as styles } from "../styles/recovery.styles";

/* =========================================================
   COMPONENT: RecoverPasswordScreen

   Provides Vaulty's email, recovery-code, and new-password
   recovery flow without relying on an email reset link.
========================================================= */

export default function RecoverPasswordScreen() {
    const [email, setEmail] = useState("");

    const [recoveryCode, setRecoveryCode] = useState("");

    const [newPassword, setNewPassword] = useState("");

    const [confirmPassword, setConfirmPassword] = useState("");

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState("");

    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

    const passwordsMatch =
        confirmPassword.length > 0 && newPassword === confirmPassword;

    const passwordRules = useMemo(
        () => [
            {
                label: "At least 8 characters",
                valid: newPassword.length >= 8,
            },
            {
                label: "One uppercase letter",
                valid: /[A-Z]/.test(newPassword),
            },
            {
                label: "One number",
                valid: /\d/.test(newPassword),
            },
            {
                label: "One special character",
                valid: /[^A-Za-z0-9]/.test(newPassword),
            },
        ],
        [newPassword],
    );

    const passwordValid = passwordRules.every((rule) => rule.valid);

    /* =====================================================
       FUNCTION: handleBack

       Returns the user to the login screen.
    ===================================================== */

    const handleBack = () => {
        router.replace("/login");
    };

    /* =====================================================
       FUNCTION: handleEmailChange

       Updates the email field and clears the current
       recovery error.
    ===================================================== */

    const handleEmailChange = (value: string) => {
        setEmail(value);
        setError("");
    };

    /* =====================================================
       FUNCTION: handleRecoveryCodeChange

       Normalizes the recovery code input while preserving
       the readable four-character grouping.
    ===================================================== */

    const handleRecoveryCodeChange = (value: string) => {
        const normalized = value
            .toUpperCase()
            .replace(/[^A-Z0-9]/g, "")
            .slice(0, 16);

        const grouped = normalized.match(/.{1,4}/g)?.join("-") ?? normalized;

        setRecoveryCode(grouped);

        setError("");
    };

    /* =====================================================
       FUNCTION: handlePasswordChange

       Updates the new password field and clears the
       current error.
    ===================================================== */

    const handlePasswordChange = (value: string) => {
        setNewPassword(value);
        setError("");
    };

    /* =====================================================
       FUNCTION: handleConfirmPasswordChange

       Updates the confirmation field and clears the
       current error.
    ===================================================== */

    const handleConfirmPasswordChange = (value: string) => {
        setConfirmPassword(value);
        setError("");
    };

    /* =====================================================
       FUNCTION: handleRecovery

       Validates the recovery form and sends the request
       to the secure server-side recovery function.
    ===================================================== */

    const handleRecovery = async () => {
        setError("");

        if (
            !email.trim() ||
            !recoveryCode ||
            !newPassword ||
            !confirmPassword
        ) {
            setError("Please complete all recovery fields.");
            return;
        }

        if (!emailValid) {
            setError("Please enter a valid email address.");
            return;
        }

        const normalizedCode = recoveryCode.replace(/[^A-Z0-9]/gi, "");

        if (normalizedCode.length !== 16) {
            setError("Enter a valid 16-character recovery code.");
            return;
        }

        if (!passwordValid) {
            setError("Please meet all password requirements.");
            return;
        }

        if (!passwordsMatch) {
            setError("Passwords do not match.");
            return;
        }

        try {
            setLoading(true);

            await recoverPassword(email, recoveryCode, newPassword);

            router.replace("/login");
        } catch (error) {
            setError(
                error instanceof Error
                    ? error.message
                    : "Unable to reset your password.",
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <SRVBackground>
            <KeyboardAvoidingView
                style={styles.container}
                behavior={Platform.OS === "ios" ? "padding" : undefined}
            >
                <ScrollView
                    contentContainerStyle={styles.content}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    {/* =================================================
                        TOP BAR
                    ================================================= */}

                    <View style={styles.topBar}>
                        <Pressable
                            onPress={handleBack}
                            style={styles.backButton}
                        >
                            <Ionicons
                                name="arrow-back"
                                size={19}
                                color={colors.text}
                            />
                        </Pressable>

                        <View>
                            <Text style={styles.eyebrow}>VAULTY RECOVERY</Text>

                            <Text style={styles.topTitle}>
                                Account recovery
                            </Text>
                        </View>
                    </View>

                    {/* =================================================
                        HERO
                    ================================================= */}

                    <View style={styles.heroIcon}>
                        <Ionicons
                            name="key-outline"
                            size={32}
                            color={colors.primaryLight}
                        />
                    </View>

                    <Text style={styles.title}>Reset your password</Text>

                    <Text style={styles.subtitle}>
                        Use one of your saved Vaulty recovery codes to create a
                        new password.
                    </Text>

                    {/* =================================================
                        FORM CARD
                    ================================================= */}

                    <View style={styles.card}>
                        <View style={styles.cardHeader}>
                            <View style={styles.cardIcon}>
                                <Ionicons
                                    name="lock-open-outline"
                                    size={17}
                                    color={colors.primaryLight}
                                />
                            </View>

                            <View>
                                <Text style={styles.cardTitle}>
                                    PASSWORD RECOVERY
                                </Text>

                                <Text style={styles.cardSubtitle}>
                                    Verify your recovery information
                                </Text>
                            </View>
                        </View>

                        <View style={styles.form}>
                            {/* EMAIL */}

                            <AppInput
                                label="Email"
                                value={email}
                                onChangeText={handleEmailChange}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                autoCorrect={false}
                                autoComplete="email"
                                placeholder="you@example.com"
                                rightElement={
                                    email.length > 0 ? (
                                        <Ionicons
                                            name={
                                                emailValid
                                                    ? "checkmark-circle"
                                                    : "alert-circle"
                                            }
                                            size={20}
                                            color={
                                                emailValid
                                                    ? colors.success
                                                    : colors.danger
                                            }
                                            style={{
                                                marginRight: 14,
                                            }}
                                        />
                                    ) : null
                                }
                            />

                            {/* RECOVERY CODE */}

                            <AppInput
                                label="Recovery code"
                                value={recoveryCode}
                                onChangeText={handleRecoveryCodeChange}
                                autoCapitalize="characters"
                                autoCorrect={false}
                                autoComplete="off"
                                placeholder="ABCD-EFGH-JKLM-NPQR"
                                style={styles.recoveryCodeInput}
                            />

                            {/* INFO */}

                            <View style={styles.infoBox}>
                                <View style={styles.infoIcon}>
                                    <Ionicons
                                        name="shield-checkmark-outline"
                                        size={16}
                                        color={colors.primaryLight}
                                    />
                                </View>

                                <View style={styles.infoContent}>
                                    <Text style={styles.infoTitle}>
                                        One-time recovery
                                    </Text>

                                    <Text style={styles.infoText}>
                                        Your recovery code can only be used
                                        once.
                                    </Text>
                                </View>
                            </View>

                            {/* NEW PASSWORD */}

                            <PasswordInput
                                label="New password"
                                value={newPassword}
                                onChangeText={handlePasswordChange}
                                autoComplete="new-password"
                                placeholder="Create a new password"
                            />

                            {/* CONFIRM PASSWORD */}

                            <PasswordInput
                                label="Confirm password"
                                value={confirmPassword}
                                onChangeText={handleConfirmPasswordChange}
                                autoComplete="new-password"
                                placeholder="Re-enter your new password"
                            />

                            {/* PASSWORD MATCH */}

                            {confirmPassword.length > 0 ? (
                                <View
                                    style={{
                                        borderWidth: 1,
                                        borderRadius: 14,
                                        padding: 10,
                                        borderColor: passwordsMatch
                                            ? colors.success
                                            : colors.danger,
                                        backgroundColor: passwordsMatch
                                            ? colors.successSoft
                                            : colors.dangerSoft,
                                    }}
                                >
                                    <Text
                                        style={{
                                            color: passwordsMatch
                                                ? colors.success
                                                : colors.danger,
                                            fontSize: 12,
                                            fontWeight: "700",
                                        }}
                                    >
                                        {passwordsMatch
                                            ? "Passwords match"
                                            : "Passwords do not match"}
                                    </Text>
                                </View>
                            ) : null}

                            {/* ERROR */}

                            {error ? (
                                <View style={styles.errorBox}>
                                    <View style={styles.errorIcon}>
                                        <Ionicons
                                            name="alert-circle-outline"
                                            size={17}
                                            color={colors.danger}
                                        />
                                    </View>

                                    <Text style={styles.errorText}>
                                        {error}
                                    </Text>
                                </View>
                            ) : null}

                            {/* SUBMIT */}

                            <View style={styles.buttonWrapper}>
                                <AppButton
                                    title="Reset password"
                                    onPress={handleRecovery}
                                    loading={loading}
                                />
                            </View>
                        </View>
                    </View>

                    <View style={styles.footer}>
                        <Text style={styles.footerText}>
                            After resetting your password, you will still need
                            your Vaulty authenticator when you sign in.
                        </Text>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SRVBackground>
    );
}
