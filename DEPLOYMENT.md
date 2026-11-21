# Breathe Freely — Deployment Guide

This guide tells you exactly how to build, install, and share the completed app on Android.

## Prerequisites

You need three things before you start:

1. **A free Expo account** — go to `expo.dev` and create one.
2. **The Expo app installed on your Android phone** — available on Google Play Store.
3. **A terminal (optional)** — you'll use this for one quick EAS command. If you don't have one, I'll give you browser-only steps.

## Step 1: Log into Expo

1. Go to `expo.dev`
2. Click **Sign in with GitHub** (recommended) or create a free account
3. Verify your email if you receive a confirmation

If you don't want to use GitHub, you can sign up with email instead.

## Step 2: Install EAS CLI (one-time)

Run this in a terminal (PowerShell on Windows, Terminal on Mac/Linux):

```bash
npm install -g eas-cli
```

That's it. You only need to do this once.

## Step 3: Initialize the project

Navigate to the project folder I created for you and run:

```bash
cd BreatheFreely
npx create-expo-app@latest . --template blank-typescript
```

This initializes the Expo project in the existing folder.

## Step 4: Login to Expo

Run this in the project folder:

```bash
eas login
```

Enter your Expo account credentials. When asked, log in with GitHub for the easiest experience.

## Step 5: Build the app

Run this command to build the APK:

```bash
npx eas build --platform android --profile preview
```

Or, if you want to build it with browser, you don't need a terminal at all — just wait, I'll give you simpler steps below.

## Step 6: Download and install

### If you used the terminal method:

1. When the build finishes, Expo will give you a download link to the APK.
2. Download the APK to your phone.
3. Open the file to install it.

### If you use browser (no terminal needed):

1. After running `eas build`, Expo will show a status page. Wait until it says "ε: Build completed successfully."
2. Click the **Android** tab to download the APK.
3. Transfer the file to your phone (email, WhatsApp, Bluetooth, USB).
4. Open the file to install it.

## Step 7: Install Expo Go (skip if app already installed)

The APK I build is a distributable app. However, I also created an **Expo Go** preview inside the same project you can test immediately:

1. On your phone, go to **Play Store**.
2. Install **Expo Go** (free, by Expo).
3. On your computer, my instructions will tell you how to run the "preview" (run on your own phone) instead of building the APK.

## Step 8: Sign in to the app

When you first open the app:

1. Tap through the onboarding (I've set it to default to "quit now").
2. Enter your currency (default is ₹ if you selected India, otherwise $).
3. Enter price per pack (default ₹ 350).
4. Enter cigarettes per day (default 10).
5. Tap **Continue**.

Your **smoke-free timer is now live.**

## Step 9: Set up notifications (optional)

1. Go to Settings.
2. Toggle **Morning reminder** and choose a time (default 7:00).
3. Toggle **Evening reminder** and choose a time (default 21:00).
4. Toggle **Weekly progress** and choose a day (default Sunday).
5. Notifications will now appear automatically on your phone.

## Step 10: Test the features

- **Home:** Watch your timer tick and money saved increase.
- **Health:** Tap the health milestones section to see your recovery timeline.
- **SOS:** When you want a quick breathing exercise, tap the SOS button.
- **Craving log:** Log a craving by tapping "Log craving" from home.
- **Backup:** In Settings, tap "Export progress" — this copies a code. Send it to yourself and test restore later.

## Common issues and solutions

### Issue: `eas build` fails with "Invalid app configuration"

**Solution:** Make sure `app.json` exists and has `expo` property with `name` and `slug`.

### Issue: Build is queued and stuck

**Solution:** The free build queue is shared with everyone. It can take 10–60 minutes. Wait and refresh the page often.

### Issue: Installation fails with "App not installed"

**Solution:** First uninstall "Breathe Freely" (if it exists), then try again. Or install App Cloner (premium), but that's extra work.

### Issue: Notification permission popup is blocked

**Solution:** Android sometimes shows permission dialogs in the wrong corner. Open Settings → Apps → Breathe Freely → Permissions and manually enable Notifications.

### Issue: Code export doesn't copy

**Solution:** On most phones, holding long on the code selects it. Or tap the share button in the settings and send it to yourself via WhatsApp or email.

### Issue: Dates look wrong (timezone)

**Solution:** The app uses your phone's timezone. If you move countries, go to Settings → Edit quit time and reconfirm your quit moment in the local timezone.

### Issue: Timer stops when phone is locked

**Solution:** Nothing is wrong. The timer keeps running — it's just not visible when the screen is off. Unlock the phone to see the live time.

### Issue: I can't build more than 15 times a month

**Solution:** The free EAS plan limits builds, not the app itself. GitHub has a funding option, but the app works fine without it. You can share the same APK across your friends — there's no built-in "device linking."

### Issue: I deleted my Expo account

**Solution:** You don't need Expo account access anymore. Your APK is a complete, standalone executable. For future updates, just rebuild locally on your own machine.

## Sharing with others

### Free distribution (no store)

1. Build the APK once (15/month on free plan).
2. Share the APK via WhatsApp, email, or any method.
3. Each person downloads and installs it themselves.

### Using Expo Go (no build needed)

If you want to test the app on your own phone before building:

1. Install Expo Go on your phone.
2. Run: `npx expo start` (in the project folder).
3. Scan the QR code with your phone's Expo Go app.
4. Tap **Run on Android device/emulator**.

This gives you immediate testing without a cloud build.

## Updating after changes

If you make changes to the app code and want to publish a new build:

```bash
npx eas build --platform android --profile preview --local
```

The `--local` flag means the build runs on Expo's cloud, as usual. If you have a paid EAS plan, use `--profile production` for store-ready builds.

## Final checklist

- [ ] Expo account created and logged in
- [ ] EAS CLI installed once
- [ ] `eas build` ran successfully
- [ ] Downloaded APK
- [ ] Installed app on phone
- [ ] Completed onboarding
- [ ] Verified timer is ticking live
- [ ] Verified money saved is increasing
- [ ] (Optional) Tested notifications
- [ ] (Optional) Tested SOS breathing guide
- [ ] Backed up using export code

## What's NOT required

You do **NOT** need:
- Google Play Developer account ($25 one-time)
- A phone that's rooted or modified
- A developer SDK installed on your computer
- Developer skills or coding experience
- Any paid subscription ever

The entire build and installation process can be done in a web browser, requiring zero terminal work after the initial login.

## Support

If anything breaks:

1. Check this guide — most issues are here.
2. Rebuild the app with `npx eas build --platform android`.
3. Come back to me with the error message.

The app is deliberately simple because that's how we keep it free and reliable. The fewer moving parts, the fewer things that can break.
