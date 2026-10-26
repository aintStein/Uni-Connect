# Uni Connect: Smart Campus OS & Coursework Suite

Uni Connect is a comprehensive, production-grade smart campus operating system connecting students, faculty, and campus safety officers across high-density academic and security infrastructure.

---

## Deliverables & Architecture Overview

### 1. 5G Network Terminology Transition
- Replaced legacy "WiFi" / "Wi-Fi" / "Wi-Fi 6E" terminology across all pages, components, notifications, and translations:
  - **Global Header**: Telemetry badge now displays `5G NR`, notification reflects `5G NR-U Active: Campus 5G standalone mesh operating at full speed`.
  - **Student Access & Keycard**: Live stream telemetry bar now shows `5G Ultra • UWB 7.9 GHz • -48 dBm`.
  - **Attendance View**: Real-time classroom presence telemetry reflects `5G Node: TH-5G-04 (-48dBm)`.
  - **Campus Pulse & Events**: Infrastructure broadcast banner updated to `Campus 5G NR Microcell Upgrade Tonight`.
  - **Facility Study Spaces**: Room telemetry reflects `5G NR Ultra` and rhythm predictor reflects 5G microcell load.
  - **Security Sentinel Operations**: Sector telemetry reflects `84 5G gNodeB Cells` and `5G NR Links`.
  - **Multilingual Support**: Updated `TRANSLATIONS` across all 5 languages (`en`, `zh`, `ms`, `id`, `kk`) to state 5G connection status.

### 2. Access Controller Firmware Mobile Layout Fix
- **Issue Resolved (from `/public/assets/aistudio/image_a74fc96c.png`)**:
  - The `Unblockable Channel Active` status badge was previously squished into a circular blob.
  - The `Export Log` and `Security Dispatch` buttons were in a cramped horizontal row that overflowed and clipped outside the card border on mobile viewports.
- **Architectural Solution**:
  - Rebuilt the firmware card into a dedicated mobile-first layout:
  - Header row displays the icon, firmware title, and a non-squishing horizontal pill badge (`whitespace-nowrap inline-flex items-center gap-1 border border-emerald-500/30`) with animated pulse beacon.
  - Description is rendered cleanly with full width below the header.
  - Button actions are structured in a balanced `grid grid-cols-2 gap-2 w-full pt-1`, ensuring `Export Log` and `Security Dispatch` fit comfortably with zero overflow.

### 3. Ventilation Alert Contrast Fix
- **Issue Resolved**:
  - In `HeadcountZonesView.tsx`, the status sentence `Ventilation Stage 3 auto-boosted • Usher 04 pinged` blended into the pink error container background.
- **Solution**:
  - Encapsulated the status line in a high-contrast container (`bg-white/95 dark:bg-slate-900/95 border border-slate-300 dark:border-slate-700 shadow-sm`).
  - Text styled with `font-semibold text-xs text-slate-900 dark:text-slate-100`.
  - Icon and active badge styled with vivid indigo and cyan tones (`text-indigo-600 dark:text-cyan-400` and `bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300`).

### 4. Student View Mobile Optimization
- **Ergonomics & Layout**:
  - Removed negative horizontal margin escapes (`-mx-margin px-margin`) from horizontal event scroll bars to eliminate unwanted horizontal page scroll on mobile.
  - Coursework metrics cards tuned with responsive gap and padding (`p-2 sm:p-3`, `text-sm sm:text-base`) to prevent squishing on screens down to 360px.
  - All interactive buttons and touch targets meet minimum 44px ergonomics.
  - Modals feature safe area padding and auto-scrolling content containers.
