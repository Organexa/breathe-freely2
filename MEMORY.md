# Breathe Freely — Project Memory

## What the product is

Breathe Freely is a free, private, offline-first Android app that helps people quit smoking. It shows how long someone has been smoke-free, the money they've saved, what their body is recovering, and provides an instant breathing guide when a craving hits. No account, no sign-up, no ads, no data upload.

**Current status:** v1 in development.
**Platform:** Android (built with Expo / React Native).
**Current milestone:** Documentation complete. Awaiting app build.

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

## Completed features (docs only)

- PRD.md — product requirements, user stories, acceptance criteria
- TRD.md — technology stack, dependencies, deployment plan
- ARCHITECTURE.md — system diagram, data flow, failure modes
- DESIGN.md — color palette, typography, components, animations
- RULES.md — coding standards and patterns (to be written)
- FEATURE-TICKETS.md — task breakdown (to be written)
- SECURITY-AND-ACCESS.md — privacy and access control (to be written)
- DEPLOYMENT.md — build and install instructions (to be written)
- TESTING.md — verification scenarios (to be written)
- MEMORY.md — this file

## Pending work

1. **Write RULES.md** — coding standards, naming conventions, file organization
2. **Write FEATURE-TICKETS.md** — all approved features broken into tasks
3. **Write SECURITY-AND-ACCESS.md** — privacy, storage security, backup
4. **Write DEPLOYMENT.md** — EAS Build steps, APK installation, update flow
5. **Write TESTING.md** — verification scenarios for each feature
6. **Create app files** — all TypeScript source, components, screens, navigation
7. **Create config files** — `app.json`, `eas.json`, `package.json`, etc.
8. **Present to user** — file structure and next steps for building APK

## Files created (as of now)

```
BreatheFreely/
└── docs/
    ├── PRD.md                    ✓ Done
    ├── TRD.md                    ✓ Done
    ├── ARCHITECTURE.md           ✓ Done
    ├── DESIGN.md                 ✓ Done
    └── MEMORY.md                 ✓ Done (this file)
```

## Blocking issues

None. Documentation is the only remaining non-coding work before the app build.

## What to resume from

Resume by reading `MEMORY.md` and `PRD.md`, then:
1. Finish RULES.md
2. Finish FEATURE-TICKETS.md
3. Finish SECURITY-AND-ACCESS.md
4. Finish DEPLOYMENT.md
5. Finish TESTING.md
6. Build the complete app
7. Present files to user

The next turn should continue with the documentation batch (RULES, FEATURE-TICKETS, SECURITY, DEPLOYMENT, TESTING), then move to the app build.

## External dependencies (all free)

| Service | Purpose | Free tier limit |
|---|---|---|
| Expo SDK | App framework | Free |
| Expo EAS Build | Cloud APK generation | 15 Android builds/month free |
| expo-notifications | Local reminders | Free |
| expo-haptics | Tactile feedback | Free |

No paid APIs, no paid databases, no paid hosting.
