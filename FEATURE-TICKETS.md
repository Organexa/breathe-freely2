# Breathe Freely — Feature Tickets

This document breaks the complete v1 product into tasks. Each ticket is one implementation unit.

## Core App

### T01 — Navigation setup
**Description:** Create the React Navigation stack with all screens.
**Files:** `App.tsx`, navigation configuration
**Dependencies:** None
**Acceptance criteria:**
- Onboarding → Home is the entry flow
- Home → CravingLog and HealthTimeline accessible
- CravingLog → SOS accessible
- Settings accessible via drawer or bottom nav
- All screens mount/unmount cleanly

### T02 — App theme and color system
**Description:** Create theme definitions (colors, typography, spacing).
**Files:** `theme/colors.ts`, `theme/typography.ts`, `theme/layout.ts`
**Dependencies:** T01
**Acceptance criteria:**
- Colors exported and used in all components
- Fonts load successfully (Inter + Fraunces)
- Spacing normalized (4px base unit)
- Shadows, gradients, border-radius defined

### T03 — App context and reducer
**Description:** Create AppContext with settings + cravings state and actions.
**Files:** `state/AppContext.tsx`, `state/types.ts`
**Dependencies:** T01, T02
**Acceptance criteria:**
- Settings and cravings stored with AsyncStorage
- All actions (setQuitAt, logCraving, resetAfterSlip, updateSettings, restore) implemented
- State persists across app restarts
- No object mutation (use Immer in reducer)

### T04 — Storage helpers
**Description:** AsyncStorage wrappers with error handling.
**Files:** `storage/storage.ts`, `storage/backup.ts`
**Dependencies:** T03
**Acceptance criteria:**
- `saveSettings` retries gracefully
- `saveCravings` wraps in try/catch
- `restore` validates format and safely updates state in one atomic operation
- Empty/invalid restore code preserved as old data

### T05 — Time and money logic
**Description:** Functions for duration formatting, money saved calculation.
**Files:** `logic/time.ts`, `logic/money.ts`
**Dependencies:** T03, T04
**Acceptance criteria:**
- `formatDuration` outputs "X days, Y hours, Z minutes"
- `formatMoney` handles currency symbol and localization
- `moneySaved` computed from settings, not stored
- All values are pure functions of stored inputs

### T06 — Health milestones
**Description:** Milestone definitions and progress computation.
**Files:** `logic/milestones.ts`
**Dependencies:** T03, T04, T05
**Acceptance criteria:**
- All 12 milestones defined with descriptions
- `currentMilestone` returns: title, date reached, description
- No trivial relationship (e.g., all displayed)

### T07 — Craving patterns
**Description:** Analysis of craving history for patterns.
**Files:** `logic/patterns.ts`
**Dependencies:** T03, T04
**Acceptance criteria:**
- `topTriggers` returns most common triggers
- `timeOfDayBreakdown` returns hourly distribution
- Empty state handled gracefully
- Results sorted by frequency

### T08 — Notifications
**Description:** Local notification scheduling and permission handling.
**Files:** `notifications/notifications.ts`
**Dependencies:** T03
**Acceptance criteria:**
- `askPermission` returns status and explains denial
- `scheduleMorning`, `scheduleEvening`, `scheduleWeekly` set timely alerts
- `clearAll` removes all pending notifications
- Notifications respect new settings immediately

### T09 — Onboarding screen
**Description:** User enters quit moment and preferences.
**Files:** `screens/OnboardingScreen.tsx`
**Dependencies:** T01, T03, T08
**Acceptance criteria:**
- Welcome screen with short description
- Tap to select quit moment (default: now)
- Currency select (INR, USD, GBP, EUR, others we'll add)
- Price per pack input
- Cigarettes per day input
- Primary button saves settings and navigates to Home

### T10 — Home screen
**Description:** Main view with timer, money, health.
**Files:** `screens/HomeScreen.tsx`
**Dependencies:** T01, T03, T04, T05, T06, T07, T08, T09, T02
**Acceptance criteria:**
- Timer ring with live ticking (decrements every second)
- Money card with live savings
- Current milestone card
- Pill button to log craving (bottom)
- Integers only (not decimals) display unless money

### T11 — SOS screen
**Description:** Breathing guide with animations.
**Files:** `screens/SosScreen.tsx`
**Dependencies:** T01, T08, T02
**Acceptance criteria:**
- Animated breathing orb with three stages (inhale, hold, exhale)
- Animated timer and text prompts explaining each stage
- Close button returns to Home
- Timer pauses during breathing

### T12 —— Craving entry screen
**Description:** Log what triggered craving and outcome.
**Files:** `screens/CravingLogScreen.tsx`
**Dependencies:** T01, T03, T04, T08, T02
**Acceptance criteria:**
- "How did it go?" question
- Trigger chip selection (Stress, After coffee, After a meal, Social situation, Boredom, Tired, Unknown)
- "Resisted" (green) vs "Smoked" (red) toggle
- "Save" saves and navigates to Home
- Entry added to cravings list on Home

### T13 —— Sliding window
**Description:** Handle slip with supportive messaging and reset.
**Files:** Screen onboarding, T03, T10
**Dependencies:** T03, T10, T12
**Acceptance criteria:**
- SOS screen includes "So tense moments are normal. Try again."
- Craving entry lets "Smoked" but app responds supportively
- Timer resets to 0 and date to now
- Money resets and shows message "Progress starts from now"

### T14 —— Health timeline screen
**Description:** All milestones in chronological display.
**Files:** `screens/HealthTimelineScreen.tsx`
**Dependencies:** T01, T03, T04, T06, T02
**Acceptance criteria:**
- Horizontal scrollable list of milestones
- Completed milestones green, current highlighted, future dimmed
- Detailed description on scroll tap

### T15 —— Settings screen
**Description:** Configuration and backup.
**Files:** `screens/SettingsScreen.tsx`
**Dependencies:** T01, T03, T04, T08, T02
**Acceptance criteria:**
- Edit quit moment with picker (date/time)
- Currency, price per pack, cigarettes per day inputs
- Notification toggles with time pickers
- "Export progress" button → copies code to clipboard
- "Restore from code" input → validates and restores
- About section with gentle disclaimer
- Share app button (Intent to share APK link)
- Application icon on settings screen

### T16 —— Core components
**Description:** Reusable UI components.
**Files:** `components/Screen.tsx`, `components/PrimaryButton.tsx`, `components/SecondaryButton.tsx`, `components/Card.tsx`, `components/StatBlock.tsx`, `components/Field.tsx`, `components/Chip.tsx`, `components/EmptyState.tsx`
**Dependencies:** T02
**Acceptance criteria:**
- All components use theme values
- Touch targets min 48dp
- Support all text inputs (currency, numbers)
- Chips prepopulate with trigger options
- Empty states show friendly placeholder
- Components memoized for performance

### T17 —— Animated widgets
**Description:** Timer ring and breathing orb.
**Files:** `components/TimerRing.tsx`, `components/BreathingOrb.tsx`
**Dependencies:** T02, T16
**Acceptance criteria:**
- TimerRing shows progress as outer glow, animates smoothly
- BreathingOrb animates at 6-second rhythm (second-in, hold-two, exhale-three)
- Respect reduced motion preference

### T18 — App entry
**Description:** Font loading, splash, navigation setup.
**Files:** `App.tsx`, `index.ts`
**Dependencies:** T01, T02, T03, T09, T10
**Acceptance criteria:**
- Expo fonts load before app renders
- Splash screen background matches app
- Onboarding shown first if not onboarded
- Back handler for navigation

## Documentation

### T19 — Rules.md
**Description:** Coding standards.
**Files:** `docs/RULES.md`
**Dependencies:** None
**Acceptance criteria:**
- All coding standards documented
- Security rules documented
- All style guidelines complete

### T20 — Feature tickets
**Description:** This document.
**Files:** `docs/FEATURE-TICKETS.md`
**Dependencies:** T19
**Acceptance criteria:**
- All features broken into tasks
- Dependencies documented
- Clear acceptance criteria per task

## Deployment

### T21 — Deployment guide
**Description:** Build instructions and APK distribution.
**Files:** `docs/DEPLOYMENT.md`
**Dependencies:** All app tasks (T01–T18)
**Acceptance criteria:**
- Expo account setup steps
- EAS Build commands
- APK download instructions
- Installation steps on Android phone
- Troubleshooting section

### T22 — Testing guide
**Description:** Verification scenarios.
**Files:** `docs/TESTING.md`
**Dependencies:** All app tasks (T01–T18)
**Acceptance criteria:**
- Timer accuracy tests
- Persisted state tests
- Notification tests
- Craving log tests
- Backup/restore tests
- Offline operating tests

## Total tickets: 22

Priority order for implementation:
1. Navigation (T01)
2. Theme (T02)
3. Context + Storage (T03–T04)
4. Onboarding (T09)
5. Core screens (T10, T11, T12, T13, T14, T15)
6. Components + Widgets (T16–T17)
7. Entry + Final polish (T18)
8. Docs (T19–T20)
9. Deployment + Testing (T21–T22)

All tickets are completeable within free resources. No paid dependencies exist.
