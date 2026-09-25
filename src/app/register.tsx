import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import { useMemo, useState } from "react";
import {
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import { AppButton } from "../components/AppButton";
import { AppInput } from "../components/AppInput";
import { FormCheckbox } from "../components/FormCheckbox";
import { PasswordInput } from "../components/PasswordInput";
import SRVBackground from "../components/SRVBackground";
import { colors, radius, spacing } from "../constants/theme";
import { useAuth } from "../context/AuthContext";

const getRegisterErrorMessage = (error: unknown) => {
    const message =
        error instanceof Error ? error.message : String(error ?? "");

    const normalized = message.toLowerCase();

    if (normalized.includes("user already registered")) {
        return "An account with this email already exists. Please log in instead.";
    }

    if (normalized.includes("email already registered")) {
        return "An account with this email already exists. Please log in instead.";
    }

    if (normalized.includes("password")) {
        return message;
    }

    return message || "Unable to create your account. Please try again.";
};

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

        if (!passwordsMatch) {
            setError("Passwords do not match.");
            return;
        }

        try {
            setLoading(true);

            const cleanEmail = email.trim().toLowerCase();

            /**
             * Supabase should create the user and immediately
             * return a session because Confirm Email is disabled.
             */
            const nextStage = await signUp(
                name,
                cleanEmail,
                password,
                rememberMe,
            );

            /**
             * New users need to enroll their authenticator.
             */
            if (nextStage === "setup") {
                router.replace("/setup-mfa");
                return;
            }

            /**
             * This is mainly a safety fallback.
             */
            if (nextStage === "challenge") {
                router.replace("/mfa-challenge");
                return;
            }

            /**
             * A ready session can go straight to the app.
             */
            if (nextStage === "ready") {
                router.replace("/(app)");
                return;
            }

            setError(
                "Account created, but security setup could not be started.",
            );
        } catch (error) {
            setError(getRegisterErrorMessage(error));
        } finally {
            setLoading(false);
        }
    };

    return (
        <SRVBackground>
            {/* Decorative ambient glow */}
            <View
                pointerEvents="none"
                style={[styles.glow, styles.glowPurple]}
            />

            <View pointerEvents="none" style={[styles.glow, styles.glowGold]} />

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
                        LOGO HERO
                    ================================================= */}
                    <View style={styles.hero}>
                        <LinearGradient
                            colors={[
                                "rgba(139,92,246,0.22)",
                                "rgba(212,175,55,0.10)",
                                "rgba(21,17,31,0.96)",
                            ]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.logoShell}
                        >
                            <View style={styles.logoInner}>
                                <Image
                                    source={require("../../assets/images/srv-logo.png")}
                                    style={styles.logo}
                                    resizeMode="contain"
                                />
                            </View>

                            <View style={styles.logoAccent}>
                                <View style={styles.accentDot} />

                                <Text style={styles.accentText}>
                                    SECURE STORAGE
                                </Text>
                            </View>
                        </LinearGradient>
                    </View>

                    {/* =================================================
                        PAGE HEADING
                    ================================================= */}
                    <View style={styles.heading}>
                        <Text style={styles.eyebrow}>SMART RENTAL VAULT</Text>

                        <Text style={styles.title}>
                            Create your{" "}
                            <Text style={styles.titleAccent}>Vaulty</Text>{" "}
                            account.
                        </Text>

                        <Text style={styles.subtitle}>
                            Your secure storage journey starts here. Create your
                            account and protect it with authenticator-based
                            verification.
                        </Text>
                    </View>

                    {/* =================================================
                        MAIN FORM CARD
                    ================================================= */}
                    <LinearGradient
                        colors={[
                            "rgba(255,255,255,0.055)",
                            "rgba(139,92,246,0.045)",
                            "rgba(9,7,13,0.92)",
                        ]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.formCard}
                    >
                        <View style={styles.cardHighlight} />

                        {/* =================================================
                            PERSONAL DETAILS
                        ================================================= */}
                        <View style={styles.sectionHeader}>
                            <View style={styles.sectionIcon}>
                                <Ionicons
                                    name="person-outline"
                                    size={16}
                                    color={colors.goldLight}
                                />
                            </View>

                            <View>
                                <Text style={styles.sectionTitle}>
                                    Personal details
                                </Text>

                                <Text style={styles.sectionSubtitle}>
                                    Tell us a little about you
                                </Text>
                            </View>
                        </View>

                        <View style={styles.form}>
                            {/* FULL NAME */}
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

                            {/* EMAIL */}
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
                        </View>

                        {/* Divider */}
                        <View style={styles.divider} />

                        {/* =================================================
                            SECURITY
                        ================================================= */}
                        <View style={styles.sectionHeader}>
                            <View style={styles.sectionIcon}>
                                <Ionicons
                                    name="shield-checkmark-outline"
                                    size={16}
                                    color={colors.goldLight}
                                />
                            </View>

                            <View>
                                <Text style={styles.sectionTitle}>
                                    Account security
                                </Text>

                                <Text style={styles.sectionSubtitle}>
                                    Protect your Vaulty account
                                </Text>
                            </View>
                        </View>

                        <View style={styles.form}>
                            {/* PASSWORD */}
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
                                        <View>
                                            <Text
                                                style={styles.requirementsTitle}
                                            >
                                                Password strength
                                            </Text>

                                            <Text
                                                style={
                                                    styles.requirementsSubtitle
                                                }
                                            >
                                                Make your password stronger
                                            </Text>
                                        </View>

                                        <View
                                            style={[
                                                styles.strengthBadge,
                                                {
                                                    borderColor:
                                                        passwordStrengthColor,
                                                },
                                            ]}
                                        >
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

                            {/* CONFIRM PASSWORD */}
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
                                    <View style={styles.matchIcon}>
                                        <Ionicons
                                            name={
                                                passwordsMatch
                                                    ? "checkmark"
                                                    : "alert"
                                            }
                                            size={14}
                                            color={
                                                passwordsMatch
                                                    ? colors.success
                                                    : colors.danger
                                            }
                                        />
                                    </View>

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
                        </View>

                        {/* =================================================
                            SESSION PREFERENCE
                        ================================================= */}
                        <View style={styles.preferenceCard}>
                            <View style={styles.preferenceIcon}>
                                <Ionicons
                                    name="phone-portrait-outline"
                                    size={18}
                                    color={colors.primary}
                                />
                            </View>

                            <View style={styles.preferenceContent}>
                                <Text style={styles.preferenceTitle}>
                                    Stay signed in
                                </Text>

                                <Text style={styles.preferenceSubtitle}>
                                    Keep your Vaulty session active on this
                                    device.
                                </Text>
                            </View>

                            <FormCheckbox
                                checked={rememberMe}
                                onPress={() => setRememberMe((value) => !value)}
                                label=""
                            />
                        </View>

                        {/* =================================================
                            MFA INFO
                        ================================================= */}
                        <View style={styles.mfaInfoCard}>
                            <View style={styles.mfaInfoIcon}>
                                <Ionicons
                                    name="shield-checkmark"
                                    size={18}
                                    color={colors.goldLight}
                                />
                            </View>

                            <View style={styles.mfaInfoContent}>
                                <Text style={styles.mfaInfoTitle}>
                                    Authenticator protection
                                </Text>

                                <Text style={styles.mfaInfoText}>
                                    After registration, you'll connect an
                                    authenticator app and verify a rotating
                                    6-digit security code.
                                </Text>
                            </View>
                        </View>

                        {/* ERROR */}
                        {error ? (
                            <View style={styles.errorBox}>
                                <View style={styles.errorIcon}>
                                    <Ionicons
                                        name="alert-circle"
                                        size={16}
                                        color={colors.danger}
                                    />
                                </View>

                                <Text style={styles.errorText}>{error}</Text>
                            </View>
                        ) : null}

                        {/* CREATE ACCOUNT */}
                        <View style={styles.buttonWrapper}>
                            <AppButton
                                title="Create account"
                                onPress={handleRegister}
                                loading={loading}
                            />
                        </View>

                        {/* Security note */}
                        <View style={styles.verificationNote}>
                            <Ionicons
                                name="lock-closed-outline"
                                size={17}
                                color={colors.goldLight}
                            />

                            <Text style={styles.verificationText}>
                                Vaulty requires authenticator verification
                                before account access is completed.
                            </Text>
                        </View>
                    </LinearGradient>

                    {/* =================================================
                        LOGIN FOOTER
                    ================================================= */}
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

                    {/* Security footer */}
                    <View style={styles.secureFooter}>
                        <Ionicons
                            name="lock-closed-outline"
                            size={13}
                            color={colors.mutedDark}
                        />

                        <Text style={styles.secureFooterText}>
                            Your account information is securely protected.
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
        paddingHorizontal: spacing.lg,
        paddingTop: 34,
        paddingBottom: 44,
    },

    /* =================================================
       AMBIENT BACKGROUND
    ================================================= */

    glow: {
        position: "absolute",
        borderRadius: 999,
    },

    glowPurple: {
        width: 240,
        height: 240,
        top: -90,
        right: -80,
        backgroundColor: colors.primary,
        opacity: 0.1,
    },

    glowGold: {
        width: 180,
        height: 180,
        bottom: 40,
        left: -90,
        backgroundColor: colors.gold,
        opacity: 0.06,
    },

    /* =================================================
       HERO / LOGO
    ================================================= */

    hero: {
        alignItems: "center",
        marginBottom: 24,
    },

    logoShell: {
        width: 190,
        minHeight: 118,
        borderRadius: 28,
        borderWidth: 1,
        borderColor: colors.borderStrong,
        padding: 10,
        shadowColor: colors.primary,
        shadowOffset: {
            width: 0,
            height: 12,
        },
        shadowOpacity: 0.2,
        shadowRadius: 22,
        elevation: 10,
    },

    logoInner: {
        flex: 1,
        minHeight: 76,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 20,
        backgroundColor: "rgba(9,7,13,0.72)",
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.06)",
    },

    logo: {
        width: 145,
        height: 70,
    },

    logoAccent: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 7,
        marginTop: 8,
    },

    accentDot: {
        width: 6,
        height: 6,
        borderRadius: 999,
        backgroundColor: colors.gold,
    },

    accentText: {
        color: colors.muted,
        fontSize: 9,
        fontWeight: "900",
        letterSpacing: 1.8,
    },

    /* =================================================
       HEADING
    ================================================= */

    heading: {
        marginBottom: 22,
    },

    eyebrow: {
        color: colors.gold,
        fontSize: 10,
        fontWeight: "900",
        letterSpacing: 2.4,
        marginBottom: 8,
    },

    title: {
        color: colors.textStrong,
        fontSize: 31,
        lineHeight: 39,
        fontWeight: "900",
    },

    titleAccent: {
        color: colors.goldLight,
    },

    subtitle: {
        color: colors.muted,
        fontSize: 14,
        lineHeight: 22,
        marginTop: 8,
        maxWidth: 370,
    },

    /* =================================================
       MAIN CARD
    ================================================= */

    formCard: {
        position: "relative",
        overflow: "hidden",
        borderRadius: 28,
        borderWidth: 1,
        borderColor: colors.borderStrong,
        padding: spacing.md,
        shadowColor: colors.black,
        shadowOffset: {
            width: 0,
            height: 18,
        },
        shadowOpacity: 0.35,
        shadowRadius: 28,
        elevation: 12,
    },

    cardHighlight: {
        position: "absolute",
        top: 0,
        left: 26,
        right: 26,
        height: 1,
        backgroundColor: "rgba(241,215,122,0.32)",
    },

    /* =================================================
       SECTION HEADERS
    ================================================= */

    sectionHeader: {
        flexDirection: "row",
        alignItems: "center",
        gap: 11,
        marginBottom: 16,
    },

    sectionIcon: {
        width: 36,
        height: 36,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: colors.goldSoft,
        borderWidth: 1,
        borderColor: "rgba(212,175,55,0.30)",
    },

    sectionTitle: {
        color: colors.textStrong,
        fontSize: 14,
        fontWeight: "800",
    },

    sectionSubtitle: {
        color: colors.mutedDark,
        fontSize: 11,
        marginTop: 2,
    },

    form: {
        gap: spacing.md,
    },

    inputIndicator: {
        marginRight: 14,
    },

    divider: {
        height: 1,
        backgroundColor: colors.border,
        marginVertical: 22,
    },

    /* =================================================
       PASSWORD
    ================================================= */

    passwordPanel: {
        backgroundColor: "rgba(33,26,46,0.72)",
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 19,
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
        fontWeight: "800",
    },

    requirementsSubtitle: {
        color: colors.mutedDark,
        fontSize: 10,
        marginTop: 2,
    },

    strengthBadge: {
        minWidth: 58,
        paddingHorizontal: 9,
        paddingVertical: 5,
        borderRadius: 999,
        borderWidth: 1,
        alignItems: "center",
    },

    strength: {
        fontSize: 11,
        fontWeight: "900",
    },

    strengthBars: {
        flexDirection: "row",
        gap: 5,
        marginTop: 4,
    },

    strengthBar: {
        flex: 1,
        height: 5,
        borderRadius: 999,
        backgroundColor: colors.border,
    },

    requirements: {
        gap: 6,
        marginTop: 3,
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

    /* =================================================
       PASSWORD MATCH
    ================================================= */

    matchBox: {
        flexDirection: "row",
        alignItems: "center",
        gap: 9,
        borderWidth: 1,
        borderRadius: 15,
        paddingVertical: 10,
        paddingHorizontal: 12,
    },

    matchIcon: {
        width: 24,
        height: 24,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(255,255,255,0.05)",
    },

    matchText: {
        fontSize: 12,
        fontWeight: "800",
    },

    /* =================================================
       SESSION
    ================================================= */

    preferenceCard: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 20,
        padding: 12,
        borderRadius: 18,
        backgroundColor: "rgba(36,23,61,0.58)",
        borderWidth: 1,
        borderColor: "rgba(139,92,246,0.22)",
    },

    preferenceIcon: {
        width: 36,
        height: 36,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: colors.primarySoft,
        marginRight: 10,
    },

    preferenceContent: {
        flex: 1,
    },

    preferenceTitle: {
        color: colors.text,
        fontSize: 12,
        fontWeight: "800",
    },

    preferenceSubtitle: {
        color: colors.mutedDark,
        fontSize: 10,
        lineHeight: 15,
        marginTop: 2,
        paddingRight: 8,
    },

    /* =================================================
       MFA INFO
    ================================================= */

    mfaInfoCard: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 14,
        padding: 12,
        borderRadius: 18,
        backgroundColor: "rgba(45,37,16,0.48)",
        borderWidth: 1,
        borderColor: "rgba(212,175,55,0.20)",
    },

    mfaInfoIcon: {
        width: 36,
        height: 36,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: colors.goldSoft,
        marginRight: 10,
    },

    mfaInfoContent: {
        flex: 1,
    },

    mfaInfoTitle: {
        color: colors.goldLight,
        fontSize: 12,
        fontWeight: "800",
    },

    mfaInfoText: {
        color: colors.mutedDark,
        fontSize: 10,
        lineHeight: 15,
        marginTop: 2,
    },

    /* =================================================
       ERROR
    ================================================= */

    errorBox: {
        flexDirection: "row",
        alignItems: "center",
        gap: 9,
        marginTop: 16,
        padding: 12,
        borderRadius: 17,
        backgroundColor: colors.dangerSoft,
        borderWidth: 1,
        borderColor: "rgba(251,113,133,0.55)",
    },

    errorIcon: {
        width: 28,
        height: 28,
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(251,113,133,0.10)",
    },

    errorText: {
        flex: 1,
        color: colors.danger,
        fontSize: 12,
        fontWeight: "700",
        lineHeight: 18,
    },

    /* =================================================
       BUTTON / NOTE
    ================================================= */

    buttonWrapper: {
        marginTop: 20,
    },

    verificationNote: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        marginTop: 14,
        paddingHorizontal: 6,
    },

    verificationText: {
        flex: 1,
        color: colors.mutedDark,
        fontSize: 10,
        lineHeight: 15,
    },

    /* =================================================
       FOOTER
    ================================================= */

    footer: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 6,
        marginTop: 26,
    },

    footerText: {
        color: colors.muted,
        fontSize: 13,
    },

    link: {
        color: colors.goldLight,
        fontSize: 13,
        fontWeight: "900",
    },

    secureFooter: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
        marginTop: 16,
    },

    secureFooterText: {
        color: colors.mutedDark,
        fontSize: 10,
    },
});
