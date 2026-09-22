import { router } from 'expo-router';
import { useState } from "react";

import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";

import { AppButton } from "../components/AppButton";
import { AppInput } from "../components/AppInput";
import SRVBackground from "../components/SRVBackground";

import { colors, radius, spacing } from "../constants/theme";

import { useAuth } from "../context/AuthContext";

export default function RegisterScreen() {
    const { signUp } = useAuth();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleRegister = async () => {
        setError("");

        if (!name.trim() || !email.trim() || !password || !confirmPassword) {
            setError("Please complete all fields.");
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        try {
            setLoading(true);

            await signUp(name, email, password);
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
                            placeholder="you@example.com"
                        />

                        <AppInput
                            label="Password"
                            value={password}
                            onChangeText={(value) => {
                                setPassword(value);
                                setError("");
                            }}
                            secureTextEntry
                            placeholder="At least 6 characters"
                        />

                        <AppInput
                            label="Confirm password"
                            value={confirmPassword}
                            onChangeText={(value) => {
                                setConfirmPassword(value);
                                setError("");
                            }}
                            secureTextEntry
                            placeholder="Re-enter your password"
                        />

                        {error ? (
                            <View style={styles.errorBox}>
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
        gap: spacing.md,
    },

    eyebrow: {
        color: colors.gold,
        fontWeight: "900",
        letterSpacing: 2.2,
        fontSize: 11,
    },

    title: {
        fontSize: 30,
        color: colors.textStrong,
        fontWeight: "900",
    },

    subtitle: {
        color: colors.muted,
        fontSize: 15,
        lineHeight: 23,
    },

    form: {
        gap: spacing.md,
        marginTop: spacing.sm,
    },

    errorBox: {
        backgroundColor: colors.dangerSoft,

        borderWidth: 1,
        borderColor: colors.danger,

        borderRadius: radius.md,

        padding: spacing.md,
    },

    errorText: {
        color: colors.danger,
        fontSize: 14,
        fontWeight: "600",
    },

    footer: {
        flexDirection: "row",
        justifyContent: "center",
        gap: 6,
        marginTop: spacing.md,
    },

    footerText: {
        color: colors.muted,
    },

    link: {
        color: colors.goldLight,
        fontWeight: "800",
    },
});
