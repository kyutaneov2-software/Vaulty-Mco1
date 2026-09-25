import { StyleSheet } from "react-native";
import { colors, radius, spacing } from "../constants/theme";

/* =========================================================
   STYLESHEET: INPUT STYLES

   Shared styling for the reusable Vaulty AppInput
   component.
========================================================= */

export const inputStyles = StyleSheet.create({
    /* =====================================================
       WRAPPER
    ===================================================== */

    wrapper: {
        gap: spacing.sm,
    },

    /* =====================================================
       LABEL
    ===================================================== */

    label: {
        color: colors.text,
        fontSize: 14,
        fontWeight: "700",
    },

    /* =====================================================
       INPUT CONTAINER
    ===================================================== */

    inputContainer: {
        minHeight: 54,
        flexDirection: "row",
        alignItems: "center",
        borderRadius: radius.md,
        borderWidth: 1,
        borderColor: colors.border,
        backgroundColor: colors.surface,
    },

    /* =====================================================
       FOCUSED STATE
    ===================================================== */

    focused: {
        borderColor: colors.primary,
        backgroundColor: colors.surfaceElevated,
    },

    /* =====================================================
       TEXT INPUT
    ===================================================== */

    input: {
        flex: 1,
        minHeight: 52,
        paddingHorizontal: spacing.md,
        color: colors.textStrong,
        fontSize: 16,
    },
});
