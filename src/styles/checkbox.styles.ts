import { StyleSheet } from "react-native";
import { colors, spacing } from "../constants/theme";

/* =========================================================
   STYLESHEET: CHECKBOX STYLES

   Shared visual styles for the reusable Vaulty
   FormCheckbox component.
========================================================= */

export const checkboxStyles = StyleSheet.create({
    /* =====================================================
       CONTAINER
    ===================================================== */

    container: {
        flexDirection: "row",
        alignItems: "center",
        gap: spacing.sm,
    },

    /* =====================================================
       CHECKBOX
    ===================================================== */

    checkbox: {
        width: 20,
        height: 20,
        borderRadius: 6,
        borderWidth: 1.5,
        borderColor: colors.borderStrong,
        backgroundColor: colors.surface,
        alignItems: "center",
        justifyContent: "center",
    },

    /* =====================================================
       CHECKED STATE
    ===================================================== */

    checked: {
        backgroundColor: colors.primary,
        borderColor: colors.primaryLight,
    },

    /* =====================================================
       LABEL
    ===================================================== */

    label: {
        color: colors.muted,
        fontSize: 14,
    },

    /* =====================================================
       PRESSED STATE
    ===================================================== */

    pressed: {
        opacity: 0.7,
    },
});
