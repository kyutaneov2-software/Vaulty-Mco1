import Ionicons from "@expo/vector-icons/Ionicons";
import { router, useLocalSearchParams } from "expo-router";
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
import { getVaultById, Vault } from "../../services/vaultService";
import { vaultsStyles as styles } from "../../styles/vaults.styles";
import { DetailSkeleton } from "../../components/Skeletons";

export default function VaultDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();

    const [vault, setVault] = useState<Vault | null>(null);
    const [loading, setLoading] = useState(true);

    const load = useCallback(async () => {
        if (!id) return;
        const data = await getVaultById(String(id));
        setVault(data);
        setLoading(false);
    }, [id]);

    useEffect(() => {
        load();
    }, [load]);

    const handleBack = () => router.back();
    const handleRent = () => {
        if (!vault) return;
        router.push(`/vaults/rent?id=${vault.id}`);
    };

    if (loading) {
        return (
            <SRVBackground>
                <DetailSkeleton />
            </SRVBackground>
        );
    }

    if (!vault) {
        return (
            <SRVBackground>
                <View style={styles.header}>
                    <Pressable
                        onPress={handleBack}
                        style={styles.headerIcon}
                        hitSlop={8}
                    >
                        <Ionicons
                            name="arrow-back"
                            size={20}
                            color={colors.text}
                        />
                    </Pressable>
                    <View style={styles.headerCopy}>
                        <Text style={styles.headerTitle}>Vault not found</Text>
                    </View>
                </View>
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
                    <Text style={styles.headerEyebrow}>VAULT</Text>
                    <Text style={styles.headerTitle}>{vault.code}</Text>
                </View>

                <Pressable
                    hitSlop={8}
                    style={({ pressed }) => [
                        styles.headerIcon,
                        pressed && styles.headerIconPressed,
                    ]}
                >
                    <Ionicons
                        name="heart-outline"
                        size={18}
                        color={colors.text}
                    />
                </Pressable>
            </View>

            {/* =================================================
                SCROLL
            ================================================= */}

            <ScrollView
                style={styles.page}
                contentContainerStyle={styles.detailContent}
                showsVerticalScrollIndicator={false}
            >
                {/* ---------- HERO IMAGE ---------- */}

                <View style={styles.detailHero}>
                    <Image
                        source={vault.image}
                        style={styles.detailHeroImage}
                        contentFit="contain"
                        transition={200}
                    />
                </View>

                {/* ---------- TITLE ---------- */}

                <View style={styles.detailTitleBlock}>
                    <Text style={styles.detailCode}>{vault.code}</Text>
                    <Text style={styles.detailSize}>
                        {vault.size} Vault • {vault.location}
                    </Text>
                </View>

                {/* ---------- DEVICE STATUS ---------- */}

                <View style={styles.deviceCard}>
                    <View style={styles.deviceRow}>
                        <View style={styles.deviceItem}>
                            <View
                                style={[
                                    styles.deviceDot,
                                    {
                                        backgroundColor: vault.online
                                            ? colors.success
                                            : colors.danger,
                                    },
                                ]}
                            />
                            <Text style={styles.deviceLabel}>Device</Text>
                            <Text style={styles.deviceValue}>
                                {vault.online ? "Online" : "Offline"}
                            </Text>
                        </View>

                        <View style={styles.deviceDivider} />

                        <View style={styles.deviceItem}>
                            <Ionicons
                                name="battery-half-outline"
                                size={16}
                                color={colors.primaryLight}
                            />
                            <Text style={styles.deviceLabel}>Battery</Text>
                            <Text style={styles.deviceValue}>
                                {vault.batteryPct}%
                            </Text>
                        </View>

                        <View style={styles.deviceDivider} />

                        <View style={styles.deviceItem}>
                            <Ionicons
                                name="wifi-outline"
                                size={16}
                                color={colors.primaryLight}
                            />
                            <Text style={styles.deviceLabel}>Signal</Text>
                            <Text style={styles.deviceValue}>
                                {vault.connection}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* ---------- PRICING ---------- */}

                <View>
                    <Text style={styles.sectionTitle}>Rental pricing</Text>

                    <View style={styles.priceGrid}>
                        <PriceTile
                            label="Hourly"
                            price={vault.priceHour}
                            unit="/hour"
                        />
                        <PriceTile
                            label="Daily"
                            price={vault.priceDay}
                            unit="/day"
                            badge="Popular"
                        />
                        <PriceTile
                            label="Weekly"
                            price={vault.priceWeek}
                            unit="/week"
                            badge="Save 15%"
                        />
                    </View>
                </View>

                {/* ---------- LOCATION ---------- */}

                <View>
                    <Text style={styles.sectionTitle}>Location</Text>

                    <View style={styles.locationCard}>
                        <View style={styles.locationIcon}>
                            <Ionicons
                                name="location-outline"
                                size={20}
                                color={colors.primaryLight}
                            />
                        </View>

                        <View style={styles.locationCopy}>
                            <Text style={styles.locationTitle}>
                                {vault.location}
                            </Text>
                            <Text style={styles.locationText}>
                                {vault.distanceKm.toFixed(1)} km from your
                                current location
                            </Text>
                        </View>
                    </View>
                </View>
            </ScrollView>

            {/* =================================================
                STICKY BOTTOM CTA
            ================================================= */}

            <View style={styles.footerCta}>
                <View style={styles.footerPriceBlock}>
                    <Text style={styles.footerPriceLabel}>FROM</Text>
                    <Text style={styles.footerPrice}>
                        ₱{vault.priceHour}
                        <Text style={styles.footerPriceUnit}>/hr</Text>
                    </Text>
                </View>

                <Pressable
                    onPress={handleRent}
                    disabled={!vault.online}
                    style={({ pressed }) => [
                        styles.footerButton,
                        !vault.online && styles.footerButtonDisabled,
                        pressed && styles.footerButtonPressed,
                    ]}
                >
                    <Text style={styles.footerButtonText}>
                        {vault.online ? "Rent vault" : "Unavailable"}
                    </Text>
                </Pressable>
            </View>
        </SRVBackground>
    );
}

/* =========================================================
   COMPONENT: PriceTile
========================================================= */

type PriceTileProps = {
    label: string;
    price: number;
    unit: string;
    badge?: string;
};

function PriceTile({ label, price, unit, badge }: PriceTileProps) {
    return (
        <View style={styles.priceTile}>
            <Text style={styles.priceTileLabel}>{label}</Text>
            <Text style={styles.priceTileValue}>
                ₱{price}
                <Text style={styles.priceTileUnit}>{unit}</Text>
            </Text>
            {badge ? (
                <View style={styles.priceTileBadge}>
                    <Text style={styles.priceTileBadgeText}>{badge}</Text>
                </View>
            ) : null}
        </View>
    );
}
