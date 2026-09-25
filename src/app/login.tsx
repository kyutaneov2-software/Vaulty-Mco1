import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import { useState } from "react";
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

const getLoginErrorMessage = (error: unknown) => {
    const message =
        error instanceof Error ? error.message : String(error ?? "");

    const normalized = message.toLowerCase();

    if (
        normalized.includes("invalid login credentials") ||
        normalized.includes("invalid email or password")
    ) {
        return "Invalid email or password.";
    }

    if (
        normalized.includes("email not confirmed") ||
        normalized.includes("email_not_confirmed")
    ) {
        return "This account still requires email confirmation.";
    }

    return message || "Unable to log in. Please try again.";
};

export default function LoginScreen() {
    const { signIn } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(true);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

    const handleLogin = async () => {
        setError("");

        if (!email.trim() || !password) {
            setError("Please enter your email and password.");
            return;
        }

        if (!emailValid) {
            setError("Please enter a valid email address.");
            return;
        }

        try {
            setLoading(true);

            const nextStage = await signIn(
                email.trim().toLowerCase(),
                password,
                rememberMe,
            );

            /**
             * A returning user with a verified TOTP factor
             * must complete the 6-digit authenticator challenge.
             */
            if (nextStage === "challenge") {
                router.replace("/mfa-challenge");
                return;
            }

            /**
             * A user without a TOTP factor needs to enroll
             * an authenticator before accessing Vaulty.
             */
            if (nextStage === "setup") {
                router.replace("/setup-mfa");
                return;
            }

            /**
             * Already authenticated with AAL2.
             */
            if (nextStage === "ready") {
                router.replace("/(app)");
                return;
            }

            setError("Unable to determine the account security status.");
        } catch (error) {
            setError(getLoginErrorMessage(error));
        } finally {
            setLoading(false);
        }
    };

    return (
        <SRVBackground>
            {/* Ambient background glow */}
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
                        BRAND HERO
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
                                    SMART RENTAL VAULT
                                </Text>
                            </View>
                        </LinearGradient>
                    </View>

                    {/* =================================================
                        HEADING
                    ================================================= */}
                    <View style={styles.headingBlock}>
                        <Text style={styles.eyebrow}>WELCOME BACK</Text>

                        <Text style={styles.title}>
                            Access your{" "}
                            <Text style={styles.titleAccent}>Vaulty</Text>.
                        </Text>

                        <Text style={styles.subtitle}>
                            Sign in to manage your storage, wallet, rentals, and
                            secure vault access.
                        </Text>
                    </View>

                    {/* =================================================
                        LOGIN CARD
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

                        {/* Account section */}
                        <View style={styles.sectionHeader}>
                            <View style={styles.sectionIcon}>
                                <Ionicons
                                    name="person-outline"
                                    size={16}
                                    color={colors.goldLight}
                                />
                            </View>

                            <View>
                                <Text style={styles.sectionTitle}>Sign in</Text>

                                <Text style={styles.sectionSubtitle}>
                                    Enter your Vaulty credentials
                                </Text>
                            </View>
                        </View>

                        <View style={styles.form}>
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

                            {/* PASSWORD */}
                            <PasswordInput
                                label="Password"
                                value={password}
                                onChangeText={(value) => {
                                    setPassword(value);
                                    setError("");
                                }}
                                autoComplete="password"
                                placeholder="Enter your password"
                            />

                            {/* OPTIONS */}
                            <View style={styles.optionsRow}>
                                <FormCheckbox
                                    checked={rememberMe}
                                    onPress={() =>
                                        setRememberMe((value) => !value)
                                    }
                                    label="Remember me"
                                />

                                <Text
                                    style={styles.forgot}
                                    onPress={() => {
                                        setError(
                                            "Password recovery will be added next.",
                                        );
                                    }}
                                >
                                    Forgot password?
                                </Text>
                            </View>

                            {/* SECURITY NOTE */}
                            <View style={styles.securityCard}>
                                <View style={styles.securityIcon}>
                                    <Ionicons
                                        name="shield-checkmark-outline"
                                        size={17}
                                        color={colors.goldLight}
                                    />
                                </View>

                                <View style={styles.securityContent}>
                                    <Text style={styles.securityTitle}>
                                        Two-step protection
                                    </Text>

                                    <Text style={styles.securityText}>
                                        After signing in, you'll verify a
                                        6-digit code from your authenticator
                                        app.
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

                                    <Text style={styles.errorText}>
                                        {error}
                                    </Text>
                                </View>
                            ) : null}

                            {/* LOGIN */}
                            <View style={styles.buttonWrapper}>
                                <AppButton
                                    title="Log in"
                                    onPress={handleLogin}
                                    loading={loading}
                                />
                            </View>
                        </View>
                    </LinearGradient>

                    {/* =================================================
                        REGISTER
                    ================================================= */}
                    <View style={styles.footer}>
                        <Text style={styles.footerText}>
                            Don't have an account?
                        </Text>

                        <Text
                            style={styles.link}
                            onPress={() => router.replace("/register")}
                        >
                            Create an account
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
                            Protected by Vaulty's secure authentication system.
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
       HERO
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
        letterSpacing: 1.7,
    },

    /* =================================================
       HEADING
    ================================================= */

    headingBlock: {
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
        fontSize: 32,
        lineHeight: 40,
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
       CARD
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

    sectionHeader: {
        flexDirection: "row",
        alignItems: "center",
        gap: 11,
        marginBottom: 18,
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

    /* =================================================
       OPTIONS
    ================================================= */

    optionsRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },

    forgot: {
        color: colors.goldLight,
        fontSize: 12,
        fontWeight: "800",
    },

    /* =================================================
       SECURITY
    ================================================= */

    securityCard: {
        flexDirection: "row",
        alignItems: "center",
        padding: 12,
        borderRadius: 18,
        backgroundColor: "rgba(36,23,61,0.58)",
        borderWidth: 1,
        borderColor: "rgba(139,92,246,0.22)",
    },

    securityIcon: {
        width: 36,
        height: 36,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: colors.primarySoft,
        marginRight: 10,
    },

    securityContent: {
        flex: 1,
    },

    securityTitle: {
        color: colors.text,
        fontSize: 12,
        fontWeight: "800",
    },

    securityText: {
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

    buttonWrapper: {
        marginTop: 4,
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
