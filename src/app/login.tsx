
import { router } from 'expo-router';
import { useState } from 'react';

import {
KeyboardAvoidingView,
Platform,
ScrollView,
StyleSheet,
Text,
View,
} from 'react-native';

import { AppButton } from '../components/AppButton';
import { AppInput } from '../components/AppInput';
import SRVBackground from '../components/SRVBackground';

import {
colors,
radius,
spacing,
} from '../constants/theme';

import { useAuth } from '../context/AuthContext';

export default function LoginScreen() {
const { signIn } = useAuth();

const [email, setEmail] = useState('');
const [password, setPassword] = useState('');

const [loading, setLoading] = useState(false);
const [error, setError] = useState('');

const handleLogin = async () => {
    setError('');

    if (!email.trim() || !password) {
    setError('Please enter your email and password.');
    return;
    }

    try {
    setLoading(true);

    await signIn(
        email.trim(),
        password,
    );
    } catch (error) {
    setError(
        error instanceof Error
        ? error.message
        : 'Unable to log in.',
    );
    } finally {
    setLoading(false);
    }
};

return (
    <SRVBackground>
    <KeyboardAvoidingView
        style={styles.container}
        behavior={
        Platform.OS === 'ios'
            ? 'padding'
            : undefined
        }
    >
        <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        >
        {/* BRAND */}
        <View style={styles.brandBlock}>
            <View style={styles.logo}>
            <Text style={styles.logoText}>
                SRV
            </Text>
            </View>

            <Text style={styles.eyebrow}>
            SMART RENTAL VAULT
            </Text>
        </View>

        {/* HEADING */}
        <View style={styles.headingBlock}>
            <Text style={styles.title}>
            Welcome back.
            </Text>

            <Text style={styles.subtitle}>
            Sign in to access your Smart Rental
            Vault account.
            </Text>
        </View>

        {/* FORM */}
        <View style={styles.form}>
            <AppInput
            label="Email"
            value={email}
            onChangeText={(value) => {
                setEmail(value);
                setError('');
            }}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            autoComplete="email"
            placeholder="you@example.com"
            />

            <AppInput
            label="Password"
            value={password}
            onChangeText={(value) => {
                setPassword(value);
                setError('');
            }}
            secureTextEntry
            autoCapitalize="none"
            autoCorrect={false}
            autoComplete="password"
            placeholder="Enter your password"
            />

            {/* ERROR */}
            {error ? (
            <View style={styles.errorBox}>
                <Text style={styles.errorText}>
                {error}
                </Text>
            </View>
            ) : null}

            {/* LOGIN */}
            <AppButton
            title="Log in"
            onPress={handleLogin}
            loading={loading}
            />
        </View>

        {/* REGISTER */}
        <View style={styles.footer}>
            <Text style={styles.footerText}>
            Don't have an account?
            </Text>

            <Text
            style={styles.link}
            onPress={() => router.replace('/register')}
            >
            Create an account
            </Text>
        </View>
        </ScrollView>
    </KeyboardAvoidingView>
    </SRVBackground>
);
}

const styles = StyleSheet.create({
container: {
    flex: 1,
},

content: {
    flexGrow: 1,
    justifyContent: 'center',

    paddingHorizontal: spacing.lg,
    paddingVertical: 40,
},

/* BRAND */

brandBlock: {
    alignItems: 'flex-start',
    gap: 12,

    marginBottom: 30,
},

logo: {
    width: 68,
    height: 68,

    borderRadius: radius.md,

    backgroundColor: colors.surface,

    borderWidth: 1.5,
    borderColor: colors.gold,

    alignItems: 'center',
    justifyContent: 'center',
},

logoText: {
    color: colors.goldLight,

    fontSize: 18,
    fontWeight: '900',

    letterSpacing: 1.5,
},

eyebrow: {
    color: colors.gold,

    fontSize: 11,
    fontWeight: '900',

    letterSpacing: 2.3,
},

/* HEADING */

headingBlock: {
    gap: 8,

    marginBottom: 26,
},

title: {
    color: colors.textStrong,

    fontSize: 34,
    lineHeight: 40,

    fontWeight: '900',
},

subtitle: {
    color: colors.muted,

    fontSize: 15,
    lineHeight: 23,

    maxWidth: 360,
},

/* FORM */

form: {
    gap: spacing.md,
},

errorBox: {
    backgroundColor: colors.dangerSoft,

    borderWidth: 1,
    borderColor: colors.danger,

    borderRadius: radius.md,

    padding: spacing.md,
},

errorText: {
    color: colors.danger,

    fontSize: 14,
    lineHeight: 20,

    fontWeight: '600',
},

/* FOOTER */

footer: {
    flexDirection: 'row',

    justifyContent: 'center',
    alignItems: 'center',

    gap: 6,

    marginTop: spacing.xl,
},

footerText: {
    color: colors.muted,

    fontSize: 14,
},

link: {
    color: colors.goldLight,

    fontSize: 14,

    fontWeight: '800',
},
});
