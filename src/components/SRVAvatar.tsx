import { Image, StyleSheet, Text, View } from "react-native";

import { colors } from "../constants/theme";

type Props = {
    size?: number;
    name?: string | null;
    imageUrl?: string | null;
};

export default function SRVAvatar({ size = 52, name, imageUrl }: Props) {
    const initials =
        name
            ?.trim()
            .split(/\s+/)
            .filter(Boolean)
            .map((part) => part.charAt(0))
            .join("")
            .slice(0, 2)
            .toUpperCase() || "SR";

    return (
        <View
            style={[
                styles.container,
                {
                    width: size,
                    height: size,
                    borderRadius: size / 2.6,
                },
            ]}
        >
            {imageUrl ? (
                <Image
                    source={{ uri: imageUrl }}
                    style={{
                        width: size,
                        height: size,
                        borderRadius: size / 2.6,
                    }}
                    resizeMode="cover"
                />
            ) : (
                <View
                    style={[
                        styles.fallback,
                        {
                            width: size,
                            height: size,
                            borderRadius: size / 2.6,
                        },
                    ]}
                >
                    <Text
                        style={[
                            styles.initials,
                            {
                                fontSize: Math.max(12, size * 0.3),
                            },
                        ]}
                    >
                        {initials}
                    </Text>
                </View>
            )}

            <View
                style={[
                    styles.goldRing,
                    {
                        width: size,
                        height: size,
                        borderRadius: size / 2.6,
                    },
                ]}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        overflow: "hidden",

        backgroundColor: colors.surface,

        borderWidth: 1,
        borderColor: colors.gold,

        alignItems: "center",
        justifyContent: "center",
    },

    fallback: {
        backgroundColor: colors.primarySoft,

        alignItems: "center",
        justifyContent: "center",
    },

    initials: {
        color: colors.goldLight,

        fontWeight: "900",

        letterSpacing: 1,
    },

    goldRing: {
        position: "absolute",

        borderWidth: 1.2,
        borderColor: colors.gold,

        opacity: 0.75,
    },
});
