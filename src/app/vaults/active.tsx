import Ionicons from "@expo/vector-icons/Ionicons";
import { router, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
    ActivityEvent,
    appendActivity,
    endRental,
    getActivityLog,
    getRentalById,
    getVaultByCode,
    Rental,
    Vault,
} from "../../services/vaultService";
import { rentalStyles as styles } from "../../styles/rental.styles";
import { ActiveSkeleton } from "../../components/Skeletons";

/* =========================================================
   TYPE: LockState

   Extended state machine for the lock control. "locking"
   and "unlocking" are transient — they render as spinners
   on the button while the device acknowledges.
========================================================= */
type LockState = "locked" | "unlocked" | "locking" | "unlocking";

/* =========================================================
   FUNCTION: formatRemaining

   Formats milliseconds as a human-readable countdown.
   Switches to seconds precision under one hour.
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
   FUNCTION: formatTime

   Formats an ISO timestamp as "HH:MM" for the activity log.
========================================================= */
function formatTime(iso: string): string {
    const d = new Date(iso);
    return d.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
    });
}

export default function ActiveRentalScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const { showSuccessNotice } = useNotice();

    const [rental, setRental] = useState<Rental | null>(null);
    const [vault, setVault] = useState<Vault | null>(null);
    const [activity, setActivity] = useState<ActivityEvent[]>([]);
    const [lockState, setLockState] = useState<LockState>("locked");
    const [loading, setLoading] = useState(true);
    const [remainingMs, setRemainingMs] = useState(0);

    /* ---------------------------------------------------------
       Load rental + vault + activity
    --------------------------------------------------------- */
    const load = useCallback(async () => {
        if (!id) return;

        try {
            const rentalData = await getRentalById(String(id));

            if (!rentalData) {
                setLoading(false);
                return;
            }

            const [vaultData, activityData] = await Promise.all([
                getVaultByCode(rentalData.vaultCode),
                getActivityLog(rentalData.id),
            ]);

            setRental(rentalData);
            setVault(vaultData);
            setActivity(activityData);
            setRemainingMs(
                new Date(rentalData.expiresAt).getTime() - Date.now(),
            );
        } catch (error) {
            console.error("Failed to load rental:", error);
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        load();
    }, [load]);

    /* ---------------------------------------------------------
       Countdown ticker — updates remainingMs every second
    --------------------------------------------------------- */
    const rentalRef = useRef<Rental | null>(null);
    rentalRef.current = rental;

    useEffect(() => {
        if (!rental) return;

        const tick = () => {
            const current = rentalRef.current;
            if (!current) return;

            const remaining =
                new Date(current.expiresAt).getTime() - Date.now();
            setRemainingMs(remaining > 0 ? remaining : 0);
        };

        tick();
        const interval = setInterval(tick, 1000);

        return () => clearInterval(interval);
    }, [rental]);

    /* ---------------------------------------------------------
       Toggle lock — mock device call, updates local state
    --------------------------------------------------------- */
    const handleToggleLock = async () => {
        if (
            !rental ||
            !vault ||
            lockState === "locking" ||
            lockState === "unlocking"
        ) {
            return;
        }

        const isLocked = lockState === "locked";
        const nextState: LockState = isLocked ? "unlocking" : "locking";
        const eventType = isLocked ? "unlock" : "lock";

        setLockState(nextState);

        try {
            // Simulated MQTT round-trip. Replace with:
            //   await publishUnlockCommand(vault.id)
            await new Promise((r) => setTimeout(r, 900));

            const event = await appendActivity(rental.id, eventType);
            setActivity((prev) => [event, ...prev]);
            setLockState(isLocked ? "unlocked" : "locked");
        } catch (error) {
            console.error("Lock toggle failed:", error);
            setLockState(isLocked ? "locked" : "unlocked");
            Alert.alert(
                "Device not responding",
                "The vault didn't acknowledge the command. Try again.",
            );
        }
    };

    /* ---------------------------------------------------------
       End rental — marks the rental cancelled, then backs out
    --------------------------------------------------------- */
    const handleEndRental = () => {
        if (!rental) return;

        Alert.alert(
            "End rental",
            "End this rental early? Unused time will not be refunded.",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "End rental",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await endRental(rental.id);

                            showSuccessNotice(
                                "Rental ended",
                                `Your rental of ${rental.vaultCode} has been ended.`,
                            );

                            router.back();
                        } catch (error) {
                            console.error("Failed to end rental:", error);
                            Alert.alert(
                                "Unable to end rental",
                                "Please try again.",
                            );
                        }
                    },
                },
            ],
        );
    };

    /* ---------------------------------------------------------
       Navigation
    --------------------------------------------------------- */
    const handleBack = () => router.back();

    /* ---------------------------------------------------------
       Derived values
    --------------------------------------------------------- */
    const isLocked = lockState === "locked";
    const isBusy = lockState === "locking" || lockState === "unlocking";
    const isExpiring = remainingMs > 0 && remainingMs < 15 * 60 * 1000;
    const isExpired = remainingMs <= 0;

    const progress = useMemo(() => {
        if (!rental) return 0;
        const total =
            new Date(rental.expiresAt).getTime() -
            new Date(rental.startedAt).getTime();
        return Math.max(0, Math.min(1, remainingMs / total));
    }, [rental, remainingMs]);

    /* ---------------------------------------------------------
       Loading
    --------------------------------------------------------- */
    if (loading) {
        return (
            <SRVBackground>
                <ActiveSkeleton />
            </SRVBackground>
        );
    }

    /* ---------------------------------------------------------
       Not found
    --------------------------------------------------------- */
    if (!rental || !vault) {
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
                        <Text style={styles.headerTitle}>Rental not found</Text>
                    </View>
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
                    <Text style={styles.headerEyebrow}>ACTIVE RENTAL</Text>
                    <Text style={styles.headerTitle}>{rental.vaultCode}</Text>
                </View>

                <Pressable
                    onPress={handleEndRental}
                    hitSlop={8}
                    style={({ pressed }) => [
                        styles.headerIcon,
                        pressed && styles.headerIconPressed,
                    ]}
                >
                    <Ionicons name="close" size={20} color={colors.text} />
                </Pressable>
            </View>

            {/* =================================================
                SCROLL
            ================================================= */}

            <ScrollView
                style={styles.page}
                contentContainerStyle={styles.activeContent}
                showsVerticalScrollIndicator={false}
            >
                {/* ---------- HERO ---------- */}

                <View
                    style={[
                        styles.heroCard,
                        isExpired
                            ? styles.heroCardExpired
                            : isExpiring
                              ? styles.heroCardExpiring
                              : isLocked
                                ? styles.heroCardLocked
                                : styles.heroCardUnlocked,
                    ]}
                >
                    <View
                        style={[
                            styles.heroIconWrap,
                            {
                                backgroundColor: isLocked
                                    ? colors.primaryFaint
                                    : colors.successSoft,
                                borderColor: isLocked
                                    ? colors.borderPurple
                                    : "rgba(94,227,154,0.35)",
                            },
                        ]}
                    >
                        <Ionicons
                            name={isLocked ? "lock-closed" : "lock-open"}
                            size={48}
                            color={
                                isLocked ? colors.primaryLight : colors.success
                            }
                        />
                    </View>

                    <Text style={styles.heroState}>
                        {isLocked ? "LOCKED" : "UNLOCKED"}
                    </Text>

                    <View style={styles.heroCountdownWrap}>
                        <Text
                            style={[
                                styles.heroCountdown,
                                isExpired && styles.heroCountdownExpired,
                                !isExpired &&
                                    isExpiring &&
                                    styles.heroCountdownExpiring,
                            ]}
                        >
                            {formatRemaining(remainingMs)}
                        </Text>
                        <Text style={styles.heroCountdownLabel}>
                            {isExpired ? "rental expired" : "remaining"}
                        </Text>
                    </View>

                    {/* Progress bar */}

                    <View style={styles.progressTrack}>
                        <View
                            style={[
                                styles.progressFill,
                                {
                                    width: `${progress * 100}%`,
                                    backgroundColor: isExpired
                                        ? colors.danger
                                        : isExpiring
                                          ? colors.warning
                                          : colors.primary,
                                },
                            ]}
                        />
                    </View>
                </View>

                {/* ---------- ACTION BUTTON ---------- */}

                <Pressable
                    onPress={handleToggleLock}
                    disabled={isBusy || isExpired}
                    style={({ pressed }) => [
                        styles.actionButton,
                        isLocked
                            ? styles.actionButtonUnlock
                            : styles.actionButtonLock,
                        (isBusy || isExpired) && styles.actionButtonDisabled,
                        pressed && !isBusy && styles.actionButtonPressed,
                    ]}
                >
                    {isBusy ? (
                        <ActivityIndicator size="small" color={colors.white} />
                    ) : (
                        <>
                            <Ionicons
                                name={isLocked ? "lock-open" : "lock-closed"}
                                size={20}
                                color={colors.white}
                            />
                            <Text style={styles.actionButtonText}>
                                {isExpired
                                    ? "Rental expired"
                                    : isLocked
                                      ? "Unlock vault"
                                      : "Lock vault"}
                            </Text>
                        </>
                    )}
                </Pressable>

                {/* ---------- DEVICE STATUS ---------- */}

                <View style={styles.section}>
                    <Text style={styles.sectionEyebrow}>DEVICE</Text>

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
                                <Text style={styles.deviceLabel}>
                                    Connection
                                </Text>
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
                </View>

                {/* ---------- RENTAL INFO ---------- */}

                <View style={styles.section}>
                    <Text style={styles.sectionEyebrow}>RENTAL</Text>

                    <View style={styles.infoCard}>
                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>Vault</Text>
                            <Text style={styles.infoValue}>{vault.code}</Text>
                        </View>

                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>Size</Text>
                            <Text style={styles.infoValue}>{vault.size}</Text>
                        </View>

                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>Location</Text>
                            <Text style={styles.infoValue}>
                                {vault.location}
                            </Text>
                        </View>

                        <View style={styles.infoDivider} />

                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>Points paid</Text>
                            <Text style={styles.infoValueStrong}>
                                ₱{rental.pointsPaid.toLocaleString()}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* ---------- ACTIVITY LOG ---------- */}

                <View style={styles.section}>
                    <Text style={styles.sectionEyebrow}>ACTIVITY</Text>

                    {activity.length === 0 ? (
                        <View style={styles.activityEmpty}>
                            <Ionicons
                                name="time-outline"
                                size={20}
                                color={colors.mutedDark}
                            />
                            <Text style={styles.activityEmptyText}>
                                Unlock the vault to start your activity log.
                            </Text>
                        </View>
                    ) : (
                        <View style={styles.activityCard}>
                            {activity.map((evt, i) => (
                                <View
                                    key={evt.id}
                                    style={[
                                        styles.activityRow,
                                        i < activity.length - 1 &&
                                            styles.activityRowBorder,
                                    ]}
                                >
                                    <View
                                        style={[
                                            styles.activityIcon,
                                            {
                                                backgroundColor:
                                                    evt.type === "unlock"
                                                        ? colors.successSoft
                                                        : colors.primaryFaint,
                                                borderColor:
                                                    evt.type === "unlock"
                                                        ? "rgba(94,227,154,0.30)"
                                                        : colors.borderPurple,
                                            },
                                        ]}
                                    >
                                        <Ionicons
                                            name={
                                                evt.type === "unlock"
                                                    ? "lock-open-outline"
                                                    : "lock-closed-outline"
                                            }
                                            size={16}
                                            color={
                                                evt.type === "unlock"
                                                    ? colors.success
                                                    : colors.primaryLight
                                            }
                                        />
                                    </View>

                                    <Text style={styles.activityTitle}>
                                        {evt.type === "unlock"
                                            ? "Unlocked"
                                            : "Locked"}
                                    </Text>

                                    <Text style={styles.activityTime}>
                                        {formatTime(evt.timestamp)}
                                    </Text>
                                </View>
                            ))}
                        </View>
                    )}
                </View>
            </ScrollView>
        </SRVBackground>
    );
}
    