import Ionicons from "@expo/vector-icons/Ionicons";
import { Tabs } from "expo-router";

import { colors } from "../../constants/theme";
import { navigationStyles as styles } from "../../styles/navigation.styles";

type TabRoute = "index" | "rentals" | "wallet" | "profile";

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
        rentals: {
            focused: "cube",
            unfocused: "cube-outline",
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

export default function AppLayout() {
    return (
        <Tabs
            screenOptions={({ route }) => ({
                headerShown: false,

                tabBarActiveTintColor: colors.primaryLight,
                tabBarInactiveTintColor: colors.mutedDark,

                tabBarStyle: styles.tabBar,
                tabBarItemStyle: styles.tabItem,
                tabBarLabelStyle: styles.tabLabel,

                tabBarIcon: ({ color, focused }) => (
                    <Ionicons
                        name={getTabIcons(route.name as TabRoute, focused)}
                        size={22}
                        color={color}
                        style={styles.tabIcon}
                    />
                ),

                tabBarHideOnKeyboard: true,
            })}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: "Home",
                    tabBarAccessibilityLabel: "Home",
                }}
            />

            <Tabs.Screen
                name="rentals"
                options={{
                    title: "Rentals",
                    tabBarAccessibilityLabel: "Rentals",
                }}
            />

            <Tabs.Screen
                name="wallet"
                options={{
                    title: "Wallet",
                    tabBarAccessibilityLabel: "Wallet",
                }}
            />

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
