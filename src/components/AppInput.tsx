import { ReactNode, useState } from "react";

import {
    StyleSheet,
    Text,
    TextInput,
    TextInputProps,
    View,
} from "react-native";

import { colors, radius, spacing } from "../constants/theme";

type Props = TextInputProps & {
    label: string;
    rightElement?: ReactNode;
};

export function AppInput({ label, rightElement, style, ...props }: Props) {
    const [focused, setFocused] = useState(false);

    return (
        <View style={styles.wrapper}>
            <Text style={styles.label}>{label}</Text>

            <View style={[styles.inputContainer, focused && styles.focused]}>
                <TextInput
                    {...props}
                    style={[styles.input, style]}
                    placeholderTextColor={colors.mutedDark}
                    selectionColor={colors.gold}
                    cursorColor={colors.gold}
                    onFocus={(event) => {
                        setFocused(true);
                        props.onFocus?.(event);
                    }}
                    onBlur={(event) => {
                        setFocused(false);
                        props.onBlur?.(event);
                    }}
                />

                {rightElement}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        gap: spacing.sm,
    },

    label: {
        color: colors.text,
        fontSize: 14,
        fontWeight: "700",
    },

    inputContainer: {
        minHeight: 54,

        flexDirection: "row",
        alignItems: "center",

        borderRadius: radius.md,
        borderWidth: 1,
        borderColor: colors.border,

        backgroundColor: colors.surface,
    },

    focused: {
        borderColor: colors.gold,
    },

    input: {
        flex: 1,

        minHeight: 52,

        paddingHorizontal: spacing.md,

        color: colors.text,
        fontSize: 16,
    },
});
