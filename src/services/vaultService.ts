/* =========================================================
   Vault Service — Supabase-backed

   All vault, rental, and activity data now lives in
   Supabase. RLS policies enforce per-user access.
========================================================= */

import { supabase } from "../lib/supabase";

/* =========================================================
   TYPES
========================================================= */

export type VaultSize = "Small" | "Medium" | "Large";
export type RentalDuration = "hour" | "day" | "week";
export type RentalStatus = "active" | "expired" | "cancelled";
export type ConnectionQuality = "Excellent" | "Good" | "Weak";

export type Vault = {
    id: string;
    code: string;
    size: VaultSize;
    location: string;
    distanceKm: number;
    latitude: number;
    longitude: number;
    priceHour: number;
    priceDay: number;
    priceWeek: number;
    online: boolean;
    batteryPct: number;
    connection: ConnectionQuality;
    image: any;
};

export type Rental = {
    id: string;
    vaultId: string;
    vaultCode: string;
    vaultSize: VaultSize;
    durationType: RentalDuration;
    pointsPaid: number;
    startedAt: string;
    expiresAt: string;
    status: RentalStatus;
};

export type ActivityEvent = {
    id: string;
    type: "unlock" | "lock";
    timestamp: string;
};

/* =========================================================
   CONSTANT: VAULT_IMAGE

   Placeholder image used for every vault until per-vault
   images are uploaded to Supabase Storage.
========================================================= */
const VAULT_IMAGE = require("../../assets/images/srv-logo.png");

/* =========================================================
   MAPPERS — snake_case DB rows to camelCase UI objects
========================================================= */

function rowToVault(row: any): Vault {
    return {
        id: row.id,
        code: row.code,
        size: row.size,
        location: row.location,
        distanceKm: 0,
        latitude: Number(row.latitude),
        longitude: Number(row.longitude),
        priceHour: row.price_hour,
        priceDay: row.price_day,
        priceWeek: row.price_week,
        online: row.online,
        batteryPct: row.battery_pct,
        connection: row.connection,
        image: VAULT_IMAGE,
    };
}

function rowToRental(row: any): Rental {
    return {
        id: row.id,
        vaultId: row.vault_id,
        vaultCode: row.vault_code,
        vaultSize: row.vault_size,
        durationType: row.duration_type,
        pointsPaid: row.points_paid,
        startedAt: row.started_at,
        expiresAt: row.expires_at,
        status: row.status,
    };
}

function rowToActivity(row: any): ActivityEvent {
    return {
        id: row.id,
        type: row.event_type,
        timestamp: row.created_at,
    };
}

/* =========================================================
   HELPERS
========================================================= */

export function getPriceForDuration(
    vault: Vault,
    duration: RentalDuration,
): number {
    switch (duration) {
        case "hour":
            return vault.priceHour;
        case "day":
            return vault.priceDay;
        case "week":
            return vault.priceWeek;
    }
}

export function getDurationHours(duration: RentalDuration): number {
    switch (duration) {
        case "hour":
            return 1;
        case "day":
            return 24;
        case "week":
            return 24 * 7;
    }
}

/* =========================================================
   VAULT QUERIES
========================================================= */

export async function getAvailableVaults(): Promise<Vault[]> {
    const { data, error } = await supabase
        .from("vaults")
        .select("*")
        .order("code", { ascending: true });

    if (error) throw new Error(error.message);
    return (data ?? []).map(rowToVault);
}

export async function getVaultById(id: string): Promise<Vault | null> {
    const { data, error } = await supabase
        .from("vaults")
        .select("*")
        .eq("id", id)
        .maybeSingle();

    if (error) throw new Error(error.message);
    return data ? rowToVault(data) : null;
}

export async function getVaultByCode(code: string): Promise<Vault | null> {
    const { data, error } = await supabase
        .from("vaults")
        .select("*")
        .eq("code", code)
        .maybeSingle();

    if (error) throw new Error(error.message);
    return data ? rowToVault(data) : null;
}

/* =========================================================
   RENTALS — CREATE (atomic via RPC)
========================================================= */

export async function createRental(
    vault: Vault,
    duration: RentalDuration,
): Promise<Rental> {
    if (!vault.online) {
        throw new Error("This vault is currently offline.");
    }

    const price = getPriceForDuration(vault, duration);
    const hours = getDurationHours(duration);

    const { data, error } = await supabase.rpc("create_rental_with_payment", {
        p_vault_id: vault.id,
        p_vault_code: vault.code,
        p_vault_size: vault.size,
        p_duration_type: duration,
        p_points_cost: price,
        p_hours: hours,
    });

    if (error) throw new Error(error.message);
    return rowToRental(data);
}

/* =========================================================
   RENTAL QUERIES
========================================================= */

export async function getRentalById(id: string): Promise<Rental | null> {
    const { data, error } = await supabase
        .from("rentals")
        .select("*")
        .eq("id", id)
        .maybeSingle();

    if (error) throw new Error(error.message);
    return data ? rowToRental(data) : null;
}

export async function getActiveRental(): Promise<Rental | null> {
    const { data, error } = await supabase
        .from("rentals")
        .select("*")
        .eq("status", "active")
        .gt("expires_at", new Date().toISOString())
        .order("started_at", { ascending: false })
        .limit(1)
        .maybeSingle();

    if (error) throw new Error(error.message);
    return data ? rowToRental(data) : null;
}

export async function getAllRentals(): Promise<Rental[]> {
    const { data, error } = await supabase
        .from("rentals")
        .select("*")
        .order("started_at", { ascending: false });

    if (error) throw new Error(error.message);
    return (data ?? []).map(rowToRental);
}

export async function endRental(rentalId: string): Promise<void> {
    const { error } = await supabase
        .from("rentals")
        .update({ status: "cancelled" })
        .eq("id", rentalId);

    if (error) throw new Error(error.message);
}

/* =========================================================
   ACTIVITY LOG
========================================================= */

export async function getActivityLog(
    rentalId: string,
): Promise<ActivityEvent[]> {
    const { data, error } = await supabase
        .from("vault_activity")
        .select("*")
        .eq("rental_id", rentalId)
        .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);
    return (data ?? []).map(rowToActivity);
}

export async function appendActivity(
    rentalId: string,
    type: "unlock" | "lock",
): Promise<ActivityEvent> {
    const {
        data: { user },
        error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
        throw new Error("You must be signed in.");
    }

    const { data, error } = await supabase
        .from("vault_activity")
        .insert({
            rental_id: rentalId,
            user_id: user.id,
            event_type: type,
        })
        .select()
        .single();

    if (error) throw new Error(error.message);
    return rowToActivity(data);
}
