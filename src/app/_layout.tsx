import { Stack } from 'expo-router';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider, useAuth } from '../context/AuthContext';
import { colors } from '../constants/theme';

function RootNavigator() {
    const { user, isLoading } = useAuth();

    if (isLoading) {
        return (
        <View style={styles.loading}>
            <ActivityIndicator size="large" color={colors.primary} />
        </View>
        );
    }

    return (
        <>
        <StatusBar style="dark" />
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Protected guard={!!user}>
            <Stack.Screen name="(app)" />
            </Stack.Protected>

            <Stack.Protected guard={!user}>
            <Stack.Screen name="login" />
            <Stack.Screen name="register" />
            </Stack.Protected>
        </Stack>
        </>
    );
}

export default function RootLayout() {
    return (
        <AuthProvider>
        <RootNavigator />
        </AuthProvider>
    );
    }

    const styles = StyleSheet.create({
    loading: {
        flex: 1,
        backgroundColor: colors.background,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
