import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";

import SRVBackground from "../../components/SRVBackground";
import { colors } from "../../constants/theme";
import { getAvailableVaults, Vault } from "../../services/vaultService";
import { vaultsStyles as styles } from "../../styles/vaults.styles";

/* =========================================================
   CONSTANT: PIN_POSITIONS

   Pre-baked positions for up to 5 pins on the placeholder
   grid. When the real map lands, these are replaced by
   real lat/lng markers.

   Positions are spread so pins never overlap and read
   naturally as "scattered points" on the tile.
========================================================= */
const PIN_POSITIONS: { top: string; left: string }[] = [
    { top: "30%", left: "28%" },
    { top: "55%", left: "62%" },
    { top: "22%", left: "68%" },
    { top: "68%", left: "34%" },
    { top: "42%", left: "48%" },
];

export default function VaultMapScreen() {
    const [vaults, setVaults] = useState<Vault[]>([]);
    const [selectedVault, setSelectedVault] = useState<Vault | null>(null);
    const [loading, setLoading] = useState(true);

    /* ---------------------------------------------------------
       Load vaults
    --------------------------------------------------------- */
    const load = useCallback(async () => {
        try {
            const data = await getAvailableVaults();
            setVaults(data);
        } catch (error) {
            console.error("Failed to load vaults:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        load();
    }, [load]);

    /* ---------------------------------------------------------
       Navigation
    --------------------------------------------------------- */
    const handleBack = () => router.back();
    const handleViewVault = (vault: Vault) =>
        router.push(`/vaults/${vault.id}`);

    const onlineCount = vaults.filter((v) => v.online).length;

    /* ---------------------------------------------------------
       Loading
    --------------------------------------------------------- */
    if (loading) {
        return (
            <SRVBackground>
                <View style={styles.loading}>
                    <ActivityIndicator size="large" color={colors.primary} />
                    <Text style={styles.loadingText}>Loading map...</Text>
                </View>
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
                    <Text style={styles.headerEyebrow}>MAP</Text>
                    <Text style={styles.headerTitle}>
                        {onlineCount} {onlineCount === 1 ? "vault" : "vaults"}{" "}
                        online
                    </Text>
                </View>
            </View>

            {/* =================================================
                MAP CONTAINER
            ================================================= */}

            <View style={styles.mapContainer}>
                <Pressable
                    onPress={() => setSelectedVault(vaults[0] ?? null)}
                    style={styles.mapArea}
                >
                    {/* Dynamic pins — one per vault */}

                    {vaults.map((v, i) => {
                        const pos = PIN_POSITIONS[i % PIN_POSITIONS.length];
                        const isSelected = selectedVault?.id === v.id;

                        return (
                            <Pressable
                                key={v.id}
                                onPress={() => setSelectedVault(v)}
                                hitSlop={10}
                                style={[
                                    styles.mapPin,
                                    {
                                        top: pos.top,
                                        left: pos.left,
                                        backgroundColor: v.online
                                            ? colors.primary
                                            : colors.mutedDark,
                                        transform: [
                                            { scale: isSelected ? 1.5 : 1 },
                                        ],
                                    },
                                ]}
                            />
                        );
                    })}

                    {/* Badge */}

                    <View style={styles.mapBadge}>
                        <View style={styles.mapBadgeDot} />
                        <Text style={styles.mapBadgeText}>
                            {onlineCount}{" "}
                            {onlineCount === 1 ? "vault" : "vaults"} online
                        </Text>
                    </View>
                </Pressable>

                {/* Banner */}

                <View style={styles.permissionBanner}>
                    <Ionicons
                        name="construct-outline"
                        size={14}
                        color={colors.warning}
                    />
                    <Text style={styles.permissionText}>
                        Interactive map coming in dev build
                    </Text>
                </View>
            </View>

            {/* =================================================
                BOTTOM SHEET
            ================================================= */}

            {selectedVault ? (
                <View style={styles.vaultSheet}>
                    <Pressable
                        onPress={() => handleViewVault(selectedVault)}
                        style={({ pressed }) => [
                            styles.sheetBody,
                            pressed && styles.sheetBodyPressed,
                        ]}
                    >
                        <View style={styles.sheetHeader}>
                            <View style={styles.sheetIcon}>
                                <Ionicons
                                    name="cube-outline"
                                    size={20}
                                    color={colors.primaryLight}
                                />
                            </View>

                            <View style={styles.sheetCopy}>
                                <Text style={styles.sheetCode}>
                                    {selectedVault.code}
                                </Text>
                                <Text style={styles.sheetMeta}>
                                    {selectedVault.size} ·{" "}
                                    {selectedVault.location}
                                </Text>
                            </View>

                            <View
                                style={[
                                    styles.sheetDot,
                                    {
                                        backgroundColor: selectedVault.online
                                            ? colors.success
                                            : colors.mutedDark,
                                    },
                                ]}
                            />
                        </View>

                        <View style={styles.sheetStats}>
                            <View style={styles.sheetStat}>
                                <Text style={styles.sheetStatLabel}>
                                    HOURLY
                                </Text>
                                <Text style={styles.sheetStatValue}>
                                    ₱{selectedVault.priceHour}
                                </Text>
                            </View>

                            <View style={styles.sheetDivider} />

                            <View style={styles.sheetStat}>
                                <Text style={styles.sheetStatLabel}>DAILY</Text>
                                <Text style={styles.sheetStatValue}>
                                    ₱{selectedVault.priceDay}
                                </Text>
                            </View>

                            <View style={styles.sheetDivider} />

                            <View style={styles.sheetStat}>
                                <Text style={styles.sheetStatLabel}>
                                    BATTERY
                                </Text>
                                <Text style={styles.sheetStatValue}>
                                    {selectedVault.batteryPct}%
                                </Text>
                            </View>
                        </View>

                        <View style={styles.sheetCta}>
                            <Text style={styles.sheetCtaText}>View vault</Text>
                            <Ionicons
                                name="arrow-forward"
                                size={16}
                                color={colors.white}
                            />
                        </View>
                    </Pressable>

                    <Pressable
                        onPress={() => setSelectedVault(null)}
                        hitSlop={8}
                        style={styles.sheetClose}
                    >
                        <Ionicons name="close" size={18} color={colors.muted} />
                    </Pressable>
                </View>
            ) : null}
        </SRVBackground>
    );
}
