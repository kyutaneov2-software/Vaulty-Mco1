import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";

import { AppButton } from "../components/AppButton";
import SRVBackground from "../components/SRVBackground";
import { colors } from "../constants/theme";
import {
    clearPendingRecoveryCodes,
    getPendingRecoveryCodes,
} from "../services/recoveryService";
import { recoveryStyles as styles } from "../styles/recovery.styles";

/* =========================================================
   COMPONENT: RecoveryCodesScreen

   Displays newly generated one-time recovery codes after
   the user's TOTP authenticator has been successfully
   verified.
========================================================= */

export default function RecoveryCodesScreen() {
    const [codes, setCodes] = useState<string[]>([]);

    /* =====================================================
       FUNCTION: loadCodes

       Loads the temporary recovery-code set kept in
       application memory.
    ===================================================== */

    const loadCodes = () => {
        const pending = getPendingRecoveryCodes();

        setCodes(pending ?? []);
    };

    /* =====================================================
       EFFECT: LOAD RECOVERY CODES

       Loads the generated recovery codes when the screen
       is mounted.
    ===================================================== */

    useEffect(() => {
        loadCodes();
    }, []);

    /* =====================================================
       FUNCTION: handleContinue

       Clears the raw recovery codes from application
       memory and sends the user to the main Vaulty app.
    ===================================================== */

    const handleContinue = () => {
        clearPendingRecoveryCodes();

        router.replace("/(app)");
    };

    return (
        <SRVBackground>
            <ScrollView
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
            >
                {/* =================================================
                    TOP BAR
                ================================================= */}

                <View style={styles.topBar}>
                    <View style={styles.cardIcon}>
                        <Ionicons
                            name="key-outline"
                            size={18}
                            color={colors.primaryLight}
                        />
                    </View>

                    <View>
                        <Text style={styles.eyebrow}>VAULTY SECURITY</Text>

                        <Text style={styles.topTitle}>Recovery codes</Text>
                    </View>
                </View>

                {/* =================================================
                    HERO
                ================================================= */}

                <View style={styles.heroIcon}>
                    <Ionicons
                        name="shield-checkmark"
                        size={34}
                        color={colors.primaryLight}
                    />
                </View>

                <Text style={styles.title}>Save your recovery codes</Text>

                <Text style={styles.subtitle}>
                    These one-time codes can help you recover your Vaulty
                    password if you forget it.
                </Text>

                {/* =================================================
                    CODES
                ================================================= */}

                <View style={styles.codesCard}>
                    <View style={styles.cardHeader}>
                        <View style={styles.cardIcon}>
                            <Ionicons
                                name="key-outline"
                                size={17}
                                color={colors.primaryLight}
                            />
                        </View>

                        <View>
                            <Text style={styles.cardTitle}>
                                YOUR RECOVERY CODES
                            </Text>

                            <Text style={styles.cardSubtitle}>
                                Each code can only be used once.
                            </Text>
                        </View>
                    </View>

                    {codes.length > 0 ? (
                        <View style={styles.codesGrid}>
                            {codes.map((code, index) => (
                                <View
                                    key={`${code}-${index}`}
                                    style={styles.codeItem}
                                >
                                    <Text selectable style={styles.codeText}>
                                        {code}
                                    </Text>
                                </View>
                            ))}
                        </View>
                    ) : (
                        <View style={styles.infoBox}>
                            <View style={styles.infoIcon}>
                                <Ionicons
                                    name="information-circle-outline"
                                    size={17}
                                    color={colors.primaryLight}
                                />
                            </View>

                            <View style={styles.infoContent}>
                                <Text style={styles.infoTitle}>
                                    Codes unavailable
                                </Text>

                                <Text style={styles.infoText}>
                                    The recovery codes are no longer available
                                    in this app session. They are not stored in
                                    readable form.
                                </Text>
                            </View>
                        </View>
                    )}

                    {/* =================================================
                        SAVE WARNING
                    ================================================= */}

                    {codes.length > 0 ? (
                        <View style={styles.saveNotice}>
                            <Ionicons
                                name="warning-outline"
                                size={17}
                                color={colors.warning}
                            />

                            <Text style={styles.saveNoticeText}>
                                Save these codes somewhere secure. Vaulty will
                                not show the raw codes again after you continue.
                            </Text>
                        </View>
                    ) : null}

                    {/* =================================================
                        CONTINUE
                    ================================================= */}

                    <View style={styles.savedButtonWrapper}>
                        <AppButton
                            title="I've saved my codes"
                            onPress={handleContinue}
                        />
                    </View>
                </View>

                <View style={styles.footer}>
                    <Text style={styles.footerText}>
                        Your recovery codes are a backup credential. Keep them
                        private and secure.
                    </Text>
                </View>
            </ScrollView>
        </SRVBackground>
    );
}
