/* =========================================================
   Notification Service

   Aggregates recent events from wallet_transactions and
   rentals into a single notification feed. No new table —
   the source data already exists.
========================================================= */

import AsyncStorage from "@react-native-async-storage/async-storage";
import { supabase } from "../lib/supabase";

/* =========================================================
   TYPES
========================================================= */

export type NotificationKind =
    | "wallet_top_up"
    | "wallet_rental"
    | "wallet_refund"
    | "rental_ended";

export type AppNotification = {
    id: string;
    kind: NotificationKind;
    title: string;
    subtitle: string;
    amount?: number;
    createdAt: string;
    href?: string;
};

const LAST_SEEN_KEY = "vaulty.notifications.lastSeen";

/* =========================================================
   FUNCTION: getNotifications

   Merges wallet transactions and cancelled rentals into
   one chronological feed, newest first.
========================================================= */
export async function getNotifications(): Promise<AppNotification[]> {
    const [txResult, rentalsResult] = await Promise.all([
        supabase
            .from("wallet_transactions")
            .select("*")
            .order("created_at", { ascending: false })
            .limit(30),
        supabase
            .from("rentals")
            .select("*")
            .order("started_at", { ascending: false })
            .limit(30),
    ]);

    if (txResult.error) throw new Error(txResult.error.message);
    if (rentalsResult.error) throw new Error(rentalsResult.error.message);

    const notifications: AppNotification[] = [];

    /* ---------- Wallet transactions ---------- */

    for (const tx of txResult.data ?? []) {
        if (tx.type === "top_up") {
            notifications.push({
                id: `tx-${tx.id}`,
                kind: "wallet_top_up",
                title: "Wallet topped up",
                subtitle: tx.description ?? "Points added to your wallet",
                amount: tx.amount,
                createdAt: tx.created_at,
                href: "/wallet",
            });
        } else if (tx.type === "rental") {
            notifications.push({
                id: `tx-${tx.id}`,
                kind: "wallet_rental",
                title: "Rental payment",
                subtitle: tx.description ?? "Vault rental",
                amount: tx.amount,
                createdAt: tx.created_at,
                href: "/rentals",
            });
        } else if (tx.type === "refund") {
            notifications.push({
                id: `tx-${tx.id}`,
                kind: "wallet_refund",
                title: "Refund received",
                subtitle: tx.description ?? "Refund processed",
                amount: tx.amount,
                createdAt: tx.created_at,
                href: "/wallet",
            });
        }
    }

    /* ---------- Ended rentals ---------- */

    for (const rental of rentalsResult.data ?? []) {
        if (rental.status === "cancelled") {
            notifications.push({
                id: `rental-${rental.id}`,
                kind: "rental_ended",
                title: "Rental ended",
                subtitle: `${rental.vault_code} · ${rental.duration_type}`,
                createdAt: rental.created_at ?? rental.started_at,
                href: `/vaults/${rental.vault_id}`,
            });
        }
    }

    /* ---------- Sort newest first ---------- */

    notifications.sort(
        (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );

    return notifications;
}

/* =========================================================
   FUNCTION: getLastSeen / setLastSeen

   Tracks when the user last viewed the notification feed,
   so the Home bell can show an unread count.
========================================================= */
export async function getLastSeen(): Promise<string | null> {
    return AsyncStorage.getItem(LAST_SEEN_KEY);
}

export async function setLastSeen(iso: string): Promise<void> {
    await AsyncStorage.setItem(LAST_SEEN_KEY, iso);
}

/* =========================================================
   FUNCTION: countUnread

   Returns how many notifications were created after the
   last time the user opened the screen.
========================================================= */
export async function countUnread(): Promise<number> {
    const [notifications, lastSeen] = await Promise.all([
        getNotifications(),
        getLastSeen(),
    ]);

    if (!lastSeen) return notifications.length;

    const since = new Date(lastSeen).getTime();
    return notifications.filter((n) => new Date(n.createdAt).getTime() > since)
        .length;
}
