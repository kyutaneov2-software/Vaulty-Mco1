import { Image, StyleSheet, Text, View } from "react-native";
import { colors } from "../constants/theme";

type Props = {
    size?: number;
    showText?: boolean;
    subtitle?: string;
};

export default function SRVLogo({
    size = 100,
    showText = true,
    subtitle = "SMART RENTAL VAULT",
}: Props) {
    return (
        <View style={styles.wrapper}>
            <Image
                source={require("../../assets/images/srv-logo.png")}
                style={[
                    styles.logo,
                    {
                        width: size,
                        height: size,
                    },
                ]}
                resizeMode="contain"
            />

            {showText && (
                <View style={styles.textWrapper}>
                    <Text style={styles.title}>SRV</Text>
                    <Text style={styles.subtitle}>{subtitle}</Text>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        alignItems: "center",
        justifyContent: "center",
    },

    logo: {
        marginBottom: 4,
    },

    textWrapper: {
        alignItems: "center",
    },

    title: {
        color: colors.text,
        fontSize: 28,
        fontWeight: "800",
        letterSpacing: 6,
        marginLeft: 6,
    },

    subtitle: {
        color: colors.gold,
        fontSize: 10,
        fontWeight: "700",
        letterSpacing: 2.4,
        marginTop: 2,
    },
});
