# Breathe Freely — Development Rules

## 1. Coding standards

- **TypeScript strict mode** enabled. All functions declare `params: Type => ReturnType`.
- No implicit any. If `any` is absolutely unavoidable, comment `// eslint-disable-next-line @typescript-eslint/no-explicit-any` and explain.
- Interfaces (not types) for public APIs. Types for internal implementation.
- Prefer `interface` over `type` when a value can be maintained as multiple properties (as opposed to discriminated unions).

## 2. Naming conventions

### Files
- Components: `PascalCase.tsx` (e.g., `TimerRing.tsx`, `PrimaryButton.tsx`)
- Utility functions: `camelCase.ts` (e.g., `formatDuration.ts`, `safeDecode.ts`)
- Types: `PascalCase.ts` (e.g., `types.ts`, `settings.ts`)
- Constants: `SCREAMING_SNAKE_CASE.ts` (e.g., `NOTIFICATION_TYPES.ts`, `MILESTONES.ts`)

### Variables and props
- Component props: `PascalCase`
- Internal variable names: `camelCase`
- Constants: `camelCase` (except exported constants that follow SCREAMING_SNAKE_CASE)

### Indentation
- 2 spaces per level. Never use tabs.

### Line length
- Maximum 100 characters. Use optional chaining and multiline chains to keep long expressions readable.

## 3. File organization

```
src/
├── theme/          # types + values, never runnable code
├── state/          # AppContext, reducer, all reducer actions
├── storage/        # AsyncStorage helpers + backup code
├── logic/          # pure functions that derive values
├── notifications/  # notification scheduling, permission handling
├── components/     # presentational components (no custom state)
│   ├── ui/         # primitives (Button, Card, Field)
│   ├── layout/     # composite layout components
│   └── indicator/  # animated widgets (TimerRing, BreathingOrb)
└── screens/        # full pages (use router.push, not imperative navigation)
```

Components are grouped by presentational/dumb nature. Screens own their own navigation and custom state.

## 4. UI consistency rules

### Spacing
- Use the base 4px unit (`0.5 * 8px` not `12px`, not `15px`).
- Component padding: `0.5rem` (8px) minimum, `1.25rem` (20px) comfortable.
- Screen sections: `1.75rem` (28px) vertical gap.

### Border radius
- Small: `12px` (48dp touch target)
- Medium: `16px` (buttons, cards, inputs)
- Large: `24px` (hero elements like SOS button)

### Touch targets
- Minimum 48dp height (12 base units).
- 48dp horizontal space between touch targets.

### Shadows
- No shadow on backgrounds (cards need shadow, surfaces don't).
- Card shadow: `0 4px 20px rgba(0, 0, 0, 0.4)`.
- Button shadow: `0 4px 12px rgba(color, 0.3)` where `color` is the button's primary color.

### Gradients
- Use sparingly (only for important elements: timer, SOS button, money card).
- Gradients are 2-stop: main color → 30% opacity.
- Never have more than one gradient per component unless merging shadows.

## 5. Security rules

### Keys and secrets stored locally
- Never store any provider keys locally. AsyncStorage keys can be read by others on the same device (storage API access).
- Payment info: never stored.

### Input validation
- URL inputs: parse with `URI.parse` and validate before using.
- Numeric inputs: reject negative values or impossible ranges.
- Import and backup codes: validate format (expected length, character set) before import.
- Local swaps (restore): always record previous value first, then validate and only commit if format is valid. Fail-safe path keeps old data.

### Dangerous actions
- API-fetching code is never written. No network calls exist in this app.
- XSS never happens (no external HTML rendering, no `dangerouslySetInnerHTML`).

### Date handling
- Derived values (duration, money) are recomputed on every render from the source (`quitAt` timestamp).
- Never store "already-remembered duration" — always recompute for freshness.

## 6. Dependency rules

### Version constraints
- Pin to major and minor versions. Use caret only for patch versions: `^51.0.0`, not `^`.
- Tab-alignment: `expo` -> `~51.0.0` (industry convention for stable versions).

### Buying dependencies
- Each package should have a documented use case.
- No "just in case" dependencies.
- Avoid multiple packages for the same capability (e.g., only `expo-linear-gradient`, not both `react-native-linear-gradient` and `react-native-screens` patterns).

## 7. Free-service restrictions

No internet calls allowed in this app. Period.

### State persistence
- Always `AsyncStorage.set` (fire-and-forget).
- Initial state reads: expect that读写 can fail and have sensible defaults.

### Notifications
- Trigger locally, never rely on server-pushed delivery.
- On Android 13+: request POST_NOTIFICATIONS at app launch; handle denial gracefully.

## 8. Development restrictions

### Multiple files
- Do not create a disconnected UI screen that doesn't read from or write to the app state.
- Do not create button components that do nothing.

### Formatting
- Always end every screen with a primary or secondary action button.
- Never leave an open-ended screen with no footer actions.

### Rendering performance
- Use `React.memo()` for presentational components that don't change often.
- Avoid memo with `useCallback` unless the prop is changed rapidly.
- Timer ring: updates throttled to 10fps (using an interval) instead of 60fps re-render.

### Testing
- All `useReducer` actions must be memo-able for the form where possible.
- All computed values must be pure functions of their inputs.

## 9. Error handling rules

### Try/catch blocks
- Wrap AsyncStorage reads/writes. On failure, graciously degrade (fronts won't wipe but won't load), log once to console.
- All promise-based internal code must have catch.

### User-facing errors
- Use the `FlatList` `ListEmptyComponent` with a title and action hint.
- For errors requiring retry: show friendly message + "try again" button.

### Feature blocks
- Feeds where async data might fail are rendered in:
  - Pending state → Skeleton + message "loading..."
  - Failed state → "Can't load right now" + "retry" button
  - Success → rendered list

### Navigation errors
- If navigation fails, don't crash the app. Fallback: show a clean error screen with "go back" button.

## 10. Code review checklist

Before committing a file:

- [ ] Exports are only at the file bottom.
- [ ] No shipping with `console.log` or debug statements.
- [ ] Types are exported from a `types.ts` if reused across files.
- [ ] No `console.error` swallowed by catch blocks (re-throw or log once).
- [ ] Button onPress handlers are memoized with `useCallback` if passed to parent.
- [ ] Screen-specific component names don't conflict with root-level components.

## 11. File naming conventions

### Screens and components
- Screen suffix: `Screen.tsx` (`OnboardingScreen.tsx`)
- Component suffix: `.tsx` if the component doesn't have a shorter name (`Button.tsx`, `Card.tsx`)
- Sub-components (found inside a file): `{ componentName }` pattern (`const { CardSection, LoadingSpinner } = ...`)

### Export naming
- Export high-level components from the top of the file.
- Export type objects at the bottom or alongside their definition.
- Export a `default` export only for entry points (`App.tsx`, `index.ts`).

## 12. Accessibility final checklist

Every screen and component:

- [ ] All interactive elements have `accessible` prop with `accessibilityLabel`.
- [ ] All icons grouped with text use combined label (e.g., accessibleLabel pair or screen readers will stop reading mid-component).
- [ ] Color contrast meets AA (4.5:1) for body text, AA+ (7:1) for headings.
- [ ] Touch targets meet 48dp minimum.
- [ ] SKip navigation not required for this minimalist app (reset every screen).
- [ ] Reduced motion respected (include colorScheme query or MotionPreference instead of color-mixing).

## 13. Project-specific rules

### Timer
- Display values: days, hours, minutes, seconds. Never "hrs" or "minutes", spell them out.
- Cigarettes saved: format as "{currency} X,YYYY" where YYYY is a localized number.
- Money saved: show the same as above (no "$" prefix unless it's the symbol).

### Craving log
- Trigger chips limited to: "Stress", "After coffee", "After a meal", "Social situation", "Boredom", "Tired", "Unknown". Only these are stored.
- Outcome cannot be omitted. Must be resisted (yes) or smoked (no).

### Settings
- Notification toggles:
  - "Morning reminder" (default: 7:00)
  - "Evening reminder" (default: 21:00)
  - "Weekly progress" (default: every 7th day at same time)
- Backups are exported to a code (not a full database file).
- Disclaimers: brief, not preachy.
