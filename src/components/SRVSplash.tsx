import { ActivityIndicator, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import SRVLogo from "./SRVLogo";
import { colors, gradients } from "../constants/theme";
import { splashStyles as styles } from "../styles/splash.styles";

/* =========================================================
COMPONENT: SRVSplash

Displays the initial Vaulty loading screen with the
application's purple-to-black visual identity.
========================================================= */
export default function SRVSplash() {
    return (
        <View style={styles.container}>
            {/* =================================================
                BACKGROUND GRADIENT
            ================================================= */}

            <LinearGradient
                colors={gradients.background}
                start={{
                    x: 0.5,
                    y: 0,
                }}
                end={{
                    x: 0.5,
                    y: 1,
                }}
                locations={[0, 0.22, 0.48, 0.72, 1]}
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                }}
            />

            {/* =================================================
                AMBIENT GLOWS
            ================================================= */}

            <View style={styles.glowTop} />

            <View style={styles.glowCenter} />

            <View style={styles.glowBottom} />

            {/* =================================================
                MAIN CONTENT
            ================================================= */}

            <View style={styles.content}>
                <View style={styles.logoArea}>
                    <View style={styles.logoGlow} />

                    <SRVLogo size={190} showText={true} />
                </View>

                {/* =================================================
                    LOADING STATUS
                ================================================= */}

                <View style={styles.loaderContainer}>
                    <View style={styles.loaderRow}>
                        <ActivityIndicator
                            size="small"
                            color={colors.primaryLight}
                        />
                    </View>

                    <Text style={styles.loadingText}>
                        SECURE STORAGE. SIMPLIFIED.
                    </Text>

                    <Text style={styles.loadingSubtext}>
                        Preparing your Vaulty experience
                    </Text>
                </View>
            </View>

            {/* =================================================
                FOOTER
            ================================================= */}

            <View style={styles.footer}>
                <View style={styles.footerLine} />

                <Text style={styles.footerTitle}>SMART RENTAL VAULT</Text>

                <Text style={styles.footerSubtitle}>VAULTY MOBILE</Text>
            </View>
        </View>
    );
}
