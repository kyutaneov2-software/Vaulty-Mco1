import Ionicons from "@expo/vector-icons/Ionicons";
import { Tabs } from "expo-router";

import { colors } from "../../constants/theme";
import { navigationStyles as styles } from "../../styles/navigation.styles";

/* =========================================================
TYPE: TabRoute

Defines the supported authenticated application tabs.
========================================================= */

type TabRoute = "index" | "wallet" | "profile";

/* =========================================================
FUNCTION: getTabIcons

Returns the focused and unfocused Ionicons associated
with each Vaulty application tab.
========================================================= */
const getTabIcons = (
    route: TabRoute,
    focused: boolean,
): keyof typeof Ionicons.glyphMap => {
    const icons: Record<
        TabRoute,
        {
            focused: keyof typeof Ionicons.glyphMap;
            unfocused: keyof typeof Ionicons.glyphMap;
        }
    > = {
        index: {
            focused: "home",
            unfocused: "home-outline",
        },

        wallet: {
            focused: "wallet",
            unfocused: "wallet-outline",
        },

        profile: {
            focused: "person",
            unfocused: "person-outline",
        },
    };

    return focused ? icons[route].focused : icons[route].unfocused;
};

/* =========================================================
    FUNCTION: AppLayout

    Configures Vaulty's authenticated bottom-tab
    navigation shared by Android and iOS.
========================================================= */
export default function AppLayout() {
    return (
        <Tabs
            screenOptions={({ route }) => ({
                /* =============================================
                    HIDE NATIVE SCREEN HEADERS

                    Each Vaulty screen provides its own visual
                    header.
                ============================================= */

                headerShown: false,

                /* =============================================
                    TAB COLORS
                ============================================= */

                tabBarActiveTintColor: colors.primaryLight,

                tabBarInactiveTintColor: colors.mutedDark,

                /* =============================================
                TAB BAR
                ============================================= */

                tabBarStyle: styles.tabBar,

                /* =============================================
                    TAB ITEM
                ============================================= */

                tabBarItemStyle: styles.tabItem,

                /* =============================================
                    TAB LABEL
                ============================================= */

                tabBarLabelStyle: styles.tabLabel,

                /* =============================================
                    TAB ICON
                ============================================= */

                tabBarIcon: ({ color, focused }) => {
                    return (
                        <Ionicons
                            name={getTabIcons(route.name as TabRoute, focused)}
                            size={22}
                            color={color}
                            style={styles.tabIcon}
                        />
                    );
                },

                /* =============================================
                KEYBOARD BEHAVIOR

                Prevents the bottom tab bar from occupying
                the keyboard area when text input is active.
                ============================================= */

                tabBarHideOnKeyboard: true,
            })}
        >
            {/* =================================================
                HOME
            ================================================= */}

            <Tabs.Screen
                name="index"
                options={{
                    title: "Home",
                    tabBarAccessibilityLabel: "Home",
                }}
            />

            {/* =================================================
                WALLET
            ================================================= */}

            <Tabs.Screen
                name="wallet"
                options={{
                    title: "Wallet",
                    tabBarAccessibilityLabel: "Wallet",
                }}
            />

            {/* =================================================
                PROFILE
            ================================================= */}

            <Tabs.Screen
                name="profile"
                options={{
                    title: "Profile",
                    tabBarAccessibilityLabel: "Profile",
                }}
            />
        </Tabs>
    );
}
