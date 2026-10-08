import { StyleSheet } from "react-native";
import { colors, radius, shadows, spacing } from "../constants/theme";

export const profileStyles = StyleSheet.create({
    /* =====================================================
       SHARED
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
       HERO CARD — horizontal layout, circular avatar
    ===================================================== */

    heroCard: {
        flexDirection: "row",
        alignItems: "center",
        gap: spacing.lg,
        padding: spacing.lg,
        borderRadius: radius.lg,
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
        ...shadows.elevated,
    },

    avatarWrap: {
        position: "relative",
        overflow: "visible",
    },

    avatarWrapPressed: {
        opacity: 0.85,
        transform: [{ scale: 0.97 }],
    },

    cameraBadge: {
        position: "absolute",
        right: -2,
        bottom: -2,
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: colors.primary,
        borderWidth: 3,
        borderColor: colors.surface,
        alignItems: "center",
        justifyContent: "center",
        shadowColor: colors.primary,
        shadowOpacity: 0.45,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 2 },
        elevation: 4,
    },

    uploadOverlay: {
        position: "absolute",
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0.65)",
        alignItems: "center",
        justifyContent: "center",
    },

    heroInfo: {
        flex: 1,
        gap: 3,
    },

    heroName: {
        color: colors.textStrong,
        fontSize: 19,
        fontWeight: "800",
        letterSpacing: -0.3,
    },

    heroEmail: {
        color: colors.muted,
        fontSize: 13,
    },

    statusPill: {
        flexDirection: "row",
        alignItems: "center",
        alignSelf: "flex-start",
        gap: 6,
        marginTop: spacing.xs,
        paddingVertical: 4,
        paddingHorizontal: 10,
        borderRadius: radius.pill,
        backgroundColor: colors.successSoft,
        borderWidth: 1,
        borderColor: "rgba(94,227,154,0.18)",
    },

    statusDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: colors.success,
    },

    statusText: {
        color: colors.success,
        fontSize: 10,
        fontWeight: "800",
        letterSpacing: 0.3,
    },

    /* =====================================================
       STATS
    ===================================================== */

    statsCard: {
        flexDirection: "row",
        alignItems: "center",
        borderRadius: radius.lg,
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
        paddingVertical: spacing.md,
        ...shadows.card,
    },

    statItem: {
        flex: 1,
        alignItems: "center",
        gap: 4,
    },

    statItemPressed: {
        opacity: 0.7,
    },

    statDivider: {
        width: 1,
        height: 34,
        backgroundColor: colors.border,
    },

    statValue: {
        color: colors.textStrong,
        fontSize: 22,
        fontWeight: "900",
        letterSpacing: -0.5,
    },

    statLabel: {
        color: colors.mutedDark,
        fontSize: 10,
        fontWeight: "800",
        letterSpacing: 1.4,
        textTransform: "uppercase",
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
       MENU
    ===================================================== */

    menuCard: {
        borderRadius: radius.lg,
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
        overflow: "hidden",
        ...shadows.card,
    },

    menuItem: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        paddingVertical: 14,
        paddingHorizontal: spacing.md,
    },

    menuPressed: {
        backgroundColor: colors.surfaceElevated,
    },

    menuIcon: {
        width: 38,
        height: 38,
        borderRadius: 12,
        backgroundColor: colors.primaryFaint,
        borderWidth: 1,
        borderColor: colors.borderPurple,
        alignItems: "center",
        justifyContent: "center",
    },

    menuTitle: {
        flex: 1,
        color: colors.text,
        fontSize: 14,
        fontWeight: "700",
    },

    divider: {
        height: 1,
        backgroundColor: colors.border,
        marginLeft: 66,
    },

    /* =====================================================
       LOGOUT
    ===================================================== */

    logoutRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        minHeight: 52,
        borderRadius: radius.md,
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
    },

    logoutRowPressed: {
        backgroundColor: colors.dangerSoft,
        borderColor: "rgba(255,107,129,0.40)",
    },

    logoutRowDisabled: {
        opacity: 0.5,
    },

    logoutText: {
        color: colors.danger,
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
