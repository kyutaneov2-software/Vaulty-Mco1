import { useState } from "react";

import { Pressable, StyleSheet } from "react-native";

import Ionicons from "@expo/vector-icons/Ionicons";

import { AppInput } from "./AppInput";

import { colors } from "../constants/theme";

type Props = {
    label: string;
    value: string;
    onChangeText: (value: string) => void;
    placeholder?: string;
    autoComplete?: "password" | "new-password";
    error?: boolean;
};

export function PasswordInput({
    label,
    value,
    onChangeText,
    placeholder,
    autoComplete,
    error = false,
}: Props) {
    const [visible, setVisible] = useState(false);

    return (
        <AppInput
            label={label}
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder}
            secureTextEntry={!visible}
            autoCapitalize="none"
            autoCorrect={false}
            autoComplete={autoComplete}
            rightElement={
                <Pressable
                    onPress={() => setVisible((value) => !value)}
                    hitSlop={10}
                    style={styles.button}
                >
                    <Ionicons
                        name={visible ? "eye-off-outline" : "eye-outline"}
                        size={21}
                        color={error ? colors.danger : colors.muted}
                    />
                </Pressable>
            }
        />
    );
}

const styles = StyleSheet.create({
    button: {
        paddingHorizontal: 14,
    },
});
