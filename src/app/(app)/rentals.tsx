import Ionicons from "@expo/vector-icons/Ionicons";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
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
import { getAllRentals, Rental } from "../../services/vaultService";
import { rentalsStyles as styles } from "../../styles/rentals.styles";
import { RentalsSkeleton } from "../../components/Skeletons";

/* =========================================================
   TYPES
========================================================= */
type FilterMode = "all" | "active" | "history";

/* =========================================================
   FUNCTION: formatRemaining
========================================================= */
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

/* =========================================================
   FUNCTION: formatDate
========================================================= */
function formatDate(iso: string): string {
    const d = new Date(iso);
    const now = new Date();

    const opts: Intl.DateTimeFormatOptions =
        d.getFullYear() === now.getFullYear()
            ? { month: "short", day: "numeric" }
            : { month: "short", day: "numeric", year: "numeric" };

    return d.toLocaleDateString(undefined, opts);
}

/* =========================================================
   FUNCTION: durationLabel
========================================================= */
function durationLabel(duration: Rental["durationType"]): string {
    switch (duration) {
        case "hour":
            return "Hourly";
        case "day":
            return "Daily";
        case "week":
            return "Weekly";
    }
}

/* =========================================================
   FUNCTION: statusTheme
========================================================= */
function statusTheme(
    rental: Rental,
    now: number,
): { label: string; color: string; tint: string } {
    if (rental.status === "cancelled") {
        return {
            label: "Cancelled",
            color: colors.danger,
            tint: colors.dangerSoft,
        };
    }

    if (
        rental.status === "expired" ||
        new Date(rental.expiresAt).getTime() <= now
    ) {
        return {
            label: "Expired",
            color: colors.mutedDark,
            tint: colors.surfaceElevated,
        };
    }

    return {
        label: "Active",
        color: colors.success,
        tint: colors.successSoft,
    };
}

/* =========================================================
   FUNCTION: groupByDate
========================================================= */
function groupByDate(rentals: Rental[]): { label: string; items: Rental[] }[] {
    const groups: Record<string, Rental[]> = {};

    for (const rental of rentals) {
        const key = new Date(rental.startedAt).toDateString();
        if (!groups[key]) groups[key] = [];
        groups[key].push(rental);
    }

    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 86400000).toDateString();

    return Object.entries(groups).map(([key, items]) => {
        let label: string;
        if (key === today) label = "Today";
        else if (key === yesterday) label = "Yesterday";
        else label = formatDate(items[0].startedAt);

        return { label, items };
    });
}

export default function RentalsScreen() {
    const { filter } = useLocalSearchParams<{ filter?: string }>();

    const [rentals, setRentals] = useState<Rental[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [now, setNow] = useState(Date.now());
    const [mode, setMode] = useState<FilterMode>("all");

    /* ---------------------------------------------------------
       Sync filter param → mode
    --------------------------------------------------------- */
    useEffect(() => {
        if (filter === "active") setMode("active");
        else if (filter === "history") setMode("history");
        else setMode("all");
    }, [filter]);

    /* ---------------------------------------------------------
       Load
    --------------------------------------------------------- */
    const load = useCallback(async () => {
        try {
            const data = await getAllRentals();
            setRentals(data);
        } catch (error) {
            console.error("Failed to load rentals:", error);
        }
    }, []);

    useFocusEffect(
        useCallback(() => {
            load().finally(() => setLoading(false));
        }, [load]),
    );

    /* ---------------------------------------------------------
       Derived lists
    --------------------------------------------------------- */
    const activeRentals = useMemo(
        () =>
            rentals.filter(
                (r) =>
                    r.status === "active" &&
                    new Date(r.expiresAt).getTime() > now,
            ),
        [rentals, now],
    );

    const historyRentals = useMemo(
        () =>
            rentals.filter(
                (r) =>
                    r.status !== "active" ||
                    new Date(r.expiresAt).getTime() <= now,
            ),
        [rentals, now],
    );

    const grouped = useMemo(
        () => groupByDate(historyRentals),
        [historyRentals],
    );

    const showActive = mode === "all" || mode === "active";
    const showHistory = mode === "all" || mode === "history";

    /* ---------------------------------------------------------
       Ticker — only runs when there are live rentals
    --------------------------------------------------------- */
    useEffect(() => {
        if (activeRentals.length === 0) return;

        const interval = setInterval(() => setNow(Date.now()), 1000);
        return () => clearInterval(interval);
    }, [activeRentals.length]);

    /* ---------------------------------------------------------
       Refresh
    --------------------------------------------------------- */
    const handleRefresh = async () => {
        try {
            setRefreshing(true);
            await load();
        } finally {
            setRefreshing(false);
        }
    };

    /* ---------------------------------------------------------
       Navigation
    --------------------------------------------------------- */
    const handleRentalPress = (rental: Rental) => {
        const isActive =
            rental.status === "active" &&
            new Date(rental.expiresAt).getTime() > now;

        if (isActive) {
            router.push(`/vaults/active?id=${rental.id}`);
        } else {
            router.push(`/vaults/${rental.vaultId}`);
        }
    };

    const handleExplore = () => router.push("/vaults");

    /* ---------------------------------------------------------
       Loading
    --------------------------------------------------------- */
    if (loading) {
        return (
            <SRVBackground>
                <RentalsSkeleton />
            </SRVBackground>
        );
    }

    return (
        <SRVBackground>
            {/* =================================================
                HEADER
            ================================================= */}

            <View style={styles.header}>
                <View style={styles.headerCopy}>
                    <Text style={styles.headerEyebrow}>HISTORY</Text>
                    <Text style={styles.headerTitle}>Your rentals</Text>
                </View>

                <Pressable
                    onPress={handleExplore}
                    hitSlop={8}
                    style={({ pressed }) => [
                        styles.headerIcon,
                        pressed && styles.headerIconPressed,
                    ]}
                >
                    <Ionicons name="add" size={20} color={colors.text} />
                </Pressable>
            </View>

            {/* =================================================
                FILTER CHIPS
            ================================================= */}

            <View style={styles.filterRow}>
                {(["all", "active", "history"] as const).map((m) => {
                    const active = mode === m;
                    const label =
                        m === "all"
                            ? "All"
                            : m === "active"
                              ? "Active"
                              : "History";

                    return (
                        <Pressable
                            key={m}
                            onPress={() => setMode(m)}
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
                                {label}
                            </Text>
                        </Pressable>
                    );
                })}
            </View>

            {/* =================================================
                SCROLL
            ================================================= */}

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
                {/* ---------- EMPTY ---------- */}

                {rentals.length === 0 ? (
                    <View style={styles.emptyCard}>
                        <View style={styles.emptyIcon}>
                            <Ionicons
                                name="cube-outline"
                                size={26}
                                color={colors.primaryLight}
                            />
                        </View>

                        <Text style={styles.emptyTitle}>No rentals yet</Text>

                        <Text style={styles.emptyText}>
                            Rent your first vault and it will show up here.
                        </Text>

                        <Pressable
                            onPress={handleExplore}
                            style={({ pressed }) => [
                                styles.emptyButton,
                                pressed && styles.emptyButtonPressed,
                            ]}
                        >
                            <Text style={styles.emptyButtonText}>
                                Find a vault
                            </Text>
                            <Ionicons
                                name="arrow-forward"
                                size={15}
                                color={colors.white}
                            />
                        </Pressable>
                    </View>
                ) : null}

                {/* ---------- ACTIVE ---------- */}

                {showActive && activeRentals.length > 0 ? (
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionEyebrow}>ACTIVE</Text>
                            <View style={styles.livePill}>
                                <View style={styles.liveDot} />
                                <Text style={styles.liveText}>
                                    {activeRentals.length} live
                                </Text>
                            </View>
                        </View>

                        {activeRentals.map((rental) => {
                            const remaining =
                                new Date(rental.expiresAt).getTime() - now;

                            return (
                                <Pressable
                                    key={rental.id}
                                    onPress={() => handleRentalPress(rental)}
                                    style={({ pressed }) => [
                                        styles.activeCard,
                                        pressed && styles.activeCardPressed,
                                    ]}
                                >
                                    <View style={styles.activeIcon}>
                                        <Ionicons
                                            name="lock-closed"
                                            size={18}
                                            color={colors.primaryLight}
                                        />
                                    </View>

                                    <View style={styles.activeBody}>
                                        <Text style={styles.activeCode}>
                                            {rental.vaultCode}
                                        </Text>
                                        <Text style={styles.activeMeta}>
                                            {rental.vaultSize} ·{" "}
                                            {durationLabel(rental.durationType)}
                                        </Text>
                                        <View style={styles.activeStatus}>
                                            <View style={styles.activeDot} />
                                            <Text
                                                style={styles.activeStatusText}
                                            >
                                                {formatRemaining(remaining)}{" "}
                                                remaining
                                            </Text>
                                        </View>
                                    </View>

                                    <Ionicons
                                        name="chevron-forward"
                                        size={18}
                                        color={colors.mutedDark}
                                    />
                                </Pressable>
                            );
                        })}
                    </View>
                ) : null}

                {/* ---------- HISTORY ---------- */}

                {showHistory && historyRentals.length > 0 ? (
                    <View style={styles.section}>
                        <Text style={styles.sectionEyebrow}>HISTORY</Text>

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

                                <View style={styles.historyCard}>
                                    {group.items.map((rental, i) => {
                                        const theme = statusTheme(rental, now);

                                        return (
                                            <Pressable
                                                key={rental.id}
                                                onPress={() =>
                                                    handleRentalPress(rental)
                                                }
                                                style={({ pressed }) => [
                                                    styles.historyRow,
                                                    i <
                                                        group.items.length -
                                                            1 &&
                                                        styles.historyRowBorder,
                                                    pressed &&
                                                        styles.historyRowPressed,
                                                ]}
                                            >
                                                <View
                                                    style={styles.historyIcon}
                                                >
                                                    <Ionicons
                                                        name="cube-outline"
                                                        size={18}
                                                        color={colors.muted}
                                                    />
                                                </View>

                                                <View
                                                    style={styles.historyBody}
                                                >
                                                    <Text
                                                        style={
                                                            styles.historyCode
                                                        }
                                                    >
                                                        {rental.vaultCode}
                                                    </Text>

                                                    <Text
                                                        style={
                                                            styles.historyMeta
                                                        }
                                                    >
                                                        {durationLabel(
                                                            rental.durationType,
                                                        )}{" "}
                                                        ·{" "}
                                                        {formatDate(
                                                            rental.startedAt,
                                                        )}
                                                    </Text>
                                                </View>

                                                <View
                                                    style={styles.historyRight}
                                                >
                                                    <Text
                                                        style={
                                                            styles.historyPrice
                                                        }
                                                    >
                                                        ₱
                                                        {rental.pointsPaid.toLocaleString()}
                                                    </Text>
                                                    <View
                                                        style={[
                                                            styles.statusPill,
                                                            {
                                                                backgroundColor:
                                                                    theme.tint,
                                                            },
                                                        ]}
                                                    >
                                                        <Text
                                                            style={[
                                                                styles.statusText,
                                                                {
                                                                    color: theme.color,
                                                                },
                                                            ]}
                                                        >
                                                            {theme.label}
                                                        </Text>
                                                    </View>
                                                </View>
                                            </Pressable>
                                        );
                                    })}
                                </View>
                            </View>
                        ))}
                    </View>
                ) : null}

                {/* ---------- FILTER EMPTY STATES ---------- */}

                {rentals.length > 0 &&
                mode === "active" &&
                activeRentals.length === 0 ? (
                    <View style={styles.emptyCard}>
                        <View style={styles.emptyIcon}>
                            <Ionicons
                                name="lock-open-outline"
                                size={26}
                                color={colors.primaryLight}
                            />
                        </View>
                        <Text style={styles.emptyTitle}>No active rentals</Text>
                        <Text style={styles.emptyText}>
                            Your current vault sessions will appear here.
                        </Text>
                    </View>
                ) : null}

                {rentals.length > 0 &&
                mode === "history" &&
                historyRentals.length === 0 ? (
                    <View style={styles.emptyCard}>
                        <View style={styles.emptyIcon}>
                            <Ionicons
                                name="time-outline"
                                size={26}
                                color={colors.primaryLight}
                            />
                        </View>
                        <Text style={styles.emptyTitle}>No rental history</Text>
                        <Text style={styles.emptyText}>
                            Past rentals will appear here once they end.
                        </Text>
                    </View>
                ) : null}

                {/* ---------- FOOTER ---------- */}

                {rentals.length > 0 ? (
                    <View style={styles.footer}>
                        <Text style={styles.footerText}>
                            {rentals.length}{" "}
                            {rentals.length === 1 ? "rental" : "rentals"} total
                        </Text>
                    </View>
                ) : null}
            </ScrollView>
        </SRVBackground>
    );
}
