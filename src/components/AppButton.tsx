import {
    ActivityIndicator,
    Pressable,
    StyleSheet,
    Text,
    ViewStyle,
} from "react-native";

import { colors, radius, spacing } from "../constants/theme";

type Props = {
    title: string;
    onPress: () => void;
    variant?: "primary" | "secondary" | "ghost" | "gold";
    loading?: boolean;
    style?: ViewStyle;
};

export function AppButton({
    title,
    onPress,
    variant = "primary",
    loading = false,
    style,
}: Props) {
    const isPrimary = variant === "primary";
    const isSecondary = variant === "secondary";
    const isGold = variant === "gold";

    return (
        <Pressable
            onPress={onPress}
            disabled={loading}
            style={({ pressed }) => [
                styles.base,

                isPrimary && styles.primary,
                isSecondary && styles.secondary,
                isGold && styles.gold,
                variant === "ghost" && styles.ghost,

                pressed && styles.pressed,
                style,
            ]}
        >
            {loading ? (
                <ActivityIndicator
                    color={isPrimary || isGold ? colors.black : colors.text}
                />
            ) : (
                <Text
                    style={[
                        styles.text,

                        isSecondary && styles.secondaryText,
                        isGold && styles.goldText,
                        variant === "ghost" && styles.ghostText,
                    ]}
                >
                    {title}
                </Text>
            )}
        </Pressable>
    );
}

const styles = StyleSheet.create({
    base: {
        minHeight: 52,
        borderRadius: radius.md,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: spacing.lg,
    },

    primary: {
        backgroundColor: colors.primary,
        borderWidth: 1,
        borderColor: colors.primary,
    },

    secondary: {
        backgroundColor: colors.surfaceSoft,
        borderWidth: 1,
        borderColor: colors.borderStrong,
    },

    gold: {
        backgroundColor: colors.gold,
        borderWidth: 1,
        borderColor: colors.goldLight,
    },

    ghost: {
        backgroundColor: colors.transparent,
    },

    pressed: {
        opacity: 0.8,
        transform: [{ scale: 0.99 }],
    },

    text: {
        color: colors.white,
        fontWeight: "800",
        fontSize: 16,
    },

    secondaryText: {
        color: colors.text,
    },

    goldText: {
        color: colors.black,
    },

    ghostText: {
        color: colors.goldLight,
    },
});
