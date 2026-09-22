import { Link } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, Text, View } from 'react-native';
import { AppButton } from '../components/AppButton';
import { AppInput } from '../components/AppInput';
import { colors, spacing } from '../constants/theme';
import { useAuth } from '../context/AuthContext';

export default function RegisterScreen() {
    const { signUp } = useAuth();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleRegister = async () => {
        if (!name.trim() || !email.trim() || !password.trim()) return;
        setLoading(true);
        await signUp(name.trim(), email.trim(), password);
        setLoading(false);
    };

    return (
        <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.content}>
            <Text style={styles.eyebrow}>SMART RENTAL VAULT</Text>
            <Text style={styles.title}>Create your SRV account</Text>
            <Text style={styles.subtitle}>Your account will eventually connect to the SRV backend and wallet service.</Text>

            <View style={styles.form}>
            <AppInput label="Full name" value={name} onChangeText={setName} autoCapitalize="words" />
            <AppInput label="Email" value={email} onChangeText={setEmail} keyboardType="email-address" />
            <AppInput label="Password" value={password} onChangeText={setPassword} secureTextEntry />
            <AppButton title="Create account" onPress={handleRegister} loading={loading} />
            </View>

            <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account?</Text>
            <Link href="/login" style={styles.link}>Log in</Link>
            </View>
        </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    content: { flex: 1, justifyContent: 'center', padding: spacing.lg, gap: spacing.md },
    eyebrow: { color: colors.primary, fontWeight: '800', letterSpacing: 1.2, fontSize: 12 },
    title: { fontSize: 30, color: colors.text, fontWeight: '800' },
    subtitle: { color: colors.muted, fontSize: 15, lineHeight: 23 },
    form: { gap: spacing.md, marginTop: spacing.sm },
    footer: { flexDirection: 'row', justifyContent: 'center', gap: 6, marginTop: spacing.md },
    footerText: { color: colors.muted },
    link: { color: colors.primary, fontWeight: '700' },
});
