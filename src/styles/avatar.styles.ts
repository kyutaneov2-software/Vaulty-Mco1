import { StyleSheet } from "react-native";
import { colors } from "../constants/theme";

/* =========================================================
   FUNCTION: getAvatarDimensions

   Generates the size-dependent styles used by SRVAvatar.
   Keeping these calculations here prevents visual styling
   logic from being duplicated inside the component.
========================================================= */
export const getAvatarDimensions = (size: number) => {
    return {
        width: size,
        height: size,
        borderRadius: size / 2.6,
    };
};

/* =========================================================
   FUNCTION: getAvatarInitialsStyle

   Generates the initials font size according to the
   current avatar size.
========================================================= */
export const getAvatarInitialsStyle = (size: number) => {
    return {
        fontSize: Math.max(12, size * 0.3),
    };
};

/* =========================================================
   STYLESHEET: AVATAR STYLES

   Shared visual styles for the reusable Vaulty avatar
   component.
========================================================= */

export const avatarStyles = StyleSheet.create({
    /* =====================================================
       CONTAINER
    ===================================================== */

    container: {
        overflow: "hidden",
        backgroundColor: colors.surface,
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
    },

    /* =====================================================
       IMAGE
    ===================================================== */

    image: {
        width: "100%",
        height: "100%",
    },

    /* =====================================================
       FALLBACK
    ===================================================== */

    fallback: {
        width: "100%",
        height: "100%",
        backgroundColor: colors.primarySoft,
        alignItems: "center",
        justifyContent: "center",
    },

    initials: {
        color: colors.primaryLight,
        fontWeight: "900",
        letterSpacing: 1,
    },

    /* =====================================================
       PURPLE RING
    ===================================================== */

    ring: {
        position: "absolute",
        left: 0,
        top: 0,
        borderWidth: 1.2,
        borderColor: colors.primaryLight,
        opacity: 0.75,
    },
});
