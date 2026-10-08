import { StyleSheet } from "react-native";
import { colors, radius, shadows, spacing } from "../constants/theme";

export const rentalsStyles = StyleSheet.create({
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
        gap: spacing.lg,
    },

    /* =====================================================
       HEADER
    ===================================================== */

    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingTop: 56,
        paddingHorizontal: spacing.lg,
        paddingBottom: 12,
        backgroundColor: "rgba(0,0,0,0.80)",
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
        zIndex: 10,
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

    /* =====================================================
       FILTER CHIPS
    ===================================================== */

    filterRow: {
        flexDirection: "row",
        gap: 8,
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
        backgroundColor: "rgba(0,0,0,0.80)",
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
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
        backgroundColor: colors.primaryFaint,
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

    sectionEyebrow: {
        color: colors.mutedDark,
        fontSize: 10,
        fontWeight: "900",
        letterSpacing: 2,
        marginLeft: 4,
    },

    /* =====================================================
       LIVE PILL
    ===================================================== */

    livePill: {
        flexDirection: "row",
        alignItems: "center",
        gap: 5,
        paddingVertical: 4,
        paddingHorizontal: 10,
        borderRadius: radius.pill,
        backgroundColor: colors.successSoft,
        borderWidth: 1,
        borderColor: "rgba(94,227,154,0.20)",
    },

    liveDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: colors.success,
    },

    liveText: {
        color: colors.success,
        fontSize: 10,
        fontWeight: "800",
        letterSpacing: 0.5,
    },

    /* =====================================================
       ACTIVE CARD
    ===================================================== */

    activeCard: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        padding: spacing.md,
        borderRadius: radius.lg,
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.borderPurple,
        ...shadows.elevated,
    },

    activeCardPressed: {
        opacity: 0.9,
        transform: [{ scale: 0.99 }],
    },

    activeIcon: {
        width: 46,
        height: 46,
        borderRadius: 14,
        backgroundColor: colors.primaryFaint,
        borderWidth: 1,
        borderColor: colors.borderPurple,
        alignItems: "center",
        justifyContent: "center",
    },

    activeBody: {
        flex: 1,
        gap: 3,
    },

    activeCode: {
        color: colors.textStrong,
        fontSize: 17,
        fontWeight: "800",
        letterSpacing: -0.2,
    },

    activeMeta: {
        color: colors.muted,
        fontSize: 12,
        fontWeight: "600",
    },

    activeStatus: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        marginTop: 3,
    },

    activeDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: colors.success,
    },

    activeStatusText: {
        color: colors.success,
        fontSize: 12,
        fontWeight: "800",
        letterSpacing: 0.2,
    },

    /* =====================================================
       DATE HEADERS
    ===================================================== */

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

    /* =====================================================
       HISTORY
    ===================================================== */

    historyCard: {
        borderRadius: radius.lg,
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
        overflow: "hidden",
        ...shadows.card,
    },

    historyRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        paddingVertical: 14,
        paddingHorizontal: spacing.md,
    },

    historyRowBorder: {
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },

    historyRowPressed: {
        backgroundColor: colors.surfaceElevated,
    },

    historyIcon: {
        width: 38,
        height: 38,
        borderRadius: 12,
        backgroundColor: colors.surfaceElevated,
        borderWidth: 1,
        borderColor: colors.border,
        alignItems: "center",
        justifyContent: "center",
    },

    historyBody: {
        flex: 1,
        gap: 2,
    },

    historyCode: {
        color: colors.text,
        fontSize: 14,
        fontWeight: "800",
    },

    historyMeta: {
        color: colors.mutedDark,
        fontSize: 11,
        fontWeight: "600",
    },

    historyRight: {
        alignItems: "flex-end",
        gap: 4,
    },

    historyPrice: {
        color: colors.text,
        fontSize: 14,
        fontWeight: "900",
        letterSpacing: -0.3,
    },

    statusPill: {
        paddingVertical: 3,
        paddingHorizontal: 8,
        borderRadius: radius.pill,
    },

    statusText: {
        fontSize: 9,
        fontWeight: "900",
        letterSpacing: 1,
        textTransform: "uppercase",
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

    emptyButton: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        marginTop: spacing.lg,
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: radius.md,
        backgroundColor: colors.primary,
    },

    emptyButtonPressed: {
        opacity: 0.85,
        transform: [{ scale: 0.98 }],
    },

    emptyButtonText: {
        color: colors.white,
        fontSize: 14,
        fontWeight: "800",
    },

    /* =====================================================
       FOOTER
    ===================================================== */

    footer: {
        alignItems: "center",
        paddingTop: spacing.sm,
        paddingBottom: spacing.md,
    },

    footerText: {
        color: colors.mutedDark,
        fontSize: 11,
        fontWeight: "600",
        letterSpacing: 0.5,
    },
});
