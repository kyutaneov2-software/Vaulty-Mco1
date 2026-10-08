import { StyleSheet } from "react-native";
import { colors, radius, spacing } from "../constants/theme";

/* =========================================================
   STYLESHEET: WALLET STYLES

   Shared styling for the authenticated Vaulty Wallet
   screen, including balance, development top-up,
   errors, empty states, and transaction history.
========================================================= */

export const walletStyles = StyleSheet.create({
    /* =====================================================
       PAGE
    ===================================================== */

    page: {
        flex: 1,
        backgroundColor: "transparent",
    },

    content: {
        paddingHorizontal: spacing.lg,
        paddingTop: 48,
        paddingBottom: 40,
        gap: spacing.lg,
    },

    /* =====================================================
       LOADING
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

    /* =====================================================
       HEADER
    ===================================================== */

    header: {
        gap: 6,
    },

    eyebrow: {
        color: colors.primaryLight,
        fontSize: 11,
        fontWeight: "900",
        letterSpacing: 2.2,
    },

    title: {
        color: colors.textStrong,
        fontSize: 32,
        fontWeight: "900",
    },

    subtitle: {
        color: colors.muted,
        fontSize: 15,
        lineHeight: 22,
    },

    /* =====================================================
       BALANCE CARD
    ===================================================== */

    balanceCard: {
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.borderPurple,
        borderRadius: radius.lg,
        padding: spacing.lg,
        shadowColor: colors.black,
        shadowOffset: {
            width: 0,
            height: 14,
        },
        shadowOpacity: 0.24,
        shadowRadius: 22,
        elevation: 7,
    },

    balanceTop: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
    },

    walletIcon: {
        width: 48,
        height: 48,
        borderRadius: 15,
        backgroundColor: colors.primarySoft,
        borderWidth: 1,
        borderColor: colors.borderPurple,
        alignItems: "center",
        justifyContent: "center",
    },

    balanceLabel: {
        color: colors.muted,
        fontSize: 11,
        fontWeight: "800",
        letterSpacing: 1.4,
    },

    balance: {
        color: colors.textStrong,
        fontSize: 46,
        lineHeight: 52,
        fontWeight: "900",
        marginTop: 24,
    },

    pointsLabel: {
        color: colors.primaryLight,
        fontSize: 12,
        fontWeight: "900",
        letterSpacing: 3,
        marginTop: 2,
    },

    /* =====================================================
       TOP UP
    ===================================================== */

    topUpSection: {
        gap: spacing.md,
    },

    sectionHeader: {
        marginTop: spacing.sm,
    },

    sectionTitle: {
        color: colors.textStrong,
        fontSize: 20,
        fontWeight: "900",
    },

    sectionSubtitle: {
        color: colors.muted,
        fontSize: 13,
        marginTop: 3,
    },

    topUpGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 10,
    },

    topUpButton: {
        width: "48%",
        minHeight: 82,
        borderRadius: radius.md,
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
        alignItems: "center",
        justifyContent: "center",
        gap: 3,
    },

    topUpButtonActive: {
        backgroundColor: colors.primary,
        borderColor: colors.primaryLight,
    },

    topUpButtonPressed: {
        opacity: 0.75,
        transform: [
            {
                scale: 0.98,
            },
        ],
    },

    topUpAmount: {
        color: colors.primaryLight,
        fontSize: 22,
        fontWeight: "900",
    },

    topUpPoints: {
        color: colors.muted,
        fontSize: 10,
        fontWeight: "800",
        letterSpacing: 1.5,
    },

    devNotice: {
        color: colors.mutedDark,
        fontSize: 11,
        lineHeight: 16,
        textAlign: "center",
    },

    /* =====================================================
       ERROR
    ===================================================== */

    errorCard: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        backgroundColor: colors.dangerSoft,
        borderWidth: 1,
        borderColor: "rgba(255,107,129,0.40)",
        borderRadius: radius.md,
        padding: spacing.md,
    },

    errorText: {
        flex: 1,
        color: colors.danger,
        fontSize: 13,
        lineHeight: 19,
    },

    /* =====================================================
       EMPTY STATE
    ===================================================== */

    emptyCard: {
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: radius.lg,
        paddingVertical: 42,
        paddingHorizontal: 24,
    },

    emptyIcon: {
        width: 58,
        height: 58,
        borderRadius: 18,
        backgroundColor: colors.primarySoft,
        borderWidth: 1,
        borderColor: colors.borderPurple,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 14,
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
        marginTop: 5,
        maxWidth: 280,
    },

    /* =====================================================
       TRANSACTIONS
    ===================================================== */

    transactionsCard: {
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: radius.lg,
        paddingHorizontal: spacing.md,
        overflow: "hidden",
    },

    transaction: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: spacing.md,
        gap: 12,
    },

    transactionBorder: {
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },

    transactionIcon: {
        width: 42,
        height: 42,
        borderRadius: 13,
        backgroundColor: colors.surfaceSoft,
        borderWidth: 1,
        borderColor: colors.border,
        alignItems: "center",
        justifyContent: "center",
    },

    transactionCopy: {
        flex: 1,
        gap: 4,
    },

    transactionTitle: {
        color: colors.text,
        fontSize: 14,
        fontWeight: "700",
    },

    transactionDate: {
        color: colors.mutedDark,
        fontSize: 12,
    },

    transactionAmount: {
        fontSize: 15,
        fontWeight: "900",
    },
    /* =========================================================
   PAYMONGO TEST CARD
========================================================= */

    payMongoTestCard: {
        flexDirection: "row",

        alignItems: "center",

        backgroundColor: colors.surface,

        borderWidth: 1,
        borderColor: colors.borderPurple,

        borderRadius: radius.lg,

        padding: spacing.md,

        marginTop: spacing.md,
    },

    payMongoTestCardPressed: {
        opacity: 0.82,

        transform: [
            {
                scale: 0.99,
            },
        ],
    },

    payMongoTestCardDisabled: {
        opacity: 0.65,
    },

    payMongoTestIcon: {
        width: 46,
        height: 46,

        borderRadius: 14,

        alignItems: "center",
        justifyContent: "center",

        backgroundColor: colors.primaryFaint,

        borderWidth: 1,
        borderColor: colors.borderPurple,
    },

    payMongoTestCopy: {
        flex: 1,

        marginLeft: 12,
        marginRight: 10,
    },

    payMongoTestTitle: {
        color: colors.textStrong,

        fontSize: 14,
        fontWeight: "900",
    },

    payMongoTestText: {
        color: colors.muted,

        fontSize: 11,
        lineHeight: 17,

        marginTop: 3,
    },
});
