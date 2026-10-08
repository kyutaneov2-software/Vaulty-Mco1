import { StyleSheet } from "react-native";
import { colors, spacing } from "../constants/theme";

export const checkboxStyles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        gap: spacing.sm,
    },

    checkbox: {
        width: 20,
        height: 20,
        borderRadius: 6,
        borderWidth: 1.5,
        borderColor: colors.border,
        backgroundColor: colors.surface,
        alignItems: "center",
        justifyContent: "center",
    },

    checked: {
        backgroundColor: colors.primary,
        borderColor: colors.primaryLight,
    },

    label: {
        color: colors.muted,
        fontSize: 14,
    },

    pressed: {
        opacity: 0.7,
    },
});
