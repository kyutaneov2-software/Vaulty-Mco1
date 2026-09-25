import { StyleSheet } from "react-native";
import { colors } from "../constants/theme";

    /* =========================================================
    STYLESHEET: SPLASH STYLES

    Shared visual styles for the Vaulty application splash
    screen.
    ========================================================= */

export const splashStyles = StyleSheet.create({
    /* =====================================================
    ROOT
    ===================================================== */

    container: {
        flex: 1,
        backgroundColor: colors.background,
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
    },

    /* =====================================================
        DECORATIVE GLOWS
    ===================================================== */

    glowTop: {
        position: "absolute",
        width: 390,
        height: 390,
        borderRadius: 195,
        backgroundColor: "rgba(139,92,246,0.13)",
        top: -225,
        left: "50%",
        marginLeft: -195,
    },

    glowCenter: {
        position: "absolute",
        width: 300,
        height: 300,
        borderRadius: 150,
        backgroundColor: "rgba(139,92,246,0.055)",
        top: "50%",
        left: "50%",
        marginTop: -150,
        marginLeft: -150,
    },

    glowBottom: {
        position: "absolute",
        width: 300,
        height: 300,
        borderRadius: 150,
        backgroundColor: "rgba(91,33,182,0.07)",
        bottom: -210,
        right: -110,
    },

    /* =====================================================
        MAIN CONTENT
    ===================================================== */

    content: {
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        paddingHorizontal: 32,
    },

    logoArea: {
        alignItems: "center",
        justifyContent: "center",
    },

    logoGlow: {
        position: "absolute",
        width: 215,
        height: 215,
        borderRadius: 108,
        backgroundColor: "rgba(139,92,246,0.08)",
    },

    /* =====================================================
        LOADING AREA
    ===================================================== */

    loaderContainer: {
        alignItems: "center",
        justifyContent: "center",
        marginTop: 34,
    },

    loaderRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 9,
    },

    loaderDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: colors.primary,
    },

    loadingText: {
        color: colors.muted,
        fontSize: 10,
        fontWeight: "800",
        letterSpacing: 1.8,
        marginTop: 13,
        textAlign: "center",
    },

    loadingSubtext: {
        color: colors.mutedDark,
        fontSize: 9,
        fontWeight: "600",
        letterSpacing: 0.8,
        marginTop: 5,
        textAlign: "center",
    },

    /* =====================================================
        FOOTER
    ===================================================== */

    footer: {
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 38,
        alignItems: "center",
        justifyContent: "center",
    },

    footerLine: {
        width: 34,
        height: 2,
        borderRadius: 2,
        backgroundColor: colors.primary,
        opacity: 0.55,
        marginBottom: 10,
    },

    footerTitle: {
        color: colors.mutedDark,
        fontSize: 9,
        fontWeight: "800",
        letterSpacing: 2.2,
    },

    footerSubtitle: {
        color: colors.mutedDark,
        fontSize: 8,
        fontWeight: "600",
        letterSpacing: 1,
        marginTop: 4,
        opacity: 0.7,
    },
});
