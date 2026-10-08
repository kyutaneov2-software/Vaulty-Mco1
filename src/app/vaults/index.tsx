import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
    ActivityIndicator,
    Pressable,
    ScrollView,
    Text,
    View,
} from "react-native";
import { Image } from "expo-image";

import SRVBackground from "../../components/SRVBackground";
import { colors } from "../../constants/theme";
import {
    getAvailableVaults,
    Vault,
    VaultSize,
} from "../../services/vaultService";
import { vaultsStyles as styles } from "../../styles/vaults.styles";
import { VaultsSkeleton } from "../../components/Skeletons";

type Filter = "All" | VaultSize;

const FILTERS: Filter[] = ["All", "Small", "Medium", "Large"];

export default function VaultsBrowseScreen() {
    const [vaults, setVaults] = useState<Vault[]>([]);
    const [filter, setFilter] = useState<Filter>("All");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const loadVaults = useCallback(async () => {
        try {
            setError("");
            const data = await getAvailableVaults();
            setVaults(data);
        } catch (err) {
            console.error("Failed to load vaults:", err);
            setError("Unable to load nearby vaults.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadVaults();
    }, [loadVaults]);

    const visible =
        filter === "All" ? vaults : vaults.filter((v) => v.size === filter);

    const handleBack = () => router.back();

    if (loading) {
        return (
            <SRVBackground>
                <VaultsSkeleton />
            </SRVBackground>
        );
    }

    return (
        <SRVBackground>
            {/* =================================================
                STICKY HEADER
            ================================================= */}

            <View style={styles.header}>
                <Pressable
                    onPress={handleBack}
                    hitSlop={8}
                    style={({ pressed }) => [
                        styles.headerIcon,
                        pressed && styles.headerIconPressed,
                    ]}
                >
                    <Ionicons name="arrow-back" size={20} color={colors.text} />
                </Pressable>

                <View style={styles.headerCopy}>
                    <Text style={styles.headerEyebrow}>VAULT DISCOVERY</Text>
                    <Text style={styles.headerTitle}>Nearby vaults</Text>
                </View>

                <Pressable
                    hitSlop={8}
                    style={({ pressed }) => [
                        styles.headerIcon,
                        pressed && styles.headerIconPressed,
                    ]}
                >
                    <Ionicons name="search" size={18} color={colors.text} />
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
                {/* ---------- MAP ---------- */}

                <Pressable
                    style={({ pressed }) => [
                        styles.mapArea,
                        pressed && styles.mapAreaPressed,
                    ]}
                >
                    <View style={styles.mapPin} />
                    <View
                        style={[styles.mapPin, { top: "35%", left: "60%" }]}
                    />
                    <View
                        style={[styles.mapPin, { top: "65%", left: "30%" }]}
                    />
                    <View
                        style={[styles.mapPin, { top: "55%", left: "75%" }]}
                    />
                    <View
                        style={[styles.mapPin, { top: "20%", left: "82%" }]}
                    />

                    <View style={styles.mapBadge}>
                        <View style={styles.mapBadgeDot} />
                        <Text style={styles.mapBadgeText}>
                            {vaults.filter((v) => v.online).length} vaults
                            online
                        </Text>
                    </View>

                    <View style={styles.mapExpand}>
                        <Ionicons
                            name="expand-outline"
                            size={16}
                            color={colors.text}
                        />
                    </View>
                </Pressable>

                {/* ---------- FILTERS ---------- */}

                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.filterRow}
                >
                    {FILTERS.map((f) => {
                        const active = f === filter;
                        return (
                            <Pressable
                                key={f}
                                onPress={() => setFilter(f)}
                                style={({ pressed }) => [
                                    styles.filterPill,
                                    active && styles.filterPillActive,
                                    pressed && styles.filterPillPressed,
                                ]}
                            >
                                <Text
                                    style={[
                                        styles.filterPillText,
                                        active && styles.filterPillTextActive,
                                    ]}
                                >
                                    {f}
                                </Text>
                            </Pressable>
                        );
                    })}
                </ScrollView>

                {/* ---------- ERROR ---------- */}

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

                {/* ---------- LIST ---------- */}

                <View style={styles.listHeader}>
                    <Text style={styles.listCount}>
                        {visible.length}{" "}
                        {visible.length === 1 ? "vault" : "vaults"}
                    </Text>
                </View>

                <View style={styles.list}>
                    {visible.map((vault) => (
                        <Pressable
                            key={vault.id}
                            onPress={() => router.push(`/vaults/${vault.id}`)}
                            style={({ pressed }) => [
                                styles.vaultRow,
                                pressed && styles.vaultRowPressed,
                            ]}
                        >
                            {/* Image */}

                            <View style={styles.vaultImageWrap}>
                                <Image
                                    source={vault.image}
                                    style={styles.vaultImage}
                                    contentFit="contain"
                                    transition={200}
                                />
                            </View>

                            {/* Body */}

                            <View style={styles.vaultBody}>
                                <View style={styles.vaultTitleRow}>
                                    <Text style={styles.vaultCode}>
                                        {vault.code}
                                    </Text>

                                    <View
                                        style={[
                                            styles.vaultDot,
                                            {
                                                backgroundColor: vault.online
                                                    ? colors.success
                                                    : colors.mutedDark,
                                            },
                                        ]}
                                    />
                                </View>

                                <Text style={styles.vaultSize}>
                                    {vault.size} • {vault.location}
                                </Text>

                                <View style={styles.vaultMeta}>
                                    <Ionicons
                                        name="location-outline"
                                        size={12}
                                        color={colors.mutedDark}
                                    />
                                    <Text style={styles.vaultMetaText}>
                                        {vault.distanceKm.toFixed(1)} km away
                                    </Text>
                                </View>

                                <View style={styles.vaultPriceRow}>
                                    <Text style={styles.vaultPrice}>
                                        ₱{vault.priceHour}
                                    </Text>
                                    <Text style={styles.vaultPriceUnit}>
                                        /hour
                                    </Text>
                                </View>
                            </View>

                            {/* Chevron */}

                            <Ionicons
                                name="chevron-forward"
                                size={18}
                                color={colors.mutedDark}
                            />
                        </Pressable>
                    ))}
                </View>
            </ScrollView>
        </SRVBackground>
    );
}
