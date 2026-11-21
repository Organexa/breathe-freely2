# Breathe Freely — Deployment Guide

How to turn this project into an installable APK with Expo EAS Build (free plan: 15 Android builds a month).

## What you need

1. **A free Expo account**: sign up at https://expo.dev.
2. **Node.js 18 or newer** on your computer: https://nodejs.org (LTS).
3. **An Android phone** to install the APK on.

You do **not** need Android Studio, a Google Play account, or any paid service.

## Step 1: Install dependencies

Unzip the project, open a terminal in the project folder, and run:

```bash
npm install
```

> Do **not** run `create-expo-app` in this folder. The project is already complete.

## Step 2: Log in to Expo

```bash
npx eas-cli login
```

## Step 3: Link the project to your Expo account (first time only)

```bash
npx eas-cli init
```

Answer **Yes** to create the project. This adds your `projectId` and `owner` to `app.json`.

## Step 4: Build the APK

```bash
npx eas-cli build --platform android --profile preview
```

- If asked to generate a new Android keystore, answer **Yes**. Expo stores it for you, and every later build is signed with the same key, so updates install over the old version.
- The build runs in Expo's cloud and usually takes 10 to 20 minutes. You can close the terminal; progress is also at https://expo.dev under your project's **Builds** tab.
- If the CLI says the folder is not a git repository, either run `git init && git add -A && git commit -m "Initial commit"` first, or set `EAS_NO_VCS=1` before the build command.

## Step 5: Install on your phone

1. When the build finishes, open the link the CLI prints (or the build page on expo.dev) **on your phone**, and tap **Install** or download the `.apk`.
2. Android will ask you to allow installs from your browser or file manager. Allow it for this install.
3. Open **Breathe Freely**.

## Build profiles (eas.json)

| Profile | Output | Use |
|---|---|---|
| `preview` | APK | Installing on your own phone and sharing directly. **Use this one.** |
| `production` | APK | Same as preview, without internal-distribution QR page. |
| `development` | APK with dev client | Only for live-reloading development. |

For a Google Play listing you would need an `.aab` instead: change `production.android.buildType` to `app-bundle`.

## Releasing an update

1. Make your changes.
2. Increase `version` (for example `1.0.1`) **and** `android.versionCode` (for example `2`) in `app.json`.
3. Run the build command from Step 4 again and install the new APK over the old one. Data is kept.

## Trying the app without building (Expo Go)

```bash
npx expo start
```

Scan the QR code with the **Expo Go** app from the Play Store. Everything works except that reminders behave slightly differently in Expo Go than in the real APK.

## Common issues

| Problem | Fix |
|---|---|
| `eas build` says *Invalid app configuration* | Run `npx expo-doctor` and fix what it lists. |
| *Project not configured* / *owner mismatch* | Run `npx eas-cli init` again while logged into your account. |
| Build stuck *in queue* | Free-plan builds wait in a shared queue. It can take a while at busy times. |
| *App not installed* on the phone | An older APK signed with a different key is installed. Uninstall it first (export a backup code from Settings beforehand). |
| No reminders arrive | Settings → Reminders must be on, and Android must allow notifications for the app. Some phones' battery savers delay them. |
| 15 builds a month used up | Wait for the monthly reset, or build locally with `npx expo run:android` (needs Android Studio). |

## Final checklist

- [ ] `npm install` finished without errors
- [ ] `npx eas-cli init` linked the project to your account
- [ ] Preview build finished on expo.dev
- [ ] APK installed and opens to the welcome screen
- [ ] Timer ticks, SOS breathing guide runs, a craving can be logged
- [ ] Export code from Settings, then restore it, works
