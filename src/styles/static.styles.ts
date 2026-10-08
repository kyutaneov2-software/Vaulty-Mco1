import { StyleSheet } from "react-native";
import { colors, radius, shadows, spacing } from "../constants/theme";

export const staticStyles = StyleSheet.create({
    header: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        paddingTop: 56,
        paddingHorizontal: spacing.lg,
        paddingBottom: 12,
        backgroundColor: "rgba(0,0,0,0.80)",
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
        zIndex: 10,
    },

    headerIcon: {
        width: 42,
        height: 42,
        borderRadius: 14,
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
        alignItems: "center",
        justifyContent: "center",
    },

    headerIconPressed: {
        backgroundColor: colors.surfaceElevated,
        transform: [{ scale: 0.96 }],
    },

    headerCopy: {
        flex: 1,
    },

    headerEyebrow: {
        color: colors.primaryLight,
        fontSize: 10,
        fontWeight: "900",
        letterSpacing: 2,
        marginBottom: 2,
    },

    headerTitle: {
        color: colors.textStrong,
        fontSize: 20,
        fontWeight: "800",
        letterSpacing: -0.3,
    },

    page: {
        flex: 1,
        backgroundColor: "transparent",
    },

    content: {
        paddingHorizontal: spacing.lg,
        paddingTop: spacing.lg,
        paddingBottom: 60,
        gap: spacing.lg,
    },

    section: {
        gap: spacing.sm,
    },

    sectionTitle: {
        color: colors.textStrong,
        fontSize: 16,
        fontWeight: "800",
        letterSpacing: -0.2,
    },

    sectionBody: {
        gap: 10,
        padding: spacing.md,
        borderRadius: radius.lg,
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
        ...shadows.card,
    },

    paragraph: {
        color: colors.text,
        fontSize: 14,
        lineHeight: 22,
        fontWeight: "400",
    },

    bulletRow: {
        flexDirection: "row",
        alignItems: "flex-start",
        gap: 10,
    },

    bulletDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: colors.primary,
        marginTop: 8,
    },

    bulletText: {
        flex: 1,
        color: colors.text,
        fontSize: 14,
        lineHeight: 22,
        fontWeight: "400",
    },

    meta: {
        color: colors.mutedDark,
        fontSize: 12,
        textAlign: "center",
        marginTop: spacing.md,
        letterSpacing: 0.5,
    },
});
