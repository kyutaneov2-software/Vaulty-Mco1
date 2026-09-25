import { ReactNode, useState } from "react";

import { Text, TextInput, TextInputProps, View } from "react-native";

import { colors } from "../constants/theme";
import { inputStyles as styles } from "../styles/input.styles";

/* =========================================================
   TYPE: Props

   Extends the native TextInput properties with a required
   label and an optional element displayed on the right.
========================================================= */

type Props = TextInputProps & {
    label: string;
    rightElement?: ReactNode;
};

/* =========================================================
   COMPONENT: AppInput

   Provides a reusable labeled text input with Vaulty's
   shared focus, typography, spacing, and color system.
========================================================= */
export function AppInput({ label, rightElement, style, ...props }: Props) {
    const [focused, setFocused] = useState(false);

    /* =====================================================
       FUNCTION: handleFocus

       Updates the input focus state and preserves any
       onFocus callback supplied by the parent.
    ===================================================== */
    const handleFocus = (
        event: Parameters<NonNullable<TextInputProps["onFocus"]>>[0],
    ) => {
        setFocused(true);

        props.onFocus?.(event);
    };

    /* =====================================================
       FUNCTION: handleBlur

       Clears the input focus state and preserves any
       onBlur callback supplied by the parent.
    ===================================================== */
    const handleBlur = (
        event: Parameters<NonNullable<TextInputProps["onBlur"]>>[0],
    ) => {
        setFocused(false);

        props.onBlur?.(event);
    };

    return (
        <View style={styles.wrapper}>
            {/* =================================================
                LABEL
            ================================================= */}

            <Text style={styles.label}>{label}</Text>

            {/* =================================================
                INPUT CONTAINER
            ================================================= */}

            <View style={[styles.inputContainer, focused && styles.focused]}>
                <TextInput
                    {...props}
                    style={[styles.input, style]}
                    placeholderTextColor={colors.mutedDark}
                    selectionColor={colors.primary}
                    cursorColor={colors.primary}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                />

                {/* =================================================
                    RIGHT ELEMENT
                ================================================= */}

                {rightElement}
            </View>
        </View>
    );
}
