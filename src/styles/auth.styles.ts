import { StyleSheet } from "react-native";

import { colors, radius, spacing } from "../constants/theme";

export const authStyles = StyleSheet.create({
    /* =================================================
        SHARED AUTH CONTAINER
    ================================================= */

    container: {
        flex: 1,
    },

    /* =================================================
        LOGIN
    ================================================= */

    loginContent: {
        flexGrow: 1,
        paddingHorizontal: spacing.lg,
        paddingTop: 56,
        paddingBottom: 44,
    },

    loginHeading: {
        marginBottom: 26,
    },

    loginEyebrow: {
        color: colors.primaryLight,
        fontSize: 10,
        fontWeight: "900",
        letterSpacing: 2.4,
        marginBottom: 8,
    },

    loginTitle: {
        color: colors.textStrong,
        fontSize: 32,
        lineHeight: 40,
        fontWeight: "900",
    },

    loginTitleAccent: {
        color: colors.primaryLight,
    },

    loginSubtitle: {
        color: colors.muted,
        fontSize: 14,
        lineHeight: 22,
        marginTop: 8,
        maxWidth: 370,
    },

    loginFormCard: {
        backgroundColor: "#08070A",
        borderWidth: 1,
        borderColor: colors.borderStrong,
        borderRadius: 26,
        padding: spacing.md,
        shadowColor: colors.black,
        shadowOffset: {
            width: 0,
            height: 18,
        },
        shadowOpacity: 0.4,
        shadowRadius: 28,
        elevation: 10,
    },

    loginCardHeader: {
        flexDirection: "row",
        alignItems: "center",
        gap: 11,
        marginBottom: 18,
    },

    loginSectionIcon: {
        width: 38,
        height: 38,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: colors.primarySoft,
        borderWidth: 1,
        borderColor: colors.borderPurple,
    },

    loginSectionTitle: {
        color: colors.textStrong,
        fontSize: 15,
        fontWeight: "800",
    },

    loginSectionSubtitle: {
        color: colors.mutedDark,
        fontSize: 11,
        marginTop: 2,
    },

    loginForm: {
        gap: spacing.md,
    },

    inputIndicator: {
        marginRight: 14,
    },

    loginOptionsRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },

    loginForgot: {
        color: colors.primaryLight,
        fontSize: 12,
        fontWeight: "800",
    },

    loginSecurityCard: {
        flexDirection: "row",
        alignItems: "center",
        padding: 12,
        borderRadius: 17,
        backgroundColor: colors.primaryFaint,
        borderWidth: 1,
        borderColor: colors.borderPurple,
    },

    loginSecurityIcon: {
        width: 36,
        height: 36,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: colors.primarySoft,
        marginRight: 10,
    },

    loginSecurityContent: {
        flex: 1,
    },

    loginSecurityTitle: {
        color: colors.text,
        fontSize: 12,
        fontWeight: "800",
    },

    loginSecurityText: {
        color: colors.mutedDark,
        fontSize: 10,
        lineHeight: 15,
        marginTop: 2,
    },

    loginErrorBox: {
        flexDirection: "row",
        alignItems: "center",
        gap: 9,
        padding: 12,
        borderRadius: 16,
        backgroundColor: colors.dangerSoft,
        borderWidth: 1,
        borderColor: "rgba(251,113,133,0.45)",
    },

    loginErrorIcon: {
        width: 28,
        height: 28,
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(251,113,133,0.10)",
    },

    loginErrorText: {
        flex: 1,
        color: colors.danger,
        fontSize: 12,
        fontWeight: "700",
        lineHeight: 18,
    },

    loginButtonWrapper: {
        marginTop: 4,
    },

    loginFooter: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 6,
        marginTop: 26,
    },

    loginFooterText: {
        color: colors.muted,
        fontSize: 13,
    },

    loginLink: {
        color: colors.primaryLight,
        fontSize: 13,
        fontWeight: "900",
    },

    loginSecureFooter: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
        marginTop: 16,
    },

    loginSecureFooterText: {
        color: colors.mutedDark,
        fontSize: 10,
    },

    /* =================================================
       REGISTER
    ================================================= */

    registerContent: {
        flexGrow: 1,
        paddingHorizontal: spacing.lg,
        paddingTop: 46,
        paddingBottom: 44,
    },

    registerHeading: {
        marginBottom: 24,
    },

    registerEyebrow: {
        color: colors.primaryLight,
        fontSize: 10,
        fontWeight: "900",
        letterSpacing: 2.4,
        marginBottom: 8,
    },

    registerTitle: {
        color: colors.textStrong,
        fontSize: 31,
        lineHeight: 39,
        fontWeight: "900",
    },

    registerTitleAccent: {
        color: colors.primaryLight,
    },

    registerSubtitle: {
        color: colors.muted,
        fontSize: 14,
        lineHeight: 22,
        marginTop: 8,
        maxWidth: 370,
    },

    registerFormCard: {
        position: "relative",
        overflow: "hidden",
        borderRadius: 28,
        borderWidth: 1,
        borderColor: colors.borderStrong,
        padding: spacing.md,
        shadowColor: colors.black,
        shadowOffset: {
            width: 0,
            height: 18,
        },
        shadowOpacity: 0.36,
        shadowRadius: 28,
        elevation: 12,
    },

    registerCardHighlight: {
        position: "absolute",
        top: 0,
        left: 26,
        right: 26,
        height: 1,
        backgroundColor: "rgba(167,139,250,0.32)",
    },

    registerSectionHeader: {
        flexDirection: "row",
        alignItems: "center",
        gap: 11,
        marginBottom: 16,
    },

    registerSectionIcon: {
        width: 36,
        height: 36,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: colors.primarySoft,
        borderWidth: 1,
        borderColor: colors.borderPurple,
    },

    registerSectionTitle: {
        color: colors.textStrong,
        fontSize: 14,
        fontWeight: "800",
    },

    registerSectionSubtitle: {
        color: colors.mutedDark,
        fontSize: 11,
        marginTop: 2,
    },

    registerForm: {
        gap: spacing.md,
    },

    registerDivider: {
        height: 1,
        backgroundColor: colors.border,
        marginVertical: 22,
    },

    /* =================================================
       REGISTER PASSWORD
    ================================================= */

    registerPasswordPanel: {
        backgroundColor: "rgba(23,19,32,0.82)",
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 19,
        padding: spacing.md,
        gap: spacing.sm,
    },

    registerStrengthHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },

    registerRequirementsTitle: {
        color: colors.text,
        fontSize: 13,
        fontWeight: "800",
    },

    registerRequirementsSubtitle: {
        color: colors.mutedDark,
        fontSize: 10,
        marginTop: 2,
    },

    registerStrengthBadge: {
        minWidth: 58,
        paddingHorizontal: 9,
        paddingVertical: 5,
        borderRadius: radius.pill,
        borderWidth: 1,
        alignItems: "center",
    },

    registerStrength: {
        fontSize: 11,
        fontWeight: "900",
    },

    registerStrengthBars: {
        flexDirection: "row",
        gap: 5,
        marginTop: 4,
    },

    registerStrengthBar: {
        flex: 1,
        height: 5,
        borderRadius: radius.pill,
        backgroundColor: colors.border,
    },

    registerRequirements: {
        gap: 6,
        marginTop: 3,
    },

    registerRule: {
        flexDirection: "row",
        alignItems: "center",
        gap: 7,
    },

    registerRuleText: {
        color: colors.muted,
        fontSize: 12,
    },

    registerRuleTextValid: {
        color: colors.success,
    },

    /* =================================================
        REGISTER PASSWORD MATCH
    ================================================= */

    registerMatchBox: {
        flexDirection: "row",
        alignItems: "center",
        gap: 9,
        borderWidth: 1,
        borderRadius: 15,
        paddingVertical: 10,
        paddingHorizontal: 12,
    },

    registerMatchIcon: {
        width: 24,
        height: 24,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(255,255,255,0.05)",
    },

    registerMatchText: {
        fontSize: 12,
        fontWeight: "800",
    },

    /* =================================================
        REGISTER SESSION
    ================================================= */

    registerPreferenceCard: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 20,
        padding: 12,
        borderRadius: 18,
        backgroundColor: colors.primaryFaint,
        borderWidth: 1,
        borderColor: colors.borderPurple,
    },

    registerPreferenceIcon: {
        width: 36,
        height: 36,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: colors.primarySoft,
        marginRight: 10,
    },

    registerPreferenceContent: {
        flex: 1,
    },

    registerPreferenceTitle: {
        color: colors.text,
        fontSize: 12,
        fontWeight: "800",
    },

    registerPreferenceSubtitle: {
        color: colors.mutedDark,
        fontSize: 10,
        lineHeight: 15,
        marginTop: 2,
        paddingRight: 8,
    },

    /* =================================================
       REGISTER MFA
    ================================================= */

    registerMfaCard: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 14,
        padding: 12,
        borderRadius: 18,
        backgroundColor: "rgba(32,20,53,0.72)",
        borderWidth: 1,
        borderColor: colors.borderPurple,
    },

    registerMfaIcon: {
        width: 36,
        height: 36,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: colors.primarySoft,
        marginRight: 10,
    },

    registerMfaContent: {
        flex: 1,
    },

    registerMfaTitle: {
        color: colors.primaryLight,
        fontSize: 12,
        fontWeight: "800",
    },

    registerMfaText: {
        color: colors.mutedDark,
        fontSize: 10,
        lineHeight: 15,
        marginTop: 2,
    },

    /* =================================================
       REGISTER ERROR
    ================================================= */

    registerErrorBox: {
        flexDirection: "row",
        alignItems: "center",
        gap: 9,
        marginTop: 16,
        padding: 12,
        borderRadius: 17,
        backgroundColor: colors.dangerSoft,
        borderWidth: 1,
        borderColor: "rgba(251,113,133,0.55)",
    },

    registerErrorIcon: {
        width: 28,
        height: 28,
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(251,113,133,0.10)",
    },

    registerErrorText: {
        flex: 1,
        color: colors.danger,
        fontSize: 12,
        fontWeight: "700",
        lineHeight: 18,
    },

    /* =================================================
       REGISTER BUTTON / SECURITY NOTE
    ================================================= */

    registerButtonWrapper: {
        marginTop: 20,
    },

    registerSecurityNote: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        marginTop: 14,
        paddingHorizontal: 6,
    },

    registerSecurityText: {
        flex: 1,
        color: colors.mutedDark,
        fontSize: 10,
        lineHeight: 15,
    },

    /* =================================================
       REGISTER FOOTER
    ================================================= */

    registerFooter: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 6,
        marginTop: 26,
    },

    registerFooterText: {
        color: colors.muted,
        fontSize: 13,
    },

    registerLink: {
        color: colors.primaryLight,
        fontSize: 13,
        fontWeight: "900",
    },

    registerSecureFooter: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
        marginTop: 16,
    },

    registerSecureFooterText: {
        color: colors.mutedDark,
        fontSize: 10,
    },

    /* =================================================
   MFA CHALLENGE
================================================= */

    mfaContent: {
        flex: 1,
        paddingHorizontal: spacing.lg,
        paddingTop: 34,
        paddingBottom: 34,
    },

    mfaTopBar: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },

    mfaEyebrow: {
        color: colors.primaryLight,
        fontSize: 10,
        fontWeight: "900",
        letterSpacing: 2.3,
    },

    mfaTopTitle: {
        color: colors.textStrong,
        fontSize: 17,
        fontWeight: "900",
        marginTop: 3,
    },

    mfaSignOutButton: {
        width: 42,
        height: 42,
        borderRadius: 14,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
    },

    mfaCenterContent: {
        flex: 1,
        justifyContent: "center",
        paddingBottom: 20,
    },

    mfaIconBox: {
        width: 68,
        height: 68,
        borderRadius: 22,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: colors.primarySoft,
        borderWidth: 1,
        borderColor: colors.borderPurple,
        marginBottom: 18,
    },

    mfaTitle: {
        color: colors.textStrong,
        fontSize: 29,
        lineHeight: 37,
        fontWeight: "900",
    },

    mfaSubtitle: {
        color: colors.muted,
        fontSize: 14,
        lineHeight: 22,
        marginTop: 8,
        marginBottom: 22,
        maxWidth: 380,
    },

    mfaCard: {
        backgroundColor: "#08070A",
        borderWidth: 1,
        borderColor: colors.borderStrong,
        borderRadius: 26,
        padding: spacing.md,
        shadowColor: colors.black,
        shadowOffset: {
            width: 0,
            height: 18,
        },
        shadowOpacity: 0.4,
        shadowRadius: 28,
        elevation: 10,
    },

    mfaCardHeader: {
        flexDirection: "row",
        alignItems: "center",
        gap: 11,
        marginBottom: 18,
    },

    mfaCardIcon: {
        width: 38,
        height: 38,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: colors.primarySoft,
        borderWidth: 1,
        borderColor: colors.borderPurple,
    },

    mfaCardTitle: {
        color: colors.textStrong,
        fontSize: 14,
        fontWeight: "800",
    },

    mfaCardSubtitle: {
        color: colors.mutedDark,
        fontSize: 11,
        marginTop: 2,
    },

    mfaLoadingBox: {
        height: 76,
        borderRadius: 18,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: colors.surfaceElevated,
        borderWidth: 1,
        borderColor: colors.border,
    },

    mfaLoadingText: {
        color: colors.mutedDark,
        fontSize: 10,
        marginTop: 7,
    },

    mfaCodeInput: {
        height: 74,
        borderRadius: 18,
        borderWidth: 1,
        borderColor: colors.borderStrong,
        backgroundColor: colors.surfaceElevated,
        color: colors.textStrong,
        fontSize: 29,
        fontWeight: "900",
        letterSpacing: 9,
    },

    mfaErrorBox: {
        flexDirection: "row",
        alignItems: "center",
        gap: 9,
        marginTop: 14,
        padding: 12,
        borderRadius: 16,
        backgroundColor: colors.dangerSoft,
        borderWidth: 1,
        borderColor: "rgba(251,113,133,0.45)",
    },

    mfaErrorIcon: {
        width: 28,
        height: 28,
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(251,113,133,0.10)",
    },

    mfaErrorText: {
        flex: 1,
        color: colors.danger,
        fontSize: 12,
        fontWeight: "700",
        lineHeight: 18,
    },

    mfaButtonWrapper: {
        marginTop: 18,
    },

    mfaInfoBox: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        marginTop: 18,
        paddingHorizontal: 6,
    },

    mfaInfoText: {
        flex: 1,
        color: colors.mutedDark,
        fontSize: 10,
        lineHeight: 15,
    },

    mfaSecurityFooter: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
        marginTop: 16,
    },

    mfaSecurityFooterText: {
        color: colors.mutedDark,
        fontSize: 10,
        textAlign: "center",
    },

    /* =========================================================
    SETUP MFA SCREEN
 ========================================================= */

    setupMfaContent: {
        flexGrow: 1,
        paddingHorizontal: spacing.lg,
        paddingTop: 34,
        paddingBottom: 44,
    },

    setupMfaTopBar: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 30,
    },

    setupMfaEyebrow: {
        color: colors.primaryLight,
        fontSize: 10,
        fontWeight: "900",
        letterSpacing: 2.3,
    },

    setupMfaTopTitle: {
        color: colors.textStrong,
        fontSize: 17,
        fontWeight: "900",
        marginTop: 3,
    },

    setupMfaSignOutButton: {
        width: 42,
        height: 42,
        borderRadius: 14,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
    },

    setupMfaHeroIcon: {
        width: 72,
        height: 72,
        borderRadius: 24,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: colors.primarySoft,
        borderWidth: 1,
        borderColor: colors.borderPurple,
        marginBottom: 18,
    },

    setupMfaTitle: {
        color: colors.textStrong,
        fontSize: 30,
        lineHeight: 38,
        fontWeight: "900",
    },

    setupMfaSubtitle: {
        color: colors.muted,
        fontSize: 14,
        lineHeight: 22,
        marginTop: 8,
        marginBottom: 22,
    },

    setupMfaCard: {
        backgroundColor: "#08070A",
        borderWidth: 1,
        borderColor: colors.borderStrong,
        borderRadius: 26,
        padding: spacing.md,
        shadowColor: colors.black,
        shadowOffset: {
            width: 0,
            height: 18,
        },
        shadowOpacity: 0.4,
        shadowRadius: 28,
        elevation: 12,
    },

    setupMfaStepHeader: {
        flexDirection: "row",
        alignItems: "center",
        gap: 11,
    },

    setupMfaStepNumber: {
        width: 34,
        height: 34,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: colors.primarySoft,
        borderWidth: 1,
        borderColor: colors.borderPurple,
    },

    setupMfaStepNumberText: {
        color: colors.primaryLight,
        fontSize: 13,
        fontWeight: "900",
    },

    setupMfaStepContent: {
        flex: 1,
    },

    setupMfaStepTitle: {
        color: colors.textStrong,
        fontSize: 13,
        fontWeight: "800",
    },

    setupMfaStepSubtitle: {
        color: colors.mutedDark,
        fontSize: 11,
        lineHeight: 16,
        marginTop: 2,
    },

    setupMfaQrCard: {
        minHeight: 238,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 18,
        backgroundColor: "#FFFFFF",
        borderRadius: 22,
        padding: 14,
    },

    setupMfaQrLoading: {
        alignItems: "center",
        justifyContent: "center",
    },

    setupMfaQrLoadingText: {
        color: "#57505F",
        fontSize: 10,
        fontWeight: "700",
        marginTop: 8,
    },

    setupMfaManualBox: {
        marginTop: 14,
        padding: 14,
        borderRadius: 17,
        backgroundColor: colors.primaryFaint,
        borderWidth: 1,
        borderColor: colors.borderPurple,
    },

    setupMfaManualHeader: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },

    setupMfaManualIcon: {
        width: 28,
        height: 28,
        borderRadius: 9,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: colors.primarySoft,
        borderWidth: 1,
        borderColor: colors.borderPurple,
    },

    setupMfaManualTitle: {
        color: colors.primaryLight,
        fontSize: 12,
        fontWeight: "900",
    },

    setupMfaManualText: {
        color: colors.muted,
        fontSize: 11,
        lineHeight: 16,
        marginTop: 7,
    },

    setupMfaSecret: {
        color: colors.text,
        fontSize: 13,
        fontWeight: "800",
        letterSpacing: 1.1,
        marginTop: 10,
    },

    setupMfaDivider: {
        height: 1,
        backgroundColor: colors.border,
        marginVertical: 22,
    },

    setupMfaCodeInput: {
        height: 64,
        marginTop: 18,
        borderRadius: 18,
        borderWidth: 1,
        borderColor: colors.borderStrong,
        backgroundColor: colors.surfaceElevated,
        color: colors.textStrong,
        fontSize: 28,
        fontWeight: "900",
        letterSpacing: 9,
    },

    setupMfaErrorBox: {
        flexDirection: "row",
        alignItems: "center",
        gap: 9,
        marginTop: 14,
        padding: 12,
        borderRadius: 16,
        backgroundColor: colors.dangerSoft,
        borderWidth: 1,
        borderColor: "rgba(255,107,129,0.38)",
    },

    setupMfaErrorIcon: {
        width: 28,
        height: 28,
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(255,107,129,0.10)",
    },

    setupMfaErrorText: {
        flex: 1,
        color: colors.danger,
        fontSize: 12,
        fontWeight: "700",
        lineHeight: 18,
    },

    setupMfaButtonWrapper: {
        marginTop: 18,
    },

    setupMfaSecurityNote: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        marginTop: 18,
        paddingHorizontal: 6,
    },

    setupMfaSecurityIcon: {
        width: 26,
        height: 26,
        borderRadius: 9,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: colors.primarySoft,
        borderWidth: 1,
        borderColor: colors.borderPurple,
    },

    setupMfaSecurityText: {
        flex: 1,
        color: colors.mutedDark,
        fontSize: 10,
        lineHeight: 15,
    },
});
