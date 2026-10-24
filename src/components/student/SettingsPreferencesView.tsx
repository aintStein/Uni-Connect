import React, { useState } from 'react';
import { StudentProfile, Language, ThemeMode } from '../../types';
import { TRANSLATIONS } from '../../data/mockCampusData';

interface SettingsPreferencesViewProps {
  profile: StudentProfile;
  language: Language;
  onSelectLanguage: (lang: Language) => void;
  themeMode: ThemeMode;
  onSelectTheme: (theme: ThemeMode) => void;
  highContrast: boolean;
  onToggleHighContrast: () => void;
  handsFreeUnlock: boolean;
  onToggleHandsFreeUnlock: () => void;
  autoAttendance: boolean;
  onToggleAutoAttendance: () => void;
  sosHaptic: boolean;
  onToggleSosHaptic: () => void;
  onCloseSettings: () => void;
}

export const SettingsPreferencesView: React.FC<SettingsPreferencesViewProps> = ({
  profile,
  language,
  onSelectLanguage,
  themeMode,
  onSelectTheme,
  highContrast,
  onToggleHighContrast,
  handsFreeUnlock,
  onToggleHandsFreeUnlock,
  autoAttendance,
  onToggleAutoAttendance,
  sosHaptic,
  onToggleSosHaptic,
  onCloseSettings,
}) => {
  const [showCalibrationModal, setShowCalibrationModal] = useState(false);
  const [calibratedDistance, setCalibratedDistance] = useState(1.5);
  const t = TRANSLATIONS[language];

  const languages: { id: Language; code: string; name: string; desc: string }[] = [
    { id: 'en', code: 'EN', name: 'English', desc: 'Default (US & UK International)' },
    { id: 'zh', code: '中', name: '中文', desc: 'Chinese (Simplified)' },
    { id: 'ms', code: 'BM', name: 'Bahasa Melayu', desc: 'Malay' },
    { id: 'id', code: 'ID', name: 'Bahasa Indonesia', desc: 'Indonesian' },
    { id: 'kk', code: 'ҚЗ', name: 'Қазақша', desc: 'Kazakh' },
  ];

  return (
    <div className="flex flex-col w-full gap-4 pb-28">
      {/* Top Header Context */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={onCloseSettings}
              className="w-10 h-10 -ml-2 rounded-full flex items-center justify-center text-on-surface hover:bg-surface-container transition-colors"
            >
              <span className="material-symbols-outlined text-[24px]">arrow_back</span>
            </button>
            <h2 className="text-lg font-bold text-on-surface tracking-tight">
              Settings & Preferences
            </h2>
          </div>
          <button
            onClick={() => alert('Uni Connect Telemetry v2.4.0 Help & Diagnostic Docs')}
            className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-on-surface"
          >
            <span className="material-symbols-outlined text-[18px]">help_outline</span>
          </button>
        </div>
        <p className="text-xs text-on-surface-variant pl-8">
          Campus Telemetry & Account Personalization
        </p>
      </div>

      {/* Student Profile Bar */}
      <div className="bg-surface-container-lowest rounded-2xl p-4 shadow-sm border border-slate-200/60 dark:border-slate-800 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-full bg-secondary-fixed flex items-center justify-center shrink-0 text-secondary">
            <span className="material-symbols-outlined text-[22px]">account_circle</span>
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-bold text-xs text-on-surface truncate">{profile.name}</span>
            <span className="text-[11px] font-mono text-on-surface-variant truncate">
              ID: {profile.id}
            </span>
          </div>
        </div>
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-container shrink-0">
          <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
          <span className="text-[10px] font-mono font-semibold text-secondary">
            Telemetry Synced
          </span>
        </div>
      </div>

      {/* Language Selection Card */}
      <div className="bg-surface-container-lowest rounded-3xl p-5 shadow-sm border border-slate-200/60 dark:border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary text-[22px]">language</span>
            <h3 className="font-bold text-sm text-on-surface">{t.displayLanguage}</h3>
          </div>
          <span className="text-[11px] font-mono text-on-surface-variant bg-surface-container px-2 py-0.5 rounded-full">
            5 Available
          </span>
        </div>

        <div className="flex flex-col gap-1.5">
          {languages.map((lang) => (
            <label
              key={lang.id}
              onClick={() => onSelectLanguage(lang.id)}
              className={`flex items-center justify-between p-3 rounded-2xl cursor-pointer transition-all border ${
                language === lang.id
                  ? 'bg-surface-container-low border-secondary/40 shadow-xs'
                  : 'bg-surface-container-lowest border-transparent hover:bg-surface-container-low/50'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold ${
                    language === lang.id
                      ? 'bg-secondary text-white'
                      : 'bg-surface-container text-on-surface-variant'
                  }`}
                >
                  {lang.code}
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="font-bold text-xs text-on-surface">{lang.name}</span>
                  <span className="text-[11px] text-on-surface-variant truncate">{lang.desc}</span>
                </div>
              </div>

              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 border ${
                  language === lang.id
                    ? 'border-secondary bg-secondary text-white'
                    : 'border-slate-300 dark:border-slate-700'
                }`}
              >
                {language === lang.id && <span className="w-2 h-2 rounded-full bg-white" />}
              </div>
            </label>
          ))}
        </div>

        <div className="flex items-start gap-2 p-3 rounded-2xl bg-surface-container-low text-xs text-on-surface-variant">
          <span className="material-symbols-outlined text-secondary text-[18px] shrink-0 mt-0.5">
            info
          </span>
          <p className="leading-snug">
            Affects voice alerts, emergency SOS prompts, and beacon notifications in real time.
          </p>
        </div>
      </div>

      {/* Appearance & Theme Selector */}
      <div className="bg-surface-container-lowest rounded-3xl p-5 shadow-sm border border-slate-200/60 dark:border-slate-800 space-y-3">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-secondary text-[22px]">
            brightness_medium
          </span>
          <h3 className="font-bold text-sm text-on-surface">{t.appearance}</h3>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {/* Light Mode */}
          <button
            onClick={() => onSelectTheme('light')}
            className={`p-3 rounded-2xl text-left border transition-all flex flex-col justify-between ${
              themeMode === 'light'
                ? 'bg-secondary-fixed/50 border-secondary text-on-surface font-semibold shadow-xs'
                : 'bg-surface-container-low border-transparent text-on-surface-variant hover:bg-surface-container'
            }`}
          >
            <div className="w-full flex items-center justify-between mb-2">
              <span className="material-symbols-outlined text-[20px] text-secondary">light_mode</span>
              {themeMode === 'light' && <span className="w-2 h-2 rounded-full bg-secondary" />}
            </div>
            <span className="font-bold text-xs block">Light</span>
            <span className="text-[10px] text-on-surface-variant">Standard</span>
          </button>

          {/* Dark Mode */}
          <button
            onClick={() => onSelectTheme('dark')}
            className={`p-3 rounded-2xl text-left border transition-all flex flex-col justify-between ${
              themeMode === 'dark'
                ? 'bg-secondary-fixed/50 border-secondary text-on-surface font-semibold shadow-xs'
                : 'bg-surface-container-low border-transparent text-on-surface-variant hover:bg-surface-container'
            }`}
          >
            <div className="w-full flex items-center justify-between mb-2">
              <span className="material-symbols-outlined text-[20px] text-secondary">dark_mode</span>
              {themeMode === 'dark' && <span className="w-2 h-2 rounded-full bg-secondary" />}
            </div>
            <span className="font-bold text-xs block">Dark</span>
            <span className="text-[10px] text-on-surface-variant">Slate</span>
          </button>

          {/* System Mode */}
          <button
            onClick={() => onSelectTheme('system')}
            className={`p-3 rounded-2xl text-left border transition-all flex flex-col justify-between ${
              themeMode === 'system'
                ? 'bg-secondary-fixed/50 border-secondary text-on-surface font-semibold shadow-xs'
                : 'bg-surface-container-low border-transparent text-on-surface-variant hover:bg-surface-container'
            }`}
          >
            <div className="w-full flex items-center justify-between mb-2">
              <span className="material-symbols-outlined text-[20px] text-secondary">devices</span>
              {themeMode === 'system' && <span className="w-2 h-2 rounded-full bg-secondary" />}
            </div>
            <span className="font-bold text-xs block">System</span>
            <span className="text-[10px] text-on-surface-variant">Adaptive</span>
          </button>
        </div>

        {/* High Contrast Sunlight Toggle */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
          <div className="flex flex-col min-w-0 pr-3">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-secondary text-[18px]">contrast</span>
              <span className="font-bold text-xs text-on-surface">High Contrast Radar</span>
            </div>
            <span className="text-[11px] text-on-surface-variant mt-0.5">
              Enhances screen legibility and beacon maps under direct outdoor sunlight.
            </span>
          </div>

          <button
            onClick={onToggleHighContrast}
            className={`w-12 h-6 rounded-full transition-colors relative p-0.5 shrink-0 ${
              highContrast ? 'bg-secondary' : 'bg-slate-300 dark:bg-slate-700'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white shadow transition-transform ${
                highContrast ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Sync & Sensor Telemetry Toggles */}
      <div className="bg-surface-container-lowest rounded-3xl p-5 shadow-sm border border-slate-200/60 dark:border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary text-[22px]">sensors</span>
            <h3 className="font-bold text-sm text-on-surface">Sync & Sensor Telemetry</h3>
          </div>
          <span className="text-[10px] font-mono text-secondary bg-surface-container px-2 py-0.5 rounded-full font-semibold">
            Ultra-Low Power
          </span>
        </div>

        {/* Toggle 1: Hands-Free Unlock */}
        <div className="flex items-start justify-between py-1">
          <div className="flex gap-3 min-w-0 pr-3">
            <div className="w-8 h-8 rounded-full bg-surface-container-low flex items-center justify-center shrink-0 text-on-surface mt-0.5">
              <span className="material-symbols-outlined text-[18px]">door_sliding</span>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-bold text-xs text-on-surface">
                Hands-free Wi-Fi Door Unlock
              </span>
              <p className="text-[11px] text-on-surface-variant mt-0.5">
                Triggers building, lab, and residence access automatically via 6E spatial beacons
                within 1.5m.
              </p>
            </div>
          </div>
          <button
            onClick={onToggleHandsFreeUnlock}
            className={`w-12 h-6 rounded-full transition-colors relative p-0.5 shrink-0 mt-1 ${
              handsFreeUnlock ? 'bg-secondary' : 'bg-slate-300 dark:bg-slate-700'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white shadow transition-transform ${
                handsFreeUnlock ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Toggle 2: Automated Attendance */}
        <div className="flex items-start justify-between py-1">
          <div className="flex gap-3 min-w-0 pr-3">
            <div className="w-8 h-8 rounded-full bg-surface-container-low flex items-center justify-center shrink-0 text-on-surface mt-0.5">
              <span className="material-symbols-outlined text-[18px]">how_to_reg</span>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-bold text-xs text-on-surface">
                Automated Classroom Attendance
              </span>
              <p className="text-[11px] text-on-surface-variant mt-0.5">
                Auto sign-in upon entering scheduled lecture halls when connected to campus wireless.
              </p>
            </div>
          </div>
          <button
            onClick={onToggleAutoAttendance}
            className={`w-12 h-6 rounded-full transition-colors relative p-0.5 shrink-0 mt-1 ${
              autoAttendance ? 'bg-secondary' : 'bg-slate-300 dark:bg-slate-700'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white shadow transition-transform ${
                autoAttendance ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Toggle 3: SOS Haptics */}
        <div className="flex items-start justify-between py-1">
          <div className="flex gap-3 min-w-0 pr-3">
            <div className="w-8 h-8 rounded-full bg-error-container flex items-center justify-center shrink-0 text-on-error-container mt-0.5">
              <span className="material-symbols-outlined text-[18px]">vibration</span>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-bold text-xs text-on-surface">Emergency SOS Quick-Trigger</span>
              <p className="text-[11px] text-on-surface-variant mt-0.5">
                Distinct haptic feedback pulse when the 3-second rapid emergency safety trigger is primed.
              </p>
            </div>
          </div>
          <button
            onClick={onToggleSosHaptic}
            className={`w-12 h-6 rounded-full transition-colors relative p-0.5 shrink-0 mt-1 ${
              sosHaptic ? 'bg-secondary' : 'bg-slate-300 dark:bg-slate-700'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white shadow transition-transform ${
                sosHaptic ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Connected Device & Spatial Calibration */}
      <div className="bg-surface-container-lowest rounded-2xl p-4 shadow-sm border border-slate-200/60 dark:border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-full bg-surface-container flex items-center justify-center shrink-0 text-on-surface-variant">
            <span className="material-symbols-outlined text-[20px]">near_me</span>
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-bold text-xs text-on-surface truncate">Beacon Calibration</span>
            <span className="text-[11px] text-on-surface-variant truncate">
              Fine-tune door reader distance (Current: {calibratedDistance.toFixed(1)}m)
            </span>
          </div>
        </div>
        <button
          onClick={() => setShowCalibrationModal(true)}
          className="px-3.5 py-1.5 rounded-xl bg-surface-container-high text-on-surface font-semibold text-xs hover:bg-surface-container transition-colors shrink-0"
        >
          Calibrate
        </button>
      </div>

      {/* Calibration Modal */}
      {showCalibrationModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-sm w-full shadow-2xl space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-sm text-on-surface">Spatial Radar Calibration</h3>
              <button onClick={() => setShowCalibrationModal(false)}>
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Adjust proximity trigger sensitivity threshold:
            </p>
            <div className="space-y-2">
              <input
                type="range"
                min="0.5"
                max="3.0"
                step="0.1"
                value={calibratedDistance}
                onChange={(e) => setCalibratedDistance(parseFloat(e.target.value))}
                className="w-full accent-secondary"
              />
              <div className="flex justify-between font-mono text-xs">
                <span>0.5m (Close)</span>
                <span className="font-bold text-secondary">{calibratedDistance.toFixed(1)}m</span>
                <span>3.0m (Wide)</span>
              </div>
            </div>
            <button
              onClick={() => setShowCalibrationModal(false)}
              className="w-full py-2.5 rounded-xl bg-secondary text-white text-xs font-semibold"
            >
              Save Calibration
            </button>
          </div>
        </div>
      )}

      {/* Statutory Footer */}
      <div className="flex flex-col items-center justify-center text-center gap-1 pt-2 pb-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container text-on-surface-variant text-[10px] font-mono">
          <span className="material-symbols-outlined text-[14px] text-secondary">verified_user</span>
          <span>FERPA Compliant · Zero-Knowledge Cryptography</span>
        </div>
        <p className="text-[10px] font-mono text-on-surface-variant mt-1">
          Uni Connect v2.4.0 · Campus Telemetry Engine
        </p>
      </div>
    </div>
  );
};
