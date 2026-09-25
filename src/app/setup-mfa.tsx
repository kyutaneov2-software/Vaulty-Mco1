import Ionicons from "@expo/vector-icons/Ionicons";
import QRCode from "react-native-qrcode-svg";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";

import { AppButton } from "../components/AppButton";
import SRVBackground from "../components/SRVBackground";
import { colors, radius, spacing } from "../constants/theme";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabase";


type EnrollmentData = {
    factorId: string;
    otpauthUri: string;
    secret: string;
};

/**
 * Prevent duplicate TOTP enrollment requests for the
 * same Supabase user.
 *
 * This is especially important in development because
 * React may run Effects more than once.
 */
const enrollmentCache = new Map<
    string,
    EnrollmentData
>();

const enrollmentRequests = new Map<
    string,
    Promise<EnrollmentData>
>();

export default function SetupMFAScreen() {
    const { refreshAuthState, signOut } = useAuth();

    const [factorId, setFactorId] = useState("");
    const [otpauthUri, setOtpauthUri] = useState("");
    const [secret, setSecret] = useState("");
    const [code, setCode] = useState("");

    const [loading, setLoading] = useState(true);
    const [verifying, setVerifying] = useState(false);
    const [existingFactor, setExistingFactor] = useState(false);
    const [error, setError] = useState("");

    /**
     * Check whether the user already has a verified
     * TOTP factor before attempting a new enrollment.
     */
    const setupFactor = async () => {
        try {
            setLoading(true);
            setError("");
    
            /**
             * Get the current authenticated user.
             */
            const {
                data: { user },
                error: userError,
            } = await supabase.auth.getUser();
    
            if (userError) {
                throw userError;
            }
    
            if (!user) {
                throw new Error(
                    "Your session has expired. Please log in again.",
                );
            }
    
            const userId = user.id;
    
            /**
             * ---------------------------------------------------------
             * CHECK CURRENT FACTORS
             * ---------------------------------------------------------
             */
            const {
                data: factors,
                error: listError,
            } = await supabase.auth.mfa.listFactors();
    
            if (listError) {
                throw listError;
            }
    
            const totpFactors = factors.totp ?? [];
    
            console.log(
                "Vaulty TOTP factors:",
                totpFactors.map((factor) => ({
                    id: factor.id,
                    status: factor.status,
                    friendlyName: factor.friendly_name,
                })),
            );
    
            /**
             * ---------------------------------------------------------
             * CASE 1:
             * A verified factor already exists.
             *
             * Do not enroll another one.
             * ---------------------------------------------------------
             */
            const verifiedFactor = totpFactors.find(
                (factor) => factor.status === "verified",
            );
    
            if (verifiedFactor) {
                console.log(
                    "Verified Vaulty authenticator already exists.",
                );
    
                router.replace("/mfa-challenge");
                return;
            }
    
            /**
             * ---------------------------------------------------------
             * CASE 2:
             * We already have an enrollment in progress for this
             * user because of a duplicate Effect invocation.
             *
             * Reuse the existing request.
             * ---------------------------------------------------------
             */
            const cachedEnrollment =
                enrollmentCache.get(userId);
    
            if (cachedEnrollment) {
                console.log(
                    "Using cached Vaulty authenticator enrollment.",
                );
    
                setFactorId(
                    cachedEnrollment.factorId,
                );
    
                setOtpauthUri(
                    cachedEnrollment.otpauthUri,
                );
    
                setSecret(
                    cachedEnrollment.secret,
                );
    
                return;
            }
    
            const existingRequest =
                enrollmentRequests.get(userId);
    
            if (existingRequest) {
                console.log(
                    "Waiting for existing Vaulty enrollment request.",
                );
    
                const enrollment =
                    await existingRequest;
    
                setFactorId(enrollment.factorId);
                setOtpauthUri(
                    enrollment.otpauthUri,
                );
                setSecret(enrollment.secret);
    
                return;
            }
    
            /**
             * ---------------------------------------------------------
             * CASE 3:
             * Start exactly ONE enrollment request.
             * ---------------------------------------------------------
             */
            const enrollmentPromise =
                (async (): Promise<EnrollmentData> => {
                    /**
                     * Check factors again inside the locked
                     * enrollment request.
                     */
                    const {
                        data: currentFactors,
                        error: currentFactorsError,
                    } =
                        await supabase.auth.mfa.listFactors();
    
                    if (currentFactorsError) {
                        throw currentFactorsError;
                    }
    
                    const currentTotp =
                        currentFactors.totp ?? [];
    
                    /**
                     * Another request/device may have created
                     * a verified factor while we were waiting.
                     */
                    const verified =
                        currentTotp.find(
                            (factor) =>
                                factor.status ===
                                "verified",
                        );
    
                    if (verified) {
                        throw new Error(
                            "A Vaulty authenticator was already verified for this account. Please sign in again.",
                        );
                    }
    
                    /**
                     * Remove old incomplete factors.
                     *
                     * These are factors that were created but never
                     * successfully verified.
                     */
                    const unverified =
                        currentTotp.filter(
                            (factor) =>
                                factor.status !==
                                "verified",
                        );
    
                    for (const factor of unverified) {
                        console.log(
                            "Removing incomplete Vaulty factor:",
                            factor.id,
                        );
    
                        const {
                            error:
                                unenrollError,
                        } =
                            await supabase.auth.mfa.unenroll(
                                {
                                    factorId:
                                        factor.id,
                                },
                            );
    
                        if (unenrollError) {
                            throw new Error(
                                "Vaulty found an unfinished authenticator setup and could not reset it. Please sign out and sign in again.",
                            );
                        }
                    }
    
                    /**
                     * -------------------------------------------------
                     * CREATE NEW TOTP FACTOR
                     * -------------------------------------------------
                     */
                    const {
                        data,
                        error: enrollError,
                    } =
                        await supabase.auth.mfa.enroll(
                            {
                                factorType: "totp",
                                friendlyName:
                                    "Vaulty Authenticator",
                            },
                        );
    
                    if (enrollError) {
                        throw enrollError;
                    }
    
                    if (
                        !data?.id ||
                        !data.totp?.uri ||
                        !data.totp?.secret
                    ) {
                        throw new Error(
                            "Supabase did not return a valid authenticator setup.",
                        );
                    }
    
                    const enrollment: EnrollmentData =
                        {
                            factorId: data.id,
                            otpauthUri:
                                data.totp.uri,
                            secret: data.totp.secret,
                        };
    
                    /**
                     * Keep the enrollment temporarily in memory
                     * so a development remount does not create
                     * another factor.
                     */
                    enrollmentCache.set(
                        userId,
                        enrollment,
                    );
    
                    console.log(
                        "New Vaulty authenticator created:",
                        enrollment.factorId,
                    );
    
                    return enrollment;
                })();
    
            /**
             * Store the in-flight request BEFORE awaiting it.
             *
             * This is the important part that prevents duplicate
             * enroll() calls.
             */
            enrollmentRequests.set(
                userId,
                enrollmentPromise,
            );
    
            try {
                const enrollment =
                    await enrollmentPromise;
    
                setFactorId(
                    enrollment.factorId,
                );
    
                setOtpauthUri(
                    enrollment.otpauthUri,
                );
    
                setSecret(
                    enrollment.secret,
                );
            } finally {
                enrollmentRequests.delete(userId);
            }
        } catch (error) {
            console.error(
                "Failed to set up MFA:",
                error,
            );
    
            setError(
                error instanceof Error
                    ? error.message
                    : "Unable to start authenticator setup.",
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setupFactor();
    }, []);

    const handleVerify = async () => {
        const cleanCode = code.replace(/\D/g, "").slice(0, 6);

        setError("");

        if (!factorId) {
            setError("Authenticator setup is not ready yet.");
            return;
        }

        if (!/^\d{6}$/.test(cleanCode)) {
            setError("Enter the 6-digit code from your authenticator app.");
            return;
        }

        try {
            setVerifying(true);

            /**
             * Create MFA challenge.
             */
            const { data: challenge, error: challengeError } =
                await supabase.auth.mfa.challenge({
                    factorId,
                });

            if (challengeError) {
                throw challengeError;
            }

            /**
             * Verify the current TOTP code.
             */
            const { error: verifyError } = await supabase.auth.mfa.verify({
                factorId,
                challengeId: challenge.id,
                code: cleanCode,
            });

            if (verifyError) {
                throw verifyError;
            }

            /**
             * Successful MFA verification promotes
             * the current session to AAL2.
             */
            const stage = await refreshAuthState();

            if (stage === "ready") {
                /**
                 * The TOTP factor is now verified.
                 * Remove the temporary enrollment secret from
                 * Vaulty's in-memory cache.
                 */
                const {
                    data: {
                        user,
                    },
                } = await supabase.auth.getUser();
            
                if (user) {
                    enrollmentCache.delete(user.id);
                }
            
                router.replace("/(app)");
                return;
            }

            setError(
                "Authenticator verified, but your session is not ready yet.",
            );
        } catch (error) {
            console.error("MFA verification failed:", error);

            setError(
                error instanceof Error
                    ? error.message
                    : "Invalid verification code.",
            );
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

    /**
     * This state is mostly a safety fallback while
     * navigation changes.
     */
    if (existingFactor) {
        return (
            <SRVBackground>
                <View style={styles.redirectContainer}>
                    <ActivityIndicator size="large" color={colors.gold} />

                    <Text style={styles.redirectTitle}>
                        Authenticator already connected
                    </Text>

                    <Text style={styles.redirectText}>
                        Taking you to verification...
                    </Text>
                </View>
            </SRVBackground>
        );
    }

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
                    <View style={styles.topBar}>
                        <View>
                            <Text style={styles.eyebrow}>VAULTY SECURITY</Text>

                            <Text style={styles.topTitle}>
                                Secure your account
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

                    <View style={styles.heroIcon}>
                        <Ionicons
                            name="shield-checkmark"
                            size={34}
                            color={colors.goldLight}
                        />
                    </View>

                    <Text style={styles.title}>Set up your authenticator</Text>

                    <Text style={styles.subtitle}>
                        Protect your Vaulty account with a time-based 6-digit
                        security code.
                    </Text>

                    <View style={styles.card}>
                        <View style={styles.stepHeader}>
                            <View style={styles.stepNumber}>
                                <Text style={styles.stepNumberText}>1</Text>
                            </View>

                            <View style={styles.stepContent}>
                                <Text style={styles.stepTitle}>
                                    Scan the QR code
                                </Text>

                                <Text style={styles.stepSubtitle}>
                                    Open Google Authenticator, Authy, or another
                                    TOTP authenticator.
                                </Text>
                            </View>
                        </View>

                        <View style={styles.qrCard}>
                            {loading ? (
                                <ActivityIndicator
                                    size="large"
                                    color={colors.primary}
                                />
                            ) : otpauthUri ? (
                                <QRCode
                                    value={otpauthUri}
                                    size={210}
                                    backgroundColor="#FFFFFF"
                                    color="#000000"
                                />
                            ) : (
                                <Ionicons
                                    name="qr-code-outline"
                                    size={64}
                                    color={colors.mutedDark}
                                />
                            )}
                        </View>

                        <View style={styles.manualBox}>
                            <View style={styles.manualHeader}>
                                <Ionicons
                                    name="key-outline"
                                    size={16}
                                    color={colors.goldLight}
                                />

                                <Text style={styles.manualTitle}>
                                    Can't scan?
                                </Text>
                            </View>

                            <Text style={styles.manualText}>
                                Enter this setup key manually in your
                                authenticator app.
                            </Text>

                            <Text selectable style={styles.secret}>
                                {secret || "Loading..."}
                            </Text>
                        </View>

                        <View style={styles.divider} />

                        <View style={styles.stepHeader}>
                            <View style={styles.stepNumber}>
                                <Text style={styles.stepNumberText}>2</Text>
                            </View>

                            <View style={styles.stepContent}>
                                <Text style={styles.stepTitle}>
                                    Verify the authenticator
                                </Text>

                                <Text style={styles.stepSubtitle}>
                                    Enter the current 6-digit code from your
                                    authenticator.
                                </Text>
                            </View>
                        </View>

                        <TextInput
                            value={code}
                            onChangeText={(value) => {
                                setCode(value.replace(/\D/g, "").slice(0, 6));

                                setError("");
                            }}
                            placeholder="000000"
                            placeholderTextColor={colors.mutedDark}
                            keyboardType="number-pad"
                            maxLength={6}
                            textAlign="center"
                            style={styles.codeInput}
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

                        <View style={styles.buttonWrapper}>
                            <AppButton
                                title="Verify authenticator"
                                onPress={handleVerify}
                                loading={verifying}
                            />
                        </View>
                    </View>

                    <View style={styles.securityNote}>
                        <Ionicons
                            name="lock-closed-outline"
                            size={16}
                            color={colors.goldLight}
                        />

                        <Text style={styles.securityText}>
                            Your authenticator code changes automatically and is
                            never stored by Vaulty.
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
        padding: spacing.lg,
        paddingTop: 34,
        paddingBottom: 44,
    },

    redirectContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: spacing.lg,
    },

    redirectTitle: {
        color: colors.textStrong,
        fontSize: 20,
        fontWeight: "900",
        marginTop: 18,
    },

    redirectText: {
        color: colors.muted,
        fontSize: 13,
        marginTop: 6,
    },

    topBar: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 30,
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

    heroIcon: {
        width: 72,
        height: 72,
        borderRadius: 24,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: colors.goldSoft,
        borderWidth: 1,
        borderColor: "rgba(212,175,55,0.32)",
        marginBottom: 18,
    },

    title: {
        color: colors.textStrong,
        fontSize: 30,
        lineHeight: 38,
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

    stepHeader: {
        flexDirection: "row",
        alignItems: "center",
        gap: 11,
    },

    stepNumber: {
        width: 34,
        height: 34,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: colors.primarySoft,
        borderWidth: 1,
        borderColor: "rgba(139,92,246,0.30)",
    },

    stepNumberText: {
        color: colors.primary,
        fontSize: 13,
        fontWeight: "900",
    },

    stepContent: {
        flex: 1,
    },

    stepTitle: {
        color: colors.textStrong,
        fontSize: 13,
        fontWeight: "800",
    },

    stepSubtitle: {
        color: colors.mutedDark,
        fontSize: 11,
        lineHeight: 16,
        marginTop: 2,
    },

    qrCard: {
        minHeight: 238,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 18,
        backgroundColor: "#FFFFFF",
        borderRadius: 22,
        padding: 14,
    },

    manualBox: {
        marginTop: 14,
        padding: 13,
        borderRadius: 17,
        backgroundColor: colors.goldSoft,
        borderWidth: 1,
        borderColor: "rgba(212,175,55,0.22)",
    },

    manualHeader: {
        flexDirection: "row",
        alignItems: "center",
        gap: 7,
    },

    manualTitle: {
        color: colors.goldLight,
        fontSize: 12,
        fontWeight: "900",
    },

    manualText: {
        color: colors.muted,
        fontSize: 11,
        lineHeight: 16,
        marginTop: 5,
    },

    secret: {
        color: colors.text,
        fontSize: 13,
        fontWeight: "800",
        letterSpacing: 1.1,
        marginTop: 9,
    },

    divider: {
        height: 1,
        backgroundColor: colors.border,
        marginVertical: 22,
    },

    codeInput: {
        height: 58,
        marginTop: 18,
        borderRadius: 18,
        borderWidth: 1,
        borderColor: colors.borderStrong,
        backgroundColor: colors.surfaceElevated,
        color: colors.textStrong,
        fontSize: 25,
        fontWeight: "900",
        letterSpacing: 8,
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

    securityNote: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        marginTop: 18,
        paddingHorizontal: 6,
    },

    securityText: {
        flex: 1,
        color: colors.mutedDark,
        fontSize: 10,
        lineHeight: 15,
    },
});
