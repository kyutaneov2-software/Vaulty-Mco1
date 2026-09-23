import { router, useFocusEffect } from "expo-router";

import { useCallback, useEffect, useState } from "react";

import {
    ActivityIndicator,
    Pressable,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";

import Ionicons from "@expo/vector-icons/Ionicons";

import SRVBackground from "../../components/SRVBackground";
import SRVAvatar from "../../components/SRVAvatar";

import { colors, radius, spacing } from "../../constants/theme";

import { useAuth } from "../../context/AuthContext";

import { getMyWallet } from "../../services/walletService";
import { getMyProfile } from "../../services/profileService";

import { Wallet } from "../../types";

export default function HomeScreen() {
    const { user } = useAuth();

    const [wallet, setWallet] = useState<Wallet | null>(null);

    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

    const [loading, setLoading] = useState(true);

    const [refreshing, setRefreshing] = useState(false);

    const [error, setError] = useState("");

    /*
     * Load wallet.
     */
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

    /*
     * Load profile avatar.
     *
     * This also runs whenever the Home tab gets focus,
     * so an uploaded photo appears after returning from Profile.
     */
    const loadProfileAvatar = useCallback(async () => {
        try {
            const profile = await getMyProfile();

            setAvatarUrl(profile.avatarUrl);
        } catch (error) {
            console.error("Failed to load profile:", error);

            setAvatarUrl(null);
        }
    }, []);

    /*
     * Initial screen load.
     */
    useEffect(() => {
        const initialize = async () => {
            try {
                setError("");

                await Promise.all([loadWallet(), loadProfileAvatar()]);
            } finally {
                setLoading(false);
            }
        };

        initialize();
    }, [loadWallet, loadProfileAvatar]);

    /*
     * Refresh avatar whenever Home receives focus.
     */
    useFocusEffect(
        useCallback(() => {
            loadProfileAvatar();
        }, [loadProfileAvatar]),
    );

    /*
     * Pull to refresh.
     */
    const handleRefresh = async () => {
        try {
            setRefreshing(true);
            setError("");

            await Promise.all([loadWallet(), loadProfileAvatar()]);
        } finally {
            setRefreshing(false);
        }
    };

    /*
     * Greeting based on time.
     */
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

    /*
     * Loading screen.
     */
    if (loading) {
        return (
            <SRVBackground>
                <View style={styles.loading}>
                    <ActivityIndicator size="large" color={colors.gold} />

                    <Text style={styles.loadingText}>Loading SRV...</Text>
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
                            onPress={() => router.push("/profile")}
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
                            onPress={() => {}}
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
                            tintColor={colors.gold}
                        />
                    }
                >
                    {/* =================================================
                        WALLET
                    ================================================= */}

                    <Pressable
                        onPress={() => router.push("/wallet")}
                        style={({ pressed }) => [
                            styles.walletCard,
                            pressed && styles.walletCardPressed,
                        ]}
                    >
                        <View style={styles.walletTop}>
                            <View>
                                <Text style={styles.walletLabel}>
                                    SRV WALLET
                                </Text>

                                <Text style={styles.walletDescription}>
                                    Available points
                                </Text>
                            </View>

                            <View style={styles.walletIcon}>
                                <Ionicons
                                    name="wallet-outline"
                                    size={22}
                                    color={colors.gold}
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
                                    color={colors.goldLight}
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
                            onPress={() => {}}
                            style={({ pressed }) => [
                                styles.findVaultCard,
                                pressed && styles.findVaultPressed,
                            ]}
                        >
                            <View style={styles.findVaultIcon}>
                                <Ionicons
                                    name="location-outline"
                                    size={28}
                                    color={colors.gold}
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
                                        color={colors.gold}
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
                                    color={colors.gold}
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
                        HOW SRV WORKS
                    ================================================= */}

                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <View>
                                <Text style={styles.sectionTitle}>
                                    How SRV works
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
                                color={colors.gold}
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
   STEP COMPONENT
========================================================= */

type StepProps = {
    number: string;
    icon: keyof typeof Ionicons.glyphMap;
    title: string;
    text: string;
};

function Step({ number, icon, title, text }: StepProps) {
    return (
        <View style={styles.step}>
            <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>{number}</Text>
            </View>

            <View style={styles.stepIcon}>
                <Ionicons name={icon} size={20} color={colors.gold} />
            </View>

            <View style={styles.stepCopy}>
                <Text style={styles.stepTitle}>{title}</Text>

                <Text style={styles.stepText}>{text}</Text>
            </View>
        </View>
    );
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

        justifyContent: "space-between",

        alignItems: "center",
    },

    headerBrand: {
        flexDirection: "row",

        alignItems: "center",

        flex: 1,
    },

    headerBrandPressed: {
        opacity: 0.8,
    },

    headerText: {
        flex: 1,

        marginLeft: 12,
    },

    greeting: {
        color: colors.muted,

        fontSize: 17,
        fontWeight: "600",

        lineHeight: 22,
    },

    name: {
        color: colors.textStrong,

        fontSize: 27,
        fontWeight: "900",

        lineHeight: 31,
    },

    headerSubtitle: {
        color: colors.mutedDark,

        fontSize: 12,

        lineHeight: 18,

        marginTop: 7,

        marginLeft: 64,
    },

    notificationButton: {
        width: 46,
        height: 46,

        borderRadius: 15,

        backgroundColor: colors.surface,

        borderWidth: 1,
        borderColor: colors.border,

        alignItems: "center",
        justifyContent: "center",

        marginLeft: 10,
    },

    notificationPressed: {
        backgroundColor: colors.surfaceSoft,

        transform: [
            {
                scale: 0.96,
            },
        ],
    },

    /* =====================================================
       PAGE
    ===================================================== */

    page: {
        flex: 1,

        backgroundColor: "transparent",
    },

    content: {
        paddingHorizontal: spacing.lg,

        paddingTop: spacing.lg,

        paddingBottom: 48,

        gap: spacing.lg,
    },

    /* =====================================================
       LOADING
    ===================================================== */

    loading: {
        flex: 1,

        alignItems: "center",
        justifyContent: "center",

        gap: 12,
    },

    loadingText: {
        color: colors.muted,

        fontSize: 14,
    },

    /* =====================================================
       WALLET
    ===================================================== */

    walletCard: {
        backgroundColor: colors.surface,

        borderWidth: 1,
        borderColor: colors.gold,

        borderRadius: radius.lg,

        padding: spacing.lg,
    },

    walletCardPressed: {
        opacity: 0.82,

        transform: [
            {
                scale: 0.99,
            },
        ],
    },

    walletTop: {
        flexDirection: "row",

        alignItems: "center",

        justifyContent: "space-between",
    },

    walletLabel: {
        color: colors.gold,

        fontSize: 11,
        fontWeight: "900",

        letterSpacing: 2,
    },

    walletDescription: {
        color: colors.muted,

        fontSize: 12,

        marginTop: 3,
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

    walletBalance: {
        color: colors.textStrong,

        fontSize: 48,
        lineHeight: 54,

        fontWeight: "900",

        marginTop: 24,
    },

    walletBottom: {
        flexDirection: "row",

        justifyContent: "space-between",

        alignItems: "center",

        marginTop: 2,
    },

    walletPoints: {
        color: colors.goldLight,

        fontSize: 11,
        fontWeight: "900",

        letterSpacing: 2.5,
    },

    walletLink: {
        flexDirection: "row",

        alignItems: "center",

        gap: 5,
    },

    walletLinkText: {
        color: colors.goldLight,

        fontSize: 12,
        fontWeight: "800",
    },

    /* =====================================================
       ERROR
    ===================================================== */

    errorCard: {
        flexDirection: "row",

        alignItems: "center",

        gap: 8,

        backgroundColor: colors.dangerSoft,

        borderWidth: 1,
        borderColor: colors.danger,

        borderRadius: radius.md,

        padding: spacing.md,
    },

    errorText: {
        flex: 1,

        color: colors.danger,

        fontSize: 13,

        lineHeight: 19,
    },

    /* =====================================================
       SECTIONS
    ===================================================== */

    section: {
        gap: 11,
    },

    sectionHeader: {
        flexDirection: "row",

        alignItems: "center",

        justifyContent: "space-between",
    },

    sectionTitleRow: {
        flexDirection: "row",

        alignItems: "center",

        flex: 1,
    },

    sectionTitleCopy: {
        flex: 1,
    },

    sectionLogo: {
        width: 42,
        height: 42,

        borderRadius: 13,

        backgroundColor: colors.surface,

        borderWidth: 1,
        borderColor: colors.gold,

        alignItems: "center",
        justifyContent: "center",

        marginRight: 11,
    },

    sectionTitle: {
        color: colors.textStrong,

        fontSize: 19,
        fontWeight: "900",
    },

    sectionSubtitle: {
        color: colors.muted,

        fontSize: 13,

        marginTop: 3,
    },

    /* =====================================================
       FIND VAULT
    ===================================================== */

    findVaultCard: {
        flexDirection: "row",

        alignItems: "center",

        backgroundColor: colors.surface,

        borderWidth: 1,
        borderColor: colors.border,

        borderRadius: radius.lg,

        padding: spacing.md,

        gap: 13,
    },

    findVaultPressed: {
        backgroundColor: colors.surfaceSoft,
    },

    findVaultIcon: {
        width: 54,
        height: 54,

        borderRadius: 17,

        backgroundColor: colors.goldSoft,

        borderWidth: 1,
        borderColor: colors.gold,

        alignItems: "center",
        justifyContent: "center",
    },

    findVaultCopy: {
        flex: 1,

        gap: 4,
    },

    findVaultTitle: {
        color: colors.text,

        fontSize: 15,
        fontWeight: "800",
    },

    findVaultText: {
        color: colors.muted,

        fontSize: 12,
        lineHeight: 18,
    },

    comingSoonBadge: {
        alignSelf: "flex-start",

        backgroundColor: colors.primarySoft,

        paddingVertical: 4,
        paddingHorizontal: 8,

        borderRadius: radius.pill,

        marginTop: 2,
    },

    comingSoonText: {
        color: colors.goldLight,

        fontSize: 9,

        fontWeight: "900",

        letterSpacing: 1.1,
    },

    /* =====================================================
       RENTAL
    ===================================================== */

    emptyRentalCard: {
        alignItems: "center",

        justifyContent: "center",

        backgroundColor: colors.surface,

        borderWidth: 1,
        borderColor: colors.border,

        borderRadius: radius.lg,

        paddingVertical: 32,

        paddingHorizontal: 24,
    },

    emptyRentalIcon: {
        width: 54,
        height: 54,

        borderRadius: 17,

        backgroundColor: colors.primarySoft,

        borderWidth: 1,
        borderColor: colors.borderStrong,

        alignItems: "center",
        justifyContent: "center",

        marginBottom: 12,
    },

    emptyRentalTitle: {
        color: colors.textStrong,

        fontSize: 16,
        fontWeight: "800",
    },

    emptyRentalText: {
        color: colors.muted,

        fontSize: 13,
        lineHeight: 19,

        textAlign: "center",

        marginTop: 4,

        maxWidth: 290,
    },

    /* =====================================================
       HOW SRV WORKS
    ===================================================== */

    stepsCard: {
        backgroundColor: colors.surface,

        borderWidth: 1,
        borderColor: colors.border,

        borderRadius: radius.lg,

        padding: spacing.md,
    },

    step: {
        flexDirection: "row",

        alignItems: "center",

        gap: 10,

        paddingVertical: 8,
    },

    stepNumber: {
        width: 30,
        height: 30,

        borderRadius: 10,

        backgroundColor: colors.goldSoft,

        alignItems: "center",
        justifyContent: "center",
    },

    stepNumberText: {
        color: colors.goldLight,

        fontSize: 10,

        fontWeight: "900",
    },

    stepIcon: {
        width: 40,
        height: 40,

        borderRadius: 12,

        backgroundColor: colors.primarySoft,

        alignItems: "center",
        justifyContent: "center",
    },

    stepCopy: {
        flex: 1,

        gap: 3,
    },

    stepTitle: {
        color: colors.text,

        fontSize: 14,
        fontWeight: "800",
    },

    stepText: {
        color: colors.muted,

        fontSize: 12,
        lineHeight: 17,
    },

    stepDivider: {
        height: 1,

        backgroundColor: colors.border,

        marginLeft: 80,
    },

    /* =====================================================
       FOOTER
    ===================================================== */

    footer: {
        alignItems: "center",

        paddingTop: 8,
        paddingBottom: 20,
    },

    footerLogo: {
        width: 48,
        height: 48,

        borderRadius: 14,

        backgroundColor: colors.surface,

        borderWidth: 1,
        borderColor: colors.gold,

        alignItems: "center",
        justifyContent: "center",

        marginBottom: 10,
    },

    footerTitle: {
        color: colors.text,

        fontSize: 12,
        fontWeight: "800",

        letterSpacing: 1,
    },

    footerText: {
        color: colors.mutedDark,

        fontSize: 11,

        marginTop: 3,
    },
});
