# Breathe Freely — Project Memory

## What the product is

Breathe Freely is a free, private, offline-first Android app that helps people quit smoking. It shows how long someone has been smoke-free, the money they've saved, what their body is recovering, and provides an instant breathing guide when a craving hits. No account, no sign-up, no ads, no data upload.

**Current status:** Breathe Freely V1.0 released. APK built with EAS (build ad4f3553-9b17-4fa0-a7ff-18817c6512a7, project @organexas-team/breathe-freely).
**Platform:** Android (built with Expo / React Native).
**Current milestone:** Source, assets and config complete. Typecheck, 16 unit tests, Android bundle export and `expo prebuild` all pass. Next step: build the APK with EAS (see DEPLOYMENT.md).

## Important decisions

- **No account system:** All data lives on-device. This maximizes privacy, eliminates server dependencies, and keeps costs zero.
- **AI supporter deferred:** Chat was considered, but with no account system, it would create quota and security issues. The offline SOS breathing guide is better for v1.
- **Android-first:** iOS would require a $99/year Apple Developer account, which is outside the no-cost constraint.
- **Design system:** Dark & premium — near-black `#0D0F12` base with green `#4ADE80` primary accent and amber `#F59E0B` for money saved.

## Technology choices

| Layer | Technology |
|---|---|
| Framework | Expo SDK 51+ (React Native) |
| Language | TypeScript |
| Navigation | React Navigation (native stack) |
| Storage | AsyncStorage (on-device) |
| Notifications | expo-notifications |
| Build | Expo EAS Build (free plan) |

## Project structure

```
BreatheFreely/
├── docs/                           # This documentation set
├── assets/                         # Icon, splash, fonts
├── src/
│   ├── theme/                     # colors, typography, layout
│   ├── state/                     # AppContext, reducer, types
│   ├── storage/                    # AsyncStorage helpers, backup
│   ├── logic/                      # time, money, milestones, patterns
│   ├── notifications/              # permission, scheduling
│   ├── components/                 # reusable UI
│   └── screens/                    # full pages
```

## Implementation notes

- All 18 app tickets (T01–T18) are implemented under `src/` plus `App.tsx` / `index.ts`.
- Screens: Onboarding (4 steps), Home, Sos, CravingLog, Slip, Journal (patterns + history), HealthTimeline, Settings, Restore.
- Navigation switches between the onboarding stack and the main stack based on `settings.onboarded`.
- Persistence is write-through from `AppContext`; it is disabled if the initial read fails, so stored data is never overwritten by defaults.
- Backup code format: `BF1.<base64url JSON>.<first 16 hex of SHA-256>`, validated field by field.
- Reminders are rescheduled from settings whenever relevant settings change.
- The timer ring is SVG-free (60 tick views); the breathing orb uses the built-in Animated API.
- `react-native-reanimated` and `react-native-gesture-handler` were dropped as unused.
- Health timeline is vertical rather than horizontal (more readable on a phone).
- `eas.json` profiles: `preview` and `production` both produce an APK.
- `app.json` no longer has a hard-coded `owner`/`projectId`/updates URL; `eas init` adds the user's own.

## External dependencies (all free)

| Service | Purpose | Free tier limit |
|---|---|---|
| Expo SDK | App framework | Free |
| Expo EAS Build | Cloud APK generation | 15 Android builds/month free |
| expo-notifications | Local reminders | Free |
| expo-haptics | Tactile feedback | Free |

No paid APIs, no paid databases, no paid hosting.
