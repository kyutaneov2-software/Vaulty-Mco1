import { ActivityIndicator, Pressable, Text, ViewStyle } from "react-native";

import { colors } from "../constants/theme";
import { buttonStyles as styles } from "../styles/button.styles";

/* =========================================================
   TYPE: Props

   Defines the properties accepted by the reusable
   AppButton component.
========================================================= */

type Props = {
    title: string;
    onPress: () => void;
    variant?: "primary" | "secondary" | "ghost" | "gold";
    loading?: boolean;
    style?: ViewStyle;
};

/* =========================================================
   COMPONENT: AppButton

   Renders a reusable Vaulty button supporting primary,
   secondary, ghost, and legacy accent variants.
========================================================= */
export function AppButton({
    title,
    onPress,
    variant = "primary",
    loading = false,
    style,
}: Props) {
    const isPrimary = variant === "primary";

    const isSecondary = variant === "secondary";

    const isGold = variant === "gold";

    /* =====================================================
       FUNCTION: getLoadingColor

       Determines the appropriate loading indicator color
       for the selected button variant.
    ===================================================== */
    const getLoadingColor = () => {
        if (isPrimary || isGold) {
            return colors.black;
        }

        return colors.text;
    };

    return (
        <Pressable
            onPress={onPress}
            disabled={loading}
            style={({ pressed }) => [
                styles.base,

                isPrimary && styles.primary,

                isSecondary && styles.secondary,

                isGold && styles.gold,

                variant === "ghost" && styles.ghost,

                pressed && styles.pressed,

                style,
            ]}
        >
            {/* =================================================
                LOADING STATE
            ================================================= */}

            {loading ? (
                <ActivityIndicator color={getLoadingColor()} />
            ) : (
                /* =============================================
                   BUTTON TEXT
                ============================================= */

                <Text
                    style={[
                        styles.text,

                        isSecondary && styles.secondaryText,

                        isGold && styles.goldText,

                        variant === "ghost" && styles.ghostText,
                    ]}
                >
                    {title}
                </Text>
            )}
        </Pressable>
    );
}
