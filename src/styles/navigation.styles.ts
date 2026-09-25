import { Platform, StyleSheet } from "react-native";
import { colors } from "../constants/theme";

/* =========================================================
   STYLESHEET: NAVIGATION STYLES

   Shared visual styles for Vaulty's authenticated
   bottom-tab navigation.
========================================================= */

export const navigationStyles = StyleSheet.create({
    /* =====================================================
       TAB BAR
    ===================================================== */

    tabBar: {
        backgroundColor: colors.surface,
        borderTopWidth: 1,
        borderTopColor: colors.border,

        /*
         * Keep the tab bar comfortably sized on both
         * Android and iOS while allowing React Navigation
         * to handle device safe-area insets.
         */
        height: Platform.select({
            ios: 76,
            android: 68,
            default: 68,
        }),

        paddingTop: 7,

        paddingBottom: Platform.select({
            ios: 8,
            android: 6,
            default: 6,
        }),

        elevation: 12,

        shadowColor: colors.black,

        shadowOffset: {
            width: 0,
            height: -5,
        },

        shadowOpacity: 0.25,
        shadowRadius: 14,
    },

    /* =====================================================
       TAB ITEM
    ===================================================== */

    tabItem: {
        paddingTop: 2,
        paddingBottom: 2,
    },

    /* =====================================================
       TAB LABEL
    ===================================================== */

    tabLabel: {
        fontSize: 11,
        fontWeight: "800",
        letterSpacing: 0.2,
        marginTop: 1,
    },

    /* =====================================================
       TAB ICON
    ===================================================== */

    tabIcon: {
        marginTop: 1,
    },
});
