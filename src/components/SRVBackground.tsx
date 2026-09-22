import type { ReactNode } from "react";
import { StyleSheet, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import { gradients } from "../constants/theme";

type Props = {
    children?: ReactNode;
};

export default function SRVBackground({ children }: Props) {
    return (
        <View style={styles.root}>
            <LinearGradient
                colors={gradients.background}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={StyleSheet.absoluteFill}
            />

            <View style={styles.content}>{children}</View>
        </View>
    );
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
    },

    content: {
        flex: 1,
    },
});
