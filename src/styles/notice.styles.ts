import { StyleSheet } from "react-native";

import { colors, radius, spacing } from "../constants/theme";

/* =========================================================
   STYLES: noticeStyles

   Shared styles for Vaulty's global success popup.
========================================================= */
export const noticeStyles = StyleSheet.create({
    overlay: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: spacing.lg,
        backgroundColor: "rgba(0,0,0,0.72)",
    },

    card: {
        width: "100%",
        maxWidth: 360,
        alignItems: "center",
        backgroundColor: colors.surfaceElevated,
        borderWidth: 1,
        borderColor: colors.borderPurple,
        borderRadius: radius.xl,
        padding: spacing.xl,
        shadowColor: colors.black,
        shadowOffset: {
            width: 0,
            height: 16,
        },
        shadowOpacity: 0.45,
        shadowRadius: 28,
        elevation: 18,
    },

    iconWrapper: {
        width: 70,
        height: 70,
        borderRadius: 22,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: colors.primary,
        borderWidth: 1,
        borderColor: colors.primaryLight,
        marginBottom: spacing.md,
    },

    eyebrow: {
        color: colors.primaryLight,
        fontSize: 10,
        fontWeight: "900",
        letterSpacing: 2.4,
        marginBottom: 6,
    },

    title: {
        color: colors.textStrong,
        fontSize: 25,
        lineHeight: 32,
        fontWeight: "900",
        textAlign: "center",
    },

    message: {
        color: colors.muted,
        fontSize: 14,
        lineHeight: 21,
        textAlign: "center",
        marginTop: 10,
        marginBottom: spacing.lg,
    },

    button: {
        width: "100%",
        minHeight: 52,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: radius.md,
        backgroundColor: colors.primary,
        paddingHorizontal: spacing.lg,
    },

    buttonPressed: {
        opacity: 0.82,
        transform: [
            {
                scale: 0.985,
            },
        ],
    },

    buttonText: {
        color: colors.white,
        fontSize: 14,
        fontWeight: "900",
    },
});
