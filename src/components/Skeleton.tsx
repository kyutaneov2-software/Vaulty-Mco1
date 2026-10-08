import { useEffect, useState } from "react";
import {
    DimensionValue,
    LayoutChangeEvent,
    StyleSheet,
    View,
    ViewStyle,
} from "react-native";
import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withTiming,
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";

import { colors } from "../constants/theme";

/* =========================================================
   COMPONENT: Skeleton

   A shimmering placeholder block. Composes into screen-level
   skeletons that mirror the real content layout.
========================================================= */

type Props = {
    width?: DimensionValue;
    height?: number;
    borderRadius?: number;
    style?: ViewStyle;
};

export function Skeleton({
    width = "100%",
    height = 16,
    borderRadius = 8,
    style,
}: Props) {
    const [blockWidth, setBlockWidth] = useState(0);
    const progress = useSharedValue(0);

    useEffect(() => {
        progress.value = withRepeat(
            withTiming(1, {
                duration: 1400,
                easing: Easing.inOut(Easing.ease),
            }),
            -1,
            false,
        );
    }, [progress]);

    const onLayout = (e: LayoutChangeEvent) => {
        setBlockWidth(e.nativeEvent.layout.width);
    };

    const shimmerStyle = useAnimatedStyle(() => {
        const travel = blockWidth || 300;
        return {
            transform: [
                {
                    translateX: progress.value * travel * 2 - travel,
                },
            ],
        };
    });

    return (
        <View
            onLayout={onLayout}
            style={[
                {
                    width,
                    height,
                    borderRadius,
                    backgroundColor: colors.surfaceElevated,
                    overflow: "hidden",
                },
                style,
            ]}
        >
            <Animated.View
                style={[StyleSheet.absoluteFill, shimmerStyle]}
                pointerEvents="none"
            >
                <LinearGradient
                    colors={[
                        "rgba(255,255,255,0)",
                        "rgba(255,255,255,0.07)",
                        "rgba(255,255,255,0)",
                    ]}
                    start={{ x: 0, y: 0.5 }}
                    end={{ x: 1, y: 0.5 }}
                    style={{ width: "100%", height: "100%" }}
                />
            </Animated.View>
        </View>
    );
}
