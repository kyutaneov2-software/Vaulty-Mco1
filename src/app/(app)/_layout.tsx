import Ionicons from "@expo/vector-icons/Ionicons";
import { Tabs } from "expo-router";

import { colors } from "../../constants/theme";

export default function AppLayout() {
    return (
        <Tabs
            screenOptions={({ route }) => ({
                headerShown: false,

                tabBarActiveTintColor: colors.goldLight,
                tabBarInactiveTintColor: colors.mutedDark,

                tabBarStyle: {
                    height: 72,

                    paddingTop: 8,
                    paddingBottom: 10,

                    backgroundColor: colors.surface,

                    borderTopWidth: 1,
                    borderTopColor: colors.border,
                },

                tabBarLabelStyle: {
                    fontSize: 12,
                    fontWeight: "700",
                },

                tabBarIcon: ({ color, size }) => {
                    const icons: Record<
                        string,
                        keyof typeof Ionicons.glyphMap
                    > = {
                        index: "home-outline",
                        wallet: "wallet-outline",
                        profile: "person-outline",
                    };

                    return (
                        <Ionicons
                            name={icons[route.name] ?? "ellipse-outline"}
                            size={size}
                            color={color}
                        />
                    );
                },
            })}
        >
            <Tabs.Screen name="index" options={{ title: "Home" }} />

            <Tabs.Screen name="wallet" options={{ title: "Wallet" }} />

            <Tabs.Screen name="profile" options={{ title: "Profile" }} />
        </Tabs>
    );
}
