# Uni Connect: Smart Campus OS & Security Sentinel Hub

Uni Connect is a comprehensive, production-grade smart campus operating system connecting students, faculty, and campus safety officers across high-density academic and security infrastructure. The system unites a sensor-aware Student Mobile Experience (UWB digital keycard, automated beacon attendance, rapid emergency SOS, campus pulse events, facility study spaces, and multilingual preferences) with an authoritative Campus Operations & Security Hub (live AI object/thermal camera feeds, real-time headcount & granular zone densities, remote turnstile controls & emergency master lockdown, and cryptographic biometric enclave authentication).

---

## User Review & Critical Decisions

> [!IMPORTANT]
> The following architectural and user experience decisions were confirmed through Phase 1 requirements alignment:

- **Confirmed Decision 1 (Dual-Mode Role Switcher)**: Users can seamlessly toggle between the **Student Mobile App** ("Uni Connect") and the **Campus Operations & Security Hub** ("Sentinel Portal") via a dedicated quick-switch utility in the header and quick-access drawer.
- **Confirmed Decision 2 (Launch View)**: The application boots directly into the **Student Digital Keycard with Proximity Radar** (Sector 1 Access), showcasing live UWB/BLE signal metrics, hardware clearance status, and recent door traces.
- **Confirmed Decision 3 (Interactive Telemetry Simulator)**: A floating or dockable **Beacon & Proximity Simulator Drawer** allows users to adjust their simulated physical distance to campus portals (e.g. Lab 402, Library Turnstiles, Turing Hall), demonstrating live radar proximity rings, automated hands-free unlocking, and auto-attendance sign-in as distance thresholds are crossed.

---

## 1. Overview & Core Concept

- **What It Does**: Unifies physical and digital campus mobility. For students, it eliminates physical IDs, manual paper rolls, and security friction by using background UWB/BLE beacon proximity. For campus security officers and administrators, it provides real-time situational awareness via AI computer vision feeds, granular occupant load tracking, anomaly chokepoint warnings, and instant tactile facility overrides.
- **Target Audience / Personas**: 
  1. *University Students & Faculty* (navigating classrooms, study spaces, dorms, gyms, and safety escorts).
  2. *Campus Safety & Operations Officers* (dispatchers, desk operators, and chief safety administrators monitoring security perimeters and building access).
- **Key Value**: Replaces disparate siloed campus apps with a unified, high-reliability system with zero dead clicks, verified hardware simulation, and WCAG AA accessible contrast for bright outdoor quads and dark operations centers.

---

## 2. User Experience & Visual Design

### Key User Flows

1. **Student Access & Proximity Radar Flow**:
   - View holographic Obsidian / Smart Digital Keycard with live rotating cryptographic token and UTC terminal clock to prevent static screenshot fraud.
   - Proximity radar scans for nearby doors (Lab 402 at 1.2m, Turnstile B at 4.5m).
   - Moving within the 1.5m beacon threshold (via proximity simulator slider) automatically unlocks the portal, generates a haptic feedback toast, and logs a real-time entry trace.
   - Option to toggle between Dark Obsidian and Daylight Opal keycard themes.

2. **Automated Attendance & Timetable Flow**:
   - Detects entry into Turing Hall 102; automatically logs student as "Present • Auto-Signed In".
   - Displays real-time class progress gauge ("1h 48m in class • 60% elapsed"), classroom density (38/45 seats), and RSSI beacon decay threshold.
   - Displays term attendance rate (96.5% circular radial gauge), daily academic schedule, and auto-sign in hardware policy toggles.

3. **Campus Safety & Tactile SOS Flow**:
   - Prominent 3-second hold emergency trigger with real-time SVG circumferential progress ring.
   - Holding for 3 seconds transmits coordinates and beacon triangulation to Campus Police Dispatcher (Officer D. Vance).
   - 2x2 Rapid Assistance grid for Campus Escort (4m ETA), Silent Distress, Medical SOS, and Hazard Photo Reporting.
   - Interactive Lit Pathways & Blue Light Call Boxes locator map.

4. **Campus Pulse, Events & Facilities Flow**:
   - Live Infrastructure Notice banner (Wi-Fi 6 upgrade).
   - Category filter pills (All, Academic, Career & Tech, Student Life, Safety Workshops).
   - Featured Hackathon card with live RSVP counter, badge linking, and capacity telemetry.
   - Study Space Finder: Live density tracker with sound levels (Silent Zone, Whisper Quiet), desk outlets availability, and 24-hour crowd rhythm predictor graph.

5. **Settings & Preferences Flow**:
   - Multilingual selector supporting 5 languages (English, Chinese Simplified, Bahasa Melayu, Bahasa Indonesia, Kazakh) dynamically adjusting interface labels and voice alerts.
   - Appearance theme switcher (Light, Dark, System Adaptive) + High Contrast Sunlight mode for bright outdoor quads.
   - Sensor toggles (Hands-free Wi-Fi Door Unlock, Automated Attendance, SOS Haptics).

6. **Campus Operations & Security Hub (Admin Mode)**:
   - **Live Feeds**: 4-camera video wall featuring North Quad (AI object detection with bounding boxes & velocity), Science & Eng Atrium (interactive Thermal/FLIR optic with calibrated 36.6°C isotherms), East Library Turnstiles (+14/min NFC gate flow), and Sports Complex Gym (overcrowding density warning).
   - **Tactile Patrol Desk**: Instant Snapshot, Rapid Unit Dispatch, Full Mosaic view, and Night Vision low-lux filter.
   - **Headcount & Zones**: Campus-wide presence counter (3,842 / 5,650), anomaly chokepoint banner, granular zone breakdowns with capacity gauges, and 24-hour diurnal waveform chart with CSV telemetry export.
   - **Access Controls & Master Overrides**: 3-second tactile hold emergency lockdown, campus free-egress evacuation switch, remote pulse door unlock, and unauthorized badge scan exception logs.
   - **Sentinel Biometric Gateway**: Simulated fingerprint / FaceID sensor with laser scan animation and 6-digit RSA SecurID hardware PIN modal.

### Visual Identity & Theme Tokens

- **Design System**: "Campus Telemetry" design specification based on high-contrast operational ergonomics.
- **Palette**:
  - *Primary Canvas*: Neutral ice surface (`#F8F9FF` light, `#0B132B` dark)
  - *Structural Base*: Deep Slate Navy (`#0F172A`)
  - *Accent & Validation*: Core Indigo (`#4B41E1` / `#645EFB`) & Electric Cyan (`#0090A9` / `#4CD7F6`)
  - *Verification State*: Emerald Green (`#10B981`)
  - *Emergency & Lockdown*: Crimson Alert (`#BA1A1A` / `#EF4444`)
- **Typography**:
  - Body & Headlines: `Inter` (geometric neo-grotesque for effortless scanning in direct sunlight).
  - Telemetry & Data: `JetBrains Mono` with `tabular-nums` for RSSI values, door codes, and millisecond latency timers.
- **Responsive Layout**:
  - Fluid mobile-first shell (`max-w-md` mobile container with realistic smartphone frame toggle on desktop, expanding smoothly to multi-column desktop operations console for admin screens).
  - Fixed bottom tab bar (Access, Attendance, Safety, Events, plus Hub switch) conforming to the 15% mobile sticky height cap with $44\text{px}+$ touch hitboxes.

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1: Client-Side Interactive Proximity Simulator**:
  - *Chosen Approach*: An interactive telemetry HUD drawer allowing users to slide simulated distance from 0.2m to 15.0m and switch beacons (Lab 402, Library Gate B, Turing Hall).
  - *Why*: Enables instant demonstration of the app's marquee hands-free beacon features (auto-unlock, audio chime, haptic feedback, attendance logging) without requiring physical UWB hardware.
- **Decision 2: High-Performance Canvas & SVG Visualizations**:
  - *Chosen Approach*: Lightweight SVG circular progress gauges, radar sweep animations, and SVG diurnal occupancy curves rather than heavy third-party charting libraries.
  - *Why*: Zero external bundle weight, 60fps silky smooth mobile rendering, and instant reaction to simulated data changes.
- **Decision 3: Zero Broken Image Protocol with Verified Local & Web Assets**:
  - *Chosen Approach*: Use the user's provided high-resolution campus photography and security feed assets (hotlinked directly with robust CSS/SVG fallback states).
  - *Why*: Guarantees authentic visual fidelity matching the user's design reference images without network flakiness.

---

## 4. Technical Architecture & Data Strategy

### System Architecture Diagram

```
┌────────────────────────────────────────────────────────────────────────┐
│                          Uni Connect Applet                            │
└──────────────────────────────────┬─────────────────────────────────────┘
                                   │
         ┌─────────────────────────┴─────────────────────────┐
         ▼                                                   ▼
┌───────────────────────────────────┐       ┌───────────────────────────────────┐
│     Student Mobile Experience     │       │     Security Sentinel Portal      │
│  (Theme: Opal / Obsidian Light)   │       │  (Theme: Slate Navy Tactical Ops) │
├───────────────────────────────────┤       ├───────────────────────────────────┤
│ • Keycard & Proximity Radar View  │       │ • Live Video & Thermal Feeds      │
│ • Automated Attendance & Schedule │       │ • Headcount & Zone Analytics      │
│ • Campus Safety 3s SOS Station    │       │ • Access Control & Master Lock    │
│ • Campus Pulse & Events Feed      │       │ • Sentinel Biometric Gateway      │
│ • Facility Study Spaces Finder    │       │ • Tactical Patrol Quick Desk      │
│ • Settings & 5-Language Switcher  │       │ • Incident Audit Logs & CSV Export│
└─────────────────┬─────────────────┘       └─────────────────┬─────────────────┘
                  │                                           │
                  └─────────────────────┬─────────────────────┘
                                        │
                                        ▼
                  ┌───────────────────────────────────────────┐
                  │      Unified Reactive Campus Store        │
                  ├───────────────────────────────────────────┤
                  │ • Simulated Beacon Distance (0.2m - 15m)  │
                  │ • Registered Student Identity & Badges    │
                  │ • Active Portal Locks (Lab 402, Gate B)   │
                  │ • Attendance Check-In Status & Timetable  │
                  │ • Live Zone Capacities & Anomaly Alerts   │
                  │ • Emergency SOS & Lockdown State Machines │
                  │ • Language (EN, 中文, BM, ID, ҚЗ) & Theme │
                  └───────────────────────────────────────────┘
```

### Component & Screen Directory Map

- `src/App.tsx`: Central coordinator managing active persona (Student vs. Security Hub), current tab, language dictionary, and theme context.
- `src/components/common/Header.tsx`: Unified top bar with live Wi-Fi signal beacon, notifications popover, student avatar, and quick role switcher toggle.
- `src/components/common/BottomNav.tsx`: Bottom tab bar with $44\text{px}+$ touch targets (Access, Attendance, Safety, Events, plus Hub switch).
- `src/components/common/ProximitySimulatorDrawer.tsx`: Dockable telemetry simulation panel with beacon slider, active node selector, and auto-walk test runner.
- `src/components/student/KeycardAccessView.tsx`: Obsidian / light keycard, rotating cryptographic QR token, proximity radar sweep, and seamless trace history.
- `src/components/student/AttendanceView.tsx`: Active lecture hall timer, 96.5% term attendance ring, live seat density, today's schedule, and lab notes modal.
- `src/components/student/SafetySosView.tsx`: 3-second tactile hold SOS button with SVG stroke offset animation, rapid assistance grid, and safe lit pathway map.
- `src/components/student/CampusPulseEventsView.tsx`: Category filter pills, featured hackathon card with interactive RSVP state, and event list with badge pass.
- `src/components/student/FacilityStudySpacesView.tsx`: Study space filter, West Campus quiet pavilion card, gym crowd rhythm tracker, and density ping alerts.
- `src/components/student/SettingsPreferencesView.tsx`: 5-language switcher, theme selector, sunlight contrast toggle, and sensor calibration.
- `src/components/security/SecurityPortalLogin.tsx`: Biometric fingerprint / FaceID sensor with laser scan animation and RSA-SecurID PIN pad.
- `src/components/security/LiveFeedsView.tsx`: 4-camera video wall with AI bounding boxes, thermal/FLIR optic toggle, audio meter, and patrol desk actions.
- `src/components/security/HeadcountZonesView.tsx`: Campus presence gauge, foyer chokepoint anomaly, granular sector breakdown, and diurnal waveform chart.
- `src/components/security/AccessControlsView.tsx`: 3-second hold emergency lockdown, campus free-egress switch, turnstile controls, and unauthorized scan flags.
- `src/data/mockCampusData.ts`: Realistic datasets for beacons, schedules, facilities, security alerts, and full multilingual translation dictionaries.

---

## 5. Verification Plan

1. **Build & Typecheck**: Run `compile_applet` to ensure pristine TypeScript compilation with zero errors or missing imports.
2. **Interactive Event Verification**:
   - Hold-to-activate 3-second SOS button in Safety view (visual countdown + dispatch notification).
   - Hold-to-engage 3-second Emergency Lockdown button in Security view (perimeter lockdown state).
   - Distance slider movement (triggers automatic door unlock at $<1.5\text{m}$ and updates radar target).
   - Language selector (instantly updates headers, status pills, and buttons across all 5 languages).
   - Theme toggle (switches between Light, Dark Slate, and High Contrast sunlight mode).
   - Live Feeds filters and thermal mode toggle.
   - Headcount real-time sync button and CSV export.
3. **Responsive Verification**: Verify both mobile single-column layout and expansive tablet/desktop layouts.
