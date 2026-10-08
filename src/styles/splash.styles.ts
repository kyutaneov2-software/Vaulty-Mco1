import { StyleSheet } from "react-native";
import { colors } from "../constants/theme";

export const splashStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
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
