import { Image, Text, View } from "react-native";

import {
    avatarStyles as styles,
    getAvatarDimensions,
    getAvatarInitialsStyle,
} from "../styles/avatar.styles";

/* =========================================================
    TYPE: Props

    Defines the optional properties accepted by SRVAvatar.
========================================================= */

type Props = {
    size?: number;
    name?: string | null;
    imageUrl?: string | null;
};

/* =========================================================
COMPONENT: SRVAvatar

Displays a user's profile image when available and
automatically falls back to their initials when no
profile image exists.
========================================================= */
export default function SRVAvatar({ size = 52, name, imageUrl }: Props) {
    /* =====================================================
        GENERATE INITIALS

        Converts the user's name into a maximum of two
        uppercase initials.
    ===================================================== */

    const initials =
        name
            ?.trim()
            .split(/\s+/)
            .filter(Boolean)
            .map((part) => part.charAt(0))
            .join("")
            .slice(0, 2)
            .toUpperCase() || "SR";

    /* =====================================================
        DYNAMIC DIMENSIONS
    ===================================================== */

    const avatarDimensions = getAvatarDimensions(size);

    const initialsStyle = getAvatarInitialsStyle(size);

    return (
        <View style={[styles.container, avatarDimensions]}>
            {/* =================================================
                PROFILE IMAGE
            ================================================= */}

            {imageUrl ? (
                <Image
                    source={{
                        uri: imageUrl,
                    }}
                    style={styles.image}
                    resizeMode="cover"
                />
            ) : (
                /* =================================================
                    INITIALS FALLBACK
                ================================================= */

                <View style={[styles.fallback, avatarDimensions]}>
                    <Text style={[styles.initials, initialsStyle]}>
                        {initials}
                    </Text>
                </View>
            )}

            {/* =================================================
                PURPLE OUTER RING
            ================================================= */}

            <View style={[styles.ring, avatarDimensions]} />
        </View>
    );
}
