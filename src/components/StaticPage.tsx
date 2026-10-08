import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import { ReactNode } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";

import { colors } from "../constants/theme";
import { staticStyles as styles } from "../styles/static.styles";
import SRVBackground from "./SRVBackground";

type Props = {
    eyebrow: string;
    title: string;
    children: ReactNode;
};

export function StaticPage({ eyebrow, title, children }: Props) {
    return (
        <SRVBackground>
            <View style={styles.header}>
                <Pressable
                    onPress={() => router.back()}
                    hitSlop={8}
                    style={({ pressed }) => [
                        styles.headerIcon,
                        pressed && styles.headerIconPressed,
                    ]}
                >
                    <Ionicons name="arrow-back" size={20} color={colors.text} />
                </Pressable>

                <View style={styles.headerCopy}>
                    <Text style={styles.headerEyebrow}>{eyebrow}</Text>
                    <Text style={styles.headerTitle}>{title}</Text>
                </View>
            </View>

            <ScrollView
                style={styles.page}
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
            >
                {children}
            </ScrollView>
        </SRVBackground>
    );
}

export function Section({
    title,
    children,
}: {
    title: string;
    children: ReactNode;
}) {
    return (
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>{title}</Text>
            <View style={styles.sectionBody}>{children}</View>
        </View>
    );
}

export function Paragraph({ children }: { children: ReactNode }) {
    return <Text style={styles.paragraph}>{children}</Text>;
}

export function Bullet({ children }: { children: ReactNode }) {
    return (
        <View style={styles.bulletRow}>
            <View style={styles.bulletDot} />
            <Text style={styles.bulletText}>{children}</Text>
        </View>
    );
}
