import { router, useFocusEffect } from "expo-router";

import { useCallback, useState } from "react";

import {
    ActivityIndicator,
    Alert,
    Image,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";

import * as ImagePicker from "expo-image-picker";

import Ionicons from "@expo/vector-icons/Ionicons";

import SRVBackground from "../../components/SRVBackground";
import SRVAvatar from "../../components/SRVAvatar";

import { colors, radius, spacing } from "../../constants/theme";

import { useAuth } from "../../context/AuthContext";

import {
    getMyProfile,
    uploadMyProfileAvatar,
} from "../../services/profileService";

export default function ProfileScreen() {
    const { user, signOut } = useAuth();

    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

    const [uploading, setUploading] = useState(false);

    const [loggingOut, setLoggingOut] = useState(false);

        /*
        * Load profile photo.
        */
    const loadProfile = useCallback(async () => {
        try {
            const profile = await getMyProfile();
    
            setAvatarUrl(profile.avatarUrl);
        } catch (error) {
            console.error("Failed to load profile:", error);
        }
    }, []);
    
    /*
        * Load the latest profile every time this screen is focused.
        */
    useFocusEffect(
        useCallback(() => {
            loadProfile();
        }, [loadProfile])
    );

    /*
     * Choose and upload profile photo.
     */
    const handlePickAvatar = async () => {
        if (uploading) {
            return;
        }

        try {
            const permission =
                await ImagePicker.requestMediaLibraryPermissionsAsync();

            if (!permission.granted) {
                Alert.alert(
                    "Photo access required",
                    "Please allow Vaulty to access your photos so you can choose a profile picture.",
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

            if (
                result.canceled ||
                !result.assets ||
                result.assets.length === 0
            ) {
                return;
            }

            const image = result.assets[0];

            if (!image.base64) {
                throw new Error("Unable to read the selected image data.");
            }

            setUploading(true);

            const uploadedUrl = await uploadMyProfileAvatar({
                base64: image.base64,
                mimeType: image.mimeType,
            });

            setAvatarUrl(uploadedUrl);

            Alert.alert(
                "Profile photo updated",
                "Your new profile photo has been saved.",
            );
        } catch (error) {
            console.error("Avatar upload failed:", error);

            Alert.alert(
                "Unable to update photo",
                error instanceof Error
                    ? error.message
                    : "Something went wrong while uploading your profile picture. Please try again.",
            );
        } finally {
            setUploading(false);
        }
    };

    /*
     * Logout.
     */
    const handleLogout = () => {
        Alert.alert("Log out", "Are you sure you want to log out of SRV?", [
            {
                text: "Cancel",
                style: "cancel",
            },
            {
                text: "Log out",
                style: "destructive",
                onPress: async () => {
                    try {
                        setLoggingOut(true);

                        await signOut();

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

    return (
        <SRVBackground>
            <View style={styles.screen}>
                {/* =================================================
    STICKY HEADER
================================================= */}

                <View style={styles.stickyHeader}>
                    <View style={styles.header}>
                        <View style={styles.headerCopy}>
                            <Text style={styles.eyebrow}>
                                SMART RENTAL VAULT
                            </Text>

                            <Text style={styles.title}>Profile</Text>
                        </View>

                        <View style={styles.headerLogoContainer}>
                            <Image
                                source={require("../../../assets/images/srv-logo.png")}
                                style={styles.headerLogo}
                                resizeMode="contain"
                            />
                        </View>
                    </View>

                    <Text style={styles.subtitle}>
                        Manage your SRV account.
                    </Text>
                </View>

                {/* =================================================
                    SCROLLABLE CONTENT
                ================================================= */}

                <ScrollView
                    style={styles.page}
                    contentContainerStyle={styles.content}
                    showsVerticalScrollIndicator={false}
                >
                    {/* =================================================
                        PROFILE CARD
                    ================================================= */}

                    <View style={styles.profileCard}>
                        <Pressable
                            onPress={handlePickAvatar}
                            disabled={uploading}
                            style={({ pressed }) => [
                                styles.avatarButton,
                                pressed &&
                                    !uploading &&
                                    styles.avatarButtonPressed,
                            ]}
                        >
                            <SRVAvatar
                                size={92}
                                name={user?.name}
                                imageUrl={avatarUrl}
                            />

                            <View style={styles.cameraButton}>
                                {uploading ? (
                                    <ActivityIndicator
                                        size="small"
                                        color={colors.background}
                                    />
                                ) : (
                                    <Ionicons
                                        name="camera"
                                        size={17}
                                        color={colors.background}
                                    />
                                )}
                            </View>
                        </Pressable>

                        <View style={styles.profileInfo}>
                            <Text style={styles.name}>
                                {user?.name ?? "SRV User"}
                            </Text>

                            <Text style={styles.email}>
                                {user?.email ?? "No email"}
                            </Text>

                            <View style={styles.activeBadge}>
                                <View style={styles.activeDot} />

                                <Text style={styles.activeText}>
                                    Active account
                                </Text>
                            </View>
                        </View>

                        <Pressable
                            onPress={handlePickAvatar}
                            disabled={uploading}
                            style={({ pressed }) => [
                                styles.changePhotoButton,
                                pressed && styles.changePhotoPressed,
                                uploading && styles.changePhotoDisabled,
                            ]}
                        >
                            <Ionicons
                                name="image-outline"
                                size={17}
                                color={colors.gold}
                            />

                            <Text style={styles.changePhotoText}>
                                {uploading ? "Uploading..." : "Change photo"}
                            </Text>
                        </Pressable>
                    </View>

                    <Text style={styles.photoHint}>
                        Choose a square photo. It will be used across your SRV
                        profile and dashboard.
                    </Text>

                    {/* =================================================
                        ACCOUNT
                    ================================================= */}

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Account</Text>

                        <View style={styles.menuCard}>
                            <MenuItem
                                icon="person-outline"
                                title="Personal information"
                                subtitle="Name and email"
                                onPress={() => {}}
                            />

                            <MenuDivider />

                            <MenuItem
                                icon="shield-checkmark-outline"
                                title="Security"
                                subtitle="Password and account security"
                                onPress={() => {}}
                            />

                            <MenuDivider />

                            <MenuItem
                                icon="notifications-outline"
                                title="Notifications"
                                subtitle="Notification preferences"
                                onPress={() => {}}
                            />
                        </View>
                    </View>

                    {/* =================================================
                        WALLET
                    ================================================= */}

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Wallet</Text>

                        <Pressable
                            onPress={() => router.push("/wallet")}
                            style={({ pressed }) => [
                                styles.walletCard,
                                pressed && styles.pressed,
                            ]}
                        >
                            <View style={styles.walletIcon}>
                                <Ionicons
                                    name="wallet-outline"
                                    size={22}
                                    color={colors.gold}
                                />
                            </View>

                            <View style={styles.walletCopy}>
                                <Text style={styles.walletTitle}>
                                    SRV Wallet
                                </Text>

                                <Text style={styles.walletSubtitle}>
                                    View your points and transactions
                                </Text>
                            </View>

                            <Ionicons
                                name="chevron-forward"
                                size={20}
                                color={colors.mutedDark}
                            />
                        </Pressable>
                    </View>

                    {/* =================================================
                        ABOUT
                    ================================================= */}

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>About</Text>

                        <View style={styles.menuCard}>
                            <MenuItem
                                icon="information-circle-outline"
                                title="About SRV"
                                subtitle="Smart Rental Vault"
                                onPress={() => {}}
                            />

                            <MenuDivider />

                            <MenuItem
                                icon="document-text-outline"
                                title="Terms & conditions"
                                subtitle="Coming soon"
                                onPress={() => {}}
                            />

                            <MenuDivider />

                            <MenuItem
                                icon="lock-closed-outline"
                                title="Privacy policy"
                                subtitle="Coming soon"
                                onPress={() => {}}
                            />
                        </View>
                    </View>

                    {/* =================================================
                        LOGOUT
                    ================================================= */}

                    <Pressable
                        onPress={handleLogout}
                        disabled={loggingOut}
                        style={({ pressed }) => [
                            styles.logoutButton,
                            pressed && styles.logoutPressed,
                            loggingOut && styles.logoutDisabled,
                        ]}
                    >
                        {loggingOut ? (
                            <ActivityIndicator
                                size="small"
                                color={colors.danger}
                            />
                        ) : (
                            <Ionicons
                                name="log-out-outline"
                                size={20}
                                color={colors.danger}
                            />
                        )}

                        <Text style={styles.logoutText}>
                            {loggingOut ? "Logging out..." : "Log out"}
                        </Text>
                    </Pressable>

                    {/* =================================================
                        FOOTER
                    ================================================= */}

                    <View style={styles.footer}>
                        <Text style={styles.version}>Smart Rental Vault</Text>

                        <Text style={styles.versionNumber}>
                            SRV Mobile • Development Build
                        </Text>
                    </View>
                </ScrollView>
            </View>
        </SRVBackground>
    );
}

/* =========================================================
   MENU ITEM
========================================================= */

type MenuItemProps = {
    icon: keyof typeof Ionicons.glyphMap;
    title: string;
    subtitle: string;
    onPress: () => void;
};

function MenuItem({ icon, title, subtitle, onPress }: MenuItemProps) {
    return (
        <Pressable
            onPress={onPress}
            style={({ pressed }) => [
                styles.menuItem,
                pressed && styles.menuPressed,
            ]}
        >
            <View style={styles.menuIcon}>
                <Ionicons name={icon} size={20} color={colors.gold} />
            </View>

            <View style={styles.menuCopy}>
                <Text style={styles.menuTitle}>{title}</Text>

                <Text style={styles.menuSubtitle}>{subtitle}</Text>
            </View>

            <Ionicons
                name="chevron-forward"
                size={18}
                color={colors.mutedDark}
            />
        </Pressable>
    );
}

/* =========================================================
   DIVIDER
========================================================= */

function MenuDivider() {
    return <View style={styles.divider} />;
}

/* =========================================================
   STYLES
========================================================= */

const styles = StyleSheet.create({
    screen: {
        flex: 1,
    },

    /* =====================================================
       STICKY HEADER
    ===================================================== */

    stickyHeader: {
        backgroundColor: colors.background,

        borderBottomWidth: 1,
        borderBottomColor: colors.border,

        paddingTop: 48,
        paddingHorizontal: spacing.lg,
        paddingBottom: 16,

        zIndex: 20,
        elevation: 8,

        shadowColor: "#000000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.22,
        shadowRadius: 10,
    },

    header: {
        flexDirection: "row",

        alignItems: "center",

        justifyContent: "space-between",
    },

    headerCopy: {
        flex: 1,
    },

    eyebrow: {
        color: colors.gold,

        fontSize: 10,
        fontWeight: "900",

        letterSpacing: 2.2,

        marginBottom: 4,
    },

    title: {
        color: colors.textStrong,

        fontSize: 28,
        fontWeight: "900",
    },

    subtitle: {
        color: colors.mutedDark,

        fontSize: 12,

        marginTop: 6,

        paddingRight: 55,
    },

    /* =====================================================
       PAGE
    ===================================================== */

    page: {
        flex: 1,

        backgroundColor: "transparent",
    },

    content: {
        padding: spacing.lg,

        paddingTop: spacing.lg,

        paddingBottom: 48,

        gap: spacing.lg,
    },

    /* =====================================================
       PROFILE CARD
    ===================================================== */

    profileCard: {
        alignItems: "center",

        backgroundColor: colors.surface,

        borderWidth: 1,
        borderColor: colors.borderStrong,

        borderRadius: radius.lg,

        padding: spacing.lg,
    },

    avatarButton: {
        position: "relative",

        marginBottom: 14,
    },

    avatarButtonPressed: {
        opacity: 0.8,

        transform: [
            {
                scale: 0.98,
            },
        ],
    },

    cameraButton: {
        position: "absolute",

        right: -2,
        bottom: -2,

        width: 32,
        height: 32,

        borderRadius: 12,

        backgroundColor: colors.gold,

        borderWidth: 2,
        borderColor: colors.surface,

        alignItems: "center",
        justifyContent: "center",
    },

    profileInfo: {
        alignItems: "center",

        gap: 5,
    },

    name: {
        color: colors.textStrong,

        fontSize: 20,
        fontWeight: "900",
    },

    email: {
        color: colors.muted,

        fontSize: 13,
    },

    activeBadge: {
        flexDirection: "row",

        alignItems: "center",

        gap: 6,

        backgroundColor: colors.successSoft,

        paddingVertical: 6,
        paddingHorizontal: 10,

        borderRadius: radius.pill,

        marginTop: 3,
    },

    activeDot: {
        width: 7,
        height: 7,

        borderRadius: 4,

        backgroundColor: colors.success,
    },

    activeText: {
        color: colors.success,

        fontSize: 11,
        fontWeight: "800",
    },

    changePhotoButton: {
        flexDirection: "row",

        alignItems: "center",
        justifyContent: "center",

        gap: 7,

        marginTop: 17,

        paddingVertical: 10,
        paddingHorizontal: 15,

        borderRadius: radius.pill,

        backgroundColor: colors.goldSoft,

        borderWidth: 1,
        borderColor: colors.gold,
    },

    changePhotoPressed: {
        opacity: 0.75,
    },

    changePhotoDisabled: {
        opacity: 0.5,
    },

    changePhotoText: {
        color: colors.goldLight,

        fontSize: 12,
        fontWeight: "800",
    },

    photoHint: {
        color: colors.mutedDark,

        fontSize: 11,

        lineHeight: 17,

        textAlign: "center",

        marginTop: -9,

        paddingHorizontal: 20,
    },

    headerLogoContainer: {
        width: 52,
        height: 52,

        borderRadius: 16,

        backgroundColor: colors.surface,

        borderWidth: 1,
        borderColor: colors.gold,

        alignItems: "center",
        justifyContent: "center",

        marginLeft: 12,
    },

    headerLogo: {
        width: 40,
        height: 40,
    },

    /* =====================================================
        SECTIONS
    ===================================================== */

    section: {
        gap: 10,
    },

    sectionTitle: {
        color: colors.textStrong,

        fontSize: 18,
        fontWeight: "900",
    },

    /* =====================================================
        MENU
    ===================================================== */

    menuCard: {
        backgroundColor: colors.surface,

        borderWidth: 1,
        borderColor: colors.border,

        borderRadius: radius.lg,

        overflow: "hidden",
    },

    menuItem: {
        minHeight: 72,

        flexDirection: "row",

        alignItems: "center",

        paddingHorizontal: spacing.md,

        gap: 12,
    },

    menuPressed: {
        backgroundColor: colors.surfaceSoft,
    },

    menuIcon: {
        width: 42,
        height: 42,

        borderRadius: 13,

        backgroundColor: colors.goldSoft,

        alignItems: "center",
        justifyContent: "center",
    },

    menuCopy: {
        flex: 1,

        gap: 3,
    },

    menuTitle: {
        color: colors.text,

        fontSize: 14,
        fontWeight: "800",
    },

    menuSubtitle: {
        color: colors.muted,

        fontSize: 12,
    },

    divider: {
        height: 1,

        backgroundColor: colors.border,

        marginLeft: 66,
    },

    /* =====================================================
        WALLET
    ===================================================== */

    walletCard: {
        flexDirection: "row",

        alignItems: "center",

        backgroundColor: colors.surface,

        borderWidth: 1,
        borderColor: colors.border,

        borderRadius: radius.lg,

        padding: spacing.md,

        gap: 12,
    },

    walletIcon: {
        width: 46,
        height: 46,

        borderRadius: 14,

        backgroundColor: colors.goldSoft,

        borderWidth: 1,
        borderColor: colors.gold,

        alignItems: "center",
        justifyContent: "center",
    },

    walletCopy: {
        flex: 1,

        gap: 3,
    },

    walletTitle: {
        color: colors.text,

        fontSize: 15,
        fontWeight: "800",
    },

    walletSubtitle: {
        color: colors.muted,

        fontSize: 12,
    },

    /* =====================================================
        LOGOUT
    ===================================================== */

    logoutButton: {
        minHeight: 54,

        flexDirection: "row",

        alignItems: "center",
        justifyContent: "center",

        gap: 8,

        backgroundColor: colors.dangerSoft,

        borderWidth: 1,
        borderColor: colors.danger,

        borderRadius: radius.md,
    },

    logoutPressed: {
        opacity: 0.75,
    },

    logoutDisabled: {
        opacity: 0.5,
    },

    logoutText: {
        color: colors.danger,

        fontSize: 15,
        fontWeight: "800",
    },

    pressed: {
        opacity: 0.75,
    },

    /* =====================================================
        FOOTER
    ===================================================== */

    footer: {
        alignItems: "center",

        paddingTop: spacing.md,

        paddingBottom: 20,
    },

    version: {
        color: colors.gold,

        textAlign: "center",

        fontSize: 12,
        fontWeight: "800",

        letterSpacing: 1.5,
    },

    versionNumber: {
        color: colors.mutedDark,

        textAlign: "center",

        fontSize: 11,

        marginTop: 4,
    },
});
