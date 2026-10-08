import { StyleSheet } from "react-native";
import { colors, radius, shadows, spacing } from "../constants/theme";

export const appStyles = StyleSheet.create({
    /* =====================================================
       STICKY HEADER
    ===================================================== */

    stickyHeader: {
        paddingTop: 56,
        paddingHorizontal: spacing.lg,
        paddingBottom: 12,
        backgroundColor: "rgba(0,0,0,0.80)",
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
        zIndex: 10,
    },

    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },

    headerBrand: {
        flexDirection: "row",
        alignItems: "center",
        flex: 1,
        gap: 12,
    },

    headerBrandPressed: {
        opacity: 0.8,
    },

    headerText: {
        flex: 1,
        gap: 1,
    },

    greeting: {
        color: colors.muted,
        fontSize: 13,
        fontWeight: "500",
    },

    name: {
        color: colors.textStrong,
        fontSize: 21,
        fontWeight: "800",
        letterSpacing: -0.3,
    },

    iconButton: {
        width: 42,
        height: 42,
        borderRadius: 14,
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
        alignItems: "center",
        justifyContent: "center",
    },

    iconButtonPressed: {
        backgroundColor: colors.surfaceElevated,
        transform: [{ scale: 0.96 }],
    },

    /* =====================================================
       QUICK PILLS
    ===================================================== */

    pillRow: {
        flexDirection: "row",
        gap: 8,
        marginTop: 12,
    },

    walletPill: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        paddingVertical: 8,
        paddingHorizontal: 14,
        borderRadius: radius.pill,
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
    },

    pillPressed: {
        backgroundColor: colors.surfaceElevated,
        opacity: 0.9,
    },

    walletPillValue: {
        color: colors.textStrong,
        fontSize: 14,
        fontWeight: "800",
        letterSpacing: -0.2,
    },

    walletPillUnit: {
        color: colors.mutedDark,
        fontSize: 11,
        fontWeight: "600",
    },

    /* =====================================================
       SCROLL CONTENT
    ===================================================== */

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
       FIND A VAULT — HERO
    ===================================================== */

    heroCard: {
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: radius.lg,
        padding: spacing.md,
        ...shadows.card,
    },

    heroHeader: {
        marginBottom: spacing.md,
    },

    heroEyebrow: {
        color: colors.primaryLight,
        fontSize: 10,
        fontWeight: "900",
        letterSpacing: 2,
        marginBottom: 4,
    },

    heroSubtitle: {
        color: colors.text,
        fontSize: 16,
        fontWeight: "700",
    },

    mapPreview: {
        height: 180,
        borderRadius: radius.md,
        backgroundColor: "#0D0D10",
        borderWidth: 1,
        borderColor: colors.border,
        overflow: "hidden",
        position: "relative",
    },

    mapPreviewPressed: {
        opacity: 0.9,
    },

    mapPin: {
        position: "absolute",
        width: 10,
        height: 10,
        borderRadius: 5,
        shadowColor: colors.primary,
        shadowOpacity: 0.8,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 0 },
        elevation: 4,
    },

    mapBadge: {
        position: "absolute",
        bottom: 10,
        left: 10,
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        paddingVertical: 6,
        paddingHorizontal: 10,
        borderRadius: radius.pill,
        backgroundColor: "rgba(0,0,0,0.75)",
        borderWidth: 1,
        borderColor: colors.border,
    },

    mapBadgeDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: colors.success,
    },

    mapBadgeText: {
        color: colors.text,
        fontSize: 11,
        fontWeight: "700",
    },

    heroButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        marginTop: spacing.md,
        minHeight: 46,
        borderRadius: radius.md,
        backgroundColor: colors.primary,
    },

    heroButtonPressed: {
        opacity: 0.85,
        transform: [{ scale: 0.99 }],
    },

    heroButtonText: {
        color: colors.white,
        fontSize: 14,
        fontWeight: "800",
    },

    /* =====================================================
       SECTION HEADERS
    ===================================================== */

    sectionHeader: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: spacing.sm,
    },

    sectionTitle: {
        color: colors.textStrong,
        fontSize: 18,
        fontWeight: "800",
        letterSpacing: -0.3,
    },

    seeAll: {
        flexDirection: "row",
        alignItems: "center",
        gap: 2,
    },

    seeAllText: {
        color: colors.primaryLight,
        fontSize: 13,
        fontWeight: "700",
    },

    /* =====================================================
       VAULT CARDS
    ===================================================== */

    vaultScroll: {
        gap: 10,
        paddingRight: spacing.lg,
    },

    vaultCard: {
        width: 160,
        padding: 10,
        borderRadius: radius.md,
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
        ...shadows.card,
    },

    vaultCardPressed: {
        opacity: 0.85,
        transform: [{ scale: 0.98 }],
    },

    vaultImageWrap: {
        width: "100%",
        height: 100,
        borderRadius: 12,
        backgroundColor: colors.surfaceElevated,
        overflow: "hidden",
        position: "relative",
        marginBottom: 10,
    },

    vaultImage: {
        width: "100%",
        height: "100%",
    },

    vaultDot: {
        position: "absolute",
        top: 8,
        right: 8,
        width: 8,
        height: 8,
        borderRadius: 4,
        borderWidth: 2,
        borderColor: colors.surface,
    },

    vaultCode: {
        color: colors.textStrong,
        fontSize: 15,
        fontWeight: "800",
        letterSpacing: -0.2,
    },

    vaultSize: {
        color: colors.muted,
        fontSize: 12,
        fontWeight: "600",
        marginTop: 2,
    },

    vaultMeta: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
        marginTop: 6,
    },

    vaultMetaText: {
        color: colors.mutedDark,
        fontSize: 11,
        fontWeight: "600",
    },

    vaultPriceRow: {
        flexDirection: "row",
        alignItems: "baseline",
        gap: 3,
        marginTop: 8,
    },

    vaultPrice: {
        color: colors.textStrong,
        fontSize: 18,
        fontWeight: "900",
        letterSpacing: -0.4,
    },

    vaultPriceUnit: {
        color: colors.mutedDark,
        fontSize: 11,
        fontWeight: "600",
    },

    /* =====================================================
       EMPTY RENTAL
    ===================================================== */

    emptyRentalCard: {
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

    emptyRentalIcon: {
        width: 46,
        height: 46,
        borderRadius: 14,
        backgroundColor: colors.primaryFaint,
        borderWidth: 1,
        borderColor: colors.borderPurple,
        alignItems: "center",
        justifyContent: "center",
    },

    emptyRentalCopy: {
        flex: 1,
        gap: 2,
    },

    emptyRentalTitle: {
        color: colors.textStrong,
        fontSize: 15,
        fontWeight: "800",
    },

    emptyRentalText: {
        color: colors.muted,
        fontSize: 12,
    },

    /* =====================================================
       HOW IT WORKS
    ===================================================== */

    stepsCard: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: spacing.md,
        borderRadius: radius.lg,
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
        ...shadows.card,
    },

    step: {
        alignItems: "center",
        gap: 6,
        flex: 1,
    },

    stepIcon: {
        width: 44,
        height: 44,
        borderRadius: 14,
        backgroundColor: colors.primaryFaint,
        borderWidth: 1,
        borderColor: colors.borderPurple,
        alignItems: "center",
        justifyContent: "center",
    },

    stepNumber: {
        color: colors.mutedDark,
        fontSize: 9,
        fontWeight: "900",
        letterSpacing: 1,
        marginTop: 2,
    },

    stepTitle: {
        color: colors.text,
        fontSize: 12,
        fontWeight: "700",
    },

    stepArrow: {
        paddingHorizontal: 4,
        marginBottom: 12,
    },

    /* =====================================================
       FOOTER
    ===================================================== */

    footer: {
        alignItems: "center",
        paddingTop: spacing.md,
        paddingBottom: 20,
    },

    footerText: {
        color: colors.mutedDark,
        fontSize: 11,
        fontWeight: "600",
        letterSpacing: 0.5,
    },

    /* =====================================================
       ACTIVE RENTAL CARD
    ===================================================== */

    activeRentalCard: {
        padding: spacing.md,
        borderRadius: radius.lg,
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.borderPurple,
        gap: spacing.md,
        ...shadows.elevated,
    },

    activeRentalCardPressed: {
        opacity: 0.92,
        transform: [{ scale: 0.99 }],
    },

    activeRentalTop: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
    },

    activeRentalIconWrap: {
        width: 42,
        height: 42,
        borderRadius: 13,
        backgroundColor: colors.primaryFaint,
        borderWidth: 1,
        borderColor: colors.borderPurple,
        alignItems: "center",
        justifyContent: "center",
    },

    activeRentalHeader: {
        flex: 1,
        gap: 2,
    },

    activeRentalEyebrow: {
        color: colors.primaryLight,
        fontSize: 10,
        fontWeight: "900",
        letterSpacing: 2,
    },

    activeRentalCode: {
        color: colors.textStrong,
        fontSize: 17,
        fontWeight: "800",
        letterSpacing: -0.2,
    },

    activeRentalCountdownWrap: {
        alignItems: "center",
        gap: 2,
    },

    activeRentalCountdown: {
        color: colors.textStrong,
        fontSize: 34,
        fontWeight: "900",
        letterSpacing: -1,
    },

    activeRentalCountdownLabel: {
        color: colors.mutedDark,
        fontSize: 10,
        fontWeight: "800",
        letterSpacing: 1.8,
        textTransform: "uppercase",
    },

    activeRentalProgressTrack: {
        width: "100%",
        height: 5,
        borderRadius: 3,
        backgroundColor: colors.border,
        overflow: "hidden",
    },

    activeRentalProgressFill: {
        height: "100%",
        borderRadius: 3,
        backgroundColor: colors.primary,
    },

    /* =====================================================
       NEARBY — compact list
    ===================================================== */

    nearbyList: {
        gap: 10,
    },

    nearbyRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        padding: 10,
        borderRadius: radius.md,
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
        ...shadows.card,
    },

    nearbyRowPressed: {
        opacity: 0.88,
        transform: [{ scale: 0.99 }],
    },

    nearbyRowImageWrap: {
        width: 64,
        height: 64,
        borderRadius: 12,
        backgroundColor: colors.surfaceElevated,
        overflow: "hidden",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
    },

    nearbyRowImage: {
        width: "100%",
        height: "100%",
    },

    nearbyRowDot: {
        position: "absolute",
        top: 6,
        right: 6,
        width: 8,
        height: 8,
        borderRadius: 4,
        borderWidth: 2,
        borderColor: colors.surface,
    },

    nearbyRowBody: {
        flex: 1,
        gap: 2,
    },

    nearbyRowRight: {
        alignItems: "flex-end",
        gap: 2,
        paddingRight: 4,
    },

    /* =====================================================
       NOTIFICATION BELL BADGE
    ===================================================== */

    bellBadge: {
        position: "absolute",
        top: 4,
        right: 4,
        minWidth: 16,
        height: 16,
        paddingHorizontal: 4,
        borderRadius: 8,
        backgroundColor: colors.danger,
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 2,
        borderColor: colors.surface,
    },

    bellBadgeText: {
        color: colors.white,
        fontSize: 9,
        fontWeight: "900",
        letterSpacing: -0.2,
    },

    /* =====================================================
       MAP PREVIEW — decorative layers
    ===================================================== */

    mapGrid: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },

    mapGridLine: {
        position: "absolute",
        height: 1,
        backgroundColor: "rgba(255,255,255,0.035)",
    },

    mapGridLineV: {
        position: "absolute",
        width: 1,
        backgroundColor: "rgba(255,255,255,0.035)",
    },

    mapRoad: {
        position: "absolute",
        backgroundColor: "rgba(139,92,246,0.10)",
    },

    mapRoadV: {
        position: "absolute",
        backgroundColor: "rgba(139,92,246,0.10)",
    },

    mapRoadDiag: {
        position: "absolute",
        top: "30%",
        left: "-20%",
        width: "140%",
        height: 2,
        backgroundColor: "rgba(139,92,246,0.07)",
        transform: [{ rotate: "-22deg" }],
    },

    mapBlock: {
        position: "absolute",
        backgroundColor: "#15151A",
        borderRadius: 2,
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.02)",
    },

    mapBlockDarker: {
        position: "absolute",
        backgroundColor: "#111116",
        borderRadius: 2,
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.02)",
    },

    mapPark: {
        position: "absolute",
        top: "54%",
        right: "6%",
        width: "20%",
        height: "22%",
        backgroundColor: "rgba(94,227,154,0.06)",
        borderRadius: 4,
        borderWidth: 1,
        borderColor: "rgba(94,227,154,0.10)",
    },

    mapWater: {
        position: "absolute",
        bottom: 0,
        left: 0,
        width: "22%",
        height: "14%",
        backgroundColor: "rgba(79,140,255,0.08)",
        borderTopRightRadius: 6,
        borderTopWidth: 1,
        borderRightWidth: 1,
        borderColor: "rgba(79,140,255,0.14)",
    },

    mapExpand: {
        position: "absolute",
        top: 10,
        right: 10,
        width: 30,
        height: 30,
        borderRadius: 10,
        backgroundColor: "rgba(0,0,0,0.75)",
        borderWidth: 1,
        borderColor: colors.border,
        alignItems: "center",
        justifyContent: "center",
    },
});
