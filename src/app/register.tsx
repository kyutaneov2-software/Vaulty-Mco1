import { router } from "expo-router";

import { useMemo, useState } from "react";

import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";

import Ionicons from "@expo/vector-icons/Ionicons";

import { AppButton } from "../components/AppButton";
import { AppInput } from "../components/AppInput";
import { FormCheckbox } from "../components/FormCheckbox";
import { PasswordInput } from "../components/PasswordInput";
import SRVBackground from "../components/SRVBackground";

import { colors, radius, spacing } from "../constants/theme";

import { useAuth } from "../context/AuthContext";

export default function RegisterScreen() {
    const { signUp } = useAuth();

    const [name, setName] = useState("");

    const [email, setEmail] = useState("");

    const [password, setPassword] = useState("");

    const [confirmPassword, setConfirmPassword] = useState("");

    const [rememberMe, setRememberMe] = useState(true);

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState("");

    const passwordRules = useMemo(
        () => [
            {
                label: "At least 8 characters",
                valid: password.length >= 8,
            },
            {
                label: "One uppercase letter",
                valid: /[A-Z]/.test(password),
            },
            {
                label: "One number",
                valid: /\d/.test(password),
            },
            {
                label: "One special character",
                valid: /[^A-Za-z0-9]/.test(password),
            },
        ],
        [password],
    );

    const passwordScore = passwordRules.filter((rule) => rule.valid).length;

    const passwordStrength =
        passwordScore <= 1 ? "Weak" : passwordScore <= 3 ? "Good" : "Strong";

    const passwordStrengthColor =
        passwordScore <= 1
            ? colors.danger
            : passwordScore <= 3
              ? colors.warning
              : colors.success;

    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

    const passwordsMatch =
        confirmPassword.length > 0 && password === confirmPassword;

    const handleRegister = async () => {
        setError("");

        if (!name.trim() || !email.trim() || !password || !confirmPassword) {
            setError("Please complete all fields.");

            return;
        }

        if (!emailValid) {
            setError("Please enter a valid email address.");

            return;
        }

        if (passwordScore < 4) {
            setError("Please meet all password requirements.");

            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match.");

            return;
        }

        try {
            setLoading(true);

            await signUp(name, email, password, rememberMe);
        } catch (error) {
            setError(
                error instanceof Error
                    ? error.message
                    : "Unable to create your account.",
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
                    <Text style={styles.eyebrow}>SMART RENTAL VAULT</Text>

                    <Text style={styles.title}>Create your account</Text>

                    <Text style={styles.subtitle}>
                        Create your SRV profile and get ready to rent smart
                        storage near you.
                    </Text>

                    <View style={styles.form}>
                        <AppInput
                            label="Full name"
                            value={name}
                            onChangeText={(value) => {
                                setName(value);
                                setError("");
                            }}
                            autoCapitalize="words"
                            autoCorrect={false}
                            placeholder="Your full name"
                        />

                        <AppInput
                            label="Email"
                            value={email}
                            onChangeText={(value) => {
                                setEmail(value);
                                setError("");
                            }}
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
                                        style={styles.inputIndicator}
                                    />
                                ) : null
                            }
                        />

                        <PasswordInput
                            label="Password"
                            value={password}
                            onChangeText={(value) => {
                                setPassword(value);
                                setError("");
                            }}
                            autoComplete="new-password"
                            placeholder="Create a password"
                        />

                        {/* PASSWORD STRENGTH */}
                        {password.length > 0 ? (
                            <View style={styles.passwordPanel}>
                                <View style={styles.strengthHeader}>
                                    <Text style={styles.requirementsTitle}>
                                        Password strength
                                    </Text>

                                    <Text
                                        style={[
                                            styles.strength,
                                            {
                                                color: passwordStrengthColor,
                                            },
                                        ]}
                                    >
                                        {passwordStrength}
                                    </Text>
                                </View>

                                <View style={styles.strengthBars}>
                                    {[1, 2, 3, 4].map((index) => (
                                        <View
                                            key={index}
                                            style={[
                                                styles.strengthBar,
                                                index <= passwordScore && {
                                                    backgroundColor:
                                                        passwordStrengthColor,
                                                },
                                            ]}
                                        />
                                    ))}
                                </View>

                                <View style={styles.requirements}>
                                    {passwordRules.map((rule) => (
                                        <View
                                            key={rule.label}
                                            style={styles.rule}
                                        >
                                            <Ionicons
                                                name={
                                                    rule.valid
                                                        ? "checkmark-circle"
                                                        : "ellipse-outline"
                                                }
                                                size={16}
                                                color={
                                                    rule.valid
                                                        ? colors.success
                                                        : colors.mutedDark
                                                }
                                            />

                                            <Text
                                                style={[
                                                    styles.ruleText,
                                                    rule.valid &&
                                                        styles.ruleTextValid,
                                                ]}
                                            >
                                                {rule.label}
                                            </Text>
                                        </View>
                                    ))}
                                </View>
                            </View>
                        ) : null}

                        <PasswordInput
                            label="Confirm password"
                            value={confirmPassword}
                            onChangeText={(value) => {
                                setConfirmPassword(value);
                                setError("");
                            }}
                            autoComplete="new-password"
                            placeholder="Re-enter your password"
                        />

                        {/* MATCH INDICATOR */}
                        {confirmPassword.length > 0 ? (
                            <View
                                style={[
                                    styles.matchBox,
                                    {
                                        borderColor: passwordsMatch
                                            ? colors.success
                                            : colors.danger,
                                        backgroundColor: passwordsMatch
                                            ? colors.successSoft
                                            : colors.dangerSoft,
                                    },
                                ]}
                            >
                                <Ionicons
                                    name={
                                        passwordsMatch
                                            ? "checkmark-circle"
                                            : "alert-circle"
                                    }
                                    size={18}
                                    color={
                                        passwordsMatch
                                            ? colors.success
                                            : colors.danger
                                    }
                                />

                                <Text
                                    style={[
                                        styles.matchText,
                                        {
                                            color: passwordsMatch
                                                ? colors.success
                                                : colors.danger,
                                        },
                                    ]}
                                >
                                    {passwordsMatch
                                        ? "Passwords match"
                                        : "Passwords do not match"}
                                </Text>
                            </View>
                        ) : null}

                        <FormCheckbox
                            checked={rememberMe}
                            onPress={() => setRememberMe((value) => !value)}
                            label="Keep me signed in"
                        />

                        {error ? (
                            <View style={styles.errorBox}>
                                <Ionicons
                                    name="alert-circle-outline"
                                    size={18}
                                    color={colors.danger}
                                />

                                <Text style={styles.errorText}>{error}</Text>
                            </View>
                        ) : null}

                        <AppButton
                            title="Create account"
                            onPress={handleRegister}
                            loading={loading}
                        />
                    </View>

                    <View style={styles.footer}>
                        <Text style={styles.footerText}>
                            Already have an account?
                        </Text>

                        <Text
                            style={styles.link}
                            onPress={() => router.replace("/login")}
                        >
                            Log in
                        </Text>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SRVBackground>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    content: {
        flexGrow: 1,

        justifyContent: "center",

        padding: spacing.lg,
        paddingVertical: 40,
    },

    eyebrow: {
        color: colors.gold,

        fontWeight: "900",
        letterSpacing: 2.2,

        fontSize: 11,

        marginBottom: 8,
    },

    title: {
        color: colors.textStrong,

        fontSize: 30,
        lineHeight: 38,

        fontWeight: "900",
    },

    subtitle: {
        color: colors.muted,

        fontSize: 15,
        lineHeight: 23,

        marginTop: 6,
        marginBottom: 24,
    },

    form: {
        gap: spacing.md,
    },

    inputIndicator: {
        marginRight: 14,
    },

    passwordPanel: {
        backgroundColor: colors.surface,

        borderWidth: 1,
        borderColor: colors.border,

        borderRadius: radius.md,

        padding: spacing.md,

        gap: spacing.sm,
    },

    strengthHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },

    requirementsTitle: {
        color: colors.text,

        fontSize: 13,
        fontWeight: "700",
    },

    strength: {
        fontSize: 13,
        fontWeight: "800",
    },

    strengthBars: {
        flexDirection: "row",
        gap: 5,
    },

    strengthBar: {
        flex: 1,

        height: 5,

        borderRadius: 999,

        backgroundColor: colors.border,
    },

    requirements: {
        gap: 6,
    },

    rule: {
        flexDirection: "row",
        alignItems: "center",

        gap: 7,
    },

    ruleText: {
        color: colors.muted,

        fontSize: 12,
    },

    ruleTextValid: {
        color: colors.success,
    },

    matchBox: {
        flexDirection: "row",
        alignItems: "center",

        gap: 8,

        borderWidth: 1,
        borderRadius: radius.md,

        padding: spacing.sm,
    },

    matchText: {
        fontSize: 13,
        fontWeight: "700",
    },

    errorBox: {
        flexDirection: "row",
        alignItems: "center",

        gap: 8,

        backgroundColor: colors.dangerSoft,

        borderWidth: 1,
        borderColor: colors.danger,

        borderRadius: radius.md,

        padding: spacing.md,
    },

    errorText: {
        flex: 1,

        color: colors.danger,

        fontSize: 14,
        fontWeight: "600",
        lineHeight: 20,
    },

    footer: {
        flexDirection: "row",

        justifyContent: "center",
        alignItems: "center",

        gap: 6,

        marginTop: spacing.xl,
    },

    footerText: {
        color: colors.muted,
        fontSize: 14,
    },

    link: {
        color: colors.goldLight,
        fontSize: 14,
        fontWeight: "800",
    },
});
