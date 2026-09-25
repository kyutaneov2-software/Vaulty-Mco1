export const colors = {
    /* =================================================
       CORE BACKGROUND
    ================================================= */

    background: "#050407",

    surface: "#0B090F",
    surfaceElevated: "#111019",
    surfaceSoft: "#171320",

    /* =================================================
       PURPLE SYSTEM
    ================================================= */

    primary: "#8B5CF6",
    primaryLight: "#A78BFA",
    primaryBright: "#B06CFF",
    primaryDark: "#5B21B6",

    primarySoft: "#21133A",
    primaryFaint: "#160D25",

    /* =================================================
       GRADIENT COLORS
    ================================================= */

    gradientTop: "#5E20D8",
    gradientTopSoft: "#4315A8",
    gradientMid: "#24103F",
    gradientBottom: "#08060B",

    /* =================================================
       TEXT
    ================================================= */

    text: "#F4F1F8",
    textStrong: "#FFFFFF",

    muted: "#A59EAF",
    mutedDark: "#706978",

    /* =================================================
       BORDERS
    ================================================= */

    border: "#24202B",
    borderStrong: "#3A2B4E",
    borderPurple: "#4B2A72",

    /* =================================================
       STATUS
    ================================================= */

    success: "#5EE39A",
    successSoft: "#10291C",

    warning: "#F4C95D",
    warningSoft: "#30260F",

    danger: "#FF6B81",
    dangerSoft: "#32131B",

    /* =================================================
       GOLD
       
       Used sparingly for premium/value accents.
    ================================================= */

    gold: "#D4AF37",
    goldLight: "#F0D875",
    goldSoft: "#2C240E",

    /* =================================================
       COMMON
    ================================================= */

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

export const gradients = {
    /* =================================================
       MAIN APP BACKGROUND
       
       Purple begins at the top and fades into black
       toward the bottom.
    ================================================= */

    background: [
        "#5E20D8",
        "#4315A8",
        "#24103F",
        "#100A18",
        "#050407",
    ] as const,

    /* =================================================
       PRIMARY ACTION
    ================================================= */

    primary: ["#6D28D9", "#8B5CF6"] as const,

    /* =================================================
       PURPLE GLOW
    ================================================= */

    purpleGlow: ["#8B5CF6", "#4C1D95", "#050407"] as const,

    /* =================================================
       PREMIUM ACCENT
    ================================================= */

    luxury: ["#8B5CF6", "#D4AF37"] as const,

    /* =================================================
       CARD
    ================================================= */

    card: ["#111019", "#09070D"] as const,
};
