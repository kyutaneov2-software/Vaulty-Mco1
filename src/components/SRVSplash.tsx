import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import SRVLogo from "./SRVLogo";
import { colors, gradients } from "../constants/theme";

export default function SRVSplash() {
    return (
        <View style={styles.container}>
            <LinearGradient
                colors={gradients.background}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={StyleSheet.absoluteFill}
            />

            <View style={styles.glowTop} />
            <View style={styles.glowBottom} />

            <View style={styles.content}>
                <SRVLogo size={190} showText={true} />

                <View style={styles.loaderContainer}>
                    <ActivityIndicator size="small" color={colors.gold} />

                    <Text style={styles.loadingText}>
                        SECURE STORAGE. SIMPLIFIED.
                    </Text>
                </View>
            </View>

            <Text style={styles.footer}>SMART RENTAL VAULT</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
        alignItems: "center",
        justifyContent: "center",
    },

    content: {
        alignItems: "center",
        justifyContent: "center",
    },

    loaderContainer: {
        alignItems: "center",
        marginTop: 34,
    },

    loadingText: {
        color: colors.muted,
        fontSize: 10,
        fontWeight: "700",
        letterSpacing: 1.7,
        marginTop: 12,
    },

    footer: {
        position: "absolute",
        bottom: 42,
        color: colors.mutedDark,
        fontSize: 9,
        fontWeight: "700",
        letterSpacing: 2,
    },

    glowTop: {
        position: "absolute",
        width: 320,
        height: 320,
        borderRadius: 160,
        backgroundColor: "rgba(139, 92, 246, 0.08)",
        top: -170,
        right: -100,
    },

    glowBottom: {
        position: "absolute",
        width: 280,
        height: 280,
        borderRadius: 140,
        backgroundColor: "rgba(212, 175, 55, 0.05)",
        bottom: -150,
        left: -100,
    },
});
