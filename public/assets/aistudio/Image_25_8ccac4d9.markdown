---
name: Campus Telemetry
colors:
  surface: '#f8f9ff'
  surface-dim: '#cbdbf5'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e5eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d3e4fe'
  on-surface: '#0b1c30'
  on-surface-variant: '#45464d'
  inverse-surface: '#213145'
  inverse-on-surface: '#eaf1ff'
  outline: '#76777d'
  outline-variant: '#c6c6cd'
  surface-tint: '#565e74'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#131b2e'
  on-primary-container: '#7c839b'
  inverse-primary: '#bec6e0'
  secondary: '#4b41e1'
  on-secondary: '#ffffff'
  secondary-container: '#645efb'
  on-secondary-container: '#fffbff'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#001f26'
  on-tertiary-container: '#0090a9'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dae2fd'
  primary-fixed-dim: '#bec6e0'
  on-primary-fixed: '#131b2e'
  on-primary-fixed-variant: '#3f465c'
  secondary-fixed: '#e2dfff'
  secondary-fixed-dim: '#c3c0ff'
  on-secondary-fixed: '#0f0069'
  on-secondary-fixed-variant: '#3323cc'
  tertiary-fixed: '#acedff'
  tertiary-fixed-dim: '#4cd7f6'
  on-tertiary-fixed: '#001f26'
  on-tertiary-fixed-variant: '#004e5c'
  background: '#f8f9ff'
  on-background: '#0b1c30'
  surface-variant: '#d3e4fe'
typography:
  headline-xl:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-xl-mobile:
    fontFamily: Inter
    fontSize: 26px
    fontWeight: '700'
    lineHeight: 32px
    letterSpacing: -0.015em
  headline-lg:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.015em
  headline-md:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 24px
    letterSpacing: -0.005em
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
  label-md:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: JetBrains Mono
    fontSize: 10px
    fontWeight: '500'
    lineHeight: 14px
    letterSpacing: 0.04em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-tablet: 1.25rem
  gutter-desktop: 1.5rem
  margin: 1rem
  margin-tablet: 1.5rem
  margin-desktop: 2rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 0.75rem
  space-lg: 1rem
  space-xl: 1.5rem
---

## Brand & Style

This design system drives a smart campus utility interface designed for students, faculty, and campus administrators navigating high-density physical and digital academic infrastructure. The experience balances mission-critical security and network telemetry with effortless day-to-day campus mobility (automated building access, contactless attendance, real-time desk/lab finding, and emergency alerts).

The aesthetic marries high-precision infrastructure monitoring with modern consumer software polish. By blending structural clarity, micro-telemetry (Wi-Fi 6E/5G link metrics, spatial beacons), and subtle frosted-glass overlays, the interface projects authoritative institutional trust, academic velocity, and technological sophistication. It avoids collegiate kitsch, athletic mascots, and academic traditionalism in favor of an ergonomic, sensor-aware operating system for campus life.

## Colors

The color architecture operates on a high-contrast foundation prioritizing daylight legibility outdoors across campus quads while retaining dark technical surfaces for telemetry indicators.

- **Deep Slate Navy (`#0F172A`)**: The primary structural base. Governs high-emphasis typography, critical action buttons, navigation chrome, and technical badges.
- **Indigo/Violet (`#4F46E5`)**: The core interactive accent. Used for student identity surfaces, validated transaction triggers, primary navigation selection, and active 5G/Wi-Fi states.
- **Electric Cyan (`#06B6D4`)**: High-visibility sensory telemetry. Reserved for active localized beacon discovery, Wi-Fi 6E mesh uplinks, transit pings, and real-time indoor radar pings.
- **Emerald Green (`#10B981`)**: Positive verification token. Applied exclusively to unlocked NFC/BLE smart locks, registered lecture attendance, gate clearances, and positive payment handshakes.
- **Crimson Alert (`#EF4444`)**: Safety and system criticals. Used for SOS triggers, campus security dispatches, lockdown broadcast cards, and critical connection drops.
- **Canvas and Tonal Neutral**: Base background sits on crisp Ice-tinted neutrals (`#F8FAFC` to `#F1F5F9`), utilizing Slate (`#64748B`) for secondary metadata and soft borders (`#E2E8F0`).

## Typography

The typographic hierarchy prioritizes rapid scanning during transit across campus. 

- **Inter** handles all narrative, navigation, and structural headings. Its neo-grotesque neutrality ensures immediate legibility across variable outdoor lighting and small-scale mobile viewports.
- **JetBrains Mono** serves as a specialized telemetry and system font. It is strictly allocated to network indicators (e.g., `RSSI -58dBm`, `5G UC`, `ID: 9482-A`), NFC terminal statuses, dynamic room codes, timestamps, and pill badge metrics.
- Tabular figures are enforced across numeric displays to prevent jitter during live data streams (step counters, dynamic transit countdowns, and lab occupancy counters).

## Layout & Spacing

The layout model is mobile-first, utilizing a fluid grid designed for one-handed thumb reachability and tactile proximity cards.

- **Mobile (<640px)**: 4-column layout with 16px (`1rem`) outer margins and 16px gutters. High-priority physical interactions (NFC unlock, digital campus pass, emergency beacon) are anchored in the lower 40% thumb zone.
- **Tablet (640px–1024px)**: 8-column layout with 24px (`1.5rem`) outer margins and 20px gutters. Splits into dual master-detail viewports (e.g., campus map on the left, building floorplan and access triggers on the right).
- **Desktop/Kiosk (>1024px)**: 12-column layout with 32px (`2rem`) outer margins, constrained to a max-width of 1280px to preserve data density.
- **Rhythm**: Element groups follow a strict 4px/8px incremental rhythm. Micro-telemetry labels pair with indicators via `space-xs` (4px), list items maintain `space-md` (12px) separation, and discrete functional cards separate via `space-lg` (16px).

## Elevation & Depth

Visual hierarchy employs a technical glassmorphism approach paired with surface-tinted elevation:

- **Surface 0 (Canvas)**: `#F8FAFC` matte base with fine structural separation via 1px `#E2E8F0` outlines.
- **Surface 1 (Base Cards)**: Pure white `#FFFFFF` with a crisp 1px `#F1F5F9` edge and an ultra-diffused shadow (`box-shadow: 0 1px 3px 0 rgba(15, 23, 42, 0.04), 0 1px 2px -1px rgba(15, 23, 42, 0.02)`).
- **Surface 2 (Floating Modals & Dynamic Telemetry Sheets)**: `#FFFFFF` with elevated ambient occlusion (`box-shadow: 0 10px 15px -3px rgba(15, 23, 42, 0.08), 0 4px 6px -4px rgba(15, 23, 42, 0.03)`).
- **Surface Proximity (Glassmorphic NFC & Mesh Panels)**: Semi-transparent backdrop-filtered cards (`background: rgba(255, 255, 255, 0.82); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); border: 1px solid rgba(255, 255, 255, 0.6)`). In dark network zones, these invert to `rgba(15, 23, 42, 0.88)` with cyan/indigo edge lighting (`border: 1px solid rgba(6, 182, 212, 0.2)`).

## Shapes

The design system employs a Level 2 (`Rounded`) shape language. Component containers, cards, and modal sheets use balanced `0.5rem` to `1rem` corner radii that convey modern consumer ergonomics without losing institutional stability.

- **Base Cards and Modals**: Radii of `0.75rem` (`12px`) to `1rem` (`16px`) ensure tactile softness for tap targets.
- **Interactive Controls & Inputs**: Radii fixed at `0.5rem` (`8px`) for buttons, text fields, and list cell selectors.
- **Badges and Status Pills**: Fully radiused pill shapes (`9999px`) to visually isolate telemetry metrics, room states, and network pings from rigid grid content.

## Components

### Buttons
- **Primary Campus Action**: `#0F172A` background, white Inter font (`14px`, medium weight), `0.5rem` radius, 44px min-height for touch compliance. Hover/press state darkens to `#020617`.
- **Secondary / Verification Trigger**: `#4F46E5` fill with subtle glow on focus; used for active sync or identity verification.
- **SOS Emergency Action**: Pill-shaped or prominent rounded square (`#EF4444`) with white iconography. Long-press triggers require a progressive perimeter ring animation (3-second tactile hold).

### Badges & Telemetry Pills
- **Network Status**: High-capsule pill (`9999px`) using `JetBrains Mono` at `10px` or `12px`.
  - *Active Wi-Fi / 5G*: Translucent Ice Cyan tint (`rgba(6, 182, 212, 0.1)`) with `#0891B2` text and a pulsing green or cyan micro-dot.
  - *Attendance Verified*: Translucent Emerald tint (`rgba(16, 185, 129, 0.12)`) with `#059669` text and a checkmark glyph.
  - *Restricted / Locked*: Translucent Slate tint (`rgba(100, 116, 139, 0.1)`) with `#475569` text.

### Proximity Cards & Digital ID
- **Proximity Access Card**: Frosted glassmorphism background (`rgba(255, 255, 255, 0.85)` over canvas) with a dynamic 1.5px gradient border that illuminates from Slate to `#10B981` when entering door reader range. Features student photo, embedded barcode/QR toggle, and live JetBrains Mono terminal clock to eliminate static screenshot fraud.
- **Hardware Telemetry Strip**: Positioned at card headers; combines signal bars, battery life of paired beacons, and lock status.

### Form Inputs & Checkboxes
- **Input Fields**: Crisp `#FFFFFF` surface with a 1px `#CBD5E1` border, transitioning to a 2px `#4F46E5` focus ring. Floating micro-labels use Inter `12px`.
- **Checkboxes & Radios**: `0.25rem` radius for checkboxes; full circle for radios. Selected state uses `#4F46E5` with an instant crisp scale transition.

### Interactive Lists
- **Campus Directory & Schedules**: Divided by 1px subtle divider lines (`#F1F5F9`). Left-hand icon container utilizes contextual tints (e.g., `#EEF2FF` for lecture halls, `#ECFEFF` for labs). Touch response triggers an immediate `#F8FAFC` surface fill.