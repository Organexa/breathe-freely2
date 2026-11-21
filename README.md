# Breathe Freely

A free, private, offline quit-smoking app for Android, built with Expo SDK 51 / React Native.

- Live smoke-free timer, money saved and cigarettes not smoked
- 12 health-recovery milestones with a timeline
- Breathe SOS: animated 4-2-6 breathing guide for cravings
- Craving journal with top triggers and time-of-day patterns
- Supportive slip flow that restarts the timer
- Local morning, evening and weekly reminders (no server)
- Backup/restore code with SHA-256 integrity check

No account, no ads, no analytics, no network calls.

## Build the APK

See [DEPLOYMENT.md](DEPLOYMENT.md). Short version:

```bash
npm install
npx eas-cli login
npx eas-cli init
npx eas-cli build --platform android --profile preview
```

## Develop

```bash
npm install
npm run typecheck
npm test
npx expo start        # then open in Expo Go on your phone
```

## Project layout

```
App.tsx, index.ts        entry: fonts, splash, providers
src/theme                colours, type scale, spacing
src/state                types, reducer, AppContext (persistence + reminders)
src/storage              AsyncStorage helpers, backup code (base64 + SHA-256)
src/logic                time, money, milestones, patterns (pure, unit-tested)
src/notifications        local reminder scheduling
src/components           Button, Card, Field, Chip, TimerRing, BreathingOrb, ...
src/screens              Onboarding, Home, Sos, CravingLog, Slip, Journal,
                         HealthTimeline, Settings, Restore
assets                   icon, adaptive icon, splash, notification icon
```

Product and design docs: PRD.md, TRD.md, ARCHITECTURE.md, DESIGN.md, RULES.md.
