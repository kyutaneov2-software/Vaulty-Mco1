import { Link } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, Text, View } from 'react-native';
import { AppButton } from '../components/AppButton';
import { AppInput } from '../components/AppInput';
import { colors, radius, spacing } from '../constants/theme';
import { useAuth } from '../context/AuthContext';

export default function LoginScreen() {
    const { signIn } = useAuth();
    const [email, setEmail] = useState('demo@srv.app');
    const [password, setPassword] = useState('password');
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        setLoading(true);
        await signIn(email.trim(), password);
        setLoading(false);
    };

    return (
        <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.content}>
            <View style={styles.logo}><Text style={styles.logoText}>SV</Text></View>
            <Text style={styles.title}>Welcome to SRV</Text>
            <Text style={styles.subtitle}>Smart Rental Vaults, accessible when you need them.</Text>

            <View style={styles.form}>
            <AppInput label="Email" value={email} onChangeText={setEmail} keyboardType="email-address" />
            <AppInput label="Password" value={password} onChangeText={setPassword} secureTextEntry />
            <AppButton title="Log in" onPress={handleLogin} loading={loading} />
            </View>

            <View style={styles.footer}>
            <Text style={styles.footerText}>New to SRV?</Text>
            <Link href="/register" style={styles.link}>Create an account</Link>
            </View>
        </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    content: { flex: 1, justifyContent: 'center', padding: spacing.lg, gap: spacing.md },
    logo: {
        width: 64, height: 64, borderRadius: 18, backgroundColor: colors.primary,
        alignItems: 'center', justifyContent: 'center', marginBottom: spacing.sm,
    },
    logoText: { color: colors.surface, fontSize: 24, fontWeight: '900' },
    title: { fontSize: 32, color: colors.text, fontWeight: '800' },
    subtitle: { color: colors.muted, fontSize: 16, lineHeight: 24, maxWidth: 360 },
    form: { gap: spacing.md, marginTop: spacing.md },
    footer: { flexDirection: 'row', justifyContent: 'center', gap: 6, marginTop: spacing.md },
    footerText: { color: colors.muted },
    link: { color: colors.primary, fontWeight: '700' },
});
