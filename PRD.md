# Breathe Freely — Product Requirements Document (PRD)

## 1. Product overview

Breathe Freely is a free, private, offline-first Android app that helps people quit smoking. It celebrates how long a person has been smoke-free, shows the money they have saved, walks them through what their body is recovering right now, and gives them an instant coping tool when a craving hits. No account, no sign-up, no ads, no data leaving the device.

**Product type:** Mobile application (Android).
**Primary platform:** Android. Built with Expo / React Native so an iOS build remains possible later.

## 2. Problem statement

Quitting smoking is hard for two emotional reasons as much as physical ones: people lose track of how far they have come, and they feel alone when a craving strikes. Existing quit apps either require sign-up, push ads, or bury the motivation under complex features. Breathe Freely removes all friction: it opens instantly, needs no account, works offline, and puts a single encouraging number — "how long have you been smoke-free" — at the center of the experience.

## 3. Target audience

Anyone who wants to stop smoking, from first-time quitters to people who have relapsed and are trying again. The app assumes no technical skill and no existing accounts. It is designed to be private: nothing is shared, tracked, or uploaded.

## 4. Product goals

- Make the smoke-free timer the emotional centerpiece of the app.
- Give concrete, personalized reasons to continue (money saved, health recovery).
- Provide an instant, calming response to cravings.
- Require zero accounts, zero payments, zero internet.
- Feel premium, calm, and trustworthy — never preachy.

## 5. Core functionality (v1)

### 5.1 Smoke-free timer and money saved
- A large timer showing days, hours, minutes, and seconds since the quit moment.
- A running "money saved" total, computed from a per-day cost the user sets (price per pack and cigarettes per day).
- Both update live while the app is open and stay accurate across app restarts.

### 5.2 Health recovery milestones
- A timeline of recovery milestones (e.g., 20 minutes, 8 hours, 24 hours, 48 hours, 3 days, 2 weeks, 1 month, 3 months, 1 year) with plain-language descriptions of what the body is recovering.
- The current milestone is highlighted; the next milestone shows how far away it is.
- Milestones are derived from the quit time, not entered by the user.

### 5.3 Craving SOS and trigger diary
- A prominent SOS button that opens a calming breathing guide.
- The breathing guide animates a slow inhale–hold–exhale cycle with gentle written prompts.
- The user can record why they wanted a cigarette (trigger) and whether they resisted or slipped.
- A craving log lists every logged craving, with the date/time, trigger, and outcome.
- A pattern view shows which triggers are most common and at what time of day cravings peak.

### 5.4 Slip (relapse) logging
- If the user smokes, a clearly-labeled slip flow lets them record the moment honestly and restart the timer.
- The app responds supportively ("This doesn't erase your progress") and immediately starts a new timer, so the person is never left without a reset state.
- Cigarettes saved statistics reset consistently with the new quit time.

### 5.5 Encouraging notifications
- Local notifications at times chosen in Settings (default: one morning, one evening).
- A weekly progress summary notification.
- Notifications are created and triggered on-device; no network or server is involved.
- Users can toggle notifications on/off in Settings.

### 5.6 Onboarding
- On first launch, a short welcome explains the app.
- The user enters: their quit moment (default "now"), currency, price per pack, and cigarettes per day.
- After onboarding, the timer is live immediately.

### 5.7 Settings
- Edit quit moment, currency, price per pack, cigarettes per day.
- Notification on/off and time selection.
- Export progress as a restore code, and restore from a code.
- About section, including a gentle disclaimer that the app is motivational, not medical advice.

### 5.8 Backup (export/restore code)
- "Export" produces a compact text code that encodes all user data.
- "Restore" accepts a previously exported code and replaces the current data.
- Fully offline.

## 6. User stories

- As a new quitter, I want to see a big, living timer so I feel the minutes adding up.
- As a quitter, I want to see the money I would have spent, so I feel rewarded.
- As a quitter facing a craving, I want one tap to open breathing guidance.
- As a quitter, I want to record a slip honestly and start again without shame.
- As a privacy-conscious user, I want no account and no data upload.
- As a user switching phones, I want to move my progress with a code.

## 7. Functional requirements

- Timer is computed from the stored quit timestamp (epoch milliseconds) and is independent of timezone.
- Currency, price per pack, cigarettes per day are stored and editable; money saved = days × cigarettes/day × price/20 (or as set).
- Cravings are stored with timestamp, trigger, and outcome.
- Notifications are scheduled with expo-notifications; weekly summary on the configured weekday/time.
- Export encodes all stored fields into a code; restore validates and decodes it.
- All storage uses AsyncStorage on-device.

## 8. Non-functional requirements

- Works fully offline after installation.
- Launches to a usable home screen in under ~2 seconds on a mid-range device.
- Timer updates every second while visible without battery drain (only renders when screen is active).
- Handles timezone changes and clock changes gracefully (timer derives from wall-clock difference, not RTC monotonic counters, to stay correct after restarts).
- Privacy: no analytics, no network calls, no third-party trackers.
- Text scales with the system font size setting without breaking layouts.
- Follows Material Design conventions for touch targets (minimum 48dp).

## 9. User journeys

### First launch
Open app → Onboarding (welcome → quit moment → currency/price → cigarettes per day → done) → Home with live timer.

### Catching a craving
Home → tap SOS → breathing screen → finish breathing → "How did it go?" → select trigger + resisted/slipped → back to Home.

### Daily check-in (passive)
Open app → see timer, money saved, current milestone → maybe scroll the health timeline → close.

### Phone change
Settings → Export → copy code → on new phone → Settings → Restore → paste code → data restored.

## 10. Acceptance criteria

- A fresh install shows onboarding, then a live timer that increments visibly.
- Restarting the app preserves the quit time and all settings and logs.
- Money saved increases over time at the configured rate.
- The SOS breathing guide animates and completes a full cycle.
- Logging a craving adds it to the log and updates the pattern view.
- Slipping restarts the timer with a supportive message and preserves nothing stale.
- Notifications appear at configured times when enabled and are suppressed when disabled.
- An exported code restores identical data on a new install.
- The app opens, navigates, and operates with no internet connection.

## 11. Out of scope (v1)

- Accounts, cloud sync, or multi-device sync (restore code only).
- AI chat supporter (deferred; see MEMORY.md).
- Payments, subscriptions, ads, or analytics.
- Social features, leaderboards, or sharing.
- iOS release (architecture supports it later; Apple account required).

## 12. Success metrics (product-level, for later)

- Activation: share of installs that reach a live timer (onboarding completion).
- Retention: users still holding an active (non-slipped) timer after 7 and 30 days.
- Craving engagement: SOS opens per active user per week.
- This app has no telemetry; metrics would come from store analytics only.
