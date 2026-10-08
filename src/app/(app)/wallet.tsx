import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
    ActivityIndicator,
    Linking,
    Pressable,
    RefreshControl,
    ScrollView,
    Text,
    View,
} from "react-native";

import SRVBackground from "../../components/SRVBackground";
import { colors } from "../../constants/theme";
import {
    devTopUp,
    getMyTransactions,
    getMyWallet,
} from "../../services/walletService";
import { createPayMongoCheckout } from "../../services/paymentService";
import { Wallet, WalletTransaction } from "../../types";
import { walletStyles as styles } from "../../styles/wallet.styles";
import { WalletSkeleton } from "../../components/Skeletons";

/* =========================================================
   FUNCTION: transactionIcon

   Returns the Ionicons icon associated with a wallet
   transaction type.
========================================================= */
const transactionIcon = (
    type: WalletTransaction["type"],
): keyof typeof Ionicons.glyphMap => {
    switch (type) {
        case "top_up":
            return "add-circle-outline";
        case "rental":
            return "cube-outline";
        case "refund":
            return "return-up-back-outline";
        case "promo":
            return "gift-outline";
        default:
            return "swap-horizontal-outline";
    }
};

/* =========================================================
   FUNCTION: transactionLabel

   Returns the display label for a wallet transaction,
   using the stored description when available.
========================================================= */
const transactionLabel = (transaction: WalletTransaction) => {
    if (transaction.description) {
        return transaction.description;
    }

    switch (transaction.type) {
        case "top_up":
            return "Points top up";
        case "rental":
            return "Vault rental";
        case "refund":
            return "Rental refund";
        case "promo":
            return "Promotional points";
        default:
            return "Wallet adjustment";
    }
};

/* =========================================================
   FUNCTION: groupByDate

   Groups transactions by date and returns an ordered list
   of date sections, each with its own transactions.
========================================================= */
function groupByDate(
    transactions: WalletTransaction[],
): { label: string; items: WalletTransaction[] }[] {
    const groups: Record<string, WalletTransaction[]> = {};

    for (const tx of transactions) {
        const date = new Date(tx.createdAt);
        const key = date.toDateString();
        if (!groups[key]) groups[key] = [];
        groups[key].push(tx);
    }

    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 86400000).toDateString();

    return Object.entries(groups).map(([key, items]) => {
        let label: string;
        if (key === today) label = "Today";
        else if (key === yesterday) label = "Yesterday";
        else label = new Date(key).toLocaleDateString();

        return { label, items };
    });
}

/* =========================================================
   COMPONENT: WalletScreen
========================================================= */
export default function WalletScreen() {
    const [wallet, setWallet] = useState<Wallet | null>(null);
    const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState("");
    const [topUpAmount, setTopUpAmount] = useState<number | null>(null);
    const [payMongoLoading, setPayMongoLoading] = useState(false);

    /* ---------------------------------------------------------
       FUNCTION: loadWallet
    --------------------------------------------------------- */
    const loadWallet = useCallback(async () => {
        try {
            setError("");
            const [walletData, transactionData] = await Promise.all([
                getMyWallet(),
                getMyTransactions(),
            ]);
            setWallet(walletData);
            setTransactions(transactionData);
        } catch (error) {
            console.error("Failed to load wallet:", error);
            setError(
                error instanceof Error
                    ? error.message
                    : "Unable to load your wallet.",
            );
        }
    }, []);

    /* ---------------------------------------------------------
       FUNCTION: handleTopUp
    --------------------------------------------------------- */
    const handleTopUp = async (amount: number) => {
        try {
            setTopUpAmount(amount);
            setError("");
            await devTopUp(amount);
            await loadWallet();
        } catch (error) {
            console.error("Development top-up failed:", error);
            setError(
                error instanceof Error
                    ? error.message
                    : "Unable to complete top-up.",
            );
        } finally {
            setTopUpAmount(null);
        }
    };

    /* ---------------------------------------------------------
       FUNCTION: handlePayMongoCheckout
    --------------------------------------------------------- */
    const handlePayMongoCheckout = async () => {
        if (payMongoLoading) return;

        try {
            setPayMongoLoading(true);
            setError("");

            const checkout = await createPayMongoCheckout({
                amount: 100,
                paymentType: "wallet_top_up",
            });

            const canOpen = await Linking.canOpenURL(checkout.checkoutUrl);
            if (!canOpen) {
                throw new Error(
                    "Your device could not open the PayMongo checkout.",
                );
            }

            await Linking.openURL(checkout.checkoutUrl);
        } catch (error) {
            console.error("PayMongo checkout failed:", error);
            setError(
                error instanceof Error
                    ? error.message
                    : "Unable to start the PayMongo checkout.",
            );
        } finally {
            setPayMongoLoading(false);
        }
    };

    /* ---------------------------------------------------------
       FUNCTION: handleRefresh
    --------------------------------------------------------- */
    const handleRefresh = async () => {
        try {
            setRefreshing(true);
            setError("");
            await loadWallet();
        } finally {
            setRefreshing(false);
        }
    };

    /* ---------------------------------------------------------
       EFFECT: initial load
    --------------------------------------------------------- */
    useEffect(() => {
        loadWallet().finally(() => setLoading(false));
    }, [loadWallet]);

    const grouped = useMemo(() => groupByDate(transactions), [transactions]);

    const handleBack = () => router.back();

    /* ---------------------------------------------------------
       LOADING
    --------------------------------------------------------- */
    if (loading) {
        return (
            <SRVBackground>
                <WalletSkeleton />
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
                    <Text style={styles.headerEyebrow}>VAULTY WALLET</Text>
                    <Text style={styles.headerTitle}>Wallet</Text>
                </View>

                <Pressable
                    hitSlop={8}
                    style={({ pressed }) => [
                        styles.headerIcon,
                        pressed && styles.headerIconPressed,
                    ]}
                >
                    <Ionicons
                        name="ellipsis-horizontal"
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
                contentContainerStyle={styles.content}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={handleRefresh}
                        tintColor={colors.primary}
                    />
                }
                showsVerticalScrollIndicator={false}
            >
                {/* ---------- BALANCE ---------- */}

                <View style={styles.balanceCard}>
                    <View style={styles.balanceTop}>
                        <View style={styles.walletBadge}>
                            <Ionicons
                                name="wallet"
                                size={18}
                                color={colors.primaryLight}
                            />
                        </View>

                        <Text style={styles.balanceLabel}>
                            AVAILABLE BALANCE
                        </Text>
                    </View>

                    <Text style={styles.balance}>
                        {(wallet?.balance ?? 0).toLocaleString()}
                    </Text>

                    <Text style={styles.balanceUnit}>VAULTY POINTS</Text>
                </View>

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

                {/* ---------- QUICK TOP UP ---------- */}

                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Quick top up</Text>
                        <Text style={styles.sectionHint}>Instant</Text>
                    </View>

                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.topUpGrid}
                    >
                        {[100, 250, 500, 1000, 2500, 5000].map((amount) => {
                            const active = topUpAmount === amount;

                            return (
                                <Pressable
                                    key={amount}
                                    onPress={() => handleTopUp(amount)}
                                    disabled={
                                        topUpAmount !== null || payMongoLoading
                                    }
                                    style={({ pressed }) => [
                                        styles.topUpButton,
                                        active && styles.topUpButtonActive,
                                        pressed && styles.topUpButtonPressed,
                                    ]}
                                >
                                    {active ? (
                                        <ActivityIndicator
                                            size="small"
                                            color={colors.primaryLight}
                                        />
                                    ) : (
                                        <>
                                            <Text style={styles.topUpAmount}>
                                                +{amount}
                                            </Text>
                                            <Text style={styles.topUpUnit}>
                                                PTS
                                            </Text>
                                        </>
                                    )}
                                </Pressable>
                            );
                        })}
                    </ScrollView>

                    <Text style={styles.devHint}>
                        Development top-ups do not process real payments.
                    </Text>
                </View>

                {/* ---------- PAY WITH CARD ---------- */}

                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Pay with card</Text>
                        <Text style={styles.sectionHint}>PayMongo</Text>
                    </View>

                    <Pressable
                        onPress={handlePayMongoCheckout}
                        disabled={payMongoLoading}
                        style={({ pressed }) => [
                            styles.payCard,
                            pressed &&
                                !payMongoLoading &&
                                styles.payCardPressed,
                            payMongoLoading && styles.payCardDisabled,
                        ]}
                    >
                        <View style={styles.payIcon}>
                            {payMongoLoading ? (
                                <ActivityIndicator
                                    size="small"
                                    color={colors.primaryLight}
                                />
                            ) : (
                                <Ionicons
                                    name="card-outline"
                                    size={20}
                                    color={colors.primaryLight}
                                />
                            )}
                        </View>

                        <View style={styles.payCopy}>
                            <Text style={styles.payTitle}>
                                {payMongoLoading
                                    ? "Opening checkout..."
                                    : "Continue with PayMongo"}
                            </Text>
                            <Text style={styles.payText}>
                                Test mode · ₱100 checkout, no real charge
                            </Text>
                        </View>

                        <Ionicons
                            name="chevron-forward"
                            size={18}
                            color={colors.mutedDark}
                        />
                    </Pressable>
                </View>

                {/* ---------- RECENT ACTIVITY ---------- */}

                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Recent activity</Text>
                    </View>

                    {transactions.length === 0 ? (
                        <View style={styles.emptyCard}>
                            <View style={styles.emptyIcon}>
                                <Ionicons
                                    name="receipt-outline"
                                    size={22}
                                    color={colors.primaryLight}
                                />
                            </View>
                            <Text style={styles.emptyTitle}>
                                No transactions yet
                            </Text>
                            <Text style={styles.emptyText}>
                                Your top ups, rentals, and refunds will appear
                                here.
                            </Text>
                        </View>
                    ) : (
                        <View style={styles.activityList}>
                            {grouped.map((group, gi) => (
                                <View key={group.label}>
                                    <Text
                                        style={[
                                            styles.dateHeader,
                                            gi > 0 && styles.dateHeaderSpaced,
                                        ]}
                                    >
                                        {group.label}
                                    </Text>

                                    <View style={styles.transactionsCard}>
                                        {group.items.map((tx, ti) => {
                                            const positive = tx.amount > 0;

                                            return (
                                                <View
                                                    key={tx.id}
                                                    style={[
                                                        styles.transaction,
                                                        ti <
                                                            group.items.length -
                                                                1 &&
                                                            styles.transactionBorder,
                                                    ]}
                                                >
                                                    <View
                                                        style={
                                                            styles.transactionIcon
                                                        }
                                                    >
                                                        <Ionicons
                                                            name={transactionIcon(
                                                                tx.type,
                                                            )}
                                                            size={18}
                                                            color={
                                                                positive
                                                                    ? colors.success
                                                                    : colors.muted
                                                            }
                                                        />
                                                    </View>

                                                    <View
                                                        style={
                                                            styles.transactionCopy
                                                        }
                                                    >
                                                        <Text
                                                            style={
                                                                styles.transactionTitle
                                                            }
                                                        >
                                                            {transactionLabel(
                                                                tx,
                                                            )}
                                                        </Text>
                                                    </View>

                                                    <Text
                                                        style={[
                                                            styles.transactionAmount,
                                                            {
                                                                color: positive
                                                                    ? colors.success
                                                                    : colors.text,
                                                            },
                                                        ]}
                                                    >
                                                        {positive ? "+" : ""}
                                                        {tx.amount.toLocaleString()}
                                                    </Text>
                                                </View>
                                            );
                                        })}
                                    </View>
                                </View>
                            ))}
                        </View>
                    )}
                </View>
            </ScrollView>
        </SRVBackground>
    );
}
