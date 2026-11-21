# Breathe Freely — Architecture

## 1. Overall architecture

```
┌──────────────────────────────────────────────┐
│              ANDROID DEVICE                  │
│                                              │
│  ┌────────────────────────────────────────┐  │
│  │         React Native (Expo)            │  │
│  │                                        │  │
│  │   App.tsx ── NavigationContainer       │  │
│  │      │                                 │  │
│  │      ├── OnboardingScreen              │  │
│  │      ├── HomeScreen ──┬── TimerRing    │  │
│  │      │                ├── MoneyCard    │  │
│  │      │                └── Milestones   │  │
│  │      ├── SosScreen ──── BreathingOrb   │  │
│  │      ├── CravingLogScreen              │  │
│  │      ├── SettingsScreen                │  │
│  │      └── HealthTimelineScreen          │  │
│  │                                        │  │
│  │   ┌──────────────────────────────────┐ │  │
│  │   │  State: AppContext (useReducer)  │ │  │
│  │   └──────────────┬───────────────────┘ │  │
│  │                  │                     │  │
│  │   ┌──────────────▼───────────────────┐ │  │
│  │   │  storage.ts (AsyncStorage)       │ │  │
│  │   └──────────────────────────────────┘ │  │
│  │                                        │  │
│  │   notifications.ts (expo-notifications)│  │
│  └────────────────────────────────────────┘  │
│                                              │
│  No network. No server. No third parties.    │
└──────────────────────────────────────────────┘
```

## 2. Frontend structure

```
BreatheFreely/
├── App.tsx                      # Entry: providers, fonts, navigation
├── app.json                     # Expo config (name, icons, permissions)
├── eas.json                     # EAS Build profiles
├── package.json
├── tsconfig.json
├── babel.config.js
├── index.ts                     # registerRootComponent
├── assets/
│   ├── icon.png                 # 1024×1024 app icon
│   ├── adaptive-icon.png        # Android adaptive foreground
│   ├── splash.png               # Splash image
│   └── fonts/                   # Bundled typefaces
├── src/
│   ├── theme/
│   │   ├── colors.ts            # Palette tokens
│   │   ├── typography.ts        # Type scale + families
│   │   └── layout.ts            # Spacing, radii, shadows
│   ├── state/
│   │   ├── AppContext.tsx       # Global state + reducer + persistence
│   │   └── types.ts             # Settings, Craving, Milestone types
│   ├── storage/
│   │   ├── storage.ts           # AsyncStorage read/write helpers
│   │   └── backup.ts            # Encode/decode export code
│   ├── logic/
│   │   ├── time.ts              # Duration formatting, live tick
│   │   ├── money.ts             # Money saved calculation
│   │   ├── milestones.ts        # Health milestone definitions + progress
│   │   └── patterns.ts          # Craving trigger/time analysis
│   ├── notifications/
│   │   └── notifications.ts     # Permission, schedule, cancel
│   ├── components/
│   │   ├── Screen.tsx           # Safe-area + background wrapper
│   │   ├── PrimaryButton.tsx
│   │   ├── SecondaryButton.tsx
│   │   ├── Card.tsx
│   │   ├── StatBlock.tsx
│   │   ├── TimerRing.tsx        # Progress ring around timer
│   │   ├── BreathingOrb.tsx     # Animated breathing guide
│   │   ├── MilestoneRow.tsx
│   │   ├── CravingRow.tsx
│   │   ├── Chip.tsx             # Selectable trigger chip
│   │   ├── Field.tsx            # Labelled text/number input
│   │   └── EmptyState.tsx
│   └── screens/
│       ├── OnboardingScreen.tsx
│       ├── HomeScreen.tsx
│       ├── SosScreen.tsx
│       ├── CravingLogScreen.tsx
│       ├── HealthTimelineScreen.tsx
│       └── SettingsScreen.tsx
└── docs/                        # This documentation set
```

## 3. Database architecture

No relational database. State model:

```ts
type Settings = {
  onboarded: boolean;
  quitAt: number;              // epoch ms
  currency: string;            // e.g. "₹", "$", "£", "€"
  pricePerPack: number;
  cigarettesPerDay: number;
  notificationsEnabled: boolean;
  morningTime: { hour: number; minute: number };
  eveningTime: { hour: number; minute: number };
};

type Craving = {
  id: string;                  // timestamp-based unique id
  at: number;                  // epoch ms
  trigger: string;             // e.g. "Stress", "After coffee"
  resisted: boolean;           // true = overcame, false = smoked
};
```

Persistence is write-through: every reducer mutation calls `storage.saveSettings` / `storage.saveCravings`. Reads happen once at startup, before the first render gate.

## 4. Authentication flow

None. There is no authentication because there are no accounts and no server. This is a deliberate design decision that eliminates entire classes of security risk (credential stuffing, token theft, account enumeration, data breaches).

## 5. API communication

None. Zero network calls. `fetch` is never used. No external SDKs with telemetry.

## 6. External integrations

| Integration | Purpose | Cost |
|---|---|---|
| expo-notifications | Local reminders | Free |
| expo-haptics | Tactile feedback | Free |
| Expo EAS Build | Produce APK in cloud | Free tier (15/mo) |

## 7. Data flow

```
User action
   │
   ▼
dispatch(action) ──► reducer(newState)
   │                      │
   │                      ├──► React re-render (derived values recomputed)
   │                      └──► storage.save* (async, fire-and-forget)
   ▼
UI updates
```

Derived values (elapsed duration, money saved, current milestone) are computed in render from `quitAt` — never stored. This guarantees they are always correct after restarts, timezone changes, and clock adjustments.

## 8. Component relationships

- `App.tsx` owns the `NavigationContainer`, the `AppProvider`, and font loading.
- `AppProvider` owns `Settings` + `Cravings`; exposes actions (`setQuitAt`, `logCraving`, `resetAfterSlip`, `updateSettings`, `restore`).
- `HomeScreen` reads only from context; it owns the 1-second tick interval (cleared on unmount / when app is backgrounded).
- `TimerRing` is presentational: receives `progress` and renders an SVG-free ring using two overlapping views with rotation and border masking.
- `BreathingOrb` owns its own animation loop and reports stage labels upward; it stops on unmount.

## 9. Failure modes and handling

| Failure | Handling |
|---|---|
| AsyncStorage read fails | Fall back to defaults, show a subtle banner |
| Notification permission denied | Disable toggle, explain in Settings inline |
| Invalid restore code | Show specific error, keep existing data intact |
| App clock changed backwards | Duration clamps at zero rather than showing negative |
| App backgrounded for hours | Timer recomputes from `quitAt` on resume — always correct |
