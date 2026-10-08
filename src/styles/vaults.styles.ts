import { StyleSheet } from "react-native";
import { colors, radius, shadows, spacing } from "../constants/theme";

export const vaultsStyles = StyleSheet.create({
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
        paddingTop: spacing.md,
        paddingBottom: 40,
        gap: spacing.md,
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
       EMBEDDED MAP CARD (Home + Vaults browse preview)

       This is the small placeholder card that opens the
       full map. The actual MapView lives in a separate
       section below.
    ===================================================== */

    mapArea: {
        height: 220,
        borderRadius: radius.lg,
        backgroundColor: "#0D0D10",
        borderWidth: 1,
        borderColor: colors.border,
        overflow: "hidden",
        position: "relative",
        ...shadows.card,
    },

    mapAreaPressed: {
        opacity: 0.92,
    },

    mapPin: {
        position: "absolute",
        top: "25%",
        left: "25%",
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: colors.primary,
        shadowColor: colors.primary,
        shadowOpacity: 0.9,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 0 },
        elevation: 4,
    },

    mapBadge: {
        position: "absolute",
        bottom: 12,
        left: 12,
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        paddingVertical: 6,
        paddingHorizontal: 10,
        borderRadius: radius.pill,
        backgroundColor: "rgba(0,0,0,0.80)",
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

    mapExpand: {
        position: "absolute",
        top: 12,
        right: 12,
        width: 34,
        height: 34,
        borderRadius: 11,
        backgroundColor: "rgba(0,0,0,0.80)",
        borderWidth: 1,
        borderColor: colors.border,
        alignItems: "center",
        justifyContent: "center",
    },

    /* =====================================================
       FULL-SCREEN MAP
    ===================================================== */

    mapContainer: {
        flex: 1,
        position: "relative",
    },

    mapView: {
        flex: 1,
    },

    permissionBanner: {
        position: "absolute",
        top: 12,
        left: 12,
        right: 12,
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        paddingVertical: 10,
        paddingHorizontal: 14,
        borderRadius: radius.pill,
        backgroundColor: "rgba(0,0,0,0.85)",
        borderWidth: 1,
        borderColor: "rgba(244,201,93,0.35)",
    },

    permissionText: {
        flex: 1,
        color: colors.warning,
        fontSize: 12,
        fontWeight: "700",
    },

    /* =====================================================
       VAULT BOTTOM SHEET (map selection)
    ===================================================== */

    vaultSheet: {
        position: "absolute",
        left: spacing.md,
        right: spacing.md,
        bottom: spacing.lg,
        borderRadius: radius.lg,
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
        overflow: "hidden",
        ...shadows.elevated,
    },

    sheetBody: {
        padding: spacing.md,
        gap: spacing.md,
    },

    sheetBodyPressed: {
        backgroundColor: colors.surfaceElevated,
    },

    sheetHeader: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
    },

    sheetIcon: {
        width: 42,
        height: 42,
        borderRadius: 13,
        backgroundColor: colors.primaryFaint,
        borderWidth: 1,
        borderColor: colors.borderPurple,
        alignItems: "center",
        justifyContent: "center",
    },

    sheetCopy: {
        flex: 1,
        gap: 2,
    },

    sheetCode: {
        color: colors.textStrong,
        fontSize: 17,
        fontWeight: "800",
        letterSpacing: -0.2,
    },

    sheetMeta: {
        color: colors.muted,
        fontSize: 12,
        fontWeight: "600",
    },

    sheetDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
    },

    sheetStats: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: spacing.sm,
        borderRadius: radius.md,
        backgroundColor: colors.surfaceElevated,
    },

    sheetStat: {
        flex: 1,
        alignItems: "center",
        gap: 3,
    },

    sheetStatLabel: {
        color: colors.mutedDark,
        fontSize: 9,
        fontWeight: "900",
        letterSpacing: 1.2,
    },

    sheetStatValue: {
        color: colors.text,
        fontSize: 14,
        fontWeight: "800",
    },

    sheetDivider: {
        width: 1,
        height: 28,
        backgroundColor: colors.border,
    },

    sheetCta: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        minHeight: 46,
        borderRadius: radius.md,
        backgroundColor: colors.primary,
    },

    sheetCtaText: {
        color: colors.white,
        fontSize: 14,
        fontWeight: "800",
    },

    sheetClose: {
        position: "absolute",
        top: 10,
        right: 10,
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: colors.surfaceElevated,
        alignItems: "center",
        justifyContent: "center",
    },

    /* =====================================================
       FILTERS
    ===================================================== */

    filterRow: {
        gap: 8,
        paddingRight: spacing.lg,
    },

    filterPill: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: radius.pill,
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
    },

    filterPillActive: {
        backgroundColor: colors.primarySoft,
        borderColor: colors.primary,
    },

    filterPillPressed: {
        opacity: 0.85,
    },

    filterPillText: {
        color: colors.muted,
        fontSize: 13,
        fontWeight: "700",
    },

    filterPillTextActive: {
        color: colors.primaryLight,
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
    },

    /* =====================================================
       LIST
    ===================================================== */

    listHeader: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: spacing.sm,
    },

    listCount: {
        color: colors.muted,
        fontSize: 12,
        fontWeight: "700",
        letterSpacing: 1.2,
    },

    list: {
        gap: 10,
    },

    vaultRow: {
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

    vaultRowPressed: {
        opacity: 0.88,
        transform: [{ scale: 0.99 }],
    },

    vaultImageWrap: {
        width: 74,
        height: 74,
        borderRadius: 12,
        backgroundColor: colors.surfaceElevated,
        overflow: "hidden",
        alignItems: "center",
        justifyContent: "center",
    },

    vaultImage: {
        width: "100%",
        height: "100%",
    },

    vaultBody: {
        flex: 1,
        gap: 2,
    },

    vaultTitleRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },

    vaultCode: {
        color: colors.textStrong,
        fontSize: 15,
        fontWeight: "800",
        letterSpacing: -0.2,
    },

    vaultDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },

    vaultSize: {
        color: colors.muted,
        fontSize: 12,
        fontWeight: "600",
    },

    vaultMeta: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
        marginTop: 4,
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
        marginTop: 6,
    },

    vaultPrice: {
        color: colors.textStrong,
        fontSize: 16,
        fontWeight: "900",
        letterSpacing: -0.3,
    },

    vaultPriceUnit: {
        color: colors.mutedDark,
        fontSize: 11,
        fontWeight: "600",
    },

    /* =====================================================
       DETAIL — HERO
    ===================================================== */

    detailContent: {
        paddingHorizontal: spacing.lg,
        paddingTop: spacing.md,
        paddingBottom: 140,
        gap: spacing.lg,
    },

    detailHero: {
        height: 220,
        borderRadius: radius.lg,
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        ...shadows.card,
    },

    detailHeroImage: {
        width: "70%",
        height: "70%",
    },

    detailTitleBlock: {
        gap: 4,
    },

    detailCode: {
        color: colors.textStrong,
        fontSize: 30,
        fontWeight: "900",
        letterSpacing: -0.5,
    },

    detailSize: {
        color: colors.muted,
        fontSize: 14,
        fontWeight: "500",
    },

    /* =====================================================
       DEVICE STATUS
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
        gap: 6,
    },

    deviceDivider: {
        width: 1,
        height: 40,
        backgroundColor: colors.border,
    },

    deviceDot: {
        width: 16,
        height: 16,
        borderRadius: 8,
    },

    deviceLabel: {
        color: colors.mutedDark,
        fontSize: 10,
        fontWeight: "800",
        letterSpacing: 1.2,
        marginTop: 2,
    },

    deviceValue: {
        color: colors.text,
        fontSize: 13,
        fontWeight: "800",
    },

    /* =====================================================
       PRICING
    ===================================================== */

    sectionTitle: {
        color: colors.textStrong,
        fontSize: 16,
        fontWeight: "800",
        letterSpacing: -0.2,
        marginBottom: spacing.sm,
    },

    priceGrid: {
        gap: 8,
    },

    priceTile: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 14,
        borderRadius: radius.md,
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
    },

    priceTileLabel: {
        color: colors.muted,
        fontSize: 13,
        fontWeight: "700",
        flex: 1,
    },

    priceTileValue: {
        color: colors.textStrong,
        fontSize: 18,
        fontWeight: "900",
        letterSpacing: -0.3,
    },

    priceTileUnit: {
        color: colors.mutedDark,
        fontSize: 12,
        fontWeight: "600",
    },

    priceTileBadge: {
        marginLeft: 10,
        paddingVertical: 3,
        paddingHorizontal: 8,
        borderRadius: radius.pill,
        backgroundColor: colors.primaryFaint,
        borderWidth: 1,
        borderColor: colors.borderPurple,
    },

    priceTileBadgeText: {
        color: colors.primaryLight,
        fontSize: 9,
        fontWeight: "900",
        letterSpacing: 0.8,
    },

    /* =====================================================
       LOCATION
    ===================================================== */

    locationCard: {
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

    locationIcon: {
        width: 46,
        height: 46,
        borderRadius: 14,
        backgroundColor: colors.primaryFaint,
        borderWidth: 1,
        borderColor: colors.borderPurple,
        alignItems: "center",
        justifyContent: "center",
    },

    locationCopy: {
        flex: 1,
        gap: 2,
    },

    locationTitle: {
        color: colors.textStrong,
        fontSize: 14,
        fontWeight: "800",
    },

    locationText: {
        color: colors.muted,
        fontSize: 12,
    },

    /* =====================================================
       FOOTER CTA
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
        backgroundColor: "rgba(0,0,0,0.90)",
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

    footerPriceUnit: {
        color: colors.mutedDark,
        fontSize: 13,
        fontWeight: "600",
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
});
