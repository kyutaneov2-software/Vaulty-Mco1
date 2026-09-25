import Ionicons from "@expo/vector-icons/Ionicons";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
    ActivityIndicator,
    Pressable,
    RefreshControl,
    ScrollView,
    Text,
    View,
} from "react-native";

import SRVBackground from "../../components/SRVBackground";
import SRVAvatar from "../../components/SRVAvatar";
import { colors } from "../../constants/theme";
import { useAuth } from "../../context/AuthContext";
import { getMyProfile } from "../../services/profileService";
import { getMyWallet } from "../../services/walletService";
import { Wallet } from "../../types";
import { appStyles as styles } from "../../styles/app.styles";

    /* =========================================================
    COMPONENT: HomeScreen

    Displays the main authenticated Vaulty dashboard,
    including the user's profile header, wallet, vault
    discovery area, current rental, and app guidance.
    ========================================================= */
export default function HomeScreen() {
    const { user } = useAuth();

    const [wallet, setWallet] = useState<Wallet | null>(null);

    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

    const [loading, setLoading] = useState(true);

    const [refreshing, setRefreshing] = useState(false);

    const [error, setError] = useState("");

    /* =====================================================
        FUNCTION: loadWallet

        Loads the authenticated user's wallet data.
    ===================================================== */
    const loadWallet = useCallback(async () => {
        try {
            const walletData = await getMyWallet();

            setWallet(walletData);

            return true;
        } catch (error) {
            console.error("Failed to load wallet:", error);

            setError("Unable to load your wallet.");

            return false;
        }
    }, []);

    /* =====================================================
        FUNCTION: loadProfileAvatar

        Loads the user's profile so the latest avatar is
        reflected on the Home screen.
    ===================================================== */
    const loadProfileAvatar = useCallback(async () => {
        try {
            const profile = await getMyProfile();

            setAvatarUrl(profile.avatarUrl);
        } catch (error) {
            console.error("Failed to load profile:", error);

            setAvatarUrl(null);
        }
    }, []);

    /* =====================================================
        FUNCTION: initialize

        Performs the initial Home screen data loading.
    ===================================================== */
    const initialize = useCallback(async () => {
        try {
            setError("");

            await Promise.all([loadWallet(), loadProfileAvatar()]);
        } finally {
            setLoading(false);
        }
    }, [loadWallet, loadProfileAvatar]);

    /* =====================================================
        EFFECT: INITIAL LOAD

        Runs once whenever the required loading callbacks
        are available.
    ===================================================== */
    useEffect(() => {
        initialize();
    }, [initialize]);

    /* =====================================================
        EFFECT: REFRESH ON FOCUS

        Reloads the user's avatar whenever the Home screen
        receives focus, especially after returning from
        the Profile page.
    ===================================================== */
    useFocusEffect(
        useCallback(() => {
            loadProfileAvatar();
        }, [loadProfileAvatar]),
    );

    /* =====================================================
        FUNCTION: handleRefresh

        Refreshes wallet and profile data when the user
        pulls down on the dashboard.
    ===================================================== */
    const handleRefresh = async () => {
        try {
            setRefreshing(true);
            setError("");

            await Promise.all([loadWallet(), loadProfileAvatar()]);
        } finally {
            setRefreshing(false);
        }
    };

    /* =====================================================
        FUNCTION: getGreeting

        Returns a greeting based on the user's current
        local time.
    ===================================================== */
    const getGreeting = () => {
        const hour = new Date().getHours();

        if (hour < 12) {
            return "Good morning";
        }

        if (hour < 18) {
            return "Good afternoon";
        }

        return "Good evening";
    };

    const firstName = user?.name?.trim().split(" ")[0] ?? "there";

    /* =====================================================
        FUNCTION: handleProfilePress

        Navigates the user to the Profile page.
    ===================================================== */
    const handleProfilePress = () => {
        router.push("/profile");
    };

    /* =====================================================
        FUNCTION: handleWalletPress

        Navigates the user to the Wallet page.
    ===================================================== */
    const handleWalletPress = () => {
        router.push("/wallet");
    };

    /* =====================================================
        FUNCTION: handleFindVaultPress

        Placeholder navigation handler for the future
        vault discovery feature.
    ===================================================== */
    const handleFindVaultPress = () => {
        // Vault discovery will be connected later.
    };

    /* =====================================================
    FUNCTION: handleNotificationPress

    Placeholder handler for the future notification
    center.
    ===================================================== */
    const handleNotificationPress = () => {
        // Notifications will be connected later.
    };

    /* =====================================================
    LOADING STATE
    ===================================================== */

    if (loading) {
        return (
            <SRVBackground>
                <View style={styles.loading}>
                    <ActivityIndicator size="large" color={colors.primary} />

                    <Text style={styles.loadingText}>Loading Vaulty...</Text>
                </View>
            </SRVBackground>
        );
    }

    return (
        <SRVBackground>
            <View style={styles.screen}>
                {/* =================================================
                    STICKY HEADER
                ================================================= */}

                <View style={styles.stickyHeader}>
                    <View style={styles.header}>
                        <Pressable
                            onPress={handleProfilePress}
                            style={({ pressed }) => [
                                styles.headerBrand,
                                pressed && styles.headerBrandPressed,
                            ]}
                        >
                            <SRVAvatar
                                size={52}
                                name={user?.name}
                                imageUrl={avatarUrl}
                            />

                            <View style={styles.headerText}>
                                <Text style={styles.greeting}>
                                    {getGreeting()},
                                </Text>

                                <Text style={styles.name}>{firstName}.</Text>
                            </View>
                        </Pressable>

                        <Pressable
                            style={({ pressed }) => [
                                styles.notificationButton,
                                pressed && styles.notificationPressed,
                            ]}
                            onPress={handleNotificationPress}
                        >
                            <Ionicons
                                name="notifications-outline"
                                size={21}
                                color={colors.text}
                            />
                        </Pressable>
                    </View>

                    <Text style={styles.headerSubtitle}>
                        Secure storage, whenever you need it.
                    </Text>
                </View>

                {/* =================================================
                    SCROLLABLE CONTENT
                ================================================= */}

                <ScrollView
                    style={styles.page}
                    contentContainerStyle={styles.content}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={handleRefresh}
                            tintColor={colors.primary}
                        />
                    }
                >
                    {/* =================================================
                        WALLET
                    ================================================= */}

                    <Pressable
                        onPress={handleWalletPress}
                        style={({ pressed }) => [
                            styles.walletCard,
                            pressed && styles.walletCardPressed,
                        ]}
                    >
                        <View style={styles.walletTop}>
                            <View>
                                <Text style={styles.walletLabel}>
                                    VAULTY WALLET
                                </Text>

                                <Text style={styles.walletDescription}>
                                    Available points
                                </Text>
                            </View>

                            <View style={styles.walletIcon}>
                                <Ionicons
                                    name="wallet-outline"
                                    size={22}
                                    color={colors.primaryLight}
                                />
                            </View>
                        </View>

                        <Text style={styles.walletBalance}>
                            {(wallet?.balance ?? 0).toLocaleString()}
                        </Text>

                        <View style={styles.walletBottom}>
                            <Text style={styles.walletPoints}>POINTS</Text>

                            <View style={styles.walletLink}>
                                <Text style={styles.walletLinkText}>
                                    View wallet
                                </Text>

                                <Ionicons
                                    name="arrow-forward"
                                    size={15}
                                    color={colors.primaryLight}
                                />
                            </View>
                        </View>
                    </Pressable>

                    {/* =================================================
                        ERROR
                    ================================================= */}

                    {error ? (
                        <View style={styles.errorCard}>
                            <Ionicons
                                name="alert-circle-outline"
                                size={19}
                                color={colors.danger}
                            />

                            <Text style={styles.errorText}>{error}</Text>
                        </View>
                    ) : null}

                    {/* =================================================
                        FIND A VAULT
                    ================================================= */}

                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <View>
                                <Text style={styles.sectionTitle}>
                                    Find a Vault
                                </Text>

                                <Text style={styles.sectionSubtitle}>
                                    Discover secure storage near you.
                                </Text>
                            </View>
                        </View>

                        <Pressable
                            onPress={handleFindVaultPress}
                            style={({ pressed }) => [
                                styles.findVaultCard,
                                pressed && styles.findVaultPressed,
                            ]}
                        >
                            <View style={styles.findVaultIcon}>
                                <Ionicons
                                    name="location-outline"
                                    size={28}
                                    color={colors.primaryLight}
                                />
                            </View>

                            <View style={styles.findVaultCopy}>
                                <Text style={styles.findVaultTitle}>
                                    Explore nearby vaults
                                </Text>

                                <Text style={styles.findVaultText}>
                                    Vault discovery and real-time availability
                                    are coming next.
                                </Text>

                                <View style={styles.comingSoonBadge}>
                                    <Text style={styles.comingSoonText}>
                                        COMING SOON
                                    </Text>
                                </View>
                            </View>

                            <Ionicons
                                name="chevron-forward"
                                size={20}
                                color={colors.mutedDark}
                            />
                        </Pressable>
                    </View>

                    {/* =================================================
                        CURRENT RENTAL
                    ================================================= */}

                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <View style={styles.sectionTitleRow}>
                                <View style={styles.sectionLogo}>
                                    <Ionicons
                                        name="cube-outline"
                                        size={21}
                                        color={colors.primaryLight}
                                    />
                                </View>

                                <View style={styles.sectionTitleCopy}>
                                    <Text style={styles.sectionTitle}>
                                        Current rental
                                    </Text>

                                    <Text style={styles.sectionSubtitle}>
                                        Your active vault sessions.
                                    </Text>
                                </View>
                            </View>
                        </View>

                        <View style={styles.emptyRentalCard}>
                            <View style={styles.emptyRentalIcon}>
                                <Ionicons
                                    name="cube-outline"
                                    size={26}
                                    color={colors.primaryLight}
                                />
                            </View>

                            <Text style={styles.emptyRentalTitle}>
                                No active rental
                            </Text>

                            <Text style={styles.emptyRentalText}>
                                Your current vault reservation will appear here.
                            </Text>
                        </View>
                    </View>

                    {/* =================================================
                        HOW VAULTY WORKS
                    ================================================= */}

                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <View>
                                <Text style={styles.sectionTitle}>
                                    How Vaulty works
                                </Text>

                                <Text style={styles.sectionSubtitle}>
                                    Simple, secure, on-demand.
                                </Text>
                            </View>
                        </View>

                        <View style={styles.stepsCard}>
                            <Step
                                number="01"
                                icon="search-outline"
                                title="Find a vault"
                                text="Choose a storage location near you."
                            />

                            <View style={styles.stepDivider} />

                            <Step
                                number="02"
                                icon="time-outline"
                                title="Choose your time"
                                text="Rent only for the time you need."
                            />

                            <View style={styles.stepDivider} />

                            <Step
                                number="03"
                                icon="shield-checkmark-outline"
                                title="Access securely"
                                text="Your reservation controls your vault access."
                            />
                        </View>
                    </View>

                    {/* =================================================
                        FOOTER
                    ================================================= */}

                    <View style={styles.footer}>
                        <View style={styles.footerLogo}>
                            <Ionicons
                                name="cube-outline"
                                size={22}
                                color={colors.primaryLight}
                            />
                        </View>

                        <Text style={styles.footerTitle}>
                            Smart Rental Vault
                        </Text>

                        <Text style={styles.footerText}>
                            Store small. Move smart.
                        </Text>
                    </View>
                </ScrollView>
            </View>
        </SRVBackground>
    );
}

    /* =========================================================
    TYPE: StepProps

    Defines the properties used by the reusable Step
    component on the Home screen.
    ========================================================= */

type StepProps = {
    number: string;
    icon: keyof typeof Ionicons.glyphMap;
    title: string;
    text: string;
};

    /* =========================================================
    COMPONENT: Step

    Renders one instructional step explaining how Vaulty
    works.
    ========================================================= */
function Step({ number, icon, title, text }: StepProps) {
    return (
        <View style={styles.step}>
            <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>{number}</Text>
            </View>

            <View style={styles.stepIcon}>
                <Ionicons name={icon} size={20} color={colors.primaryLight} />
            </View>

            <View style={styles.stepCopy}>
                <Text style={styles.stepTitle}>{title}</Text>

                <Text style={styles.stepText}>{text}</Text>
            </View>
        </View>
    );
}
