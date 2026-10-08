import Ionicons from "@expo/vector-icons/Ionicons";
import * as ImagePicker from "expo-image-picker";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Pressable,
    ScrollView,
    Text,
    View,
} from "react-native";

import SRVBackground from "../../components/SRVBackground";
import SRVAvatar from "../../components/SRVAvatar";
import { colors } from "../../constants/theme";
import { useAuth } from "../../context/AuthContext";
import { useNotice } from "../../context/NoticeContext";
import { useWallet } from "../../context/WalletContext";
import {
    getMyProfile,
    uploadMyProfileAvatar,
} from "../../services/profileService";
import { getAllRentals } from "../../services/vaultService";
import { profileStyles as styles } from "../../styles/profile.styles";

/* =========================================================
   CONSTANT: AVATAR_SIZE
========================================================= */
const AVATAR_SIZE = 96;

export default function ProfileScreen() {
    const { user, signOut } = useAuth();
    const { showSuccessNotice } = useNotice();
    const { balance, refresh: refreshWallet } = useWallet();

    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
    const [activeCount, setActiveCount] = useState(0);
    const [totalCount, setTotalCount] = useState(0);
    const [uploading, setUploading] = useState(false);
    const [loggingOut, setLoggingOut] = useState(false);

    /* =====================================================
       FUNCTION: loadProfile
    ===================================================== */
    const loadProfile = useCallback(async () => {
        try {
            const [profile, rentals] = await Promise.all([
                getMyProfile(),
                getAllRentals().catch(() => []),
            ]);

            setAvatarUrl(profile.avatarUrl);
            setTotalCount(rentals.length);

            const now = Date.now();
            const active = rentals.filter(
                (r) =>
                    r.status === "active" &&
                    new Date(r.expiresAt).getTime() > now,
            ).length;
            setActiveCount(active);
        } catch (error) {
            console.error("Failed to load profile:", error);
        }
    }, []);

    useFocusEffect(
        useCallback(() => {
            loadProfile();
            refreshWallet();
        }, [loadProfile, refreshWallet]),
    );

    /* =====================================================
       FUNCTION: handlePickAvatar
    ===================================================== */
    const handlePickAvatar = async () => {
        if (uploading) return;

        try {
            const permission =
                await ImagePicker.requestMediaLibraryPermissionsAsync();

            if (!permission.granted) {
                Alert.alert(
                    "Photo access required",
                    "Please allow Vaulty to access your photos.",
                );
                return;
            }

            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ["images"],
                allowsMultipleSelection: false,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.85,
                exif: false,
                base64: true,
            });

            if (result.canceled || !result.assets?.[0]) return;

            const image = result.assets[0];
            if (!image.base64) {
                throw new Error("Unable to read the selected image.");
            }

            setUploading(true);

            const uploadedUrl = await uploadMyProfileAvatar({
                base64: image.base64,
                mimeType: image.mimeType,
            });

            setAvatarUrl(uploadedUrl);

            showSuccessNotice(
                "Photo updated",
                "Your new profile photo has been saved.",
            );
        } catch (error) {
            console.error("Avatar upload failed:", error);
            Alert.alert(
                "Unable to update photo",
                error instanceof Error ? error.message : "Please try again.",
            );
        } finally {
            setUploading(false);
        }
    };

    /* =====================================================
       FUNCTION: handleLogout
    ===================================================== */
    const handleLogout = () => {
        Alert.alert("Log out", "Are you sure you want to log out?", [
            { text: "Cancel", style: "cancel" },
            {
                text: "Log out",
                style: "destructive",
                onPress: async () => {
                    try {
                        setLoggingOut(true);
                        await signOut();
                        showSuccessNotice(
                            "Logged out",
                            "You have been securely logged out.",
                        );
                        router.replace("/login");
                    } catch (error) {
                        console.error("Logout failed:", error);
                        Alert.alert("Unable to log out", "Please try again.");
                    } finally {
                        setLoggingOut(false);
                    }
                },
            },
        ]);
    };

    /* =====================================================
       NAVIGATION
    ===================================================== */
    const handleWalletPress = () => router.push("/wallet");

    const handleActivePress = () => {
        router.push("/(app)/rentals?filter=active");
    };

    const handleTotalPress = () => {
        router.push("/(app)/rentals?filter=history");
    };

    const handlePersonalInfo = () => {};
    const handleSecurity = () => router.push("/settings/security");
    const handleNotifications = () => router.push("/notifications");
    const handleAbout = () => router.push("/settings/about");
    const handleTerms = () => router.push("/settings/terms");
    const handlePrivacy = () => router.push("/settings/privacy");
    const handleSettings = () => {};

    return (
        <SRVBackground>
            {/* =================================================
                STICKY HEADER
            ================================================= */}

            <View style={styles.header}>
                <View style={styles.headerCopy}>
                    <Text style={styles.headerEyebrow}>ACCOUNT</Text>
                    <Text style={styles.headerTitle}>Profile</Text>
                </View>

                <Pressable
                    onPress={handleSettings}
                    hitSlop={8}
                    style={({ pressed }) => [
                        styles.headerIcon,
                        pressed && styles.headerIconPressed,
                    ]}
                >
                    <Ionicons
                        name="settings-outline"
                        size={19}
                        color={colors.text}
                    />
                </Pressable>
            </View>

            {/* =================================================
                SCROLL
            ================================================= */}

            <ScrollView
                style={styles.page}
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
            >
                {/* ---------- HERO ---------- */}

                <View style={styles.heroCard}>
                    <Pressable
                        onPress={handlePickAvatar}
                        disabled={uploading}
                        style={({ pressed }) => [
                            styles.avatarWrap,
                            {
                                width: AVATAR_SIZE,
                                height: AVATAR_SIZE,
                                borderRadius: AVATAR_SIZE / 2,
                            },
                            pressed && !uploading && styles.avatarWrapPressed,
                        ]}
                    >
                        <SRVAvatar
                            size={AVATAR_SIZE}
                            name={user?.name}
                            imageUrl={avatarUrl}
                        />

                        {!uploading && (
                            <View style={styles.cameraBadge}>
                                <Ionicons
                                    name="camera"
                                    size={14}
                                    color={colors.white}
                                />
                            </View>
                        )}

                        {uploading && (
                            <View
                                style={[
                                    styles.uploadOverlay,
                                    { borderRadius: AVATAR_SIZE / 2 },
                                ]}
                            >
                                <ActivityIndicator
                                    size="small"
                                    color={colors.white}
                                />
                            </View>
                        )}
                    </Pressable>

                    <View style={styles.heroInfo}>
                        <Text style={styles.heroName} numberOfLines={1}>
                            {user?.name ?? "Vaulty User"}
                        </Text>

                        <Text style={styles.heroEmail} numberOfLines={1}>
                            {user?.email ?? "No email"}
                        </Text>

                        <View style={styles.statusPill}>
                            <View style={styles.statusDot} />
                            <Text style={styles.statusText}>
                                {uploading
                                    ? "Uploading photo..."
                                    : "Active account"}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* ---------- STATS ---------- */}

                <View style={styles.statsCard}>
                    <Pressable
                        onPress={handleWalletPress}
                        style={({ pressed }) => [
                            styles.statItem,
                            pressed && styles.statItemPressed,
                        ]}
                    >
                        <Text style={styles.statValue}>
                            {balance.toLocaleString()}
                        </Text>
                        <Text style={styles.statLabel}>Points</Text>
                    </Pressable>

                    <View style={styles.statDivider} />

                    <Pressable
                        onPress={handleActivePress}
                        style={({ pressed }) => [
                            styles.statItem,
                            pressed && styles.statItemPressed,
                        ]}
                    >
                        <Text style={styles.statValue}>{activeCount}</Text>
                        <Text style={styles.statLabel}>Active</Text>
                    </Pressable>

                    <View style={styles.statDivider} />

                    <Pressable
                        onPress={handleTotalPress}
                        style={({ pressed }) => [
                            styles.statItem,
                            pressed && styles.statItemPressed,
                        ]}
                    >
                        <Text style={styles.statValue}>{totalCount}</Text>
                        <Text style={styles.statLabel}>Total</Text>
                    </Pressable>
                </View>

                {/* ---------- ACCOUNT ---------- */}

                <View style={styles.section}>
                    <Text style={styles.sectionEyebrow}>ACCOUNT</Text>

                    <View style={styles.menuCard}>
                        <MenuItem
                            icon="person-outline"
                            title="Personal information"
                            onPress={handlePersonalInfo}
                        />
                        <MenuDivider />
                        <MenuItem
                            icon="shield-checkmark-outline"
                            title="Security & password"
                            onPress={handleSecurity}
                        />
                        <MenuDivider />
                        <MenuItem
                            icon="notifications-outline"
                            title="Notifications"
                            onPress={handleNotifications}
                        />
                    </View>
                </View>

                {/* ---------- ABOUT ---------- */}

                <View style={styles.section}>
                    <Text style={styles.sectionEyebrow}>ABOUT</Text>

                    <View style={styles.menuCard}>
                        <MenuItem
                            icon="information-circle-outline"
                            title="About Vaulty"
                            onPress={handleAbout}
                        />
                        <MenuDivider />
                        <MenuItem
                            icon="document-text-outline"
                            title="Terms & conditions"
                            onPress={handleTerms}
                        />
                        <MenuDivider />
                        <MenuItem
                            icon="lock-closed-outline"
                            title="Privacy policy"
                            onPress={handlePrivacy}
                        />
                    </View>
                </View>

                {/* ---------- LOGOUT ---------- */}

                <Pressable
                    onPress={handleLogout}
                    disabled={loggingOut}
                    style={({ pressed }) => [
                        styles.logoutRow,
                        pressed && !loggingOut && styles.logoutRowPressed,
                        loggingOut && styles.logoutRowDisabled,
                    ]}
                >
                    {loggingOut ? (
                        <ActivityIndicator size="small" color={colors.danger} />
                    ) : (
                        <Ionicons
                            name="log-out-outline"
                            size={19}
                            color={colors.danger}
                        />
                    )}
                    <Text style={styles.logoutText}>
                        {loggingOut ? "Logging out..." : "Log out"}
                    </Text>
                </Pressable>

                {/* ---------- FOOTER ---------- */}

                <View style={styles.footer}>
                    <Text style={styles.footerText}>
                        Vaulty Mobile • v1.0.0
                    </Text>
                </View>
            </ScrollView>
        </SRVBackground>
    );
}

/* =========================================================
   COMPONENT: MenuItem
========================================================= */

type MenuItemProps = {
    icon: keyof typeof Ionicons.glyphMap;
    title: string;
    onPress: () => void;
};

function MenuItem({ icon, title, onPress }: MenuItemProps) {
    return (
        <Pressable
            onPress={onPress}
            style={({ pressed }) => [
                styles.menuItem,
                pressed && styles.menuPressed,
            ]}
        >
            <View style={styles.menuIcon}>
                <Ionicons name={icon} size={18} color={colors.primaryLight} />
            </View>

            <Text style={styles.menuTitle}>{title}</Text>

            <Ionicons
                name="chevron-forward"
                size={16}
                color={colors.mutedDark}
            />
        </Pressable>
    );
}

function MenuDivider() {
    return <View style={styles.divider} />;
}
