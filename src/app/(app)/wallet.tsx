import Ionicons from "@expo/vector-icons/Ionicons";
import { useCallback, useEffect, useState } from "react";
import {
    ActivityIndicator,
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
import { Wallet, WalletTransaction } from "../../types";
import { walletStyles as styles } from "../../styles/wallet.styles";

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
   COMPONENT: WalletScreen

   Displays the user's current points balance, development
   top-up controls, and wallet transaction history.
========================================================= */
export default function WalletScreen() {
    const [wallet, setWallet] = useState<Wallet | null>(null);

    const [transactions, setTransactions] = useState<WalletTransaction[]>([]);

    const [loading, setLoading] = useState(true);

    const [refreshing, setRefreshing] = useState(false);

    const [error, setError] = useState("");

    const [topUpAmount, setTopUpAmount] = useState<number | null>(null);

    /* =====================================================
       FUNCTION: loadWallet

       Loads the user's wallet and transaction history.
    ===================================================== */
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

    /* =====================================================
       FUNCTION: handleTopUp

       Runs the development-only wallet top-up operation
       and refreshes the wallet after completion.
    ===================================================== */
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

    /* =====================================================
       FUNCTION: handleRefresh

       Refreshes the wallet balance and transaction list
       when the user performs pull-to-refresh.
    ===================================================== */
    const handleRefresh = async () => {
        try {
            setRefreshing(true);
            setError("");

            await loadWallet();
        } finally {
            setRefreshing(false);
        }
    };

    /* =====================================================
       EFFECT: INITIAL WALLET LOAD

       Loads wallet information when the screen is first
       mounted.
    ===================================================== */
    useEffect(() => {
        loadWallet().finally(() => {
            setLoading(false);
        });
    }, [loadWallet]);

    /* =====================================================
       LOADING STATE
    ===================================================== */

    if (loading) {
        return (
            <SRVBackground>
                <View style={styles.loading}>
                    <ActivityIndicator size="large" color={colors.primary} />

                    <Text style={styles.loadingText}>Loading wallet...</Text>
                </View>
            </SRVBackground>
        );
    }

    return (
        <SRVBackground>
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
                {/* =================================================
                    HEADER
                ================================================= */}

                <View style={styles.header}>
                    <Text style={styles.eyebrow}>VAULTY WALLET</Text>

                    <Text style={styles.title}>Your points</Text>

                    <Text style={styles.subtitle}>
                        Use points to rent available Vaulty vaults.
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
                                            color={colors.white}
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
                                color={colors.primaryLight}
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
                                    {/* =================================
                                           TRANSACTION ICON
                                        ================================= */}

                                    <View style={styles.transactionIcon}>
                                        <Ionicons
                                            name={transactionIcon(
                                                transaction.type,
                                            )}
                                            size={20}
                                            color={
                                                positive
                                                    ? colors.success
                                                    : colors.muted
                                            }
                                        />
                                    </View>

                                    {/* =================================
                                           TRANSACTION DETAILS
                                        ================================= */}

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

                                    {/* =================================
                                           TRANSACTION AMOUNT
                                        ================================= */}

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
