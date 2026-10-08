import { StyleSheet } from "react-native";
import { colors, radius, spacing } from "../constants/theme";

export const inputStyles = StyleSheet.create({
    wrapper: {
        gap: spacing.sm,
    },

    label: {
        color: colors.text,
        fontSize: 14,
        fontWeight: "700",
    },

    inputContainer: {
        minHeight: 54,
        flexDirection: "row",
        alignItems: "center",
        borderRadius: radius.md,
        borderWidth: 1,
        borderColor: colors.border,
        backgroundColor: colors.surface,
    },

    focused: {
        borderColor: colors.primary,
        backgroundColor: colors.surfaceElevated,
    },

    input: {
        flex: 1,
        minHeight: 52,
        paddingHorizontal: spacing.md,
        color: colors.textStrong,
        fontSize: 16,
    },
});
