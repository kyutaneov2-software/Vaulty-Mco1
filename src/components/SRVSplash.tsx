import { ActivityIndicator, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import SRVLogo from "./SRVLogo";
import { colors, gradients } from "../constants/theme";
import { splashStyles as styles } from "../styles/splash.styles";

export default function SRVSplash() {
    return (
        <View style={styles.container}>
            <LinearGradient
                colors={gradients.background}
                start={{ x: 0.5, y: 0 }}
                end={{ x: 0.5, y: 1 }}
                locations={[0, 0.22, 0.48, 0.72, 1]}
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                }}
            />

            <View style={styles.content}>
                <View style={styles.logoArea}>
                    <SRVLogo size={190} showText={true} />
                </View>

                <View style={styles.loaderContainer}>
                    <View style={styles.loaderRow}>
                        <ActivityIndicator
                            size="small"
                            color={colors.primaryLight}
                        />
                    </View>

                    <Text style={styles.loadingText}>
                        SECURE STORAGE. SIMPLIFIED.
                    </Text>

                    <Text style={styles.loadingSubtext}>
                        Preparing your Vaulty experience
                    </Text>
                </View>
            </View>

            <View style={styles.footer}>
                <View style={styles.footerLine} />

                <Text style={styles.footerTitle}>SMART RENTAL VAULT</Text>

                <Text style={styles.footerSubtitle}>VAULTY MOBILE</Text>
            </View>
        </View>
    );
}
