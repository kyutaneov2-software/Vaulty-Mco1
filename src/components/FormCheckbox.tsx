import Ionicons from "@expo/vector-icons/Ionicons";
import { Pressable, Text, View } from "react-native";

import { colors } from "../constants/theme";
import { checkboxStyles as styles } from "../styles/checkbox.styles";

/* =========================================================
   TYPE: Props

   Defines the properties required by the reusable
   FormCheckbox component.
========================================================= */

type Props = {
    checked: boolean;
    onPress: () => void;
    label: string;
};

/* =========================================================
   COMPONENT: FormCheckbox

   Displays a tappable checkbox with a label for boolean
   form options such as "Remember me".
========================================================= */
export function FormCheckbox({ checked, onPress, label }: Props) {
    return (
        <Pressable
            onPress={onPress}
            style={({ pressed }) => [
                styles.container,
                pressed && styles.pressed,
            ]}
        >
            {/* =================================================
                CHECKBOX
            ================================================= */}

            <View style={[styles.checkbox, checked && styles.checked]}>
                {checked ? (
                    <Ionicons name="checkmark" size={15} color={colors.black} />
                ) : null}
            </View>

            {/* =================================================
                LABEL
            ================================================= */}

            <Text style={styles.label}>{label}</Text>
        </Pressable>
    );
}
