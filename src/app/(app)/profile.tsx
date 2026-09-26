import Ionicons from "@expo/vector-icons/Ionicons";
import * as ImagePicker from "expo-image-picker";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Image,
    Pressable,
    ScrollView,
    Text,
    View,
} from "react-native";

import SRVBackground from "../../components/SRVBackground";
import SRVAvatar from "../../components/SRVAvatar";
import { colors } from "../../constants/theme";
import { useAuth } from "../../context/AuthContext";
import {
    getMyProfile,
    uploadMyProfileAvatar,
} from "../../services/profileService";
import { profileStyles as styles } from "../../styles/profile.styles";
import { useNotice } from "../../context/NoticeContext";

/* =========================================================
   COMPONENT: ProfileScreen

   Displays the authenticated user's profile information,
   profile photo management, account options, wallet access,
   application information, and logout controls.
========================================================= */
export default function ProfileScreen() {
    const { user, signOut } = useAuth();
    const { showSuccessNotice } = useNotice();

    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

    const [uploading, setUploading] = useState(false);

    const [loggingOut, setLoggingOut] = useState(false);

    /* =====================================================
       FUNCTION: loadProfile

       Loads the latest profile data, including the current
       profile photo.
    ===================================================== */
    const loadProfile = useCallback(async () => {
        try {
            const profile = await getMyProfile();

            setAvatarUrl(profile.avatarUrl);
        } catch (error) {
            console.error("Failed to load profile:", error);
        }
    }, []);

    /* =====================================================
       EFFECT: REFRESH PROFILE ON FOCUS

       Reloads the profile every time the Profile screen
       receives focus.
    ===================================================== */
    useFocusEffect(
        useCallback(() => {
            loadProfile();
        }, [loadProfile]),
    );

    /* =====================================================
       FUNCTION: handlePickAvatar

       Requests photo-library permission, lets the user
       choose a square image, and uploads the selected
       profile photo.
    ===================================================== */
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

    /* =====================================================
       FUNCTION: handleLogout

       Shows a confirmation dialog and signs the user out
       after confirmation.
    ===================================================== */
    const handleLogout = () => {
        Alert.alert("Log out", "Are you sure you want to log out of Vaulty?", [
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

                        showSuccessNotice(
                            "Logged out",
                            "You have been securely logged out of your Vaulty account.",
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
       FUNCTION: handleWalletPress

       Navigates the user to the Wallet screen.
    ===================================================== */
    const handleWalletPress = () => {
        router.push("/wallet");
    };

    /* =====================================================
       FUNCTION: handlePersonalInformationPress

       Placeholder for the future personal-information
       editing screen.
    ===================================================== */
    const handlePersonalInformationPress = () => {
        // Personal information editing will be connected later.
    };

    /* =====================================================
       FUNCTION: handleSecurityPress

       Placeholder for the future account-security screen.
    ===================================================== */
    const handleSecurityPress = () => {
        // Security settings will be connected later.
    };

    /* =====================================================
       FUNCTION: handleNotificationsPress

       Placeholder for the future notification-preferences
       screen.
    ===================================================== */
    const handleNotificationsPress = () => {
        // Notification preferences will be connected later.
    };

    /* =====================================================
       FUNCTION: handleAboutPress

       Placeholder for the future About Vaulty screen.
    ===================================================== */
    const handleAboutPress = () => {
        // About information will be connected later.
    };

    /* =====================================================
       FUNCTION: handleTermsPress

       Placeholder for the future Terms & Conditions screen.
    ===================================================== */
    const handleTermsPress = () => {
        // Terms and conditions will be connected later.
    };

    /* =====================================================
       FUNCTION: handlePrivacyPress

       Placeholder for the future Privacy Policy screen.
    ===================================================== */
    const handlePrivacyPress = () => {
        // Privacy policy will be connected later.
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
                        Manage your Vaulty account.
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
                                {user?.name ?? "Vaulty User"}
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
                                color={colors.primaryLight}
                            />

                            <Text style={styles.changePhotoText}>
                                {uploading ? "Uploading..." : "Change photo"}
                            </Text>
                        </Pressable>
                    </View>

                    <Text style={styles.photoHint}>
                        Choose a square photo. It will be used across your
                        Vaulty profile and dashboard.
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
                                onPress={handlePersonalInformationPress}
                            />

                            <MenuDivider />

                            <MenuItem
                                icon="shield-checkmark-outline"
                                title="Security"
                                subtitle="Password and account security"
                                onPress={handleSecurityPress}
                            />

                            <MenuDivider />

                            <MenuItem
                                icon="notifications-outline"
                                title="Notifications"
                                subtitle="Notification preferences"
                                onPress={handleNotificationsPress}
                            />
                        </View>
                    </View>

                    {/* =================================================
                        WALLET
                    ================================================= */}

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Wallet</Text>

                        <Pressable
                            onPress={handleWalletPress}
                            style={({ pressed }) => [
                                styles.walletCard,
                                pressed && styles.walletCardPressed,
                            ]}
                        >
                            <View style={styles.walletIcon}>
                                <Ionicons
                                    name="wallet-outline"
                                    size={22}
                                    color={colors.primaryLight}
                                />
                            </View>

                            <View style={styles.walletCopy}>
                                <Text style={styles.walletTitle}>
                                    Vaulty Wallet
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
                                title="About Vaulty"
                                subtitle="Smart Rental Vault"
                                onPress={handleAboutPress}
                            />

                            <MenuDivider />

                            <MenuItem
                                icon="document-text-outline"
                                title="Terms & conditions"
                                subtitle="Coming soon"
                                onPress={handleTermsPress}
                            />

                            <MenuDivider />

                            <MenuItem
                                icon="lock-closed-outline"
                                title="Privacy policy"
                                subtitle="Coming soon"
                                onPress={handlePrivacyPress}
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
                        <Text style={styles.version}>SMART RENTAL VAULT</Text>

                        <Text style={styles.versionNumber}>
                            Vaulty Mobile • Development Build
                        </Text>
                    </View>
                </ScrollView>
            </View>
        </SRVBackground>
    );
}

/* =========================================================
   TYPE: MenuItemProps

   Defines the properties accepted by the reusable
   profile menu item component.
========================================================= */

type MenuItemProps = {
    icon: keyof typeof Ionicons.glyphMap;
    title: string;
    subtitle: string;
    onPress: () => void;
};

/* =========================================================
   COMPONENT: MenuItem

   Renders a reusable account or information menu row
   with an icon, title, subtitle, and navigation indicator.
========================================================= */
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
                <Ionicons name={icon} size={20} color={colors.primaryLight} />
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
   COMPONENT: MenuDivider

   Renders the divider between profile menu items.
========================================================= */
function MenuDivider() {
    return <View style={styles.divider} />;
}
