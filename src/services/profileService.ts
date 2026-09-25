import { decode } from "base64-arraybuffer";

import { supabase } from "../lib/supabase";

export type MyProfile = {
    id: string;
    name: string;
    avatarUrl: string | null;
};

export async function getMyProfile(): Promise<MyProfile> {
    const {
        data: { user },
        error: authError,
    } = await supabase.auth.getUser();

    if (authError) {
        throw authError;
    }

    if (!user) {
        throw new Error("Not authenticated");
    }

    const { data, error } = await supabase
        .from("profiles")
        .select("id, name, avatar_url")
        .eq("id", user.id)
        .single();

    if (error) {
        throw error;
    }

    return {
        id: data.id,
        name: data.name ?? "",
        avatarUrl: data.avatar_url ?? null,
    };
}

type UploadAvatarOptions = {
    base64: string;
    mimeType?: string | null;
};

export async function uploadMyProfileAvatar({
    base64,
    mimeType,
}: UploadAvatarOptions): Promise<string> {
    const {
        data: { user },
        error: authError,
    } = await supabase.auth.getUser();

    if (authError) {
        throw authError;
    }

    if (!user) {
        throw new Error("Not authenticated");
    }

    if (!base64) {
        throw new Error("The selected image has no image data.");
    }

    /*
     * ImagePicker's base64 output is JPEG image data.
     *
     * Supabase recommends ArrayBuffer for React Native uploads.
     */
    const arrayBuffer = decode(base64);

    const contentType = mimeType || "image/jpeg";

    /*
     * Keep one predictable avatar file per user.
     *
     * This means a new profile photo replaces the previous one
     * instead of creating unlimited avatar files.
     */
    const filePath = `${user.id}/avatar.jpg`;

    const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, arrayBuffer, {
            contentType,
            cacheControl: "3600",
            upsert: true,
        });

    if (uploadError) {
        throw uploadError;
    }

    const { data: publicUrlData } = supabase.storage
        .from("avatars")
        .getPublicUrl(filePath);

    /*
     * Add a cache-busting query so the new photo appears
     * immediately after replacing the previous image.
     */
    const avatarUrl = `${publicUrlData.publicUrl}?v=${Date.now()}`;

    const { error: profileError } = await supabase
        .from("profiles")
        .update({
            avatar_url: avatarUrl,
            updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);

    if (profileError) {
        throw profileError;
    }

    return avatarUrl;
}
