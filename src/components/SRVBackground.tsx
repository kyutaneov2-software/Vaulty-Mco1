import { ReactNode } from "react";
import { StyleSheet, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import { gradients } from "../constants/theme";

type Props = {
    children?: ReactNode;
};

/* =========================================================
    COMPONENT: SRVBackground

    Provides the shared Vaulty black-to-purple vertical
    background used throughout the application.
========================================================= */
export default function SRVBackground({ children }: Props) {
    return (
        <View style={styles.root}>
            <LinearGradient
                colors={gradients.background}
                start={{
                    x: 0.5,
                    y: 0,
                }}
                end={{
                    x: 0.5,
                    y: 1,
                }}
                locations={[0, 0.22, 0.48, 0.72, 1]}
                style={StyleSheet.absoluteFill}
            />

            {/* Subtle atmospheric purple glow */}
            <LinearGradient
                colors={[
                    "rgba(139,92,246,0.14)",
                    "rgba(139,92,246,0.03)",
                    "rgba(0,0,0,0)",
                ]}
                start={{
                    x: 0.5,
                    y: 0,
                }}
                end={{
                    x: 0.5,
                    y: 0.65,
                }}
                style={StyleSheet.absoluteFill}
            />

            <View style={styles.content}>{children}</View>
        </View>
    );
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: "#050407",
    },

    content: {
        flex: 1,
    },
});
