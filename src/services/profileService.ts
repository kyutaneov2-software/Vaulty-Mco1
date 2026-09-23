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

export async function uploadMyProfileAvatar(
    imageUri: string,
    mimeType?: string | null,
): Promise<string> {
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

    const response = await fetch(imageUri);

    if (!response.ok) {
        throw new Error("Unable to read the selected image.");
    }

    const arrayBuffer = await response.arrayBuffer();

    const actualMimeType = mimeType || "image/jpeg";

    const mimeExtension =
        actualMimeType.split("/")[1]?.split(";")[0]?.toLowerCase() || "jpeg";

    const extension = mimeExtension === "jpeg" ? "jpg" : mimeExtension;

    const filePath = `${user.id}/avatar-${Date.now()}.${extension}`;

    const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, arrayBuffer, {
            contentType: actualMimeType,
            cacheControl: "3600",
            upsert: false,
        });

    if (uploadError) {
        throw uploadError;
    }

    const { data: publicUrlData } = supabase.storage
        .from("avatars")
        .getPublicUrl(filePath);

    const avatarUrl = publicUrlData.publicUrl;

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
