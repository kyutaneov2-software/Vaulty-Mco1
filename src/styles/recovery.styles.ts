import { StyleSheet } from "react-native";
import { colors, radius, shadows, spacing } from "../constants/theme";

export const recoveryStyles = StyleSheet.create({
    container: {
        flex: 1,
    },

    content: {
        flexGrow: 1,
        paddingHorizontal: spacing.lg,
        paddingTop: 34,
        paddingBottom: 44,
    },

    /* =====================================================
       TOP BAR
    ===================================================== */

    topBar: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        marginBottom: 30,
    },

    backButton: {
        width: 42,
        height: 42,
        borderRadius: 14,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
    },

    eyebrow: {
        color: colors.primaryLight,
        fontSize: 10,
        fontWeight: "900",
        letterSpacing: 2.3,
    },

    topTitle: {
        color: colors.textStrong,
        fontSize: 17,
        fontWeight: "900",
        marginTop: 3,
    },

    /* =====================================================
       HERO
    ===================================================== */

    heroIcon: {
        width: 68,
        height: 68,
        borderRadius: 22,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: colors.primaryFaint,
        borderWidth: 1,
        borderColor: colors.borderPurple,
        marginBottom: 18,
    },

    title: {
        color: colors.textStrong,
        fontSize: 30,
        lineHeight: 38,
        fontWeight: "900",
    },

    subtitle: {
        color: colors.muted,
        fontSize: 14,
        lineHeight: 22,
        marginTop: 8,
        marginBottom: 22,
    },

    /* =====================================================
       FORM CARD
    ===================================================== */

    card: {
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: radius.lg,
        padding: spacing.md,
        ...shadows.card,
    },

    cardHeader: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        marginBottom: 18,
    },

    cardIcon: {
        width: 38,
        height: 38,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: colors.primaryFaint,
        borderWidth: 1,
        borderColor: colors.borderPurple,
    },

    cardTitle: {
        color: colors.textStrong,
        fontSize: 14,
        fontWeight: "800",
    },

    cardSubtitle: {
        color: colors.mutedDark,
        fontSize: 11,
        marginTop: 2,
    },

    form: {
        gap: spacing.md,
    },

    recoveryCodeInput: {
        fontSize: 15,
        fontWeight: "800",
        letterSpacing: 2,
    },

    /* =====================================================
       INFO BOX
    ===================================================== */

    infoBox: {
        flexDirection: "row",
        alignItems: "center",
        gap: 9,
        padding: 12,
        borderRadius: 16,
        backgroundColor: colors.surfaceElevated,
        borderWidth: 1,
        borderColor: colors.border,
    },

    infoIcon: {
        width: 30,
        height: 30,
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: colors.primaryFaint,
    },

    infoContent: {
        flex: 1,
    },

    infoTitle: {
        color: colors.text,
        fontSize: 12,
        fontWeight: "800",
    },

    infoText: {
        color: colors.muted,
        fontSize: 11,
        lineHeight: 16,
        marginTop: 2,
    },

    /* =====================================================
       ERROR
    ===================================================== */

    errorBox: {
        flexDirection: "row",
        alignItems: "center",
        gap: 9,
        padding: 12,
        borderRadius: 16,
        backgroundColor: colors.dangerSoft,
        borderWidth: 1,
        borderColor: "rgba(255,107,129,0.38)",
    },

    errorIcon: {
        width: 28,
        height: 28,
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(255,107,129,0.10)",
    },

    errorText: {
        flex: 1,
        color: colors.danger,
        fontSize: 12,
        fontWeight: "700",
        lineHeight: 18,
    },

    buttonWrapper: {
        marginTop: 2,
    },

    /* =====================================================
       RECOVERY CODES
    ===================================================== */

    codesCard: {
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: radius.lg,
        padding: spacing.md,
        ...shadows.card,
    },

    codesGrid: {
        gap: 9,
    },

    codeItem: {
        minHeight: 46,
        borderRadius: 13,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: colors.surfaceElevated,
        borderWidth: 1,
        borderColor: colors.border,
    },

    codeText: {
        color: colors.textStrong,
        fontSize: 15,
        fontWeight: "900",
        letterSpacing: 1.6,
    },

    saveNotice: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        marginTop: 14,
        padding: 12,
        borderRadius: 15,
        backgroundColor: colors.warningSoft,
        borderWidth: 1,
        borderColor: "rgba(244,201,93,0.24)",
    },

    saveNoticeText: {
        flex: 1,
        color: colors.warning,
        fontSize: 11,
        lineHeight: 16,
        fontWeight: "700",
    },

    savedButtonWrapper: {
        marginTop: 18,
    },

    /* =====================================================
       FOOTER
    ===================================================== */

    footer: {
        alignItems: "center",
        justifyContent: "center",
        marginTop: 20,
        paddingHorizontal: 8,
    },

    footerText: {
        color: colors.mutedDark,
        fontSize: 10,
        textAlign: "center",
        lineHeight: 16,
    },
});
