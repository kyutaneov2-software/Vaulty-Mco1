import { ReactNode } from "react";
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
                start={{ x: 0.5, y: 0 }}
                end={{ x: 0.5, y: 1 }}
                locations={[0, 0.15, 0.4, 0.7, 1]}
                style={StyleSheet.absoluteFill}
            />

            <View style={styles.content}>{children}</View>
        </View>
    );
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: "#000000",
    },

    content: {
        flex: 1,
    },
});
