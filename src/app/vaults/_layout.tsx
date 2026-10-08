import { Stack } from "expo-router";

export default function VaultsLayout() {
    return (
        <Stack
            screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: "transparent" },
            }}
        />
    );
}
