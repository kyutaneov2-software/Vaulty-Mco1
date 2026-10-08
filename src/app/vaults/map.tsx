import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import { WebView } from "react-native-webview";

import SRVBackground from "../../components/SRVBackground";
import { colors } from "../../constants/theme";
import { buildMapHtml } from "../../services/mapHtml";
import { getAvailableVaults, Vault } from "../../services/vaultService";
import { vaultsStyles as styles } from "../../styles/vaults.styles";

/* =========================================================
   CONSTANT: NWSSU_CENTER
========================================================= */
const NWSSU_CENTER = {
    latitude: 12.0675,
    longitude: 124.5948,
};

export default function VaultMapScreen() {
    const webViewRef = useRef<WebView>(null);

    const [vaults, setVaults] = useState<Vault[]>([]);
    const [selectedVault, setSelectedVault] = useState<Vault | null>(null);
    const [loading, setLoading] = useState(true);
    const [mapReady, setMapReady] = useState(false);
    const [html, setHtml] = useState<string>("");

    /* ---------------------------------------------------------
       Load vaults, then build the HTML once
    --------------------------------------------------------- */
    const load = useCallback(async () => {
        try {
            const data = await getAvailableVaults();
            setVaults(data);
            setHtml(buildMapHtml(data, NWSSU_CENTER));
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
       Handle messages from the WebView
    --------------------------------------------------------- */
    const handleMessage = (event: any) => {
        try {
            const msg = JSON.parse(event.nativeEvent.data);

            if (msg.type === "map_ready") {
                setMapReady(true);
            } else if (msg.type === "marker_tap") {
                const v = vaults.find((x) => x.id === msg.id);
                if (v) setSelectedVault(v);
            }
        } catch (error) {
            console.error("Map message parse failed:", error);
        }
    };

    /* ---------------------------------------------------------
       When a vault is selected from the strip, recenter the map
    --------------------------------------------------------- */
    const handleStripSelect = (vault: Vault) => {
        setSelectedVault(vault);

        webViewRef.current?.injectJavaScript(`
            window.setCenter(${vault.latitude}, ${vault.longitude});
            true;
        `);
    };

    /* ---------------------------------------------------------
       Clear selection → reset map view
    --------------------------------------------------------- */
    const handleClearSelection = () => {
        setSelectedVault(null);
        webViewRef.current?.injectJavaScript(`
            window.resetView();
            true;
        `);
    };

    /* ---------------------------------------------------------
       Navigation
    --------------------------------------------------------- */
    const handleBack = () => router.back();
    const handleViewVault = (vault: Vault) =>
        router.push(`/vaults/${vault.id}`);

    /* ---------------------------------------------------------
       Derived
    --------------------------------------------------------- */
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
                MAP — WebView with embedded Leaflet
            ================================================= */}

            <View style={styles.mapContainer}>
                <WebView
                    ref={webViewRef}
                    source={{ html }}
                    style={styles.mapView}
                    originWhitelist={["*"]}
                    javaScriptEnabled
                    domStorageEnabled
                    onMessage={handleMessage}
                    onError={(e) =>
                        console.error("WebView error:", e.nativeEvent)
                    }
                    androidLayerType="hardware"
                    startInLoadingState
                    renderLoading={() => (
                        <View style={styles.mapLoader}>
                            <ActivityIndicator
                                size="large"
                                color={colors.primary}
                            />
                        </View>
                    )}
                />

                {!mapReady ? (
                    <View style={styles.mapLoaderOverlay}>
                        <ActivityIndicator
                            size="small"
                            color={colors.primaryLight}
                        />
                        <Text style={styles.mapLoaderText}>
                            Loading tiles...
                        </Text>
                    </View>
                ) : null}
            </View>

            {/* =================================================
                VAULT SELECTOR STRIP
            ================================================= */}

            <View style={styles.vaultStrip}>
                {vaults.map((v) => {
                    const isSelected = selectedVault?.id === v.id;

                    return (
                        <Pressable
                            key={v.id}
                            onPress={() => handleStripSelect(v)}
                            style={({ pressed }) => [
                                styles.stripCard,
                                isSelected && styles.stripCardActive,
                                pressed && styles.stripCardPressed,
                            ]}
                        >
                            <View style={styles.stripIcon}>
                                <Ionicons
                                    name="cube-outline"
                                    size={16}
                                    color={colors.primaryLight}
                                />
                            </View>

                            <View style={styles.stripCopy}>
                                <Text style={styles.stripCode}>{v.code}</Text>
                                <Text style={styles.stripMeta}>
                                    {v.size} · ₱{v.priceHour}/hr
                                </Text>
                            </View>

                            <View
                                style={[
                                    styles.stripDot,
                                    {
                                        backgroundColor: v.online
                                            ? colors.success
                                            : colors.mutedDark,
                                    },
                                ]}
                            />
                        </Pressable>
                    );
                })}
            </View>

            {/* =================================================
                SELECTED VAULT BOTTOM SHEET
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
                        onPress={handleClearSelection}
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
