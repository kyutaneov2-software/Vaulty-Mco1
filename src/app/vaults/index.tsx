import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
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

    const onlineCount = vaults.filter((v) => v.online).length;
    const handleBack = () => router.back();
    const handleMapPress = () => router.push("/vaults/map");

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
                HEADER
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
                    onPress={handleMapPress}
                    style={({ pressed }) => [
                        styles.mapArea,
                        pressed && styles.mapAreaPressed,
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

                    {vaults.map((v, i) => {
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
                            <View style={styles.vaultImageWrap}>
                                <Image
                                    source={vault.image}
                                    style={styles.vaultImage}
                                    contentFit="contain"
                                    transition={200}
                                />
                            </View>

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
                                        {vault.distanceKm > 0
                                            ? `${vault.distanceKm.toFixed(1)} km away`
                                            : vault.location}
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
