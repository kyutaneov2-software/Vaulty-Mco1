import {
    Text,
    TextInput,
    TextInputProps,
    StyleSheet,
    View,
} from "react-native";

import { colors, radius, spacing } from "../constants/theme";

type Props = TextInputProps & {
    label: string;
};

export function AppInput({ label, ...props }: Props) {
    return (
        <View style={styles.wrapper}>
            <Text style={styles.label}>{label}</Text>

            <TextInput
                placeholderTextColor={colors.mutedDark}
                autoCapitalize="none"
                selectionColor={colors.gold}
                cursorColor={colors.gold}
                style={styles.input}
                {...props}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        gap: spacing.sm,
    },

    label: {
        color: colors.text,
        fontWeight: "700",
        fontSize: 14,
    },

    input: {
        minHeight: 54,
        borderRadius: radius.md,
        borderWidth: 1,
        borderColor: colors.border,
        backgroundColor: colors.surface,
        paddingHorizontal: spacing.md,
        fontSize: 16,
        color: colors.text,
    },
});
