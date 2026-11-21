# Breathe Freely — Design System

## 1. Color palette

Primary dark base: `#0D0F12` (near-black, not pitch black)

**Green accent (trust, hope, growth):**
- Primary: `#4ADE80` (bright, energising)
- Muted: `#10B981` (calm)
- Faint: `#059669` (subtle highlight)
- Darker: `#064E3B` (text on dark)

**Amber accent (money, reward, warmth):**
- Primary: `#F59E0B` (warm, earned)
- Faint: `#D97706` (subtle glow)
- Darker: `#92400E` (text on dark)

**Neutral text:**
- Primary: `#FFFFFF` (headings, timer)
- Secondary: `#9CA3AF` (labels, helper text)
- Muted: `#6B7280` (disabled, secondary information)

**Surface shades:**
- Card: `#181B21` (slightly lighter than base)
- Subtle highlight: `#232730`

**Exception handling:**
- Warning (slip): `#EF4444` (red, urgent but not aggressive)
- Success (recovery milestone): `#4ADE80` (green)

## 2. Typography

**Two-family system:**

| Role | Typeface | License | Size | Weight |
|---|---|---|---|---|
| Headings | Fraunces | Open Sans + Fraunces (Google Fonts) | 28–48px | 400–700 |
| Body / Stats / Timer | Inter | SIL Open Font License | 14–48px | 400–600 |

**Type scale:**
- XXL heading (timer): 48px Fraunces, 700, tracking -1
- XL heading: 32px Fraunces, 700
- L heading: 24px Inter, 600
- M heading: 20px Inter, 600
- S heading: 16px Inter, 600
- Body: 14px Inter, 400, leading 1.5
- Small: 12px Inter, 400, uppercase
- Micro: 10px Inter, 400, lowercase, tracking 1px

## 3. Spacing system

Base unit: 4px. All distances are multiples.

| Purpose | Size | Spacing |
|---|---|---|
| Atom (hairline) | 4px | — |
| Extra small | 8px | 2 × 4 |
| Small | 12px | 3 × 4 |
| Base | 16px | 4 × 4 |
| Large | 24px | 6 × 4 |
| XL | 32px | 8 × 4 |
- = 48px | 12 × 4 |

**Component-specific:**
- Card padding: 20px (5 base units)
- Section vertical gap: 28px (7 base units)
- Button vertical padding: 16px
- Touch target: 48dp minimum (12 base units)

## 4. Buttons

**Primary button:**
- Background: `#4ADE80` green
- Text: `#0D0F12` black (high contrast)
- Padding: vertical 16px, horizontal 24px
- Border-radius: 12px
- Shadow: 0 4px 12px rgba(74, 222, 128, 0.3)
- Highlight: white glow on press using scale with opacity

**Secondary button:**
- Background: `#181B21` (card)
- Text: `#FFFFFF` primary
- Border: 1px solid `#232730`
- Same padding and border-radius as primary

**Outline button (white text on green):**
- Background: transparent
- Text: `#4ADE80` green
- Border: 2px solid `#4ADE80`
- Same padding and border-radius

**Text-only button:**
- Text: `#9CA3AF` secondary
- No background, no border
- Padding: vertical 12px, horizontal 16px
- Preserves text contrast when placed above dark background

## 5. Cards

- Background: `#181B21`
- Border: 1px solid `#232730`
- Border-radius: 16px
- Padding: 20px
- Shadow: 0 4px 20px rgba(0, 0, 0, 0.4)
- Top accent: 4px shimmer in green or amber

## 6. Input fields

- Background: `#181B21`
- Border: 2px solid `#232730`
- Border-radius: 12px
- Text: `#FFFFFF`
- Focused border: `#4ADE80` green
- Text input padding: vertical 14px, horizontal 16px
- Placeholder: `#6B7280` muted
- Error border: `#EF4444` red

## 7. Icons

Ionicons used exclusively (bundled with Expo.View with `@expo/vector-icons`).

| Icon | Color | Context |
|---|---|---|
| Stop Circle | Primary green | SOS button, clean moment |
| Refresh | Primary green | Reset after slip |
| Notifications | Secondary gray | Settings toggles |
| People | Secondary gray | Settings label |
| Copy | Secondary gray | Export hint |
| Zap | Primary amber | Money saved |
| Clock | Secondary gray | Settings labels |
| Shield | Secondary gray | Privacy notice |

Icon sizes: 24px (secondary), 48px (primary labels), 64px (hero).

## 8. Gradients

- Timer glow: green radial gradient at bottom right corner
- Breathing orb: fading gradient (white → green) with dynamic opacity
- Money card: amber gradient glow
- SOS button: warm border gradient (green → amber)

All gradients use `expo-linear-gradient` with low opacity stops (0.1–0.3) to never dominate the dark interface.

## 9. Animations

- Breathing orb: `scale` with opacity to create pulse — inhale (scale 1 → 1.15, opacity 0.5 → 0.9), hold, exhale (scale 1.15 → 1, opacity 0.9 → 0.5)
- Smooth number transitions: compact tweening for the timer values (changes every second, full re-render too jarring)
- Fade-in: entire screens fade in from opacity 0 → 1 over 300ms
- Tab switches: minimal slide; native stack navigation handles directionality
- Ripple: inset border scaleX animated on press for button states

All animations respect `colorScheme === 'dark'` only; no separate light mode in v1 (dark-first design for calm, minimal browser reading).

## 10. Layout principles

- **Single-column flow:** mobile-first, no multi-column content.
- **One emotional centerpiece:** timer ring above everything else; everything else is supporting.
- **One accent color:** one dominant accent (green) and one supporting accent (amber). No polychromatic card systems.
- **Breathing rhythm:** sections separated by consistent 28px; content sections use 20px inside cards.
- **Touch targets:** all interactive elements meet 48dp minimum; thumbs align with bottom one-third of screen.

## 11. Empty states and loading states

**Empty state:**
- Simple icon at 48dp
- Primary text: 14px Inter, white
- Secondary text: 12px Inter, muted

**Loading:**
- Spinner centered in screen, subtle (no blocking fade overlay)
- Schedules slip immediately (no waiting for app boot-up notifications)

**Error states:**
- Friendly phrasing: "Can't save right now. Try again in a moment."
- Actionable hint: include an explicit "Retry" button

## 12. Accessibility

- All interactive elements have `accessible` prop with `accessibilityLabel`.
- All icons with text have combined label description.
- Moderate color contrast maintained (white on `#181B21`, primary green on `#0D0F12`).
- Font sizes scale with system's "Display Size" setting (font not size-restricted).
- Reduced motion respected: animations can be disabled if system prefers reduced motion.
