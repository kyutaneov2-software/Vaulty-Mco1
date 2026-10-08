export const colors = {
    background: "#000000",

    surface: "#0B0B0E",
    surfaceElevated: "#131317",
    surfaceSoft: "#1A1A1F",

    primary: "#8B5CF6",
    primaryLight: "#A78BFA",
    primaryBright: "#B06CFF",
    primaryDark: "#5B21B6",

    primarySoft: "rgba(139,92,246,0.10)",
    primaryFaint: "rgba(139,92,246,0.05)",

    gradientTop: "#0A0612",
    gradientTopSoft: "#060609",
    gradientMid: "#030305",
    gradientBottom: "#000000",

    text: "#F5F5F7",
    textStrong: "#FFFFFF",

    muted: "#8E8E93",
    mutedDark: "#5A5A5F",

    border: "#1C1C21",
    borderStrong: "#2A2A31",
    borderPurple: "rgba(139,92,246,0.35)",

    success: "#5EE39A",
    successSoft: "rgba(94,227,154,0.10)",

    warning: "#F4C95D",
    warningSoft: "rgba(244,201,93,0.10)",

    danger: "#FF6B81",
    dangerSoft: "rgba(255,107,129,0.10)",

    gold: "#D4AF37",
    goldLight: "#F0D875",
    goldSoft: "rgba(212,175,55,0.10)",

    black: "#000000",
    white: "#FFFFFF",
    transparent: "transparent",
};

export const spacing = {
    xs: 6,
    sm: 10,
    md: 16,
    lg: 24,
    xl: 32,
};

export const radius = {
    sm: 10,
    md: 16,
    lg: 22,
    xl: 28,
    pill: 999,
};

export const shadows = {
    card: {
        shadowColor: "#000000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.35,
        shadowRadius: 12,
        elevation: 4,
    },

    elevated: {
        shadowColor: "#000000",
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.5,
        shadowRadius: 24,
        elevation: 10,
    },

    purple: {
        shadowColor: "#8B5CF6",
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.35,
        shadowRadius: 16,
        elevation: 8,
    },
};

export const gradients = {
    /* =================================================
       MAIN APP BACKGROUND

       Silver-to-black gradient. The top of the screen
       uses a slate silver so the app reads visibly in
       daylight. Fades through dark gray into pure black
       by the bottom third.
    ================================================= */

    background: [
        "#2E3138",
        "#1A1B1F",
        "#0D0D10",
        "#030304",
        "#000000",
    ] as const,

    primary: ["#6D28D9", "#8B5CF6"] as const,

    purpleGlow: ["#8B5CF6", "#4C1D95", "#000000"] as const,

    luxury: ["#8B5CF6", "#D4AF37"] as const,

    card: ["#131317", "#0B0B0E"] as const,
};
