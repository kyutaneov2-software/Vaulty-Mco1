import { Pressable, StyleSheet, Text, View } from "react-native";

import Ionicons from "@expo/vector-icons/Ionicons";

import { colors, spacing } from "../constants/theme";

type Props = {
    checked: boolean;
    onPress: () => void;
    label: string;
};

export function FormCheckbox({ checked, onPress, label }: Props) {
    return (
        <Pressable
            onPress={onPress}
            style={({ pressed }) => [
                styles.container,
                pressed && styles.pressed,
            ]}
        >
            <View style={[styles.checkbox, checked && styles.checked]}>
                {checked ? (
                    <Ionicons name="checkmark" size={15} color={colors.black} />
                ) : null}
            </View>

            <Text style={styles.label}>{label}</Text>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        gap: spacing.sm,
    },

    checkbox: {
        width: 20,
        height: 20,

        borderRadius: 6,

        borderWidth: 1.5,
        borderColor: colors.borderStrong,

        alignItems: "center",
        justifyContent: "center",
    },

    checked: {
        backgroundColor: colors.gold,
        borderColor: colors.gold,
    },

    label: {
        color: colors.muted,
        fontSize: 14,
    },

    pressed: {
        opacity: 0.7,
    },
});
