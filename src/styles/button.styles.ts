import { StyleSheet } from "react-native";
import { colors, radius, spacing } from "../constants/theme";

/* =========================================================
   STYLESHEET: BUTTON STYLES

   Shared visual styles for the reusable Vaulty
   AppButton component and its supported variants.
========================================================= */

export const buttonStyles = StyleSheet.create({
    /* =====================================================
       BASE
    ===================================================== */

    base: {
        minHeight: 52,
        borderRadius: radius.md,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: spacing.lg,
    },

    /* =====================================================
       PRIMARY
    ===================================================== */

    primary: {
        backgroundColor: colors.primary,
        borderWidth: 1,
        borderColor: colors.primary,
    },

    /* =====================================================
       SECONDARY
    ===================================================== */

    secondary: {
        backgroundColor: colors.surfaceSoft,
        borderWidth: 1,
        borderColor: colors.borderStrong,
    },

    /* =====================================================
       ACCENT

       Legacy "gold" variant is retained for compatibility,
       but uses Vaulty's purple accent system.
    ===================================================== */

    gold: {
        backgroundColor: colors.primaryLight,
        borderWidth: 1,
        borderColor: colors.primaryBright,
    },

    /* =====================================================
       GHOST
    ===================================================== */

    ghost: {
        backgroundColor: colors.transparent,
    },

    /* =====================================================
       PRESSED
    ===================================================== */

    pressed: {
        opacity: 0.8,
        transform: [
            {
                scale: 0.99,
            },
        ],
    },

    /* =====================================================
       BASE TEXT
    ===================================================== */

    text: {
        color: colors.white,
        fontWeight: "800",
        fontSize: 16,
    },

    /* =====================================================
       SECONDARY TEXT
    ===================================================== */

    secondaryText: {
        color: colors.text,
    },

    /* =====================================================
       ACCENT TEXT
    ===================================================== */

    goldText: {
        color: colors.black,
    },

    /* =====================================================
       GHOST TEXT
    ===================================================== */

    ghostText: {
        color: colors.primaryLight,
    },
});
