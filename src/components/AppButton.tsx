import { ActivityIndicator, Pressable, StyleSheet, Text, ViewStyle } from 'react-native';
import { colors, radius, spacing } from '../constants/theme';

type Props = {
    title: string;
    onPress: () => void;
    variant?: 'primary' | 'secondary' | 'ghost';
    loading?: boolean;
    style?: ViewStyle;
};

export function AppButton({ title, onPress, variant = 'primary', loading, style }: Props) {
    const isPrimary = variant === 'primary';
    const isSecondary = variant === 'secondary';

    return (
        <Pressable
        onPress={onPress}
        disabled={loading}
        style={({ pressed }) => [
            styles.base,
            isPrimary && styles.primary,
            isSecondary && styles.secondary,
            variant === 'ghost' && styles.ghost,
            pressed && styles.pressed,
            style,
        ]}
        >
        {loading ? (
            <ActivityIndicator color={isPrimary ? colors.surface : colors.primary} />
        ) : (
            <Text style={[styles.text, !isPrimary && styles.secondaryText]}>{title}</Text>
        )}
        </Pressable>
    );
}

const styles = StyleSheet.create({
    base: {
        minHeight: 52,
        borderRadius: radius.md,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: spacing.lg,
    },
    primary: { backgroundColor: colors.primary },
    secondary: {
        backgroundColor: colors.softBlue,
        borderWidth: 1,
        borderColor: '#D4E3FF',
    },
    ghost: { backgroundColor: 'transparent' },
    pressed: { opacity: 0.85 },
    text: { color: colors.surface, fontWeight: '700', fontSize: 16 },
    secondaryText: { color: colors.primary },
});
