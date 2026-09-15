# Rental Vault System

A smart physical-vault rental platform. Users browse available vaults, rent them for a chosen duration, pay, and unlock the physical device through the app.

The system spans three layers:

- **Mobile app** — Expo / React Native (this repository)
- **Backend services** — authentication, rentals, payments, entitlements
- **IoT device** — ESP32/ESP8266 vault controller over MQTT

---

## Status

**Phase 1 — UI Foundation.** The current goal is to establish the design system, navigation structure, authentication flow, and paywall experience. Device actions are mocked until the hardware layer is connected.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Expo SDK 57 |
| Runtime | React Native / React 19 |
| Language | TypeScript |
| Navigation | Expo Router (file-based) |
| Fonts | Inter via `@expo-google-fonts/inter` |
| Icons | Lucide (`lucide-react-native`) |
| State | Zustand |
| Secure storage | `expo-secure-store` |
| Payments | TBD (regional PSP + optional entitlement provider) |
| Device comms | MQTT (Phase 5) |

---

## Getting Started

### Prerequisites

- Node.js 20+
- npm or yarn
- Expo Go on your phone, or an iOS/Android simulator

### Install

```bash
npm install
```

### Run

```bash
npx expo start
```

Then choose a target:

- `i` — iOS simulator
- `a` — Android emulator
- `w` — Web
- Scan the QR code with Expo Go

> **Note:** RevenueCat and MQTT will require a development build later. Phase 1 runs entirely in Expo Go.

---

## Project Structure

```text
src/
├── app/                    # Expo Router — thin route wrappers
│   ├── _layout.tsx         # Root layout + auth guard
│   ├── (auth)/             # Welcome, sign-in, sign-up
│   ├── (tabs)/             # Home, Vaults, Rentals, Activity, Profile
│   ├── vault/[id].tsx      # Vault detail
│   └── rental/             # Plan selection + active vault control
├── components/             # Shared UI primitives
├── constants/              # Design tokens
├── features/               # Feature modules (auth, vault, rentals, ...)
├── services/               # API, MQTT, entitlements
└── hooks/
```

Route files in `app/` stay thin — they pass through to screen components in `features/`. UI primitives live in `components/`.

---

# Design System

## Visual Identity

The visual identity is **Premium Smart Vault** — a dark industrial fintech interface inspired by modern dashboards and secure-device products without becoming a generic crypto application.

The design combines three references:

1. **Modern dark fintech/Web3 dashboards** — for hierarchy, cards, data presentation, and premium purple accents.
2. **Dark mobile wallet interfaces** — for mobile spacing, balance/session cards, status indicators, and bottom navigation.
3. **The 3D metallic vault product render** — for the physical product identity, industrial feel, and secondary metal/copper palette.

### Core Personality

> **Secure + Premium + Technical + Minimal**

The application should feel like a premium smart-security product that happens to use a modern fintech interface — **not a crypto app with a vault attached**.

---

## Color Theme

The base interface should use a very dark navy/black foundation with restrained accent colors.

### Core Palette

| Token | Purpose | Value |
|---|---|---|
| `background` | Main app background | `#080C12` |
| `surface` | Secondary background | `#0D121A` |
| `card` | Standard card surface | `#121923` |
| `elevated` | Elevated components | `#171F2B` |
| `border` | Card/input borders | `#26313D` |
| `text` | Primary text | `#F4F7FA` |
| `textSecondary` | Supporting text | `#8B96A5` |
| `textMuted` | Metadata / disabled text | `#596371` |

### Accent Palette

| Token | Purpose | Value |
|---|---|---|
| `primary` | Main CTA, selected states, rental selection | `#6C4CF6` |
| `blue` | Device/technical information | `#4F8CFF` |
| `success` | Active, available, connected, unlocked | `#55D68A` |
| `warning` | Expiring, low battery, pending | `#F5B84B` |
| `danger` | Error, denied, disconnected | `#F45B5B` |

### Product Identity Palette

The physical vault render provides a secondary product palette.

| Token | Purpose | Value |
|---|---|---|
| `metal` | Brushed-metal surfaces | `#C9D0DC` |
| `steel` | Secondary metal | `#7D899C` |
| `coldBlue` | Physical blue highlight | `#738CFF` |
| `vaultPurple` | Product-to-app connection | `#6C4CF6` |
| `copper` | Vault interior / premium detail | `#E6A36F` |
| `warmLight` | Soft copper highlight | `#FFD0A3` |

### Color Usage Rule

**Purple/Blue = digital interface**

**Copper = physical vault identity**

Copper should be used sparingly so that it remains a recognizable product accent rather than becoming another primary UI color.

---

## React Native Color Tokens

Centralize colors rather than scattering hex values through screen files.

```ts
export const colors = {
    background: "#080C12",
    surface: "#0D121A",
    card: "#121923",
    elevated: "#171F2B",

    border: "#26313D",

    text: "#F4F7FA",
    textSecondary: "#8B96A5",
    textMuted: "#596371",

    primary: "#6C4CF6",
    blue: "#4F8CFF",
    success: "#55D68A",
    warning: "#F5B84B",
    danger: "#F45B5B",
};
```

---

## Typography

### Primary Font

**Inter**

Inter is the primary font for the entire application.

Use it for:

- Screen titles
- Cards
- Buttons
- Body text
- Status labels
- Financial values
- Rental countdowns
- Device information

### Typography Hierarchy

| Element | Font | Weight |
|---|---|---|
| Hero number | Inter | 700 |
| Large screen title | Inter | 700 |
| Section heading | Inter | 600 |
| Card title | Inter | 600 |
| Body | Inter | 400 |
| Secondary text | Inter | 400 |
| Button text | Inter | 600 |
| Balance/session value | Inter | 600–700 |
| Tiny status label | Inter | 500 |

Do not make every element bold. Create visual hierarchy by combining size, weight, spacing, and color contrast.

### Recommended Sizes

| Element | Size |
|---|---:|
| Hero number | `32–40` |
| Large screen title | `28–32` |
| Section title | `20–22` |
| Card title | `16–18` |
| Body | `14–16` |
| Secondary text | `13–14` |
| Caption | `11–12` |
| Button | `14–15` |
| Tiny status label | `10–11` |

For dashboard values such as remaining rental time, balance, or vault status, use approximately `30–36px`.

---

## Iconography

Use one consistent outline icon family.

### Recommended

**Lucide**

Suggested icons:

- `Shield`
- `Lock`
- `Unlock`
- `Vault`
- `Clock`
- `Wallet`
- `CreditCard`
- `User`
- `Settings`
- `Bell`
- `Wifi`
- `Bluetooth`
- `Battery`
- `MapPin`
- `History`
- `ChevronRight`

Avoid mixing unrelated icon styles.

---

## Shape Language

### Border Radius

| Element | Radius |
|---|---:|
| Small element | `10px` |
| Input | `12px` |
| Card | `16px` |
| Large card | `20px` |
| Hero panel | `24px` |
| Bottom sheet | `24px` |
| Pill | `999px` |

The interface should use rounded forms, but not every component should become a pill.

---

## Spacing

Use an 8-point spacing system:

```text
4
8
12
16
20
24
32
40
48
64
```

Most screen layouts should rely primarily on:

```text
16px
20px
24px
32px
```

This creates a predictable mobile layout and makes the interface easier to maintain.

---

## Cards and Surfaces

The interface uses a **Dark Glass / Soft Industrial** style rather than full glassmorphism.

Cards should generally have:

- Dark surface background
- Thin border
- 16–20px radius
- Subtle shadow
- Strong title
- Muted metadata
- One clear action

Example:

```text
╭──────────────────────────────╮
│                              │
│  Vault A-017                 │
│  Medium                      │
│                              │
│  ● Available                 │
│                              │
│       ₱50 / hour             │
│                              │
╰──────────────────────────────╯
```

---

## Shadows and Glow

Use shadows for depth, not decoration.

```ts
shadowColor: "#000000",
shadowOpacity: 0.25,
shadowRadius: 12,
shadowOffset: {
    width: 0,
    height: 6,
},
```

Purple/blue glow should be reserved for:

- Primary CTAs
- Selected rental plans
- Active vault states
- Security-related actions
- Important status highlights

Do **not** make every card glow.

---

## Background Treatment

The primary background is near-black navy.

Subtle ambient lighting can be used:

```text
Top-right     → subtle purple glow
Center        → dark navy
Bottom-left   → subtle blue glow
```

The background should remain visually quiet so the content remains the focus.

---

## UI Personality

### The interface should feel:

- Secure
- Premium
- Controlled
- Technical
- Minimal
- Modern
- Physical-product-oriented

### Avoid:

- Excessive neon
- Excessive glassmorphism
- Gaming-style glow
- Excessive gradients
- Rainbow crypto aesthetics
- Dense trading-dashboard layouts
- Generic Bootstrap-style cards

---

# Core Screens

```text
Welcome → Sign In / Sign Up → Home → Vaults → Vault Detail
       → Choose Rental → Paywall → Active Rental → Lock / Unlock
```

| Screen | Purpose |
|---|---|
| Welcome | Brand entry point |
| Sign In / Sign Up | Authentication |
| Home | Active rental summary, device status, quick unlock |
| Vaults | Browse and filter available vaults |
| Vault Detail | Vault info, pricing tiers, "Rent Vault" |
| Choose Rental | Hourly / Daily / Weekly plan selection |
| Paywall | Purchase flow, entitlement check |
| Active Vault | Lock/unlock control, countdown, activity log |
| Rentals | Active + history, extend, early release |
| Activity | Event log |
| Profile | Account, payment methods, notifications |

---

## Home

The dashboard should summarize the user's current state.

Example:

```text
Good morning

ACTIVE RENTAL

Vault A-017
Medium Vault

23h 41m remaining

██████████████████░░

[ Open Vault ]

Device
● Connected
Battery 87%
```

Available or nearby vaults can appear underneath.

---

## Vaults

Adapt the card hierarchy from the desktop reference.

```text
Vaults

[ Near Me ] [ All ]

┌──────────────────────────┐
│  Vault A-017             │
│  Medium                  │
│                          │
│  ● Available             │
│                          │
│  ₱30 / hour              │
│                          │
│              [ View ]    │
└──────────────────────────┘
```

Possible filters:

- All
- Available
- Nearby
- Small
- Medium
- Large

---

## Vault Detail

This should be one of the most visually important screens.

```text
← Vault A-017                         ☆

        [ 3D Vault Image ]

        Medium Vault

● Available

Location
NwSSU Building A

Security
Electronic Lock

Rental

₱30 / hour
₱120 / day
₱600 / week

[ Rent Vault ]
```

The 3D metallic vault render is a primary product asset here.

---

## Rental / Paywall

The paywall should feel like selecting physical access time rather than a generic digital subscription.

```text
Choose Your Rental

Access the vault for as long
as you need.

┌──────────────────────────┐
│  HOURLY                  │
│  ₱30 / hour              │
│                          │
│  Flexible access         │
└──────────────────────────┘

┌──────────────────────────┐
│  DAILY                   │
│  ₱120 / day              │
│                          │
│  Best for short storage  │
└──────────────────────────┘

┌──────────────────────────┐
│  WEEKLY                  │
│  ₱600 / week             │
│                          │
│  Long-term storage       │
└──────────────────────────┘

[ Continue ]
```

Selected rental plan:

- Purple border
- Purple surface tint
- Check icon

---

## Authentication

Authentication screens should remain visually clean.

### Welcome

```text
Secure what matters.

Your personal storage,
available when you need it.

[ Get Started ]

[ Sign In ]
```

The 3D vault render can sit above or behind the headline with subtle purple lighting.

### Sign In

```text
Welcome Back

Email
┌──────────────────────────┐
│                          │
└──────────────────────────┘

Password
┌──────────────────────────┐
│                          │
└──────────────────────────┘

Forgot password?

[ Sign In ]

──────── or ────────

Continue with Google
Continue with Apple
```

Keep decorative elements minimal on authentication screens.

---

## Active Vault Control

This is a core product screen.

```text
ACTIVE VAULT

        ┌───────────────┐
        │               │
        │     LOCKED    │
        │               │
        └───────────────┘

Vault A-017

● Connected

23h 41m remaining

        [ UNLOCK ]

Battery       87%
Connection    Excellent

Recent Activity

07:31  Locked
06:48  Unlocked
06:02  Locked
```

The unlock action should be the strongest CTA on this screen.

---

## Security States

Security/device status should be immediately recognizable.

| State | Visual |
|---|---|
| Locked | Purple / Blue |
| Unlocked | Green |
| Connecting | Blue + loading |
| Disconnected | Red |
| Expiring | Amber |

Example labels:

```text
LOCKED
UNLOCKED
CONNECTING
DISCONNECTED
15 MINUTES LEFT
```

Use the same semantic colors consistently across the app.

---

# Architecture Principle

> **Payment entitlement is not the same thing as physical access.**

The backend determines whether access is permitted.

The mobile application should not independently decide that a user is allowed to unlock the physical vault.

Conceptually:

```text
USER
 │
 ▼
AUTHENTICATION
 │
 ▼
BACKEND
 │
 ├───────────────┐
 ▼               ▼
RENTAL          PAYMENT
 │               │
 ▼               ▼
VAULT           PAYMENT / ENTITLEMENT SYSTEM
 │
 ▼
DEVICE ACCESS
 │
 ▼
ESP32
 │
 ▼
LOCK
```

The backend validates:

```text
userId
+
vaultId
+
rentalId
+
currentTime
+
paymentStatus
=
ACCESS ALLOWED
```

Then the backend can publish the authorized MQTT command to the ESP32 and return a short-lived access token or access result.

The mobile app renders the result instead of acting as the final authority.

---

# Development Roadmap

- [x] **Phase 0** — Project scaffold, folder structure, GitHub
- [ ] **Phase 1** — UI foundation (design system, navigation, screens)
- [ ] **Phase 2** — Authentication backend + persistent sessions
- [ ] **Phase 3** — Payments / entitlement integration
- [ ] **Phase 4** — Rental backend (creation, expiry, history)
- [ ] **Phase 5** — ESP32 + MQTT device communication
- [ ] **Phase 6** — Physical vault integration + end-to-end testing

---

## Phase 1 Screen Target

The first complete UI prototype should cover:

```text
Welcome
   ↓
Sign Up / Sign In
   ↓
Home
   ↓
Vaults
   ↓
Vault Detail
   ↓
Choose Rental
   ↓
Paywall
   ↓
Active Rental
   ↓
Vault Access
   ↓
Lock / Unlock State
```

At this stage, device actions may remain mocked.

The priority is to establish a consistent visual system, navigation structure, authentication flow, and rental/paywall experience before connecting the physical hardware.

---

## Development Notes

- **Package installs** — use `npx expo install` for Expo-managed packages so versions stay compatible with SDK 57.
- **Path alias** — `@/*` maps to `./src/*` (configured in `tsconfig.json`).
- **Env files** — use `.env.local` for local secrets; it is gitignored.
- **Auth guard** — uses `Stack.Protected` (SDK 53+ pattern), not per-screen `<Redirect>`.
- **Expo Go** — Phase 1 UI work can run in Expo Go. Native payment and device integrations may require a development build later.

---

# References

- [Expo Documentation](https://docs.expo.dev/)
- [Expo Router](https://docs.expo.dev/router/introduction)
- [Design Specification](./Rental_Vault_System_UI_Design.md)

---

# License

Private. All rights reserved.
