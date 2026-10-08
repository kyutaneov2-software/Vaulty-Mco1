import Ionicons from "@expo/vector-icons/Ionicons";
import { router, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Pressable,
    ScrollView,
    Text,
    View,
} from "react-native";
import { Image } from "expo-image";

import SRVBackground from "../../components/SRVBackground";
import { colors } from "../../constants/theme";
import { useNotice } from "../../context/NoticeContext";
import {
    createRental,
    getPriceForDuration,
    getVaultById,
    RentalDuration,
    Vault,
} from "../../services/vaultService";
import { getMyWallet } from "../../services/walletService";
import { Wallet } from "../../types";
import { rentalStyles as styles } from "../../styles/rental.styles";
import { RentSkeleton } from "../../components/Skeletons";

/* =========================================================
   CONSTANT: DURATION_OPTIONS

   The three rental tiers. Order matters — this is the
   order they appear on screen.
========================================================= */
const DURATION_OPTIONS: {
    key: RentalDuration;
    label: string;
    sublabel: string;
}[] = [
    { key: "hour", label: "Hourly", sublabel: "1 hour" },
    { key: "day", label: "Daily", sublabel: "24 hours" },
    { key: "week", label: "Weekly", sublabel: "7 days" },
];

export default function RentScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const { showSuccessNotice } = useNotice();

    const [vault, setVault] = useState<Vault | null>(null);
    const [wallet, setWallet] = useState<Wallet | null>(null);
    const [duration, setDuration] = useState<RentalDuration>("hour");
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);

    /* ---------------------------------------------------------
       FUNCTION: load
    --------------------------------------------------------- */
    const load = useCallback(async () => {
        if (!id) return;

        try {
            const [vaultData, walletData] = await Promise.all([
                getVaultById(String(id)),
                getMyWallet().catch(() => null),
            ]);

            setVault(vaultData);
            if (walletData) setWallet(walletData);
        } catch (error) {
            console.error("Failed to load rental data:", error);
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        load();
    }, [load]);

    /* ---------------------------------------------------------
       FUNCTION: handleConfirm

       Creates the rental and routes to the active rental
       control screen. Errors surface as alerts.
    --------------------------------------------------------- */
    const handleConfirm = async () => {
        if (!vault || processing) return;

        const price = getPriceForDuration(vault, duration);
        const balance = wallet?.balance ?? 0;

        if (balance < price) {
            Alert.alert(
                "Insufficient points",
                `You need ${(price - balance).toLocaleString()} more points. Top up your wallet to continue.`,
                [
                    { text: "Not now", style: "cancel" },
                    {
                        text: "Top up",
                        onPress: () => router.push("/wallet"),
                    },
                ],
            );
            return;
        }

        try {
            setProcessing(true);

            const rental = await createRental(vault, duration);

            showSuccessNotice(
                "Vault reserved",
                `${rental.vaultCode} is yours for the next ${DURATION_OPTIONS.find((d) => d.key === duration)?.sublabel}.`,
            );

            router.replace(`/vaults/active?id=${rental.id}`);
        } catch (error) {
            console.error("Failed to create rental:", error);
            Alert.alert(
                "Unable to complete rental",
                error instanceof Error ? error.message : "Please try again.",
            );
        } finally {
            setProcessing(false);
        }
    };

    const handleBack = () => router.back();
    const handleWalletPress = () => router.push("/wallet");

    /* ---------------------------------------------------------
       LOADING
    --------------------------------------------------------- */
    if (loading) {
        return (
            <SRVBackground>
                <RentSkeleton />
            </SRVBackground>
        );
    }

    if (!vault) {
        return (
            <SRVBackground>
                <View style={styles.header}>
                    <Pressable
                        onPress={handleBack}
                        hitSlop={8}
                        style={({ pressed }) => [
                            styles.headerIcon,
                            pressed && styles.headerIconPressed,
                        ]}
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

    const price = getPriceForDuration(vault, duration);
    const balance = wallet?.balance ?? 0;
    const remaining = balance - price;
    const sufficient = remaining >= 0;

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
                    <Text style={styles.headerEyebrow}>NEW RENTAL</Text>
                    <Text style={styles.headerTitle}>Choose duration</Text>
                </View>
            </View>

            {/* =================================================
                SCROLL
            ================================================= */}

            <ScrollView
                style={styles.page}
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
            >
                {/* ---------- VAULT PREVIEW ---------- */}

                <View style={styles.vaultPreview}>
                    <View style={styles.vaultImageWrap}>
                        <Image
                            source={vault.image}
                            style={styles.vaultImage}
                            contentFit="contain"
                            transition={200}
                        />
                    </View>

                    <View style={styles.vaultInfo}>
                        <Text style={styles.vaultCode}>{vault.code}</Text>
                        <Text style={styles.vaultMeta}>
                            {vault.size} • {vault.location}
                        </Text>

                        <View style={styles.onlineRow}>
                            <View
                                style={[
                                    styles.onlineDot,
                                    {
                                        backgroundColor: vault.online
                                            ? colors.success
                                            : colors.danger,
                                    },
                                ]}
                            />
                            <Text style={styles.onlineText}>
                                {vault.online ? "Online" : "Offline"}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* ---------- DURATION PICKER ---------- */}

                <View style={styles.section}>
                    <Text style={styles.sectionEyebrow}>DURATION</Text>

                    <View style={styles.durationRow}>
                        {DURATION_OPTIONS.map((opt) => {
                            const active = opt.key === duration;
                            const price = getPriceForDuration(vault, opt.key);

                            return (
                                <Pressable
                                    key={opt.key}
                                    onPress={() => setDuration(opt.key)}
                                    style={({ pressed }) => [
                                        styles.durationTile,
                                        active && styles.durationTileActive,
                                        pressed && styles.durationTilePressed,
                                    ]}
                                >
                                    <Text
                                        style={[
                                            styles.durationLabel,
                                            active &&
                                                styles.durationLabelActive,
                                        ]}
                                    >
                                        {opt.label}
                                    </Text>

                                    <Text
                                        style={[
                                            styles.durationPrice,
                                            active &&
                                                styles.durationPriceActive,
                                        ]}
                                    >
                                        ₱{price.toLocaleString()}
                                    </Text>

                                    <Text style={styles.durationSublabel}>
                                        {opt.sublabel}
                                    </Text>
                                </Pressable>
                            );
                        })}
                    </View>
                </View>

                {/* ---------- SUMMARY ---------- */}

                <View style={styles.section}>
                    <Text style={styles.sectionEyebrow}>SUMMARY</Text>

                    <View style={styles.summaryCard}>
                        <View style={styles.summaryRow}>
                            <Text style={styles.summaryLabel}>Vault rate</Text>
                            <Text style={styles.summaryValue}>
                                ₱{price.toLocaleString()}
                            </Text>
                        </View>

                        <View style={styles.summaryRow}>
                            <Text style={styles.summaryLabel}>
                                Access duration
                            </Text>
                            <Text style={styles.summaryValue}>
                                {
                                    DURATION_OPTIONS.find(
                                        (d) => d.key === duration,
                                    )?.sublabel
                                }
                            </Text>
                        </View>

                        <View style={styles.summaryDivider} />

                        <View style={styles.summaryRow}>
                            <Text style={styles.summaryTotalLabel}>Total</Text>
                            <Text style={styles.summaryTotalValue}>
                                ₱{price.toLocaleString()}
                            </Text>
                        </View>

                        <Pressable
                            onPress={handleWalletPress}
                            style={({ pressed }) => [
                                styles.walletRow,
                                pressed && styles.walletRowPressed,
                            ]}
                        >
                            <Ionicons
                                name="wallet-outline"
                                size={15}
                                color={colors.primaryLight}
                            />
                            <Text style={styles.walletRowLabel}>
                                Wallet balance
                            </Text>
                            <Text style={styles.walletRowValue}>
                                {balance.toLocaleString()} pts
                            </Text>
                        </Pressable>

                        <View style={styles.remainingRow}>
                            <Text style={styles.remainingLabel}>
                                After payment
                            </Text>
                            <View style={styles.remainingValueWrap}>
                                <Text
                                    style={[
                                        styles.remainingValue,
                                        {
                                            color: sufficient
                                                ? colors.success
                                                : colors.danger,
                                        },
                                    ]}
                                >
                                    {remaining.toLocaleString()} pts
                                </Text>
                                <Ionicons
                                    name={
                                        sufficient
                                            ? "checkmark-circle"
                                            : "alert-circle"
                                    }
                                    size={15}
                                    color={
                                        sufficient
                                            ? colors.success
                                            : colors.danger
                                    }
                                />
                            </View>
                        </View>
                    </View>

                    {!sufficient && (
                        <View style={styles.warningCard}>
                            <Ionicons
                                name="alert-circle-outline"
                                size={18}
                                color={colors.danger}
                            />
                            <Text style={styles.warningText}>
                                You need {Math.abs(remaining).toLocaleString()}{" "}
                                more points. Top up your wallet to continue.
                            </Text>
                        </View>
                    )}
                </View>
            </ScrollView>

            {/* =================================================
                STICKY BOTTOM CTA
            ================================================= */}

            <View style={styles.footerCta}>
                <View style={styles.footerPriceBlock}>
                    <Text style={styles.footerPriceLabel}>TOTAL</Text>
                    <Text style={styles.footerPrice}>
                        ₱{price.toLocaleString()}
                    </Text>
                </View>

                <Pressable
                    onPress={handleConfirm}
                    disabled={processing || !vault.online}
                    style={({ pressed }) => [
                        styles.footerButton,
                        (!vault.online || processing) &&
                            styles.footerButtonDisabled,
                        pressed && !processing && styles.footerButtonPressed,
                    ]}
                >
                    {processing ? (
                        <ActivityIndicator size="small" color={colors.white} />
                    ) : (
                        <Text style={styles.footerButtonText}>
                            {!vault.online
                                ? "Vault offline"
                                : sufficient
                                  ? "Confirm rental"
                                  : "Top up first"}
                        </Text>
                    )}
                </Pressable>
            </View>
        </SRVBackground>
    );
}
