import { StyleSheet } from "react-native";
import { colors, radius, spacing } from "../constants/theme";

/* =========================================================
   STYLESHEET: PROFILE STYLES

   Shared styling for the authenticated Vaulty Profile
   screen and its reusable profile menu components.
========================================================= */

export const profileStyles = StyleSheet.create({
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
        alignItems: "center",
        justifyContent: "space-between",
    },

    headerCopy: {
        flex: 1,
    },

    eyebrow: {
        color: colors.primaryLight,
        fontSize: 10,
        fontWeight: "900",
        letterSpacing: 2.2,
        marginBottom: 4,
    },

    title: {
        color: colors.textStrong,
        fontSize: 28,
        fontWeight: "900",
    },

    subtitle: {
        color: colors.mutedDark,
        fontSize: 12,
        lineHeight: 18,
        marginTop: 6,
        paddingRight: 55,
    },

    headerLogoContainer: {
        width: 52,
        height: 52,
        borderRadius: 16,
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.borderPurple,
        alignItems: "center",
        justifyContent: "center",
        marginLeft: 12,
    },

    headerLogo: {
        width: 40,
        height: 40,
    },

    /* =====================================================
       PROFILE CARD
    ===================================================== */

    profileCard: {
        alignItems: "center",
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.borderStrong,
        borderRadius: radius.lg,
        padding: spacing.lg,
        shadowColor: colors.black,
        shadowOffset: {
            width: 0,
            height: 12,
        },
        shadowOpacity: 0.2,
        shadowRadius: 20,
        elevation: 6,
    },

    avatarButton: {
        position: "relative",
        marginBottom: 14,
    },

    avatarButtonPressed: {
        opacity: 0.8,
        transform: [
            {
                scale: 0.98,
            },
        ],
    },

    cameraButton: {
        position: "absolute",
        right: -2,
        bottom: -2,
        width: 32,
        height: 32,
        borderRadius: 12,
        backgroundColor: colors.primary,
        borderWidth: 2,
        borderColor: colors.surface,
        alignItems: "center",
        justifyContent: "center",
    },

    profileInfo: {
        alignItems: "center",
        gap: 5,
    },

    name: {
        color: colors.textStrong,
        fontSize: 20,
        fontWeight: "900",
    },

    email: {
        color: colors.muted,
        fontSize: 13,
    },

    activeBadge: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        backgroundColor: colors.successSoft,
        paddingVertical: 6,
        paddingHorizontal: 10,
        borderRadius: radius.pill,
        marginTop: 3,
        borderWidth: 1,
        borderColor: "rgba(94,227,154,0.18)",
    },

    activeDot: {
        width: 7,
        height: 7,
        borderRadius: 4,
        backgroundColor: colors.success,
    },

    activeText: {
        color: colors.success,
        fontSize: 11,
        fontWeight: "800",
    },

    changePhotoButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 7,
        marginTop: 17,
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: radius.pill,
        backgroundColor: colors.primarySoft,
        borderWidth: 1,
        borderColor: colors.borderPurple,
    },

    changePhotoPressed: {
        opacity: 0.75,
    },

    changePhotoDisabled: {
        opacity: 0.5,
    },

    changePhotoText: {
        color: colors.primaryLight,
        fontSize: 12,
        fontWeight: "800",
    },

    photoHint: {
        color: colors.mutedDark,
        fontSize: 11,
        lineHeight: 17,
        textAlign: "center",
        marginTop: -9,
        paddingHorizontal: 20,
    },

    /* =====================================================
       SECTIONS
    ===================================================== */

    section: {
        gap: 10,
    },

    sectionTitle: {
        color: colors.textStrong,
        fontSize: 18,
        fontWeight: "900",
    },

    /* =====================================================
       MENU
    ===================================================== */

    menuCard: {
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: radius.lg,
        overflow: "hidden",
    },

    menuItem: {
        minHeight: 72,
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: spacing.md,
        gap: 12,
    },

    menuPressed: {
        backgroundColor: colors.surfaceSoft,
    },

    menuIcon: {
        width: 42,
        height: 42,
        borderRadius: 13,
        backgroundColor: colors.primarySoft,
        borderWidth: 1,
        borderColor: colors.borderPurple,
        alignItems: "center",
        justifyContent: "center",
    },

    menuCopy: {
        flex: 1,
        gap: 3,
    },

    menuTitle: {
        color: colors.text,
        fontSize: 14,
        fontWeight: "800",
    },

    menuSubtitle: {
        color: colors.muted,
        fontSize: 12,
    },

    divider: {
        height: 1,
        backgroundColor: colors.border,
        marginLeft: 66,
    },

    /* =====================================================
       WALLET
    ===================================================== */

    walletCard: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: radius.lg,
        padding: spacing.md,
        gap: 12,
    },

    walletCardPressed: {
        backgroundColor: colors.surfaceSoft,
        opacity: 0.92,
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

    walletCopy: {
        flex: 1,
        gap: 3,
    },

    walletTitle: {
        color: colors.text,
        fontSize: 15,
        fontWeight: "800",
    },

    walletSubtitle: {
        color: colors.muted,
        fontSize: 12,
    },

    /* =====================================================
       LOGOUT
    ===================================================== */

    logoutButton: {
        minHeight: 54,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        backgroundColor: colors.dangerSoft,
        borderWidth: 1,
        borderColor: "rgba(255,107,129,0.40)",
        borderRadius: radius.md,
    },

    logoutPressed: {
        opacity: 0.75,
    },

    logoutDisabled: {
        opacity: 0.5,
    },

    logoutText: {
        color: colors.danger,
        fontSize: 15,
        fontWeight: "800",
    },

    /* =====================================================
       FOOTER
    ===================================================== */

    footer: {
        alignItems: "center",
        paddingTop: spacing.md,
        paddingBottom: 20,
    },

    version: {
        color: colors.primaryLight,
        textAlign: "center",
        fontSize: 12,
        fontWeight: "800",
        letterSpacing: 1.5,
    },

    versionNumber: {
        color: colors.mutedDark,
        textAlign: "center",
        fontSize: 11,
        marginTop: 4,
    },
});
