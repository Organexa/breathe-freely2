# Breathe Freely — Security Audit Report

**Date:** 2026-11-20
**Product category:** Mobile application (Android — Expo / React Native)
**Auditor:** Claude (Chief Application Security Engineer role)

---

## 1. Project overview

| Layer | Technology |
|---|---|
| Product category | Mobile application (Android) |
| Framework | Expo SDK 51 (React Native) |
| Language | TypeScript (strict) |
| State + storage | React Context + AsyncStorage (on-device) |
| Navigation | React Navigation (native stack) |
| Notifications | expo-notifications (local only) |
| Crypto | expo-crypto (SHA-256 for restore code integrity) |
| Backend | None (fully offline) |
| Database | None (device-local storage only) |
| Authentication | None by design |
| Payments | None |
| Hosting | None required (app runs offline after install) |
| Build | Expo EAS Build (free tier) |

---

## 2. Security audit summary

| Security area | Status | Important finding |
|---|---|---|
| Secret protection | **PASS** | Zero secrets found in the entire project. No API keys, no passwords, no tokens, no certificates. |
| Personal data and privacy | **PASS** | No personal data leaves the device. No accounts, no analytics, no telemetry, no network calls. |
| Authentication | **NOT APPLICABLE** | No authentication exists by design (single-user, device-local app). |
| Authorization and roles | **NOT APPLICABLE** | No roles exist. Single-user device app. |
| Database security | **NOT APPLICABLE** | No server database exists. |
| API security | **NOT APPLICABLE** | No APIs exist. The app makes zero network requests. |
| Input validation | **FIXED — VERIFIED** | Restore code validation was weak. Now strict: length caps, checksum verification, field-level type/range validation. Numeric inputs on onboarding validated. |
| Payment security | **NOT APPLICABLE** | No payment system. |
| Rate limiting | **NOT APPLICABLE** | No network endpoints to rate-limit. No external services called. |
| Production configuration | **PASS** | No debug endpoints, no development credentials, no debug mode in config. `eas.json` uses internal preview profile (APK). |
| Mobile security | **PARTIAL** | Uses AsyncStorage (not encrypted). Acceptable for v1 given no sensitive credentials are stored; documented as a known limitation. Notification permission handled gracefully. |
| File and storage security | **PASS** | No file uploads. Storage is device-local. |
| Dependencies | **FIXED — VERIFIED** | Removed 8 unused/invalid packages. Remaining dependencies are pinned to compatible Expo SDK 51 versions. |
| Logging and monitoring | **PASS** | `console.error` calls only log storage failures — they do not log secrets, passwords, or personal data. |
| Attacker-perspective review | **PASS** | See Part 4 below. No exploitable attack vectors found given the offline, accountless architecture. |
| AI features | **NOT APPLICABLE** | No AI features in v1 (deferred by design). |

---

## 3. Vulnerabilities found and fixed

### VULN-001 (CRITICAL — fixed) — Restore feature crashes on React Native

**Affected file:** `src/storage/backup.ts`
**What was wrong:** The file imported Node.js `crypto` and used `Buffer.from()`. Neither exists in the React Native runtime. Any use of the export/restore feature would throw `crypto is not defined` and crash the app — making the only data-protection mechanism (backup) completely non-functional.
**Potential impact:** Users could not back up or restore progress; the feature would crash on use.
**Fix applied:** Replaced with `expo-crypto` (`Crypto.digestString`, `Crypto.digestType.SHA256`) and `btoa`-based base64 encoding. Added `expo-crypto` to `package.json`.
**Verification:** Static review confirms the new implementation uses only React Native–compatible APIs. Full runtime verification requires a device build (BLOCKED on build environment).

### VULN-002 (MEDIUM — fixed) — Weak restore-code validation

**Affected file:** `src/storage/backup.ts`
**What was wrong:** The restore parser validated only that `quitAt` was a number. A malformed but checksum-valid code could inject arbitrary values into settings (e.g., absurd prices, out-of-range times), producing a corrupted app state.
**Potential impact:** Data integrity corruption on restore.
**Fix applied:** Added `validateSettings()` with field-level checks: quitAt range, currency length (1–3 chars), price range, cigarettes/day integer range, notification boolean, and time-of-day ranges. Added a 4 KB size cap on restore codes to prevent oversized payloads.
**Verification:** Static review confirms all validation paths return `null` (reject) on invalid input, preserving existing data.

### VULN-003 (LOW — fixed) — Unnecessary and invalid dependencies

**Affected files:** `package.json`
**What was wrong:** Declared 8 dependencies not used by the app (expo-router, expo-sqlite, expo-localization, expo-local-notifications, expo-constants, expo-linking, react-native-svg) plus two duplicate `react-native-screens` and `react-native-reanimated` entries. Some packages (expo-local-notifications) may not exist at the pinned version, which can fail installation. Extra dependencies enlarge the attack surface and bundle size.
**Potential impact:** Build failures; larger attack surface from unneeded native modules.
**Fix applied:** Removed all unused packages and duplicate entries. Kept only the packages the app actually imports: expo, expo-crypto, expo-font, expo-haptics, expo-notifications, expo-splash-screen, expo-status-bar, react, react-native, react-native-gesture-handler, react-native-reanimated, react-native-safe-area-context, react-native-screens, @react-navigation/native, @react-navigation/native-stack, @react-native-async-storage/async-storage.
**Verification:** Cross-checked each remaining dependency against `src/` imports. Verified match.

---

## 4. Attacker-perspective review (safe, non-destructive)

| Scenario | Result |
|---|---|
| Access another user's records | **NOT POSSIBLE** — no accounts, no server, no shared records. |
| Access another organization's data | **NOT POSSIBLE** — no multi-tenant architecture. |
| Access an admin page/endpoint | **NOT POSSIBLE** — no admin, no endpoints. |
| Modify own role/permissions | **NOT POSSIBLE** — no roles or permissions exist. |
| Unauthenticated access to protected APIs | **NOT POSSIBLE** — no APIs exist. |
| Expired sessions accessing resources | **NOT POSSIBLE** — no sessions exist. |
| Manipulate payment status | **NOT POSSIBLE** — no payments. |
| Duplicate requests creating duplicate rewards | **NOT POSSIBLE** — no server-side rewards. |
| Download private files of another account | **NOT POSSIBLE** — no files, no accounts. |
| User input causing unsafe content render | **NOT POSSIBLE** — user input is limited to numeric values, currency selection (from a fixed list), and trigger chips (from a fixed list). No free-text fields are rendered. |
| Bypass subscription/feature restrictions | **NOT POSSIBLE** — no subscriptions or paid features. |
| Mobile app data exposure | **LOW RISK** — AsyncStorage is not encrypted. It contains only non-sensitive progress data (quit time, money settings, craving log). No credentials or secrets are stored. Documented limitation. |
| Bypass rate limits or abuse public features | **NOT POSSIBLE** — no public features requiring server interaction. |
| Public config exposing private resources | **PASS** — config contains no private endpoints or credentials. |
| Weak account recovery/verification logic | **NOT APPLICABLE** — no account recovery exists. Restore codes use SHA-256 integrity verification with strict validation. |
| Administrator actions without authorization | **NOT APPLICABLE** — no administrator exists. |

---

## 5. Remaining risks and limitations

| Risk | Level | Mitigation / note |
|---|---|---|
| AsyncStorage data is not encrypted at rest | LOW | Contains only non-sensitive progress data. No credentials stored. A future version could use expo-secure-store, but it is not needed for current data. |
| No cloud backup | INFORMATIONAL | By design (no accounts). The export/restore code is the recovery path. Users are guided to export periodically. |
| Notification permission depends on Android version | LOW | Android 13+ requires runtime permission. App handles denial gracefully. |
| No runtime device testing performed | BLOCKED | Requires an Expo/EAS build environment with internet access. Static review completed; on-device verification is the user's build step. |

---

## 6. Test results

| Check | Result |
|---|---|
| Secret scan across all source/config/docs | PASS — no secrets found |
| Console/log audit | PASS — logs contain no personal data or secrets |
| Restore code parser review | FIXED — VERIFIED (static) |
| Dependency inventory vs imports | FIXED — VERIFIED |
| Onboarding input validation review | PASS — numeric inputs validated (positive, in-range) |
| Notification permission handling review | PASS — graceful denial path |
| Production config review | PASS — no debug endpoints, internal preview build |

---

## 7. Production readiness conclusion

**READY FOR PRODUCTION REVIEW** — but with an honest caveat.

The security posture of this app is strong because of its architecture: there is no server, no account, no network traffic, no third-party SDK with telemetry, and no payment system. This eliminates the overwhelming majority of attack vectors that plague typical web/SaaS products.

The one thing not yet done is **runtime testing on a real Android device**, which requires building the APK through Expo EAS Build (an internet-connected step performed by the user, per the no-install constraint). Static analysis is complete; on-device verification of the restore feature and notifications remains as the user's build step.

This is not a guarantee that the application is unhackable — no application can make that claim. It is an honest statement that the available checks passed and remaining limitations are documented.

---

## 8. Recommended ongoing security practice

Because this app is fully offline and has no server, the ongoing-security checklist is short:

1. Run a secret scan after any dependency change (there are no secrets to leak, but verify).
2. If any feature is added that makes network calls, stores credentials, adds accounts, or integrates AI — run a full security re-audit (Parts 2–23 of the security master prompt apply).
3. Keep the free build pipeline isolated; never commit signing keys or keystores to the repository.
4. Update dependencies only when Expo SDK-compatible versions are available; verify compatibility before upgrading.
