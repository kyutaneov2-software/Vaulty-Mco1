import { StyleSheet } from "react-native";
import { colors, radius, spacing } from "../constants/theme";

/* =========================================================
   STYLESHEET: APP STYLES

   Shared styles for the main authenticated Vaulty
   application pages, starting with the Home screen.
========================================================= */

export const appStyles = StyleSheet.create({
    /* =====================================================
       MAIN SCREEN
    ===================================================== */

    screen: {
        flex: 1,
    },

    page: {
        flex: 1,
        backgroundColor: "transparent",
    },

    content: {
        paddingHorizontal: spacing.lg,
        paddingTop: spacing.lg,
        paddingBottom: 48,
        gap: spacing.lg,
    },

    /* =====================================================
       STICKY HEADER
    ===================================================== */

    stickyHeader: {
        backgroundColor: "rgba(5,4,7,0.62)",
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
        paddingTop: 48,
        paddingHorizontal: spacing.lg,
        paddingBottom: 16,
        zIndex: 20,
        elevation: 8,
        shadowColor: colors.black,
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.22,
        shadowRadius: 10,
    },

    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },

    headerBrand: {
        flexDirection: "row",
        alignItems: "center",
        flex: 1,
    },

    headerBrandPressed: {
        opacity: 0.8,
    },

    headerText: {
        flex: 1,
        marginLeft: 12,
    },

    greeting: {
        color: colors.muted,
        fontSize: 17,
        fontWeight: "600",
        lineHeight: 22,
    },

    name: {
        color: colors.textStrong,
        fontSize: 27,
        fontWeight: "900",
        lineHeight: 31,
    },

    headerSubtitle: {
        color: colors.mutedDark,
        fontSize: 12,
        lineHeight: 18,
        marginTop: 7,
        marginLeft: 64,
    },

    notificationButton: {
        width: 46,
        height: 46,
        borderRadius: 15,
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
        alignItems: "center",
        justifyContent: "center",
        marginLeft: 10,
    },

    notificationPressed: {
        backgroundColor: colors.surfaceSoft,
        transform: [
            {
                scale: 0.96,
            },
        ],
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
       WALLET CARD
    ===================================================== */

    walletCard: {
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.borderPurple,
        borderRadius: radius.lg,
        padding: spacing.lg,
        shadowColor: colors.black,
        shadowOffset: {
            width: 0,
            height: 12,
        },
        shadowOpacity: 0.24,
        shadowRadius: 20,
        elevation: 6,
    },

    walletCardPressed: {
        opacity: 0.82,
        transform: [
            {
                scale: 0.99,
            },
        ],
    },

    walletTop: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },

    walletLabel: {
        color: colors.primaryLight,
        fontSize: 11,
        fontWeight: "900",
        letterSpacing: 2,
    },

    walletDescription: {
        color: colors.muted,
        fontSize: 12,
        marginTop: 3,
    },

    walletIcon: {
        width: 46,
        height: 46,
        borderRadius: 14,
        backgroundColor: colors.primarySoft,
        borderWidth: 1,
        borderColor: colors.borderPurple,
        alignItems: "center",
        justifyContent: "center",
    },

    walletBalance: {
        color: colors.textStrong,
        fontSize: 48,
        lineHeight: 54,
        fontWeight: "900",
        marginTop: 24,
    },

    walletBottom: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 2,
    },

    walletPoints: {
        color: colors.primaryLight,
        fontSize: 11,
        fontWeight: "900",
        letterSpacing: 2.5,
    },

    walletLink: {
        flexDirection: "row",
        alignItems: "center",
        gap: 5,
    },

    walletLinkText: {
        color: colors.primaryLight,
        fontSize: 12,
        fontWeight: "800",
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
       SECTIONS
    ===================================================== */

    section: {
        gap: 11,
    },

    sectionHeader: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },

    sectionTitleRow: {
        flexDirection: "row",
        alignItems: "center",
        flex: 1,
    },

    sectionTitleCopy: {
        flex: 1,
    },

    sectionLogo: {
        width: 42,
        height: 42,
        borderRadius: 13,
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.borderPurple,
        alignItems: "center",
        justifyContent: "center",
        marginRight: 11,
    },

    sectionTitle: {
        color: colors.textStrong,
        fontSize: 19,
        fontWeight: "900",
    },

    sectionSubtitle: {
        color: colors.muted,
        fontSize: 13,
        marginTop: 3,
    },

    /* =====================================================
       FIND A VAULT
    ===================================================== */

    findVaultCard: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: radius.lg,
        padding: spacing.md,
        gap: 13,
    },

    findVaultPressed: {
        backgroundColor: colors.surfaceSoft,
    },

    findVaultIcon: {
        width: 54,
        height: 54,
        borderRadius: 17,
        backgroundColor: colors.primarySoft,
        borderWidth: 1,
        borderColor: colors.borderPurple,
        alignItems: "center",
        justifyContent: "center",
    },

    findVaultCopy: {
        flex: 1,
        gap: 4,
    },

    findVaultTitle: {
        color: colors.text,
        fontSize: 15,
        fontWeight: "800",
    },

    findVaultText: {
        color: colors.muted,
        fontSize: 12,
        lineHeight: 18,
    },

    comingSoonBadge: {
        alignSelf: "flex-start",
        backgroundColor: colors.primarySoft,
        paddingVertical: 4,
        paddingHorizontal: 8,
        borderRadius: radius.pill,
        marginTop: 2,
    },

    comingSoonText: {
        color: colors.primaryLight,
        fontSize: 9,
        fontWeight: "900",
        letterSpacing: 1.1,
    },

    /* =====================================================
       CURRENT RENTAL
    ===================================================== */

    emptyRentalCard: {
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: radius.lg,
        paddingVertical: 32,
        paddingHorizontal: 24,
    },

    emptyRentalIcon: {
        width: 54,
        height: 54,
        borderRadius: 17,
        backgroundColor: colors.primarySoft,
        borderWidth: 1,
        borderColor: colors.borderPurple,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 12,
    },

    emptyRentalTitle: {
        color: colors.textStrong,
        fontSize: 16,
        fontWeight: "800",
    },

    emptyRentalText: {
        color: colors.muted,
        fontSize: 13,
        lineHeight: 19,
        textAlign: "center",
        marginTop: 4,
        maxWidth: 290,
    },

    /* =====================================================
       HOW VAULTY WORKS
    ===================================================== */

    stepsCard: {
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: radius.lg,
        padding: spacing.md,
    },

    step: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        paddingVertical: 8,
    },

    stepNumber: {
        width: 30,
        height: 30,
        borderRadius: 10,
        backgroundColor: colors.primarySoft,
        borderWidth: 1,
        borderColor: colors.borderPurple,
        alignItems: "center",
        justifyContent: "center",
    },

    stepNumberText: {
        color: colors.primaryLight,
        fontSize: 10,
        fontWeight: "900",
    },

    stepIcon: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: colors.primarySoft,
        borderWidth: 1,
        borderColor: colors.borderPurple,
        alignItems: "center",
        justifyContent: "center",
    },

    stepCopy: {
        flex: 1,
        gap: 3,
    },

    stepTitle: {
        color: colors.text,
        fontSize: 14,
        fontWeight: "800",
    },

    stepText: {
        color: colors.muted,
        fontSize: 12,
        lineHeight: 17,
    },

    stepDivider: {
        height: 1,
        backgroundColor: colors.border,
        marginLeft: 80,
    },

    /* =====================================================
       FOOTER
    ===================================================== */

    footer: {
        alignItems: "center",
        paddingTop: 8,
        paddingBottom: 20,
    },

    footerLogo: {
        width: 48,
        height: 48,
        borderRadius: 14,
        backgroundColor: colors.primarySoft,
        borderWidth: 1,
        borderColor: colors.borderPurple,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 10,
    },

    footerTitle: {
        color: colors.text,
        fontSize: 12,
        fontWeight: "800",
        letterSpacing: 1,
    },

    footerText: {
        color: colors.mutedDark,
        fontSize: 11,
        marginTop: 3,
    },
});
