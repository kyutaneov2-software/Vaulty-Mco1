import Ionicons from "@expo/vector-icons/Ionicons";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
    ActivityIndicator,
    Pressable,
    ScrollView,
    Text,
    View,
} from "react-native";

import SRVBackground from "../components/SRVBackground";
import { colors } from "../constants/theme";
import {
    AppNotification,
    getNotifications,
    setLastSeen,
} from "../services/notificationService";
import { notificationsStyles as styles } from "../styles/notifications.styles";
import { NotificationsSkeleton } from "../components/Skeletons";

/* =========================================================
   FUNCTION: themeForKind

   Icon, color, and tint per notification kind.
========================================================= */
function themeForKind(kind: AppNotification["kind"]) {
    switch (kind) {
        case "wallet_top_up":
            return {
                icon: "add-circle-outline" as const,
                color: colors.success,
                tint: colors.successSoft,
                border: "rgba(94,227,154,0.28)",
            };
        case "wallet_rental":
            return {
                icon: "cube-outline" as const,
                color: colors.primaryLight,
                tint: colors.primaryFaint,
                border: colors.borderPurple,
            };
        case "wallet_refund":
            return {
                icon: "return-up-back-outline" as const,
                color: colors.warning,
                tint: colors.warningSoft,
                border: "rgba(244,201,93,0.28)",
            };
        case "rental_ended":
            return {
                icon: "lock-closed-outline" as const,
                color: colors.muted,
                tint: colors.surfaceElevated,
                border: colors.border,
            };
    }
}

/* =========================================================
   FUNCTION: formatTime

   "Just now", "5m", "2h", "Yesterday", "Jan 15".
========================================================= */
function formatTime(iso: string): string {
    const date = new Date(iso);
    const diff = Date.now() - date.getTime();
    const minutes = Math.floor(diff / 60000);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;

    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;

    const days = Math.floor(hours / 24);
    if (days === 1) return "Yesterday";
    if (days < 7) return `${days}d ago`;

    return date.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
    });
}

/* =========================================================
   FUNCTION: groupByDay
========================================================= */
function groupByDay(notifications: AppNotification[]) {
    const groups: Record<string, AppNotification[]> = {};

    for (const n of notifications) {
        const key = new Date(n.createdAt).toDateString();
        if (!groups[key]) groups[key] = [];
        groups[key].push(n);
    }

    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 86400000).toDateString();

    return Object.entries(groups).map(([key, items]) => {
        let label: string;
        if (key === today) label = "Today";
        else if (key === yesterday) label = "Yesterday";
        else
            label = new Date(key).toLocaleDateString(undefined, {
                month: "short",
                day: "numeric",
            });

        return { label, items };
    });
}

export default function NotificationsScreen() {
    const [notifications, setNotifications] = useState<AppNotification[]>([]);
    const [loading, setLoading] = useState(true);

    const load = useCallback(async () => {
        try {
            const data = await getNotifications();
            setNotifications(data);
        } catch (error) {
            console.error("Failed to load notifications:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    /* Mark all as seen when the screen opens */
    useFocusEffect(
        useCallback(() => {
            load();
            setLastSeen(new Date().toISOString());
        }, [load]),
    );

    const grouped = useMemo(() => groupByDay(notifications), [notifications]);

    const handleBack = () => router.back();

    const handlePress = (n: AppNotification) => {
        if (n.href) router.push(n.href as any);
    };

    if (loading) {
        return (
            <SRVBackground>
                <NotificationsSkeleton />
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
                    <Text style={styles.headerEyebrow}>ACTIVITY</Text>
                    <Text style={styles.headerTitle}>Notifications</Text>
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
                {notifications.length === 0 ? (
                    <View style={styles.emptyCard}>
                        <View style={styles.emptyIcon}>
                            <Ionicons
                                name="notifications-off-outline"
                                size={26}
                                color={colors.primaryLight}
                            />
                        </View>

                        <Text style={styles.emptyTitle}>Nothing here yet</Text>

                        <Text style={styles.emptyText}>
                            Your wallet activity and rentals will show up here.
                        </Text>
                    </View>
                ) : (
                    grouped.map((group, gi) => (
                        <View key={group.label}>
                            <Text
                                style={[
                                    styles.dateHeader,
                                    gi > 0 && styles.dateHeaderSpaced,
                                ]}
                            >
                                {group.label}
                            </Text>

                            <View style={styles.listCard}>
                                {group.items.map((n, i) => {
                                    const theme = themeForKind(n.kind);
                                    const positive = (n.amount ?? 0) > 0;

                                    return (
                                        <Pressable
                                            key={n.id}
                                            onPress={() => handlePress(n)}
                                            style={({ pressed }) => [
                                                styles.row,
                                                i < group.items.length - 1 &&
                                                    styles.rowBorder,
                                                pressed && styles.rowPressed,
                                            ]}
                                        >
                                            <View
                                                style={[
                                                    styles.iconWrap,
                                                    {
                                                        backgroundColor:
                                                            theme.tint,
                                                        borderColor:
                                                            theme.border,
                                                    },
                                                ]}
                                            >
                                                <Ionicons
                                                    name={theme.icon}
                                                    size={18}
                                                    color={theme.color}
                                                />
                                            </View>

                                            <View style={styles.body}>
                                                <Text style={styles.title}>
                                                    {n.title}
                                                </Text>
                                                <Text
                                                    style={styles.subtitle}
                                                    numberOfLines={1}
                                                >
                                                    {n.subtitle}
                                                </Text>
                                                <Text style={styles.meta}>
                                                    {formatTime(n.createdAt)}
                                                </Text>
                                            </View>

                                            {typeof n.amount === "number" ? (
                                                <Text
                                                    style={[
                                                        styles.amount,
                                                        {
                                                            color: positive
                                                                ? colors.success
                                                                : colors.text,
                                                        },
                                                    ]}
                                                >
                                                    {positive ? "+" : ""}
                                                    {n.amount.toLocaleString()}
                                                </Text>
                                            ) : null}
                                        </Pressable>
                                    );
                                })}
                            </View>
                        </View>
                    ))
                )}
            </ScrollView>
        </SRVBackground>
    );
}
