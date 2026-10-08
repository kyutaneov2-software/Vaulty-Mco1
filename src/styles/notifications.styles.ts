import { StyleSheet } from "react-native";
import { colors, radius, shadows, spacing } from "../constants/theme";

export const notificationsStyles = StyleSheet.create({
    loading: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        gap: 12,
    },

    loadingText: {
        color: colors.muted,
        fontSize: 14,
    },

    page: {
        flex: 1,
        backgroundColor: "transparent",
    },

    content: {
        paddingHorizontal: spacing.lg,
        paddingTop: spacing.lg,
        paddingBottom: 40,
        gap: spacing.lg,
    },

    /* =====================================================
       HEADER
    ===================================================== */

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

    /* =====================================================
       DATE GROUP
    ===================================================== */

    dateHeader: {
        color: colors.mutedDark,
        fontSize: 10,
        fontWeight: "900",
        letterSpacing: 1.5,
        marginLeft: 4,
        marginBottom: spacing.sm,
    },

    dateHeaderSpaced: {
        marginTop: spacing.md,
    },

    /* =====================================================
       LIST
    ===================================================== */

    listCard: {
        borderRadius: radius.lg,
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
        overflow: "hidden",
        ...shadows.card,
    },

    row: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        paddingVertical: 14,
        paddingHorizontal: spacing.md,
    },

    rowBorder: {
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },

    rowPressed: {
        backgroundColor: colors.surfaceElevated,
    },

    iconWrap: {
        width: 40,
        height: 40,
        borderRadius: 13,
        borderWidth: 1,
        alignItems: "center",
        justifyContent: "center",
    },

    body: {
        flex: 1,
        gap: 2,
    },

    title: {
        color: colors.text,
        fontSize: 14,
        fontWeight: "800",
    },

    subtitle: {
        color: colors.muted,
        fontSize: 12,
        fontWeight: "500",
    },

    meta: {
        color: colors.mutedDark,
        fontSize: 11,
        fontWeight: "600",
        marginTop: 2,
    },

    amount: {
        fontSize: 14,
        fontWeight: "900",
        letterSpacing: -0.3,
    },

    /* =====================================================
       EMPTY
    ===================================================== */

    emptyCard: {
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 56,
        paddingHorizontal: 24,
        borderRadius: radius.lg,
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
        ...shadows.card,
    },

    emptyIcon: {
        width: 64,
        height: 64,
        borderRadius: 20,
        backgroundColor: colors.primaryFaint,
        borderWidth: 1,
        borderColor: colors.borderPurple,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 16,
    },

    emptyTitle: {
        color: colors.textStrong,
        fontSize: 17,
        fontWeight: "800",
    },

    emptyText: {
        color: colors.muted,
        fontSize: 13,
        lineHeight: 20,
        textAlign: "center",
        marginTop: 6,
        maxWidth: 260,
    },
});
