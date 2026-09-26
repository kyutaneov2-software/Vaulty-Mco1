import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import { useState } from "react";
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Text,
    View,
} from "react-native";

import { AppButton } from "../components/AppButton";
import { AppInput } from "../components/AppInput";
import { FormCheckbox } from "../components/FormCheckbox";
import { PasswordInput } from "../components/PasswordInput";
import SRVBackground from "../components/SRVBackground";
import { colors } from "../constants/theme";
import { useAuth } from "../context/AuthContext";
import { authStyles as styles } from "../styles/auth.styles";

/* =========================================================
   FUNCTION: getLoginErrorMessage

   Converts authentication errors into user-friendly
   messages for the Vaulty login screen.
========================================================= */
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

    if (
        normalized.includes("too many requests") ||
        normalized.includes("rate limit")
    ) {
        return "Too many login attempts. Please wait a moment and try again.";
    }

    return message || "Unable to log in. Please try again.";
};

/* =========================================================
   FUNCTION: LoginScreen

   Renders the Vaulty login screen and routes the user
   through the appropriate MFA stage after authentication.
========================================================= */
export default function LoginScreen() {
    const { signIn } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

    /* =========================================================
       FUNCTION: handleEmailChange

       Updates the email field and clears the current error.
    ========================================================= */
    const handleEmailChange = (value: string) => {
        setEmail(value);
        setError("");
    };

    /* =========================================================
       FUNCTION: handlePasswordChange

       Updates the password field and clears the current error.
    ========================================================= */
    const handlePasswordChange = (value: string) => {
        setPassword(value);
        setError("");
    };

    /* =========================================================
       FUNCTION: handleRememberMeToggle

       Toggles whether the authentication session should
       remain persisted on the current device.
    ========================================================= */
    const handleRememberMeToggle = () => {
        setRememberMe((value) => !value);
    };

    /* =========================================================
    FUNCTION: handleForgotPassword

    Opens the Vaulty password-recovery screen.
 ========================================================= */

    const handleForgotPassword = () => {
        router.push("/recover-password");
    };

    /* =========================================================
       FUNCTION: handleRegisterNavigation

       Navigates the user to the account registration screen.
    ========================================================= */
    const handleRegisterNavigation = () => {
        router.replace("/register");
    };

    /* =========================================================
       FUNCTION: handleLogin

       Validates credentials, authenticates the user,
       and routes according to the user's MFA state.
    ========================================================= */
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

            /*
             * Existing verified TOTP factor.
             */
            if (nextStage === "challenge") {
                router.replace("/mfa-challenge");
                return;
            }

            /*
             * User has no verified TOTP factor.
             */
            if (nextStage === "setup") {
                router.replace("/setup-mfa");
                return;
            }

            /*
             * User is already fully authenticated.
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
            <KeyboardAvoidingView
                style={styles.container}
                behavior={Platform.OS === "ios" ? "padding" : undefined}
            >
                <ScrollView
                    contentContainerStyle={styles.loginContent}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    {/* =================================================
                        PAGE HEADING
                    ================================================= */}
                    <View style={styles.loginHeading}>
                        <Text style={styles.loginEyebrow}>WELCOME BACK</Text>

                        <Text style={styles.loginTitle}>
                            Access your{" "}
                            <Text style={styles.loginTitleAccent}>Vaulty</Text>.
                        </Text>

                        <Text style={styles.loginSubtitle}>
                            Sign in to manage your storage, wallet, rentals, and
                            secure vault access.
                        </Text>
                    </View>

                    {/* =================================================
                        LOGIN FORM
                    ================================================= */}
                    <View style={styles.loginFormCard}>
                        <View style={styles.loginCardHeader}>
                            <View style={styles.loginSectionIcon}>
                                <Ionicons
                                    name="person-outline"
                                    size={17}
                                    color={colors.primaryLight}
                                />
                            </View>

                            <View>
                                <Text style={styles.loginSectionTitle}>
                                    Sign in
                                </Text>

                                <Text style={styles.loginSectionSubtitle}>
                                    Enter your Vaulty credentials
                                </Text>
                            </View>
                        </View>

                        <View style={styles.loginForm}>
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
                                            style={styles.inputIndicator}
                                        />
                                    ) : null
                                }
                            />

                            {/* PASSWORD */}
                            <PasswordInput
                                label="Password"
                                value={password}
                                onChangeText={handlePasswordChange}
                                autoComplete="password"
                                placeholder="Enter your password"
                            />

                            {/* OPTIONS */}
                            <View style={styles.loginOptionsRow}>
                                <FormCheckbox
                                    checked={rememberMe}
                                    onPress={handleRememberMeToggle}
                                    label="Remember me"
                                />

                                <Text
                                    style={styles.loginForgot}
                                    onPress={handleForgotPassword}
                                >
                                    Forgot password?
                                </Text>
                            </View>

                            {/* MFA INFORMATION */}
                            <View style={styles.loginSecurityCard}>
                                <View style={styles.loginSecurityIcon}>
                                    <Ionicons
                                        name="shield-checkmark-outline"
                                        size={18}
                                        color={colors.primaryLight}
                                    />
                                </View>

                                <View style={styles.loginSecurityContent}>
                                    <Text style={styles.loginSecurityTitle}>
                                        Two-step protection
                                    </Text>

                                    <Text style={styles.loginSecurityText}>
                                        After signing in, you'll verify a
                                        6-digit code from your authenticator
                                        app.
                                    </Text>
                                </View>
                            </View>

                            {/* ERROR */}
                            {error ? (
                                <View style={styles.loginErrorBox}>
                                    <View style={styles.loginErrorIcon}>
                                        <Ionicons
                                            name="alert-circle"
                                            size={16}
                                            color={colors.danger}
                                        />
                                    </View>

                                    <Text style={styles.loginErrorText}>
                                        {error}
                                    </Text>
                                </View>
                            ) : null}

                            {/* LOGIN BUTTON */}
                            <View style={styles.loginButtonWrapper}>
                                <AppButton
                                    title="Log in"
                                    onPress={handleLogin}
                                    loading={loading}
                                />
                            </View>
                        </View>
                    </View>

                    {/* =================================================
                        REGISTER FOOTER
                    ================================================= */}
                    <View style={styles.loginFooter}>
                        <Text style={styles.loginFooterText}>
                            Don't have an account?
                        </Text>

                        <Text
                            style={styles.loginLink}
                            onPress={handleRegisterNavigation}
                        >
                            Create an account
                        </Text>
                    </View>

                    {/* =================================================
                        SECURITY FOOTER
                    ================================================= */}
                    <View style={styles.loginSecureFooter}>
                        <Ionicons
                            name="lock-closed-outline"
                            size={13}
                            color={colors.mutedDark}
                        />

                        <Text style={styles.loginSecureFooterText}>
                            Protected by Vaulty's secure authentication system.
                        </Text>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SRVBackground>
    );
}
