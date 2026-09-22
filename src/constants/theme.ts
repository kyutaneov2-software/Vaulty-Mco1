/**
 * Smart Rental Vault (SRV)
 * Luxury design system
 * Purple + Black + Gold
 */

export const colors = {
    // Main surfaces
    background: "#09070D",
    surface: "#15111F",
    surfaceElevated: "#1C1628",
    surfaceSoft: "#211A2E",

    // Brand
    primary: "#8B5CF6",
    primaryDark: "#6D28D9",
    primarySoft: "#24173D",

    // Luxury / premium accent
    gold: "#D4AF37",
    goldLight: "#F1D77A",
    goldSoft: "#2D2510",

    // Text
    text: "#F8F4FF",
    textStrong: "#FFFFFF",
    muted: "#A9A0B8",
    mutedDark: "#7F758F",

    // Borders
    border: "#30263D",
    borderStrong: "#4A3A5E",

    // Status
    success: "#55D98A",
    successSoft: "#12301F",

    warning: "#F5C451",
    warningSoft: "#352A0E",

    danger: "#FB7185",
    dangerSoft: "#34151D",

    // Compatibility with the original SRV foundation
    softBlue: "#24173D",
    softGreen: "#12301F",
    softYellow: "#352A0E",

    // Utility
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
    pill: 999,
};

export const gradients = {
    background: ["#05040A", "#0B0712", "#160D25", "#09060F"] as const,

    primary: ["#6D28D9", "#8B5CF6"] as const,

    luxury: ["#8B5CF6", "#D4AF37"] as const,

    gold: ["#B8860B", "#F1D77A", "#D4AF37"] as const,

    card: ["#211A2E", "#15111F"] as const,
};