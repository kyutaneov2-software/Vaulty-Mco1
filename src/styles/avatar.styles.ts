import { StyleSheet } from "react-native";
import { colors } from "../constants/theme";

/* =========================================================
   FUNCTION: getAvatarDimensions

   Generates the size-dependent styles used by SRVAvatar.
   borderRadius is size / 2 so every avatar renders as a
   perfect circle regardless of size.
========================================================= */
export const getAvatarDimensions = (size: number) => {
    return {
        width: size,
        height: size,
        borderRadius: size / 2,
    };
};

/* =========================================================
   FUNCTION: getAvatarInitialsStyle

   Generates the initials font size according to the
   current avatar size.
========================================================= */
export const getAvatarInitialsStyle = (size: number) => {
    return {
        fontSize: Math.max(12, size * 0.32),
    };
};

/* =========================================================
   STYLESHEET: AVATAR STYLES
========================================================= */
export const avatarStyles = StyleSheet.create({
    container: {
        overflow: "hidden",
        backgroundColor: colors.surfaceElevated,
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
    },

    image: {
        width: "100%",
        height: "100%",
    },

    fallback: {
        width: "100%",
        height: "100%",
        backgroundColor: colors.primaryFaint,
        alignItems: "center",
        justifyContent: "center",
    },

    initials: {
        color: colors.primaryLight,
        fontWeight: "900",
        letterSpacing: 1,
    },

    ring: {
        position: "absolute",
        left: 0,
        top: 0,
        borderWidth: 1,
        borderColor: colors.borderPurple,
        opacity: 0.6,
    },
});
