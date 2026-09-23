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

import { colors, radius, spacing } from "../../constants/theme";

import {
    devTopUp,
    getMyTransactions,
    getMyWallet,
} from "../../services/walletService";

import { Wallet, WalletTransaction } from "../../types";

/* =========================================================
     TRANSACTION ICON
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
     TRANSACTION LABEL
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
     WALLET SCREEN
  ========================================================= */

export default function WalletScreen() {
    const [wallet, setWallet] = useState<Wallet | null>(null);

    const [transactions, setTransactions] = useState<WalletTransaction[]>([]);

    const [loading, setLoading] = useState(true);

    const [refreshing, setRefreshing] = useState(false);

    const [error, setError] = useState("");

    const [topUpAmount, setTopUpAmount] = useState<number | null>(null);

    /* =======================================================
       LOAD WALLET
    ======================================================= */

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

    /* =======================================================
       DEVELOPMENT TOP UP
    ======================================================= */

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

    /* =======================================================
       INITIAL LOAD
    ======================================================= */

    useEffect(() => {
        loadWallet().finally(() => {
            setLoading(false);
        });
    }, [loadWallet]);

    /* =======================================================
       PULL TO REFRESH
    ======================================================= */

    const handleRefresh = async () => {
        try {
            setRefreshing(true);

            await loadWallet();
        } finally {
            setRefreshing(false);
        }
    };

    /* =======================================================
       LOADING STATE
    ======================================================= */

    if (loading) {
        return (
            <SRVBackground>
                <View style={styles.loading}>
                    <ActivityIndicator size="large" color={colors.gold} />

                    <Text style={styles.loadingText}>Loading wallet...</Text>
                </View>
            </SRVBackground>
        );
    }

    /* =======================================================
       MAIN UI
    ======================================================= */

    return (
        <SRVBackground>
            <ScrollView
                style={styles.page}
                contentContainerStyle={styles.content}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={handleRefresh}
                        tintColor={colors.gold}
                    />
                }
                showsVerticalScrollIndicator={false}
            >
                {/* =================================================
              HEADER
          ================================================= */}

                <View style={styles.header}>
                    <Text style={styles.eyebrow}>SRV WALLET</Text>

                    <Text style={styles.title}>Your points</Text>

                    <Text style={styles.subtitle}>
                        Use points to rent available SRV vaults.
                    </Text>
                </View>

                {/* =================================================
              BALANCE CARD
          ================================================= */}

                <View style={styles.balanceCard}>
                    <View style={styles.balanceTop}>
                        <View style={styles.walletIcon}>
                            <Ionicons
                                name="wallet-outline"
                                size={24}
                                color={colors.gold}
                            />
                        </View>

                        <Text style={styles.balanceLabel}>
                            AVAILABLE BALANCE
                        </Text>
                    </View>

                    <Text style={styles.balance}>
                        {(wallet?.balance ?? 0).toLocaleString()}
                    </Text>

                    <Text style={styles.pointsLabel}>POINTS</Text>
                </View>

                {/* =================================================
              TOP UP
          ================================================= */}

                <View style={styles.topUpSection}>
                    <View style={styles.sectionHeader}>
                        <View>
                            <Text style={styles.sectionTitle}>
                                Top up points
                            </Text>

                            <Text style={styles.sectionSubtitle}>
                                Development mode
                            </Text>
                        </View>
                    </View>

                    <View style={styles.topUpGrid}>
                        {[100, 250, 500, 1000].map((amount) => {
                            const active = topUpAmount === amount;

                            return (
                                <Pressable
                                    key={amount}
                                    onPress={() => handleTopUp(amount)}
                                    disabled={topUpAmount !== null}
                                    style={({ pressed }) => [
                                        styles.topUpButton,

                                        active && styles.topUpButtonActive,

                                        pressed && styles.topUpButtonPressed,
                                    ]}
                                >
                                    {active ? (
                                        <ActivityIndicator
                                            size="small"
                                            color={colors.black}
                                        />
                                    ) : (
                                        <>
                                            <Text style={styles.topUpAmount}>
                                                +{amount}
                                            </Text>

                                            <Text style={styles.topUpPoints}>
                                                POINTS
                                            </Text>
                                        </>
                                    )}
                                </Pressable>
                            );
                        })}
                    </View>

                    <Text style={styles.devNotice}>
                        Development top-ups do not process real payments.
                    </Text>
                </View>

                {/* =================================================
              ERROR
          ================================================= */}

                {error ? (
                    <View style={styles.errorCard}>
                        <Ionicons
                            name="alert-circle-outline"
                            size={20}
                            color={colors.danger}
                        />

                        <Text style={styles.errorText}>{error}</Text>
                    </View>
                ) : null}

                {/* =================================================
              RECENT ACTIVITY
          ================================================= */}

                <View style={styles.sectionHeader}>
                    <View>
                        <Text style={styles.sectionTitle}>Recent activity</Text>

                        <Text style={styles.sectionSubtitle}>
                            Your points history
                        </Text>
                    </View>
                </View>

                {/* =================================================
              EMPTY STATE
          ================================================= */}

                {transactions.length === 0 ? (
                    <View style={styles.emptyCard}>
                        <View style={styles.emptyIcon}>
                            <Ionicons
                                name="receipt-outline"
                                size={26}
                                color={colors.gold}
                            />
                        </View>

                        <Text style={styles.emptyTitle}>
                            No transactions yet
                        </Text>

                        <Text style={styles.emptyText}>
                            Your top ups, rentals, and refunds will appear here.
                        </Text>
                    </View>
                ) : (
                    /* =================================================
               TRANSACTION LIST
            ================================================= */

                    <View style={styles.transactionsCard}>
                        {transactions.map((transaction, index) => {
                            const positive = transaction.amount > 0;

                            return (
                                <View
                                    key={transaction.id}
                                    style={[
                                        styles.transaction,

                                        index < transactions.length - 1 &&
                                            styles.transactionBorder,
                                    ]}
                                >
                                    {/* ICON */}

                                    <View style={styles.transactionIcon}>
                                        <Ionicons
                                            name={transactionIcon(
                                                transaction.type,
                                            )}
                                            size={20}
                                            color={
                                                positive
                                                    ? colors.success
                                                    : colors.gold
                                            }
                                        />
                                    </View>

                                    {/* DETAILS */}

                                    <View style={styles.transactionCopy}>
                                        <Text style={styles.transactionTitle}>
                                            {transactionLabel(transaction)}
                                        </Text>

                                        <Text style={styles.transactionDate}>
                                            {new Date(
                                                transaction.createdAt,
                                            ).toLocaleDateString()}
                                        </Text>
                                    </View>

                                    {/* AMOUNT */}

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

                                        {transaction.amount.toLocaleString()}
                                    </Text>
                                </View>
                            );
                        })}
                    </View>
                )}
            </ScrollView>
        </SRVBackground>
    );
}

/* =========================================================
     STYLES
  ========================================================= */

const styles = StyleSheet.create({
    /* =====================================================
         PAGE
      ===================================================== */

    page: {
        flex: 1,
        backgroundColor: "transparent",
    },

    content: {
        padding: spacing.lg,
        paddingTop: 48,
        paddingBottom: 40,
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
         HEADER
      ===================================================== */

    header: {
        gap: 6,
    },

    eyebrow: {
        color: colors.gold,

        fontSize: 11,
        fontWeight: "900",

        letterSpacing: 2.2,
    },

    title: {
        color: colors.textStrong,

        fontSize: 32,
        fontWeight: "900",
    },

    subtitle: {
        color: colors.muted,

        fontSize: 15,
        lineHeight: 22,
    },

    /* =====================================================
         BALANCE
      ===================================================== */

    balanceCard: {
        backgroundColor: colors.surface,

        borderWidth: 1,
        borderColor: colors.borderStrong,

        borderRadius: radius.lg,

        padding: spacing.lg,
    },

    balanceTop: {
        flexDirection: "row",

        alignItems: "center",

        gap: 12,
    },

    walletIcon: {
        width: 48,
        height: 48,

        borderRadius: 15,

        backgroundColor: colors.goldSoft,

        borderWidth: 1,
        borderColor: colors.gold,

        alignItems: "center",
        justifyContent: "center",
    },

    balanceLabel: {
        color: colors.muted,

        fontSize: 11,
        fontWeight: "800",

        letterSpacing: 1.4,
    },

    balance: {
        color: colors.textStrong,

        fontSize: 46,
        lineHeight: 52,

        fontWeight: "900",

        marginTop: 24,
    },

    pointsLabel: {
        color: colors.goldLight,

        fontSize: 12,
        fontWeight: "900",

        letterSpacing: 3,

        marginTop: 2,
    },

    /* =====================================================
         TOP UP
      ===================================================== */

    topUpSection: {
        gap: spacing.md,
    },

    sectionHeader: {
        marginTop: spacing.sm,
    },

    sectionTitle: {
        color: colors.textStrong,

        fontSize: 20,
        fontWeight: "900",
    },

    sectionSubtitle: {
        color: colors.muted,

        fontSize: 13,

        marginTop: 3,
    },

    topUpGrid: {
        flexDirection: "row",

        flexWrap: "wrap",

        gap: 10,
    },

    topUpButton: {
        width: "48%",

        minHeight: 82,

        borderRadius: radius.md,

        backgroundColor: colors.surface,

        borderWidth: 1,
        borderColor: colors.border,

        alignItems: "center",
        justifyContent: "center",

        gap: 3,
    },

    topUpButtonActive: {
        backgroundColor: colors.gold,

        borderColor: colors.goldLight,
    },

    topUpButtonPressed: {
        opacity: 0.75,

        transform: [
            {
                scale: 0.98,
            },
        ],
    },

    topUpAmount: {
        color: colors.goldLight,

        fontSize: 22,

        fontWeight: "900",
    },

    topUpPoints: {
        color: colors.muted,

        fontSize: 10,

        fontWeight: "800",

        letterSpacing: 1.5,
    },

    devNotice: {
        color: colors.mutedDark,

        fontSize: 11,

        textAlign: "center",
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
    },

    /* =====================================================
         EMPTY STATE
      ===================================================== */

    emptyCard: {
        alignItems: "center",

        justifyContent: "center",

        backgroundColor: colors.surface,

        borderWidth: 1,
        borderColor: colors.border,

        borderRadius: radius.lg,

        paddingVertical: 42,

        paddingHorizontal: 24,
    },

    emptyIcon: {
        width: 58,
        height: 58,

        borderRadius: 18,

        backgroundColor: colors.goldSoft,

        borderWidth: 1,
        borderColor: colors.gold,

        alignItems: "center",
        justifyContent: "center",

        marginBottom: 14,
    },

    emptyTitle: {
        color: colors.textStrong,

        fontSize: 17,
        fontWeight: "800",
    },

    emptyText: {
        color: colors.muted,

        fontSize: 13,
        lineHeight: 20,

        textAlign: "center",

        marginTop: 5,

        maxWidth: 280,
    },

    /* =====================================================
         TRANSACTIONS
      ===================================================== */

    transactionsCard: {
        backgroundColor: colors.surface,

        borderWidth: 1,
        borderColor: colors.border,

        borderRadius: radius.lg,

        paddingHorizontal: spacing.md,
    },

    transaction: {
        flexDirection: "row",

        alignItems: "center",

        paddingVertical: spacing.md,

        gap: 12,
    },

    transactionBorder: {
        borderBottomWidth: 1,

        borderBottomColor: colors.border,
    },

    transactionIcon: {
        width: 42,
        height: 42,

        borderRadius: 13,

        backgroundColor: colors.surfaceSoft,

        alignItems: "center",
        justifyContent: "center",
    },

    transactionCopy: {
        flex: 1,

        gap: 4,
    },

    transactionTitle: {
        color: colors.text,

        fontSize: 14,

        fontWeight: "700",
    },

    transactionDate: {
        color: colors.mutedDark,

        fontSize: 12,
    },

    transactionAmount: {
        fontSize: 15,

        fontWeight: "900",
    },
});
