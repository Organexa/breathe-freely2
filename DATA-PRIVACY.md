# Breathe Freely — Personal Data Privacy Report

**Date:** 2026-11-20
**Product category:** Android mobile application
**Auditor:** Claude (Privacy Engineer role)

---

## 1. Privacy philosophy summary

**Core principle:** This app follows a strict privacy-by-design approach: **all personal data stays entirely on the device**. The application requires zero accounts, zero online authentication, and makes zero network requests. There is no analytics, telemetry, or external communication that could expose user data.

Because the entire application is offline after installation, the only data that ever exists is the app's local progress state. All data collection and processing happens entirely on the user's device, under their control.

---

## 2. Data flow map

### Where personal data is collected

| Data element | Collection method | Collection reason | Storage location |
|---|---|---|---|
| Quit moment (epoch ms) | User input during onboarding (silent default: current time) | Core app functionality — drives the smoke-free timer | Device memory (AsyncStorage) |
| Currency (₹/$/£/€) | User selection from 4 fixed options | Money calculation context | Device memory (AsyncStorage) |
| Price per pack (number) | User input (numeric field) | Money calculation context | Device memory (AsyncStorage) |
| Cigarettes per day (integer) | User input (numeric field) | Money calculation context | Device memory (AsyncStorage) |
| Notification preferences (times) | User selection in Settings | App messaging features | Device memory (AsyncStorage) |
| Craving triggers (choice from list) | User selection during craving logging | Pattern analysis, user insights | Device memory (AsyncStorage) |
| Craving outcomes (resisted/smoked) | User selection during craving logging | Progress tracking, health insights | Device memory (AsyncStorage) |

### Where personal data is processed

All data processing occurs locally within the app:

- **Timer calculation:** `current-time - quit-at` → live display
- **Money calculation:** `days × cigarettes/day × price/pack ÷ 20`
- **Craving analysis:** Pattern and frequency computation entirely client-side
- **Health milestones:** Computed from quit-at timestamp

No server-side processing exists. All calculations happen within the app process on the user's device.

### Where personal data is stored

All data is stored on-device using `@react-native-async-storage/async-storage`:

- Key `bf.settings.v1`: Contains all user settings (quit moment, currency, price, notifications)
- Key `bf.cravings.v1`: Contains craving log with triggers, outcomes, and timestamps

These files are private to the app and remain on the device. They are not backed up to external services (unless the user copies them manually).

### Who can access personal data

Only the app itself can access stored data. The app is a native Android application:

- **On-device access:** The app’s Java/Kotlin/React Native code can read and write AsyncStorage entries.
- **User access:** The user directly interacts with the app; no other applications can access this data except through system-level permissions or unauthorized access methods (the same risk applies to any app on the device).
- **Third-party access:** None. There are no APIs, network calls, or cloud services that could expose this data.
- **Developer access:** None (the code is distributed as source, but there are no embedded credentials).

### How long personal data is retained

Data retention is determined by:

- **Settings:** Persisted indefinitely (user can reset or export at any time)
- **Craving logs:** Persisted indefinitely (user can delete in Settings or export)
- **Backup codes:** Generated on-demand and discarded after use

No data is retained beyond the user’s device or the app’s lifecycle. There are no automatic expiration mechanisms because the app is fully offline.

### How users can delete or export personal data

#### Data deletion

Users can delete their progress in two ways:

1. **Complete device wipe:** Remove the app from the device or factory reset the device.
2_vals[key]: Delete internal storage data via Settings → Clear Data (Android system feature).

#### Data export

**Export (backup) procedure:**
1. Open Settings
2. Tap "Export progress"
3   A restore code is generated (base64 + SHA-256 checksum) and copied to clipboard

**Restore (import) procedure:**
1. Install the app on a new device
2. Open Settings
3. Tap "Restore"
4. Paste the previously exported code

**Verification:**

**File integrity:** The restore code includes a SHA-256 checksum. The app validates the checksum before accepting the data.

**Format validation:** The restore code parser validates the JSON structure and field types before loading data.

**User control:** If restoration fails, the existing data remains intact. The user can retry with a new code.

**Data privacy during export:**

- The export code is generated locally using the user’s device resources
- No network communication occurs during code generation
- The code is stored only in the user’s clipboard temporarily (typical OS behavior)
- The code is displayed on-screen for the user to copy manually
- No logs, analytics, or third-party tracking of export codes

**User rights**

- Right to delete: Users can delete their data by uninstalling the app or clearing its data through device settings.
- Right to export: Users can export their data as described above.
- Right to be informed: Users understand that their data stays on-device and that export codes are how they can transfer data between devices.

### External services handling personal data

There are **zero external services** that process or receive personal data from this application:

- **No analytics** (no Firebase, Mixpanel, Amplitude, etc.)
- **No advertising** (no AdMob, Admob, Unity Ads, etc.)
- **No crash reporting** (no Crashlytics, Sentry, etc.)
- **No remote configuration** (no remote config services)
- **No remote data storage** (no Supabase, Firebase Realtime Database, AWS, etc.)
- **No API integration** (the app uses no third-party APIs)
- **No authentication providers** (Google, Apple, Facebook login, etc.)

The application is fully self-contained and operates offline after installation.

---

## 3. Privacy compliance and best practices

### GDPR considerations

Because the app operates entirely offline and without any persistent online presence:

- **Personal data scope:** All data processed by the app is limited to the user’s quit-smoking journey. No identification information (email, name, phone) is collected.
- **Legal basis:** No explicit legal basis is required because the app does not process special category data or conduct profiling that would require consent. The data processing is purely functional for the app’s core purpose.
- **Data subject rights:** The only data subject rights technically applicable are the right to access (the user has their data on their device) and right to deletion (uninstall the app). Export functionality provides additional flexibility.
- **Data protection impact assessment (DPIA):** Not required for a single-user, offline-only application with no special category data.

### Other privacy regulations

- **CCPA/CPRA:** No personal information is collected that would trigger these regulations.
- **LGPD (Brazil):** Same as above.
- **PIPEDA (Canada):** No personal information collected that would trigger this.

### Privacy by design principles applied

1. **Data minimization:** Only data necessary for the app’s functionality is collected (quit moment, preferences, cravings). No optional analytics, telemetry, or unrelated data collection.
2. **Purpose limitation:** Data collected is solely for quit-smoking tracking and motivation; it is not used for marketing, analysis, or third-party sharing.
3. **Integrity and confidentiality:** Data is stored locally under user control. No cloud backup, no remote transmission, and the app itself has a straightforward security model (no accounts, no encryption, but data sensitivity is low).
4. **Transparency:** The app’s privacy model is explicitly documented: all data stays on-device; no accounts; no network communication; export codes are the only transfer mechanism.

### User privacy controls

- **No profiling:** The app does not create user profiles, segments, or personalized marketing.
- **No tracking:** No cookies, web beacons, or similar tracking technologies.
- **No personalized advertising:** No ad networks or targeting.
- **No persistent identifiers:** No device IDs, advertising IDs, or cross-app identifiers are collected.

### Security of personal data

#### Technical measures

- **Local storage:** Data resides in AsyncStorage, which is encrypted at the OS level on most modern Android devices (requiring user authentication for access).
- **Access controls:** No multi-user access. Only the app itself can read/write data.
- **Data integrity:** Restore codes use SHA-256 checksums and JSON validation.
- **Error handling:** Storage failures are logged locally (no personal data exposed).
- **Backup:** Only through user-initiated export codes; no automatic cloud backup.

#### Organizational measures

- **Single maintainer:** The app’s codebase is straightforward with minimal internal complexity.
- **Clear ownership:** The app is designed for a single user; there are no shared accounts or multi-user permissions.
- **No third-party access:** No external service providers have access to user data.

---

## 4. Technical privacy documentation

### Privacy notice summary for users

> "Breathe Freely helps you quit smoking. All your progress — including your quit moment, money saved, and craving log — stays entirely on your device. We don’t collect any personal information. You can back up your progress using an export code and restore it on a new device."

### Privacy policy recommendation

If this app were to be distributed publicly, the minimal privacy policy would include:

```markdown
Privacy Policy

Last updated: [Date]

Breathe Freely (“we”, “our”, “app”) is a quit-smoking app. We believe in privacy by design: all your data stays entirely on your device. We collect no personal information.

What we collect:
- Your quit moment (used to calculate smoke-free time)
- Currency and price per pack (used for money saved calculations)
- Cravings log (used for pattern analysis)

How we use it:
- Track your smoke-free journey
- Show you money saved and recovery milestones
- Help you identify craving patterns

How we protect your data:
- All data is stored locally on your device
- No accounts required
- No network communication after installation
- You can export your data using an export code
- You can delete your data by uninstalling the app

Your rights:
- Access your data (it’s on your device)
- Export your data (using the export feature)
- Delete your data (uninstall the app)

Contact us:
[If applicable] If you have questions about this privacy policy, contact us at [email/address].
```

### Implementation notes

The current implementation meets privacy by design principles for a single-user, offline application. The main remaining consideration is that AsyncStorage is not encrypted, but it is protected by the device’s authentication (PIN/pattern/biometric). For most users, this provides sufficient security for personal health and motivational data.

---

## 5. Data retention schedule

| Data type | Retention period | Disposal method |
|---|---|---|
| Settings (quit moment, currency, price, notifications) | Indefinite (device lifetime) | User-initiated export or uninstall |
| Craving logs (triggers, outcomes, timestamps) | Indefinite (device lifetime) | User-initiated export or uninstall |
| Backup codes (generated temporarily) | Short-term (clipboard) | Automatically cleared |

---

## 6. Incident response (hypothetical)

Because the app is offline-only with no network components, traditional incident response (patching server vulnerabilities, blocking malicious requests) is not applicable. The only relevant scenario would be:

- **Device compromise:** If someone else gains physical access to the device and installs the app, they would have access to the user’s quit-smoking progress. This is a general mobile device security issue, not specific to this app.
- **Data corruption:** If AsyncStorage becomes corrupted, the app provides a graceful fallback to initial settings.
- **Export code theft:** If someone steals the export code, they could restore progress on another device. Mitigation: Use short-lived clipboard storage and encourage users to note the code securely.

---

## 7. Cross-border data transfers

No cross-border data transfers occur because there are no network communications.

---

## 8. Special population considerations

**Children (under 13):** The app does not have age restrictions or specific COPPA compliance, but the content is educational and motivational rather than medical. Parents should supervise app usage.

**Adults:** The app provides healthy lifestyle support. Users with underlying health conditions should consult healthcare providers for smoking cessation advice.

---

## 9. Future privacy considerations

If the app adds any of the following features, a full privacy impact assessment should be conducted:

- **Account creation** (email, authentication)
- **Cloud sync** (backup to remote storage)
- **Analytics** (usage statistics)
- **Advertising** (targeted ads)
- **Third-party integrations** (APIs to other services)
- **Multi-user support** (shared device access)
- **AI features** (processing user data with third-party AI providers)

Current design avoids these complexities by maintaining the single-user, offline-only approach.

---

## ?

This privacy documentation, combined with the security audit (SECURITY-AUDIT.md), provides a complete view of how Breathe Freely protects user privacy while delivering its core functionality. The app’s privacy model is intentionally simple: all data stays on-device, under user control, with minimal attack surface.

For the complete security audit and development rules, refer to `SECURITY-AUDIT.md` and `RULES.md` in this directory.