import { StyleSheet } from "react-native";
import { colors, radius, shadows, spacing } from "../constants/theme";

/* =========================================================
   STYLESHEET: RENTAL STYLES

   Covers both vault rental screens:
     - rent.tsx   → duration picker + payment summary
     - active.tsx → live lock control + countdown + log
========================================================= */

export const rentalStyles = StyleSheet.create({
    /* =====================================================
       SHARED
    ===================================================== */

    loading: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },

    page: {
        flex: 1,
        backgroundColor: "transparent",
    },

    content: {
        paddingHorizontal: spacing.lg,
        paddingTop: spacing.lg,
        paddingBottom: 140,
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
       RENT SCREEN — vault preview
    ===================================================== */

    vaultPreview: {
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

    vaultImageWrap: {
        width: 64,
        height: 64,
        borderRadius: radius.md,
        backgroundColor: colors.surfaceElevated,
        overflow: "hidden",
    },

    vaultImage: {
        width: "100%",
        height: "100%",
    },

    vaultInfo: {
        flex: 1,
        gap: 3,
    },

    vaultCode: {
        color: colors.textStrong,
        fontSize: 17,
        fontWeight: "800",
        letterSpacing: -0.2,
    },

    vaultMeta: {
        color: colors.muted,
        fontSize: 12,
        fontWeight: "600",
    },

    onlineRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        marginTop: 3,
    },

    onlineDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
    },

    onlineText: {
        color: colors.mutedDark,
        fontSize: 11,
        fontWeight: "700",
    },

    /* =====================================================
       SECTIONS
    ===================================================== */

    section: {
        gap: spacing.sm,
    },

    sectionEyebrow: {
        color: colors.mutedDark,
        fontSize: 10,
        fontWeight: "900",
        letterSpacing: 2,
        marginLeft: 4,
    },

    /* =====================================================
       RENT SCREEN — duration picker
    ===================================================== */

    durationRow: {
        flexDirection: "row",
        gap: 8,
    },

    durationTile: {
        flex: 1,
        paddingVertical: spacing.md,
        paddingHorizontal: 10,
        borderRadius: radius.md,
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
        alignItems: "center",
        gap: 6,
    },

    durationTileActive: {
        backgroundColor: colors.primaryFaint,
        borderColor: colors.primary,
    },

    durationTilePressed: {
        opacity: 0.9,
    },

    durationLabel: {
        color: colors.muted,
        fontSize: 11,
        fontWeight: "800",
        letterSpacing: 1.2,
        textTransform: "uppercase",
    },

    durationLabelActive: {
        color: colors.primaryLight,
    },

    durationPrice: {
        color: colors.textStrong,
        fontSize: 20,
        fontWeight: "900",
        letterSpacing: -0.5,
    },

    durationPriceActive: {
        color: colors.textStrong,
    },

    durationSublabel: {
        color: colors.mutedDark,
        fontSize: 10,
        fontWeight: "600",
    },

    /* =====================================================
       RENT SCREEN — summary
    ===================================================== */

    summaryCard: {
        padding: spacing.md,
        borderRadius: radius.lg,
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
        gap: spacing.sm,
        ...shadows.card,
    },

    summaryRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },

    summaryLabel: {
        color: colors.muted,
        fontSize: 13,
        fontWeight: "600",
    },

    summaryValue: {
        color: colors.text,
        fontSize: 13,
        fontWeight: "700",
    },

    summaryDivider: {
        height: 1,
        backgroundColor: colors.border,
        marginVertical: spacing.xs,
    },

    summaryTotalLabel: {
        color: colors.textStrong,
        fontSize: 14,
        fontWeight: "800",
    },

    summaryTotalValue: {
        color: colors.textStrong,
        fontSize: 20,
        fontWeight: "900",
        letterSpacing: -0.5,
    },

    walletRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        marginTop: spacing.sm,
        paddingVertical: 10,
        paddingHorizontal: spacing.sm,
        borderRadius: radius.sm,
        backgroundColor: colors.surfaceElevated,
    },

    walletRowPressed: {
        opacity: 0.75,
    },

    walletRowLabel: {
        flex: 1,
        color: colors.muted,
        fontSize: 12,
        fontWeight: "600",
    },

    walletRowValue: {
        color: colors.text,
        fontSize: 13,
        fontWeight: "800",
    },

    remainingRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginTop: 2,
        paddingHorizontal: spacing.xs,
    },

    remainingLabel: {
        color: colors.muted,
        fontSize: 12,
        fontWeight: "600",
    },

    remainingValueWrap: {
        flexDirection: "row",
        alignItems: "center",
        gap: 5,
    },

    remainingValue: {
        fontSize: 13,
        fontWeight: "800",
    },

    /* =====================================================
       RENT SCREEN — insufficient balance warning
    ===================================================== */

    warningCard: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        padding: 12,
        borderRadius: radius.md,
        backgroundColor: colors.dangerSoft,
        borderWidth: 1,
        borderColor: "rgba(255,107,129,0.40)",
    },

    warningText: {
        flex: 1,
        color: colors.danger,
        fontSize: 12,
        fontWeight: "700",
        lineHeight: 17,
    },

    /* =====================================================
       RENT SCREEN — sticky footer CTA
    ===================================================== */

    footerCta: {
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        paddingHorizontal: spacing.lg,
        paddingTop: spacing.md,
        paddingBottom: 32,
        backgroundColor: "rgba(0,0,0,0.92)",
        borderTopWidth: 1,
        borderTopColor: colors.border,
    },

    footerPriceBlock: {
        gap: 2,
    },

    footerPriceLabel: {
        color: colors.mutedDark,
        fontSize: 9,
        fontWeight: "900",
        letterSpacing: 1.5,
    },

    footerPrice: {
        color: colors.textStrong,
        fontSize: 22,
        fontWeight: "900",
        letterSpacing: -0.5,
    },

    footerButton: {
        flex: 1,
        minHeight: 52,
        borderRadius: radius.md,
        backgroundColor: colors.primary,
        alignItems: "center",
        justifyContent: "center",
    },

    footerButtonPressed: {
        opacity: 0.85,
        transform: [{ scale: 0.99 }],
    },

    footerButtonDisabled: {
        backgroundColor: colors.surfaceElevated,
        borderWidth: 1,
        borderColor: colors.border,
    },

    footerButtonText: {
        color: colors.white,
        fontSize: 15,
        fontWeight: "800",
    },

    /* =====================================================
       ACTIVE RENTAL — hero card
    ===================================================== */

    activeContent: {
        paddingHorizontal: spacing.lg,
        paddingTop: spacing.lg,
        paddingBottom: 60,
        gap: spacing.lg,
    },

    heroCard: {
        padding: spacing.lg,
        borderRadius: radius.lg,
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
        gap: spacing.md,
        ...shadows.elevated,
    },

    /* ---------- Image area ---------- */

    heroImageArea: {
        height: 200,
        borderRadius: radius.md,
        backgroundColor: colors.surfaceElevated,
        overflow: "hidden",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
    },

    heroImageGlow: {
        position: "absolute",
        width: "80%",
        height: "80%",
        borderRadius: 999,
        opacity: 0.5,
    },

    heroImage: {
        width: "70%",
        height: "70%",
    },

    /* ---------- State pill (top-left of image) ---------- */

    heroStatePill: {
        position: "absolute",
        top: 12,
        left: 12,
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: radius.pill,
        borderWidth: 1,
    },

    heroStateDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
    },

    heroStateText: {
        fontSize: 10,
        fontWeight: "900",
        letterSpacing: 1.2,
    },

    /* ---------- Lock badge (bottom-right of image) ---------- */

    heroLockBadge: {
        position: "absolute",
        right: 12,
        bottom: 12,
        width: 44,
        height: 44,
        borderRadius: 14,
        borderWidth: 1.5,
        alignItems: "center",
        justifyContent: "center",
    },

    /* ---------- Vault label ---------- */

    heroLabel: {
        gap: 2,
    },

    heroLabelCode: {
        color: colors.textStrong,
        fontSize: 22,
        fontWeight: "900",
        letterSpacing: -0.5,
    },

    heroLabelMeta: {
        color: colors.muted,
        fontSize: 13,
        fontWeight: "600",
    },

    /* ---------- Countdown ---------- */

    heroCountdownWrap: {
        alignItems: "center",
        gap: 2,
        marginTop: spacing.xs,
    },

    heroCountdown: {
        color: colors.textStrong,
        fontSize: 42,
        fontWeight: "900",
        letterSpacing: -1,
    },

    heroCountdownExpiring: {
        color: colors.warning,
    },

    heroCountdownExpired: {
        color: colors.danger,
    },

    heroCountdownLabel: {
        color: colors.mutedDark,
        fontSize: 11,
        fontWeight: "800",
        letterSpacing: 1.8,
        textTransform: "uppercase",
    },

    /* ---------- Progress ---------- */

    progressTrack: {
        width: "100%",
        height: 5,
        borderRadius: 3,
        backgroundColor: colors.border,
        overflow: "hidden",
    },

    progressFill: {
        height: "100%",
        borderRadius: 3,
    },

    /* =====================================================
       ACTIVE RENTAL — lock/unlock action button
    ===================================================== */

    actionButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
        minHeight: 58,
        borderRadius: radius.md,
    },

    actionButtonUnlock: {
        backgroundColor: colors.primary,
    },

    actionButtonLock: {
        backgroundColor: colors.success,
    },

    actionButtonPressed: {
        opacity: 0.88,
        transform: [{ scale: 0.99 }],
    },

    actionButtonDisabled: {
        opacity: 0.5,
    },

    actionButtonText: {
        color: colors.white,
        fontSize: 16,
        fontWeight: "800",
        letterSpacing: 0.3,
    },

    /* =====================================================
       ACTIVE RENTAL — device status
    ===================================================== */

    deviceCard: {
        padding: spacing.md,
        borderRadius: radius.lg,
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
        ...shadows.card,
    },

    deviceRow: {
        flexDirection: "row",
        alignItems: "center",
    },

    deviceItem: {
        flex: 1,
        alignItems: "center",
        gap: 5,
    },

    deviceDivider: {
        width: 1,
        height: 40,
        backgroundColor: colors.border,
    },

    deviceDot: {
        width: 14,
        height: 14,
        borderRadius: 7,
    },

    deviceLabel: {
        color: colors.mutedDark,
        fontSize: 10,
        fontWeight: "800",
        letterSpacing: 1.2,
        textTransform: "uppercase",
        marginTop: 3,
    },

    deviceValue: {
        color: colors.text,
        fontSize: 13,
        fontWeight: "800",
    },

    /* =====================================================
       ACTIVE RENTAL — info card
    ===================================================== */

    infoCard: {
        padding: spacing.md,
        borderRadius: radius.lg,
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
        gap: spacing.sm,
        ...shadows.card,
    },

    infoRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },

    infoLabel: {
        color: colors.muted,
        fontSize: 13,
        fontWeight: "600",
    },

    infoValue: {
        color: colors.text,
        fontSize: 13,
        fontWeight: "700",
    },

    infoValueStrong: {
        color: colors.textStrong,
        fontSize: 16,
        fontWeight: "900",
        letterSpacing: -0.3,
    },

    infoDivider: {
        height: 1,
        backgroundColor: colors.border,
        marginVertical: spacing.xs,
    },

    /* =====================================================
       ACTIVE RENTAL — activity log
    ===================================================== */

    activityEmpty: {
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: spacing.xl,
        paddingHorizontal: spacing.lg,
        borderRadius: radius.lg,
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
        borderStyle: "dashed",
        gap: spacing.sm,
    },

    activityEmptyText: {
        color: colors.mutedDark,
        fontSize: 13,
        textAlign: "center",
        fontWeight: "600",
    },

    activityCard: {
        borderRadius: radius.lg,
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
        overflow: "hidden",
        ...shadows.card,
    },

    activityRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        paddingVertical: 14,
        paddingHorizontal: spacing.md,
    },

    activityRowBorder: {
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },

    activityIcon: {
        width: 34,
        height: 34,
        borderRadius: 11,
        borderWidth: 1,
        alignItems: "center",
        justifyContent: "center",
    },

    activityTitle: {
        flex: 1,
        color: colors.text,
        fontSize: 14,
        fontWeight: "700",
    },

    activityTime: {
        color: colors.mutedDark,
        fontSize: 12,
        fontWeight: "700",
    },

    /* =====================================================
       RENTALS TAB — active rental row
    ===================================================== */

    activeDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: colors.success,
    },
});
