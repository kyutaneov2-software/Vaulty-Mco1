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
    Text,
    TextInput,
    View,
} from "react-native";

import { AppButton } from "../components/AppButton";
import SRVBackground from "../components/SRVBackground";
import { colors } from "../constants/theme";
import { useAuth } from "../context/AuthContext";
import { generateRecoveryCodes } from "../services/recoveryService";
import { supabase } from "../lib/supabase";
import { authStyles as styles } from "../styles/auth.styles";

/* =========================================================
   TYPE: EnrollmentData

   Stores the temporary TOTP enrollment information returned
   by Supabase while the user is completing setup.
========================================================= */

type EnrollmentData = {
    factorId: string;
    otpauthUri: string;
    secret: string;
};

/* =========================================================
   CACHE: TOTP ENROLLMENT DATA

   Keeps an unfinished enrollment temporarily in memory so
   a development remount does not create another factor.
========================================================= */

const enrollmentCache = new Map<string, EnrollmentData>();

/* =========================================================
   CACHE: TOTP ENROLLMENT REQUESTS

   Stores in-flight enrollment requests so duplicate
   useEffect executions reuse the same Supabase request.
========================================================= */

const enrollmentRequests = new Map<string, Promise<EnrollmentData>>();

/* =========================================================
   COMPONENT: SetupMFAScreen

   Guides the user through creating and verifying a
   time-based one-time-password authenticator and then
   generating one-time account recovery codes.
========================================================= */

export default function SetupMFAScreen() {
    const { refreshAuthState, signOut } = useAuth();

    const [factorId, setFactorId] = useState("");

    const [otpauthUri, setOtpauthUri] = useState("");

    const [secret, setSecret] = useState("");

    const [code, setCode] = useState("");

    const [loading, setLoading] = useState(true);

    const [verifying, setVerifying] = useState(false);

    const [mfaVerified, setMfaVerified] = useState(false);

    const [error, setError] = useState("");

    /* =====================================================
       EFFECT: INITIAL MFA SETUP

       Checks the user's existing factors and safely starts
       exactly one TOTP enrollment request.
    ===================================================== */

    useEffect(() => {
        /* =================================================
           FUNCTION: setupFactor

           Checks the user's existing TOTP factors and
           safely starts exactly one authenticator
           enrollment.
        ================================================= */

        const setupFactor = async () => {
            try {
                setLoading(true);
                setError("");

                /* =============================================
                   GET CURRENT AUTHENTICATED USER
                ============================================= */

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

                /* =============================================
                   CHECK CURRENT MFA FACTORS
                ============================================= */

                const { data: factors, error: listError } =
                    await supabase.auth.mfa.listFactors();

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

                /* =============================================
                   CASE 1: VERIFIED FACTOR ALREADY EXISTS

                   Do not create another authenticator.
                ============================================= */

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

                /* =============================================
                   CASE 2: COMPLETED ENROLLMENT EXISTS IN MEMORY

                   Reuse the current enrollment.
                ============================================= */

                const cachedEnrollment = enrollmentCache.get(userId);

                if (cachedEnrollment) {
                    console.log(
                        "Using cached Vaulty authenticator enrollment.",
                    );

                    setFactorId(cachedEnrollment.factorId);

                    setOtpauthUri(cachedEnrollment.otpauthUri);

                    setSecret(cachedEnrollment.secret);

                    return;
                }

                /* =============================================
                   CASE 3: ENROLLMENT REQUEST ALREADY RUNNING

                   Reuse the in-flight request rather than
                   starting another Supabase enrollment call.
                ============================================= */

                const existingRequest = enrollmentRequests.get(userId);

                if (existingRequest) {
                    console.log(
                        "Waiting for existing Vaulty enrollment request.",
                    );

                    const enrollment = await existingRequest;

                    setFactorId(enrollment.factorId);

                    setOtpauthUri(enrollment.otpauthUri);

                    setSecret(enrollment.secret);

                    return;
                }

                /* =============================================
                   CASE 4: CREATE ONE NEW ENROLLMENT REQUEST

                   Store the Promise before awaiting it so
                   duplicate executions can reuse the request.
                ============================================= */

                const enrollmentPromise =
                    (async (): Promise<EnrollmentData> => {
                        /* =====================================
                           SECOND FACTOR CHECK

                           Protects against another request or
                           device creating a factor while this
                           request is being prepared.
                        ===================================== */

                        const {
                            data: currentFactors,
                            error: currentFactorsError,
                        } = await supabase.auth.mfa.listFactors();

                        if (currentFactorsError) {
                            throw currentFactorsError;
                        }

                        const currentTotp = currentFactors.totp ?? [];

                        /* =====================================
                           CHECK FOR NEWLY VERIFIED FACTOR
                        ===================================== */

                        const verified = currentTotp.find(
                            (factor) => factor.status === "verified",
                        );

                        if (verified) {
                            throw new Error(
                                "A Vaulty authenticator was already verified for this account. Please sign in again.",
                            );
                        }

                        /* =====================================
                           REMOVE INCOMPLETE FACTORS

                           Clears stale enrollments left by an
                           interrupted setup.
                        ===================================== */

                        const unverified = currentTotp.filter(
                            (factor) => factor.status !== "verified",
                        );

                        for (const factor of unverified) {
                            console.log(
                                "Removing incomplete Vaulty factor:",
                                factor.id,
                            );

                            const { error: unenrollError } =
                                await supabase.auth.mfa.unenroll({
                                    factorId: factor.id,
                                });

                            if (unenrollError) {
                                throw new Error(
                                    "Vaulty found an unfinished authenticator setup and could not reset it. Please sign out and sign in again.",
                                );
                            }
                        }

                        /* =====================================
                           CREATE NEW TOTP FACTOR
                        ===================================== */

                        const { data, error: enrollError } =
                            await supabase.auth.mfa.enroll({
                                factorType: "totp",
                                friendlyName: "Vaulty Authenticator",
                            });

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

                        const enrollment: EnrollmentData = {
                            factorId: data.id,

                            otpauthUri: data.totp.uri,

                            secret: data.totp.secret,
                        };

                        /* =====================================
                           CACHE TEMPORARY ENROLLMENT

                           Prevents development remounts from
                           creating another TOTP factor.
                        ===================================== */

                        enrollmentCache.set(userId, enrollment);

                        console.log(
                            "New Vaulty authenticator created:",
                            enrollment.factorId,
                        );

                        return enrollment;
                    })();

                /* =============================================
                   STORE REQUEST BEFORE AWAITING
                ============================================= */

                enrollmentRequests.set(userId, enrollmentPromise);

                try {
                    const enrollment = await enrollmentPromise;

                    setFactorId(enrollment.factorId);

                    setOtpauthUri(enrollment.otpauthUri);

                    setSecret(enrollment.secret);
                } finally {
                    enrollmentRequests.delete(userId);
                }
            } catch (error) {
                console.error("Failed to set up MFA:", error);

                setError(
                    error instanceof Error
                        ? error.message
                        : "Unable to start authenticator setup.",
                );
            } finally {
                setLoading(false);
            }
        };

        setupFactor();
    }, []);

    /* =========================================================
       FUNCTION: handleCodeChange

       Keeps only numeric characters and limits the input
       to six digits.
    ========================================================= */

    const handleCodeChange = (value: string) => {
        setCode(value.replace(/\D/g, "").slice(0, 6));

        setError("");
    };

    /* =========================================================
       FUNCTION: completeMFASetup

       Generates the user's one-time recovery codes after
       successful TOTP verification and navigates to the
       recovery-code display screen.
    ========================================================= */

    const completeMFASetup = async () => {
        /* =============================================
               GENERATE RECOVERY CODES

               The recovery service stores the raw codes
               temporarily in memory while only their hashes
               are stored server-side.
            ============================================= */

        await generateRecoveryCodes();

        /* =============================================
               REMOVE TEMPORARY TOTP ENROLLMENT CACHE
            ============================================= */

        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (user) {
            enrollmentCache.delete(user.id);
        }

        /* =============================================
               SHOW RECOVERY CODES
            ============================================= */

        router.replace("/recovery-codes");
    };

    /* =========================================================
       FUNCTION: handleVerify

       Verifies the six-digit TOTP code. Once the
       authenticator is verified, generates recovery codes.
       If recovery-code generation fails, the user can retry
       without completing the TOTP verification again.
    ========================================================= */

    const handleVerify = async () => {
        setError("");

        /* =============================================
           VALIDATE FACTOR
        ============================================= */

        if (!factorId) {
            setError("Authenticator setup is not ready yet.");

            return;
        }

        /* =============================================
           VALIDATE CODE
        ============================================= */

        const cleanCode = code.replace(/\D/g, "").slice(0, 6);

        if (!/^\d{6}$/.test(cleanCode)) {
            setError("Enter the 6-digit code from your authenticator app.");

            return;
        }

        try {
            setVerifying(true);

            /* =============================================
               STEP 1: VERIFY TOTP

               Skip this step when MFA has already been
               successfully verified and only recovery-code
               generation needs to be retried.
            ============================================= */

            if (!mfaVerified) {
                /* =========================================
                   CREATE MFA CHALLENGE
                ========================================= */

                const { data: challenge, error: challengeError } =
                    await supabase.auth.mfa.challenge({
                        factorId,
                    });

                if (challengeError) {
                    throw challengeError;
                }

                if (!challenge?.id) {
                    throw new Error(
                        "Vaulty could not create an MFA verification challenge.",
                    );
                }

                /* =========================================
                   VERIFY TOTP CODE
                ========================================= */

                const { error: verifyError } = await supabase.auth.mfa.verify({
                    factorId,

                    challengeId: challenge.id,

                    code: cleanCode,
                });

                if (verifyError) {
                    throw verifyError;
                }

                /* =========================================
                   REFRESH AUTH STATE

                   Successful verification should promote
                   the session to the ready/AAL2 state.
                ========================================= */

                const stage = await refreshAuthState();

                if (stage !== "ready") {
                    setError(
                        "Authenticator verified, but your session is not ready yet.",
                    );

                    return;
                }

                setMfaVerified(true);
            }

            /* =============================================
               STEP 2: GENERATE RECOVERY CODES

               This can be retried independently if the
               server-side recovery-code generation fails.
            ============================================= */

            try {
                await completeMFASetup();
            } catch (recoveryError) {
                console.error(
                    "Recovery-code generation failed:",
                    recoveryError,
                );

                setError(
                    "Your authenticator was verified, but recovery codes could not be generated. Tap the button again to retry.",
                );
            }
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

    /* =========================================================
       FUNCTION: handleSignOut

       Signs the user out of Vaulty from the MFA setup screen.
    ========================================================= */

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
                <ScrollView
                    contentContainerStyle={styles.setupMfaContent}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    {/* =================================================
                       TOP BAR
                    ================================================= */}

                    <View style={styles.setupMfaTopBar}>
                        <View>
                            <Text style={styles.setupMfaEyebrow}>
                                VAULTY SECURITY
                            </Text>

                            <Text style={styles.setupMfaTopTitle}>
                                Secure your account
                            </Text>
                        </View>

                        <Pressable
                            onPress={handleSignOut}
                            style={styles.setupMfaSignOutButton}
                        >
                            <Ionicons
                                name="log-out-outline"
                                size={18}
                                color={colors.muted}
                            />
                        </Pressable>
                    </View>

                    {/* =================================================
                       HERO
                    ================================================= */}

                    <View style={styles.setupMfaHeroIcon}>
                        <Ionicons
                            name="shield-checkmark"
                            size={34}
                            color={colors.primaryLight}
                        />
                    </View>

                    <Text style={styles.setupMfaTitle}>
                        Set up your authenticator
                    </Text>

                    <Text style={styles.setupMfaSubtitle}>
                        Protect your Vaulty account with a time-based 6-digit
                        security code.
                    </Text>

                    {/* =================================================
                       SETUP CARD
                    ================================================= */}

                    <View style={styles.setupMfaCard}>
                        {/* =============================================
                           STEP 1
                        ============================================= */}

                        <View style={styles.setupMfaStepHeader}>
                            <View style={styles.setupMfaStepNumber}>
                                <Text style={styles.setupMfaStepNumberText}>
                                    1
                                </Text>
                            </View>

                            <View style={styles.setupMfaStepContent}>
                                <Text style={styles.setupMfaStepTitle}>
                                    Scan the QR code
                                </Text>

                                <Text style={styles.setupMfaStepSubtitle}>
                                    Open Google Authenticator, Authy, or another
                                    TOTP authenticator.
                                </Text>
                            </View>
                        </View>

                        {/* =============================================
                           QR CODE
                        ============================================= */}

                        <View style={styles.setupMfaQrCard}>
                            {loading ? (
                                <View style={styles.setupMfaQrLoading}>
                                    <ActivityIndicator
                                        size="large"
                                        color={colors.primary}
                                    />

                                    <Text style={styles.setupMfaQrLoadingText}>
                                        Preparing authenticator...
                                    </Text>
                                </View>
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

                        {/* =============================================
                           MANUAL SETUP
                        ============================================= */}

                        <View style={styles.setupMfaManualBox}>
                            <View style={styles.setupMfaManualHeader}>
                                <View style={styles.setupMfaManualIcon}>
                                    <Ionicons
                                        name="key-outline"
                                        size={15}
                                        color={colors.primaryLight}
                                    />
                                </View>

                                <Text style={styles.setupMfaManualTitle}>
                                    Can't scan?
                                </Text>
                            </View>

                            <Text style={styles.setupMfaManualText}>
                                Enter this setup key manually in your
                                authenticator app.
                            </Text>

                            <Text selectable style={styles.setupMfaSecret}>
                                {secret || "Loading..."}
                            </Text>
                        </View>

                        <View style={styles.setupMfaDivider} />

                        {/* =============================================
                           STEP 2
                        ============================================= */}

                        <View style={styles.setupMfaStepHeader}>
                            <View style={styles.setupMfaStepNumber}>
                                <Text style={styles.setupMfaStepNumberText}>
                                    2
                                </Text>
                            </View>

                            <View style={styles.setupMfaStepContent}>
                                <Text style={styles.setupMfaStepTitle}>
                                    {mfaVerified
                                        ? "Authenticator verified"
                                        : "Verify the authenticator"}
                                </Text>

                                <Text style={styles.setupMfaStepSubtitle}>
                                    {mfaVerified
                                        ? "Your authenticator is connected. Generate your recovery codes next."
                                        : "Enter the current 6-digit code from your authenticator."}
                                </Text>
                            </View>
                        </View>

                        {/* =============================================
                           CODE INPUT
                        ============================================= */}

                        {!mfaVerified ? (
                            <TextInput
                                value={code}
                                onChangeText={handleCodeChange}
                                placeholder="000000"
                                placeholderTextColor={colors.mutedDark}
                                keyboardType="number-pad"
                                maxLength={6}
                                textAlign="center"
                                autoCorrect={false}
                                autoCapitalize="none"
                                style={styles.setupMfaCodeInput}
                            />
                        ) : null}

                        {/* =============================================
                           ERROR
                        ============================================= */}

                        {error ? (
                            <View style={styles.setupMfaErrorBox}>
                                <View style={styles.setupMfaErrorIcon}>
                                    <Ionicons
                                        name="alert-circle-outline"
                                        size={17}
                                        color={colors.danger}
                                    />
                                </View>

                                <Text style={styles.setupMfaErrorText}>
                                    {error}
                                </Text>
                            </View>
                        ) : null}

                        {/* =============================================
                           VERIFY / RECOVERY BUTTON
                        ============================================= */}

                        <View style={styles.setupMfaButtonWrapper}>
                            <AppButton
                                title={
                                    mfaVerified
                                        ? "Generate recovery codes"
                                        : "Verify authenticator"
                                }
                                onPress={handleVerify}
                                loading={verifying}
                            />
                        </View>
                    </View>

                    {/* =================================================
                       SECURITY NOTE
                    ================================================= */}

                    <View style={styles.setupMfaSecurityNote}>
                        <View style={styles.setupMfaSecurityIcon}>
                            <Ionicons
                                name="lock-closed-outline"
                                size={14}
                                color={colors.primaryLight}
                            />
                        </View>

                        <Text style={styles.setupMfaSecurityText}>
                            Your authenticator code changes automatically and is
                            never stored by Vaulty.
                        </Text>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SRVBackground>
    );
}
