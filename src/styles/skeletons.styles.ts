import { StyleSheet } from "react-native";
import { colors, radius, shadows, spacing } from "../constants/theme";

export const skStyles = StyleSheet.create({
    fill: {
        flex: 1,
    },

    stickyHeader: {
        paddingTop: 56,
        paddingHorizontal: spacing.lg,
        paddingBottom: 12,
        backgroundColor: "rgba(0,0,0,0.80)",
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },

    headerRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
    },

    headerText: {
        flex: 1,
    },

    pillRow: {
        flexDirection: "row",
        marginTop: 12,
    },

    chipRow: {
        flexDirection: "row",
        gap: 8,
        marginTop: 4,
        marginBottom: 4,
    },

    topUpRow: {
        flexDirection: "row",
        gap: 8,
    },

    content: {
        paddingHorizontal: spacing.lg,
        paddingTop: spacing.lg,
        paddingBottom: 40,
        gap: spacing.lg,
    },

    card: {
        padding: spacing.md,
        borderRadius: radius.lg,
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
        ...shadows.card,
    },

    group: {
        borderRadius: radius.lg,
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
        overflow: "hidden",
        ...shadows.card,
    },

    divider: {
        height: 1,
        backgroundColor: colors.border,
        marginLeft: 60,
    },

    row: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        padding: 12,
    },

    rowTall: {
        padding: 10,
        borderRadius: radius.md,
        borderWidth: 1,
        borderColor: colors.border,
        backgroundColor: colors.surface,
        ...shadows.card,
    },

    rowBody: {
        flex: 1,
    },

    rowRight: {
        alignItems: "flex-end",
    },

    balanceTop: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
    },
    /* =====================================================
    ACTIVE RENTAL
 ===================================================== */

    heroSkeleton: {
        alignItems: "center",
        paddingVertical: 32,
        paddingHorizontal: spacing.lg,
        borderRadius: radius.lg,
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
        ...shadows.elevated,
    },

    deviceRow: {
        flexDirection: "row",
        alignItems: "center",
        padding: spacing.md,
        borderRadius: radius.lg,
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
        ...shadows.card,
    },

    deviceItem: {
        flex: 1,
        alignItems: "center",
    },

    deviceDivider: {
        width: 1,
        height: 40,
        backgroundColor: colors.border,
    },

    infoRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: 12,
        paddingHorizontal: spacing.md,
    },
});
