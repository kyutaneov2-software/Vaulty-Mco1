import Ionicons from "@expo/vector-icons/Ionicons";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import {
    Pressable,
    RefreshControl,
    ScrollView,
    Text,
    View,
} from "react-native";
import { Image } from "expo-image";

import SRVBackground from "../../components/SRVBackground";
import SRVAvatar from "../../components/SRVAvatar";
import { colors } from "../../constants/theme";
import { useAuth } from "../../context/AuthContext";
import { useWallet } from "../../context/WalletContext";
import { getMyProfile } from "../../services/profileService";
import {
    getActiveRental,
    getAvailableVaults,
    Rental,
    Vault,
} from "../../services/vaultService";
import { appStyles as styles } from "../../styles/app.styles";
import { countUnread } from "../../services/notificationService";
import { HomeSkeleton } from "../../components/Skeletons";

function formatRemaining(ms: number): string {
    if (ms <= 0) return "Expired";

    const totalSec = Math.floor(ms / 1000);
    const h = Math.floor(totalSec / 3600);
    const m = Math.floor((totalSec % 3600) / 60);
    const s = totalSec % 60;

    if (h > 0) return `${h}h ${m}m`;
    if (m > 0) return `${m}m ${s}s`;
    return `${s}s`;
}

export default function HomeScreen() {
    const { user } = useAuth();
    const { balance, refresh: refreshWallet } = useWallet();

    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
    const [vaults, setVaults] = useState<Vault[]>([]);
    const [activeRental, setActiveRental] = useState<Rental | null>(null);
    const [remainingMs, setRemainingMs] = useState(0);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState("");
    const [unreadCount, setUnreadCount] = useState(0);

    /* ---------------------------------------------------------
       Loaders
    --------------------------------------------------------- */

    const loadProfileAvatar = useCallback(async () => {
        try {
            const profile = await getMyProfile();
            setAvatarUrl(profile.avatarUrl);
        } catch (error) {
            console.error("Failed to load profile:", error);
            setAvatarUrl(null);
        }
    }, []);

    const loadVaults = useCallback(async () => {
        try {
            const data = await getAvailableVaults();
            setVaults(data);
        } catch (error) {
            console.error("Failed to load vaults:", error);
        }
    }, []);

    const loadActiveRental = useCallback(async () => {
        try {
            const rental = await getActiveRental();
            setActiveRental(rental);

            if (rental) {
                setRemainingMs(
                    new Date(rental.expiresAt).getTime() - Date.now(),
                );
            }
        } catch (error) {
            console.error("Failed to load active rental:", error);
            setActiveRental(null);
        }
    }, []);

    const initialize = useCallback(async () => {
        try {
            setError("");
            await Promise.all([
                refreshWallet(),
                loadProfileAvatar(),
                loadVaults(),
                loadActiveRental(),
            ]);
        } finally {
            setLoading(false);
        }
    }, [refreshWallet, loadProfileAvatar, loadVaults, loadActiveRental]);

    useEffect(() => {
        initialize();
    }, [initialize]);

    useFocusEffect(
        useCallback(() => {
            loadProfileAvatar();
            loadActiveRental();
            refreshWallet();
        }, [loadProfileAvatar, loadActiveRental, refreshWallet]),
    );

    /* ---------------------------------------------------------
       Countdown ticker
    --------------------------------------------------------- */
    const rentalRef = useRef<Rental | null>(null);
    rentalRef.current = activeRental;

    useEffect(() => {
        if (!activeRental) return;

        const tick = () => {
            const current = rentalRef.current;
            if (!current) return;

            const remaining = Math.max(
                0,
                new Date(current.expiresAt).getTime() - Date.now(),
            );
            setRemainingMs(remaining);
        };

        tick();
        const interval = setInterval(tick, 1000);

        return () => clearInterval(interval);
    }, [activeRental]);

    /* ---------------------------------------------------------
       Refresh
    --------------------------------------------------------- */
    const handleRefresh = async () => {
        try {
            setRefreshing(true);
            setError("");
            await Promise.all([
                refreshWallet(),
                loadProfileAvatar(),
                loadVaults(),
                loadActiveRental(),
            ]);
        } finally {
            setRefreshing(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            countUnread()
                .then(setUnreadCount)
                .catch((error) => console.error("Unread count failed:", error));
        }, []),
    );

    /* ---------------------------------------------------------
       Derived
    --------------------------------------------------------- */
    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return "Good morning";
        if (hour < 18) return "Good afternoon";
        return "Good evening";
    };

    const firstName = user?.name?.trim().split(" ")[0] ?? "there";
    const nearby = vaults.slice(0, 5);
    const onlineCount = vaults.filter((v) => v.online).length;
    const useCompactList = nearby.length <= 2;

    /* ---------------------------------------------------------
       Navigation
    --------------------------------------------------------- */
    const handleProfilePress = () => router.push("/profile");
    const handleWalletPress = () => router.push("/wallet");
    const handleMapPress = () => router.push("/vaults/map");
    const handleVaultPress = (vault: Vault) =>
        router.push(`/vaults/${vault.id}`);
    const handleRentalPress = () => {
        if (activeRental) {
            router.push(`/vaults/active?id=${activeRental.id}`);
        }
    };

    /* ---------------------------------------------------------
       Loading
    --------------------------------------------------------- */
    if (loading) {
        return (
            <SRVBackground>
                <HomeSkeleton />
            </SRVBackground>
        );
    }

    return (
        <SRVBackground>
            {/* Sticky header */}

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
                            size={44}
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
                        onPress={() => router.push("/notifications")}
                        style={({ pressed }) => [
                            styles.iconButton,
                            pressed && styles.iconButtonPressed,
                        ]}
                    >
                        <Ionicons
                            name="notifications-outline"
                            size={20}
                            color={colors.text}
                        />

                        {unreadCount > 0 ? (
                            <View style={styles.bellBadge}>
                                <Text style={styles.bellBadgeText}>
                                    {unreadCount > 9 ? "9+" : unreadCount}
                                </Text>
                            </View>
                        ) : null}
                    </Pressable>
                </View>

                <View style={styles.pillRow}>
                    <Pressable
                        onPress={handleWalletPress}
                        style={({ pressed }) => [
                            styles.walletPill,
                            pressed && styles.pillPressed,
                        ]}
                    >
                        <Ionicons
                            name="wallet-outline"
                            size={14}
                            color={colors.primaryLight}
                        />
                        <Text style={styles.walletPillValue}>
                            {balance.toLocaleString()}
                        </Text>
                        <Text style={styles.walletPillUnit}>pts</Text>
                    </Pressable>
                </View>
            </View>

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
                {error ? (
                    <View style={styles.errorCard}>
                        <Ionicons
                            name="alert-circle-outline"
                            size={18}
                            color={colors.danger}
                        />
                        <Text style={styles.errorText}>{error}</Text>
                    </View>
                ) : null}

                {/* Active rental */}

                {activeRental ? (
                    <Pressable
                        onPress={handleRentalPress}
                        style={({ pressed }) => [
                            styles.activeRentalCard,
                            pressed && styles.activeRentalCardPressed,
                        ]}
                    >
                        <View style={styles.activeRentalTop}>
                            <View style={styles.activeRentalIconWrap}>
                                <Ionicons
                                    name="lock-closed"
                                    size={20}
                                    color={colors.primaryLight}
                                />
                            </View>

                            <View style={styles.activeRentalHeader}>
                                <Text style={styles.activeRentalEyebrow}>
                                    ACTIVE RENTAL
                                </Text>
                                <Text style={styles.activeRentalCode}>
                                    {activeRental.vaultCode}
                                </Text>
                            </View>

                            <Ionicons
                                name="chevron-forward"
                                size={18}
                                color={colors.mutedDark}
                            />
                        </View>

                        <View style={styles.activeRentalCountdownWrap}>
                            <Text style={styles.activeRentalCountdown}>
                                {formatRemaining(remainingMs)}
                            </Text>
                            <Text style={styles.activeRentalCountdownLabel}>
                                remaining
                            </Text>
                        </View>

                        <View style={styles.activeRentalProgressTrack}>
                            <View
                                style={[
                                    styles.activeRentalProgressFill,
                                    {
                                        width: `${Math.min(
                                            100,
                                            (remainingMs /
                                                (new Date(
                                                    activeRental.expiresAt,
                                                ).getTime() -
                                                    new Date(
                                                        activeRental.startedAt,
                                                    ).getTime())) *
                                                100,
                                        )}%`,
                                    },
                                ]}
                            />
                        </View>
                    </Pressable>
                ) : null}

                {/* Find a vault */}

                <View style={styles.heroCard}>
                    <View style={styles.heroHeader}>
                        <Text style={styles.heroEyebrow}>FIND A VAULT</Text>
                        <Text style={styles.heroSubtitle}>
                            Discover secure storage near you.
                        </Text>
                    </View>

                    <Pressable
                        onPress={handleMapPress}
                        style={({ pressed }) => [
                            styles.mapPreview,
                            pressed && styles.mapPreviewPressed,
                        ]}
                    >
                        {/* Grid */}

                        <View style={styles.mapGrid} pointerEvents="none">
                            <View
                                style={[
                                    styles.mapGridLine,
                                    { top: "18%", left: 0, right: 0 },
                                ]}
                            />
                            <View
                                style={[
                                    styles.mapGridLine,
                                    { top: "36%", left: 0, right: 0 },
                                ]}
                            />
                            <View
                                style={[
                                    styles.mapGridLine,
                                    { top: "72%", left: 0, right: 0 },
                                ]}
                            />
                            <View
                                style={[
                                    styles.mapGridLine,
                                    { top: "88%", left: 0, right: 0 },
                                ]}
                            />

                            <View
                                style={[
                                    styles.mapGridLineV,
                                    { left: "22%", top: 0, bottom: 0 },
                                ]}
                            />
                            <View
                                style={[
                                    styles.mapGridLineV,
                                    { left: "58%", top: 0, bottom: 0 },
                                ]}
                            />
                            <View
                                style={[
                                    styles.mapGridLineV,
                                    { left: "82%", top: 0, bottom: 0 },
                                ]}
                            />
                        </View>

                        {/* Roads */}

                        <View
                            style={[
                                styles.mapRoad,
                                { top: "52%", left: 0, right: 0, height: 3 },
                            ]}
                            pointerEvents="none"
                        />
                        <View
                            style={[
                                styles.mapRoadV,
                                { left: "40%", top: 0, bottom: 0, width: 3 },
                            ]}
                            pointerEvents="none"
                        />
                        <View style={styles.mapRoadDiag} pointerEvents="none" />

                        {/* Blocks */}

                        <View
                            style={[
                                styles.mapBlock,
                                {
                                    top: "8%",
                                    left: "6%",
                                    width: "13%",
                                    height: "10%",
                                },
                            ]}
                            pointerEvents="none"
                        />
                        <View
                            style={[
                                styles.mapBlock,
                                {
                                    top: "8%",
                                    left: "26%",
                                    width: "11%",
                                    height: "12%",
                                },
                            ]}
                            pointerEvents="none"
                        />
                        <View
                            style={[
                                styles.mapBlockDarker,
                                {
                                    top: "8%",
                                    left: "64%",
                                    width: "14%",
                                    height: "10%",
                                },
                            ]}
                            pointerEvents="none"
                        />
                        <View
                            style={[
                                styles.mapBlock,
                                {
                                    top: "8%",
                                    left: "86%",
                                    width: "10%",
                                    height: "14%",
                                },
                            ]}
                            pointerEvents="none"
                        />
                        <View
                            style={[
                                styles.mapBlockDarker,
                                {
                                    top: "22%",
                                    left: "6%",
                                    width: "12%",
                                    height: "12%",
                                },
                            ]}
                            pointerEvents="none"
                        />
                        <View
                            style={[
                                styles.mapBlock,
                                {
                                    top: "22%",
                                    left: "64%",
                                    width: "14%",
                                    height: "16%",
                                },
                            ]}
                            pointerEvents="none"
                        />
                        <View
                            style={[
                                styles.mapBlock,
                                {
                                    top: "58%",
                                    left: "6%",
                                    width: "14%",
                                    height: "12%",
                                },
                            ]}
                            pointerEvents="none"
                        />
                        <View
                            style={[
                                styles.mapBlockDarker,
                                {
                                    top: "58%",
                                    left: "26%",
                                    width: "10%",
                                    height: "10%",
                                },
                            ]}
                            pointerEvents="none"
                        />
                        <View
                            style={[
                                styles.mapBlock,
                                {
                                    top: "58%",
                                    left: "62%",
                                    width: "12%",
                                    height: "12%",
                                },
                            ]}
                            pointerEvents="none"
                        />
                        <View
                            style={[
                                styles.mapBlockDarker,
                                {
                                    top: "80%",
                                    left: "26%",
                                    width: "16%",
                                    height: "10%",
                                },
                            ]}
                            pointerEvents="none"
                        />
                        <View
                            style={[
                                styles.mapBlock,
                                {
                                    top: "80%",
                                    left: "62%",
                                    width: "12%",
                                    height: "10%",
                                },
                            ]}
                            pointerEvents="none"
                        />

                        <View style={styles.mapPark} pointerEvents="none" />
                        <View style={styles.mapWater} pointerEvents="none" />

                        {/* Pins */}

                        {nearby.map((v, i) => {
                            const positions = [
                                { top: "28%", left: "30%" },
                                { top: "62%", left: "68%" },
                                { top: "42%", left: "50%" },
                                { top: "76%", left: "28%" },
                                { top: "22%", left: "72%" },
                            ];
                            const pos = positions[i % positions.length];

                            return (
                                <View
                                    key={v.id}
                                    style={[
                                        styles.mapPin,
                                        {
                                            top: pos.top,
                                            left: pos.left,
                                            backgroundColor: v.online
                                                ? colors.primary
                                                : colors.mutedDark,
                                        },
                                    ]}
                                    pointerEvents="none"
                                />
                            );
                        })}

                        <View style={styles.mapBadge} pointerEvents="none">
                            <View style={styles.mapBadgeDot} />
                            <Text style={styles.mapBadgeText}>
                                {onlineCount}{" "}
                                {onlineCount === 1 ? "vault" : "vaults"} online
                            </Text>
                        </View>

                        <View style={styles.mapExpand} pointerEvents="none">
                            <Ionicons
                                name="expand-outline"
                                size={14}
                                color={colors.text}
                            />
                        </View>
                    </Pressable>

                    <Pressable
                        onPress={handleMapPress}
                        style={({ pressed }) => [
                            styles.heroButton,
                            pressed && styles.heroButtonPressed,
                        ]}
                    >
                        <Text style={styles.heroButtonText}>Open map</Text>
                        <Ionicons
                            name="arrow-forward"
                            size={16}
                            color={colors.white}
                        />
                    </Pressable>
                </View>

                {/* Nearby */}

                <View>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Nearby</Text>

                        <Pressable
                            onPress={handleMapPress}
                            hitSlop={8}
                            style={styles.seeAll}
                        >
                            <Text style={styles.seeAllText}>See all</Text>
                            <Ionicons
                                name="chevron-forward"
                                size={14}
                                color={colors.primaryLight}
                            />
                        </Pressable>
                    </View>

                    {useCompactList ? (
                        <View style={styles.nearbyList}>
                            {nearby.map((vault) => (
                                <Pressable
                                    key={vault.id}
                                    onPress={() => handleVaultPress(vault)}
                                    style={({ pressed }) => [
                                        styles.nearbyRow,
                                        pressed && styles.nearbyRowPressed,
                                    ]}
                                >
                                    <View style={styles.nearbyRowImageWrap}>
                                        <Image
                                            source={vault.image}
                                            style={styles.nearbyRowImage}
                                            contentFit="contain"
                                            transition={200}
                                        />

                                        <View
                                            style={[
                                                styles.nearbyRowDot,
                                                {
                                                    backgroundColor:
                                                        vault.online
                                                            ? colors.success
                                                            : colors.mutedDark,
                                                },
                                            ]}
                                        />
                                    </View>

                                    <View style={styles.nearbyRowBody}>
                                        <Text style={styles.vaultCode}>
                                            {vault.code}
                                        </Text>
                                        <Text style={styles.vaultSize}>
                                            {vault.size}
                                        </Text>

                                        <View style={styles.vaultMeta}>
                                            <Ionicons
                                                name="location-outline"
                                                size={12}
                                                color={colors.mutedDark}
                                            />
                                            <Text
                                                style={styles.vaultMetaText}
                                                numberOfLines={1}
                                            >
                                                {vault.location}
                                            </Text>
                                        </View>
                                    </View>

                                    <View style={styles.nearbyRowRight}>
                                        <Text style={styles.vaultPrice}>
                                            ₱{vault.priceHour}
                                        </Text>
                                        <Text style={styles.vaultPriceUnit}>
                                            /hr
                                        </Text>
                                    </View>
                                </Pressable>
                            ))}
                        </View>
                    ) : (
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={styles.vaultScroll}
                        >
                            {nearby.map((vault) => (
                                <Pressable
                                    key={vault.id}
                                    onPress={() => handleVaultPress(vault)}
                                    style={({ pressed }) => [
                                        styles.vaultCard,
                                        pressed && styles.vaultCardPressed,
                                    ]}
                                >
                                    <View style={styles.vaultImageWrap}>
                                        <Image
                                            source={vault.image}
                                            style={styles.vaultImage}
                                            contentFit="contain"
                                            transition={200}
                                        />

                                        <View
                                            style={[
                                                styles.vaultDot,
                                                {
                                                    backgroundColor:
                                                        vault.online
                                                            ? colors.success
                                                            : colors.mutedDark,
                                                },
                                            ]}
                                        />
                                    </View>

                                    <Text style={styles.vaultCode}>
                                        {vault.code}
                                    </Text>
                                    <Text style={styles.vaultSize}>
                                        {vault.size}
                                    </Text>

                                    <View style={styles.vaultMeta}>
                                        <Ionicons
                                            name="location-outline"
                                            size={12}
                                            color={colors.mutedDark}
                                        />
                                        <Text style={styles.vaultMetaText}>
                                            {vault.distanceKm > 0
                                                ? `${vault.distanceKm.toFixed(1)} km`
                                                : vault.location}
                                        </Text>
                                    </View>

                                    <View style={styles.vaultPriceRow}>
                                        <Text style={styles.vaultPrice}>
                                            ₱{vault.priceHour}
                                        </Text>
                                        <Text style={styles.vaultPriceUnit}>
                                            /hr
                                        </Text>
                                    </View>
                                </Pressable>
                            ))}
                        </ScrollView>
                    )}
                </View>

                {/* Empty rental */}

                {!activeRental ? (
                    <View>
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>Your rental</Text>
                        </View>

                        <View style={styles.emptyRentalCard}>
                            <View style={styles.emptyRentalIcon}>
                                <Ionicons
                                    name="cube-outline"
                                    size={22}
                                    color={colors.primaryLight}
                                />
                            </View>

                            <View style={styles.emptyRentalCopy}>
                                <Text style={styles.emptyRentalTitle}>
                                    No active rental
                                </Text>
                                <Text style={styles.emptyRentalText}>
                                    Find a vault to get started.
                                </Text>
                            </View>

                            <Ionicons
                                name="chevron-forward"
                                size={18}
                                color={colors.mutedDark}
                            />
                        </View>
                    </View>
                ) : null}

                {/* How it works */}

                <View>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>How it works</Text>
                    </View>

                    <View style={styles.stepsCard}>
                        <Step number="01" icon="search-outline" title="Find" />

                        <View style={styles.stepArrow}>
                            <Ionicons
                                name="arrow-forward"
                                size={14}
                                color={colors.mutedDark}
                            />
                        </View>

                        <Step number="02" icon="time-outline" title="Rent" />

                        <View style={styles.stepArrow}>
                            <Ionicons
                                name="arrow-forward"
                                size={14}
                                color={colors.mutedDark}
                            />
                        </View>

                        <Step
                            number="03"
                            icon="lock-open-outline"
                            title="Unlock"
                        />
                    </View>
                </View>

                <View style={styles.footer}>
                    <Text style={styles.footerText}>
                        Vaulty • Smart Rental Vault
                    </Text>
                </View>
            </ScrollView>
        </SRVBackground>
    );
}

type StepProps = {
    number: string;
    icon: keyof typeof Ionicons.glyphMap;
    title: string;
};

function Step({ number, icon, title }: StepProps) {
    return (
        <View style={styles.step}>
            <View style={styles.stepIcon}>
                <Ionicons name={icon} size={18} color={colors.primaryLight} />
            </View>
            <Text style={styles.stepNumber}>{number}</Text>
            <Text style={styles.stepTitle}>{title}</Text>
        </View>
    );
}
