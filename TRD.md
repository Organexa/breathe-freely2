# Breathe Freely — Technical Requirements Document (TRD)

## 1. Selected technologies

| Layer | Technology | Why |
|---|---|---|
| App framework | Expo SDK 51+ (React Native) | One codebase, free SDK, no Android Studio needed, cloud builds |
| Language | TypeScript | Safer code, fewer runtime bugs, better maintainability |
| Navigation | React Navigation (native stack) | Standard, lightweight, no paid dependency |
| Local storage | `@react-native-async-storage/async-storage` | On-device key-value persistence, free, no account |
| Notifications | `expo-notifications` | Local (on-device) notifications, free |
| Animations | `react-native-reanimated` + `Animated` API | Smooth 60fps breathing animation |
| Icons | `@expo/vector-icons` (Ionicons) | Bundled with Expo, free |
| Fonts | `expo-font` with Google Fonts (Inter + Fraunces) | Premium typography, free, open licence |
| Gradients | `expo-linear-gradient` | Soft glows and depth |
| Haptics | `expo-haptics` | Tactile feedback on key actions |
| Date handling | Native `Date` + small helpers | Avoids extra dependencies |
| Build | Expo EAS Build (free plan) | Cloud APK generation, 15 Android builds/month free |
| Distribution | Direct APK + optional Expo Go preview | No store fee required |

## 2. Dependencies (production)

```
expo                    ~51.0.0
expo-status-bar         ~1.12.1
expo-notifications      ~0.28.0
expo-haptics            ~13.0.0
expo-linear-gradient    ~13.0.0
expo-font               ~12.0.0
expo-splash-screen      ~0.27.0
@react-native-async-storage/async-storage 1.23.1
@react-navigation/native ^6.1.0
@react-navigation/native-stack ^6.9.0
react-native-screens    ~3.31.1
react-native-safe-area-context 4.10.5
react-native-reanimated  ~3.10.1
react-native-gesture-handler ~2.16.1
@expo/vector-icons      ^14.0.0
```

All of the above are open-source and free. No paid SDKs, no paid APIs, no paid services.

## 3. Development dependencies

`typescript`, `@types/react`, `@babel/core`, `jest`, `jest-expo`, `@testing-library/react-native`. All free.

## 4. Database requirements

No server database. Data is stored on the device with AsyncStorage under a single namespaced key set:

| Key | Contents |
|---|---|
| `bf.settings.v1` | quitAt, currency, pricePerPack, cigarettesPerDay, notificationsEnabled, morningTime, eveningTime, onboarded |
| `bf.cravings.v1` | array of { id, at, trigger, resisted } |
| `bf.milestones.v1` | (derived, not stored) |

Why not SQLite: the data volume is tiny (a few hundred cravings at most), and AsyncStorage removes a native module and its build complexity. If the log grows large in a future version, migrate to `expo-sqlite`.

## 5. API requirements

None. The app makes zero network requests. This is a deliberate privacy and reliability decision: nothing can fail, nothing can leak, nothing can cost money.

## 6. Hosting requirements

None for v1. The app is static after install. Future optional: host a privacy policy page on GitHub Pages for Play Store submission (free).

## 7. Deployment requirements

- A free Expo account (`expo.dev`) to run cloud builds.
- `eas-cli` used from the Expo web UI or a one-time command — no local install required if using the browser-based build trigger.
- APK output distributed directly (sideload) or via a free link.
- Google Play listing optional and requires a one-time $25 registration fee — **not required** to use the app.

## 8. System limitations

- **No native compilation in the authoring environment.** The project is delivered as complete source; the APK is produced by Expo's cloud build service. This is the free, no-install path.
- **iOS** requires a paid Apple Developer account ($99/year) to install outside Expo Go. Not part of v1.
- **Notifications on Android 13+** require the runtime permission prompt; the app handles denial gracefully.
- **Exact alarm timing**: Android may delay notifications slightly under battery optimisation. This is an OS behaviour, not an app bug.
- **No cloud backup**: progress is device-local; the export/restore code is the only transfer path (by design, since there is no account).
