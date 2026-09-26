import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import { useMemo, useState } from "react";
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Text,
    View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import { AppButton } from "../components/AppButton";
import { AppInput } from "../components/AppInput";
import { FormCheckbox } from "../components/FormCheckbox";
import { PasswordInput } from "../components/PasswordInput";
import SRVBackground from "../components/SRVBackground";
import { colors } from "../constants/theme";
import { useAuth } from "../context/AuthContext";
import { authStyles as styles } from "../styles/auth.styles";
import { useNotice } from "../context/NoticeContext";

/* =========================================================
   FUNCTION: getRegisterErrorMessage

   Converts registration errors into user-friendly messages.
========================================================= */
const getRegisterErrorMessage = (error: unknown) => {
    const message =
        error instanceof Error ? error.message : String(error ?? "");

    const normalized = message.toLowerCase();

    if (
        normalized.includes("user already registered") ||
        normalized.includes("email already registered")
    ) {
        return "An account with this email already exists. Please log in instead.";
    }

    if (
        normalized.includes("rate limit") ||
        normalized.includes("too many requests")
    ) {
        return "Too many registration attempts. Please wait a moment before trying again.";
    }

    return message || "Unable to create your account. Please try again.";
};

/* =========================================================
   FUNCTION: RegisterScreen

   Renders the Vaulty account registration screen and
   starts the TOTP security setup after registration.
========================================================= */
export default function RegisterScreen() {
    const { signUp } = useAuth();
    const { showSuccessNotice } = useNotice();

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

    /* =========================================================
       FUNCTION: handleNameChange

       Updates the full name field and clears the error.
    ========================================================= */
    const handleNameChange = (value: string) => {
        setName(value);
        setError("");
    };

    /* =========================================================
       FUNCTION: handleEmailChange

       Updates the email field and clears the error.
    ========================================================= */
    const handleEmailChange = (value: string) => {
        setEmail(value);
        setError("");
    };

    /* =========================================================
       FUNCTION: handlePasswordChange

       Updates the password field and clears the error.
    ========================================================= */
    const handlePasswordChange = (value: string) => {
        setPassword(value);
        setError("");
    };

    /* =========================================================
       FUNCTION: handleConfirmPasswordChange

       Updates the confirmation field and clears the error.
    ========================================================= */
    const handleConfirmPasswordChange = (value: string) => {
        setConfirmPassword(value);
        setError("");
    };

    /* =========================================================
       FUNCTION: handleRememberMeToggle

       Toggles persistent session behavior.
    ========================================================= */
    const handleRememberMeToggle = () => {
        setRememberMe((value) => !value);
    };

    /* =========================================================
       FUNCTION: handleLoginNavigation

       Navigates the user back to the login screen.
    ========================================================= */
    const handleLoginNavigation = () => {
        router.replace("/login");
    };

    /* =========================================================
    FUNCTION: handleRegister
 
    Validates registration data, creates the account,
    shows the registration success notice, and routes
    the new user into the appropriate security stage.
 ========================================================= */
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

            const nextStage = await signUp(
                name.trim(),
                cleanEmail,
                password,
                rememberMe,
            );

            /* =====================================================
            REGISTRATION SUCCESS NOTICE
 
            The global notice remains mounted while Expo Router
            changes screens.
         ===================================================== */
            showSuccessNotice(
                "Account created",
                "Your Vaulty account was created successfully. Let's secure it with your authenticator.",
            );

            /* =====================================================
            NEW ACCOUNT
 
            New users continue to TOTP setup.
         ===================================================== */
            if (nextStage === "setup") {
                router.replace("/setup-mfa");
                return;
            }

            /* =====================================================
            EXISTING AUTHENTICATOR
 
            Safety fallback if the account already has a
            verified authenticator.
         ===================================================== */
            if (nextStage === "challenge") {
                router.replace("/mfa-challenge");
                return;
            }

            /* =====================================================
            FULLY AUTHENTICATED
 
            Safety fallback if the session is already ready.
         ===================================================== */
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
            <KeyboardAvoidingView
                style={styles.container}
                behavior={Platform.OS === "ios" ? "padding" : undefined}
            >
                <ScrollView
                    contentContainerStyle={styles.registerContent}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    {/* =================================================
                        PAGE HEADING
                    ================================================= */}
                    <View style={styles.registerHeading}>
                        <Text style={styles.registerEyebrow}>
                            SMART RENTAL VAULT
                        </Text>

                        <Text style={styles.registerTitle}>
                            Create your{" "}
                            <Text style={styles.registerTitleAccent}>
                                Vaulty
                            </Text>{" "}
                            account.
                        </Text>

                        <Text style={styles.registerSubtitle}>
                            Your secure storage journey starts here. Create your
                            account and protect it with authenticator-based
                            verification.
                        </Text>
                    </View>

                    {/* =================================================
                        REGISTRATION CARD
                    ================================================= */}
                    <LinearGradient
                        colors={["#100C16", "#09070D", "#050407"]}
                        start={{
                            x: 0,
                            y: 0,
                        }}
                        end={{
                            x: 0.8,
                            y: 1,
                        }}
                        style={styles.registerFormCard}
                    >
                        <View style={styles.registerCardHighlight} />

                        {/* =================================================
                            PERSONAL DETAILS
                        ================================================= */}
                        <View style={styles.registerSectionHeader}>
                            <View style={styles.registerSectionIcon}>
                                <Ionicons
                                    name="person-outline"
                                    size={16}
                                    color={colors.primaryLight}
                                />
                            </View>

                            <View>
                                <Text style={styles.registerSectionTitle}>
                                    Personal details
                                </Text>

                                <Text style={styles.registerSectionSubtitle}>
                                    Tell us a little about you
                                </Text>
                            </View>
                        </View>

                        <View style={styles.registerForm}>
                            {/* FULL NAME */}
                            <AppInput
                                label="Full name"
                                value={name}
                                onChangeText={handleNameChange}
                                autoCapitalize="words"
                                autoCorrect={false}
                                placeholder="Your full name"
                            />

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
                        </View>

                        <View style={styles.registerDivider} />

                        {/* =================================================
                            ACCOUNT SECURITY
                        ================================================= */}
                        <View style={styles.registerSectionHeader}>
                            <View style={styles.registerSectionIcon}>
                                <Ionicons
                                    name="shield-checkmark-outline"
                                    size={16}
                                    color={colors.primaryLight}
                                />
                            </View>

                            <View>
                                <Text style={styles.registerSectionTitle}>
                                    Account security
                                </Text>

                                <Text style={styles.registerSectionSubtitle}>
                                    Protect your Vaulty account
                                </Text>
                            </View>
                        </View>

                        <View style={styles.registerForm}>
                            {/* PASSWORD */}
                            <PasswordInput
                                label="Password"
                                value={password}
                                onChangeText={handlePasswordChange}
                                autoComplete="new-password"
                                placeholder="Create a password"
                            />

                            {/* PASSWORD STRENGTH */}
                            {password.length > 0 ? (
                                <View style={styles.registerPasswordPanel}>
                                    <View style={styles.registerStrengthHeader}>
                                        <View>
                                            <Text
                                                style={
                                                    styles.registerRequirementsTitle
                                                }
                                            >
                                                Password strength
                                            </Text>

                                            <Text
                                                style={
                                                    styles.registerRequirementsSubtitle
                                                }
                                            >
                                                Make your password stronger
                                            </Text>
                                        </View>

                                        <View
                                            style={[
                                                styles.registerStrengthBadge,
                                                {
                                                    borderColor:
                                                        passwordStrengthColor,
                                                },
                                            ]}
                                        >
                                            <Text
                                                style={[
                                                    styles.registerStrength,
                                                    {
                                                        color: passwordStrengthColor,
                                                    },
                                                ]}
                                            >
                                                {passwordStrength}
                                            </Text>
                                        </View>
                                    </View>

                                    <View style={styles.registerStrengthBars}>
                                        {[1, 2, 3, 4].map((index) => (
                                            <View
                                                key={index}
                                                style={[
                                                    styles.registerStrengthBar,
                                                    index <= passwordScore && {
                                                        backgroundColor:
                                                            passwordStrengthColor,
                                                    },
                                                ]}
                                            />
                                        ))}
                                    </View>

                                    <View style={styles.registerRequirements}>
                                        {passwordRules.map((rule) => (
                                            <View
                                                key={rule.label}
                                                style={styles.registerRule}
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
                                                        styles.registerRuleText,
                                                        rule.valid &&
                                                            styles.registerRuleTextValid,
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
                                onChangeText={handleConfirmPasswordChange}
                                autoComplete="new-password"
                                placeholder="Re-enter your password"
                            />

                            {/* PASSWORD MATCH */}
                            {confirmPassword.length > 0 ? (
                                <View
                                    style={[
                                        styles.registerMatchBox,
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
                                    <View style={styles.registerMatchIcon}>
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
                                            styles.registerMatchText,
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
                        <View style={styles.registerPreferenceCard}>
                            <View style={styles.registerPreferenceIcon}>
                                <Ionicons
                                    name="phone-portrait-outline"
                                    size={18}
                                    color={colors.primaryLight}
                                />
                            </View>

                            <View style={styles.registerPreferenceContent}>
                                <Text style={styles.registerPreferenceTitle}>
                                    Stay signed in
                                </Text>

                                <Text style={styles.registerPreferenceSubtitle}>
                                    Keep your Vaulty session active on this
                                    device.
                                </Text>
                            </View>

                            <FormCheckbox
                                checked={rememberMe}
                                onPress={handleRememberMeToggle}
                                label=""
                            />
                        </View>

                        {/* =================================================
                            MFA INFORMATION
                        ================================================= */}
                        <View style={styles.registerMfaCard}>
                            <View style={styles.registerMfaIcon}>
                                <Ionicons
                                    name="shield-checkmark"
                                    size={18}
                                    color={colors.primaryLight}
                                />
                            </View>

                            <View style={styles.registerMfaContent}>
                                <Text style={styles.registerMfaTitle}>
                                    Authenticator protection
                                </Text>

                                <Text style={styles.registerMfaText}>
                                    After registration, you'll connect an
                                    authenticator app and verify a rotating
                                    6-digit security code.
                                </Text>
                            </View>
                        </View>

                        {/* =================================================
                            ERROR
                        ================================================= */}
                        {error ? (
                            <View style={styles.registerErrorBox}>
                                <View style={styles.registerErrorIcon}>
                                    <Ionicons
                                        name="alert-circle"
                                        size={16}
                                        color={colors.danger}
                                    />
                                </View>

                                <Text style={styles.registerErrorText}>
                                    {error}
                                </Text>
                            </View>
                        ) : null}

                        {/* =================================================
                            CREATE ACCOUNT
                        ================================================= */}
                        <View style={styles.registerButtonWrapper}>
                            <AppButton
                                title="Create account"
                                onPress={handleRegister}
                                loading={loading}
                            />
                        </View>

                        {/* =================================================
                            SECURITY NOTE
                        ================================================= */}
                        <View style={styles.registerSecurityNote}>
                            <Ionicons
                                name="lock-closed-outline"
                                size={17}
                                color={colors.primaryLight}
                            />

                            <Text style={styles.registerSecurityText}>
                                Vaulty requires authenticator verification
                                before account access is completed.
                            </Text>
                        </View>
                    </LinearGradient>

                    {/* =================================================
                        LOGIN FOOTER
                    ================================================= */}
                    <View style={styles.registerFooter}>
                        <Text style={styles.registerFooterText}>
                            Already have an account?
                        </Text>

                        <Text
                            style={styles.registerLink}
                            onPress={handleLoginNavigation}
                        >
                            Log in
                        </Text>
                    </View>

                    {/* =================================================
                        SECURITY FOOTER
                    ================================================= */}
                    <View style={styles.registerSecureFooter}>
                        <Ionicons
                            name="lock-closed-outline"
                            size={13}
                            color={colors.mutedDark}
                        />

                        <Text style={styles.registerSecureFooterText}>
                            Your account information is securely protected.
                        </Text>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SRVBackground>
    );
}
