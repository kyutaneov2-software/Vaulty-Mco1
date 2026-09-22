import { router } from "expo-router";

import { Alert, StyleSheet, View } from "react-native";

import { AppButton } from "../../components/AppButton";
import SRVBackground from "../../components/SRVBackground";

import { useAuth } from "../../context/AuthContext";

export default function ProfileScreen() {
    const { signOut } = useAuth();

    const handleLogout = () => {
        Alert.alert("Log out", "Are you sure you want to log out?", [
            {
                text: "Cancel",
                style: "cancel",
            },
            {
                text: "Log out",
                style: "destructive",
                onPress: async () => {
                    await signOut();
                    router.replace("/login");
                },
            },
        ]);
    };

    return (
        <SRVBackground>
            <View style={styles.container}>
                <AppButton
                    title="Log out"
                    variant="secondary"
                    onPress={handleLogout}
                />
            </View>
        </SRVBackground>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "flex-end",
        padding: 24,
        paddingBottom: 32,
    },
});
