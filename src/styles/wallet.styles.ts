import { StyleSheet } from "react-native";
import { colors, radius, shadows, spacing } from "../constants/theme";

export const walletStyles = StyleSheet.create({
    /* =====================================================
       SHARED
    ===================================================== */

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
       BALANCE
    ===================================================== */

    balanceCard: {
        padding: spacing.lg,
        borderRadius: radius.lg,
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
        ...shadows.elevated,
    },

    balanceTop: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
    },

    walletBadge: {
        width: 34,
        height: 34,
        borderRadius: 11,
        backgroundColor: colors.primaryFaint,
        borderWidth: 1,
        borderColor: colors.borderPurple,
        alignItems: "center",
        justifyContent: "center",
    },

    balanceLabel: {
        color: colors.muted,
        fontSize: 11,
        fontWeight: "900",
        letterSpacing: 1.8,
    },

    balance: {
        color: colors.textStrong,
        fontSize: 54,
        lineHeight: 60,
        fontWeight: "900",
        letterSpacing: -1.5,
        marginTop: 20,
    },

    balanceUnit: {
        color: colors.mutedDark,
        fontSize: 11,
        fontWeight: "900",
        letterSpacing: 2.5,
        marginTop: 4,
    },

    /* =====================================================
       ERROR
    ===================================================== */

    errorCard: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        padding: spacing.md,
        borderRadius: radius.md,
        backgroundColor: colors.dangerSoft,
        borderWidth: 1,
        borderColor: "rgba(255,107,129,0.40)",
    },

    errorText: {
        flex: 1,
        color: colors.danger,
        fontSize: 13,
        lineHeight: 19,
    },

    /* =====================================================
       SECTIONS
    ===================================================== */

    section: {
        gap: spacing.sm,
    },

    sectionHeader: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },

    sectionTitle: {
        color: colors.textStrong,
        fontSize: 16,
        fontWeight: "800",
        letterSpacing: -0.2,
    },

    sectionHint: {
        color: colors.mutedDark,
        fontSize: 11,
        fontWeight: "700",
        letterSpacing: 1,
        textTransform: "uppercase",
    },

    /* =====================================================
       QUICK TOP UP

       Horizontal scroll row. Buttons have fixed width so
       additional amounts can be added without breaking the
       layout — the row simply scrolls.
    ===================================================== */

    topUpGrid: {
        flexDirection: "row",
        gap: 8,
        paddingRight: spacing.lg,
    },

    topUpButton: {
        width: 88,
        minHeight: 62,
        borderRadius: radius.md,
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
        alignItems: "center",
        justifyContent: "center",
        gap: 2,
    },

    topUpButtonActive: {
        backgroundColor: colors.primaryFaint,
        borderColor: colors.primary,
    },

    topUpButtonPressed: {
        opacity: 0.85,
        transform: [{ scale: 0.98 }],
    },

    topUpAmount: {
        color: colors.textStrong,
        fontSize: 16,
        fontWeight: "900",
        letterSpacing: -0.3,
    },

    topUpUnit: {
        color: colors.mutedDark,
        fontSize: 9,
        fontWeight: "900",
        letterSpacing: 1.2,
    },

    devHint: {
        color: colors.mutedDark,
        fontSize: 10,
        fontWeight: "600",
        marginTop: 2,
    },

    /* =====================================================
       PAY WITH CARD
    ===================================================== */

    payCard: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        padding: spacing.md,
        borderRadius: radius.lg,
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
        ...shadows.card,
    },

    payCardPressed: {
        opacity: 0.88,
        transform: [{ scale: 0.99 }],
    },

    payCardDisabled: {
        opacity: 0.65,
    },

    payIcon: {
        width: 44,
        height: 44,
        borderRadius: 14,
        backgroundColor: colors.primaryFaint,
        borderWidth: 1,
        borderColor: colors.borderPurple,
        alignItems: "center",
        justifyContent: "center",
    },

    payCopy: {
        flex: 1,
        gap: 2,
    },

    payTitle: {
        color: colors.textStrong,
        fontSize: 14,
        fontWeight: "800",
    },

    payText: {
        color: colors.muted,
        fontSize: 11,
        fontWeight: "500",
    },

    /* =====================================================
       ACTIVITY
    ===================================================== */

    activityList: {
        gap: 0,
    },

    dateHeader: {
        color: colors.mutedDark,
        fontSize: 10,
        fontWeight: "900",
        letterSpacing: 1.5,
        marginBottom: 8,
        marginLeft: 4,
    },

    dateHeaderSpaced: {
        marginTop: spacing.md,
    },

    transactionsCard: {
        borderRadius: radius.lg,
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
        overflow: "hidden",
        ...shadows.card,
    },

    transaction: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        paddingVertical: 14,
        paddingHorizontal: spacing.md,
    },

    transactionBorder: {
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },

    transactionIcon: {
        width: 38,
        height: 38,
        borderRadius: 12,
        backgroundColor: colors.surfaceElevated,
        borderWidth: 1,
        borderColor: colors.border,
        alignItems: "center",
        justifyContent: "center",
    },

    transactionCopy: {
        flex: 1,
    },

    transactionTitle: {
        color: colors.text,
        fontSize: 14,
        fontWeight: "700",
    },

    transactionAmount: {
        fontSize: 15,
        fontWeight: "900",
        letterSpacing: -0.3,
    },

    /* =====================================================
       EMPTY
    ===================================================== */

    emptyCard: {
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 42,
        paddingHorizontal: 24,
        borderRadius: radius.lg,
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
        ...shadows.card,
    },

    emptyIcon: {
        width: 54,
        height: 54,
        borderRadius: 17,
        backgroundColor: colors.primaryFaint,
        borderWidth: 1,
        borderColor: colors.borderPurple,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 14,
    },

    emptyTitle: {
        color: colors.textStrong,
        fontSize: 16,
        fontWeight: "800",
    },

    emptyText: {
        color: colors.muted,
        fontSize: 13,
        lineHeight: 20,
        textAlign: "center",
        marginTop: 5,
        maxWidth: 280,
    },
});
