import React, { useState, useEffect } from 'react';
import { StudentProfile, NearbyBeacon, AccessTrace, Language, ThemeMode } from '../../types';
import { TRANSLATIONS } from '../../data/mockCampusData';

interface KeycardAccessViewProps {
  profile: StudentProfile;
  beacons: NearbyBeacon[];
  traces: AccessTrace[];
  currentDistance: number;
  onOpenSos: () => void;
  language: Language;
  themeMode?: ThemeMode;
  onToggleTheme?: () => void;
  highContrast?: boolean;
}

export const KeycardAccessView: React.FC<KeycardAccessViewProps> = ({
  profile,
  beacons,
  traces,
  currentDistance,
  onOpenSos,
  language,
  themeMode,
  onToggleTheme,
  highContrast,
}) => {
  const [localCardTheme, setLocalCardTheme] = useState<'obsidian' | 'light'>('obsidian');
  const [showQrModal, setShowQrModal] = useState(false);
  const [clockSec, setClockSec] = useState('10:27:48.6');
  const [autoSync, setAutoSync] = useState(true);
  const [qrToken, setQrToken] = useState('UWB-8841-SEC-9921');
  const t = TRANSLATIONS[language];

  // High precision terminal clock (ms counter)
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const hrs = String(now.getHours()).padStart(2, '0');
      const mins = String(now.getMinutes()).padStart(2, '0');
      const secs = String(now.getSeconds()).padStart(2, '0');
      const ms = String(Math.floor(now.getMilliseconds() / 100));
      setClockSec(`${hrs}:${mins}:${secs}.${ms}`);
    }, 100);
    return () => clearInterval(timer);
  }, []);

  // Rotate QR code token every 30 seconds
  useEffect(() => {
    const tokenTimer = setInterval(() => {
      const rand = Math.floor(1000 + Math.random() * 9000);
      setQrToken(`UWB-8841-SEC-${rand}`);
    }, 30000);
    return () => clearInterval(tokenTimer);
  }, []);

  const nearestBeacon = beacons[0] || { name: 'Lab 402', distanceMeters: currentDistance };

  // Sync isDark with global themeMode if provided, else fallback to local toggle
  const isDark = themeMode ? themeMode === 'dark' : localCardTheme === 'obsidian';

  const toggleTheme = () => {
    if (onToggleTheme) {
      onToggleTheme();
    } else {
      setLocalCardTheme(isDark ? 'light' : 'obsidian');
    }
  };

  return (
    <div className="flex flex-col w-full gap-3 pb-6">
      {/* Telemetry Stream Strip */}
      <div
        className={`w-full rounded-2xl p-3 shadow-xs border transition-colors flex items-center justify-between ${
          isDark
            ? 'bg-[#101728] border-slate-800 text-white'
            : 'bg-surface-container-lowest border-outline-variant/30 text-on-surface'
        }`}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
              isDark ? 'bg-blue-950/80 text-cyan-400' : 'bg-secondary-fixed text-secondary'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">wifi_tethering</span>
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold tracking-tight">
                {t.telemetryLive}
              </span>
              <span
                className={`px-1.5 py-0.2 rounded text-[9px] font-mono font-bold uppercase ${
                  isDark
                    ? 'bg-cyan-950 text-cyan-400 border border-cyan-800/60'
                    : 'bg-secondary text-white'
                }`}
              >
                LIVE
              </span>
            </div>
            <p
              className={`text-[10px] font-mono truncate mt-0.5 ${
                isDark ? 'text-slate-400' : 'text-on-surface-variant'
              }`}
            >
              5G Ultra • UWB 7.9 GHz • -48 dBm
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={() => setAutoSync(!autoSync)}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-mono transition-colors cursor-pointer ${
              isDark
                ? 'bg-slate-800/90 text-slate-300 hover:bg-slate-700'
                : 'bg-surface-container-high text-on-surface'
            }`}
            title="Toggle Auto-Sync"
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                autoSync ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'
              }`}
            />
            <span>{autoSync ? 'Synced' : 'Paused'}</span>
          </button>

          <button
            onClick={toggleTheme}
            className={`w-7 h-7 rounded-full flex items-center justify-center text-xs transition-colors cursor-pointer ${
              isDark
                ? 'bg-slate-800 text-cyan-300 hover:bg-slate-700'
                : 'bg-surface-container text-on-surface-variant hover:text-on-surface'
            }`}
            title={isDark ? 'Switch to Light Card' : 'Switch to Dark Card'}
          >
            <span className="material-symbols-outlined text-[15px]">
              {isDark ? 'light_mode' : 'dark_mode'}
            </span>
          </button>
        </div>
      </div>

      {/* Holographic Keycard (Obsidian Dark or Daylight Light) */}
      <div
        className={`relative w-full rounded-3xl p-4.5 shadow-xl overflow-hidden transition-all duration-300 border ${
          isDark
            ? 'bg-gradient-to-br from-[#0c1424] via-[#09101f] to-[#060a14] text-white border-blue-500/35 shadow-blue-950/40'
            : 'bg-gradient-to-br from-white via-indigo-50/50 to-blue-50/60 text-slate-900 border-indigo-200/80 shadow-indigo-100/50'
        }`}
      >
        {/* Glow backdrop light */}
        <div
          className={`absolute -top-14 -right-14 w-44 h-44 rounded-full blur-3xl pointer-events-none ${
            isDark ? 'bg-cyan-500/15' : 'bg-indigo-400/20'
          }`}
        />

        {/* Keycard Header */}
        <div className="flex items-start justify-between relative z-10 mb-3.5">
          <div className="flex items-center gap-2.5">
            <div
              className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 border ${
                isDark
                  ? 'bg-slate-800/80 border-cyan-400/30 text-cyan-400'
                  : 'bg-indigo-600 text-white border-transparent'
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">contactless</span>
            </div>
            <div>
              <span
                className={`text-[9px] font-mono tracking-wider uppercase block font-semibold ${
                  isDark ? 'text-cyan-400' : 'text-indigo-600'
                }`}
              >
                {language === 'zh' ? '智能学生门禁卡' : 'SMART KEYCARD'}
              </span>
              <h2 className="text-base font-bold tracking-tight leading-tight">
                {language === 'zh' ? '都市联合大学' : 'Metro University'}
              </h2>
            </div>
          </div>

          {/* NFC Status & Live Clock */}
          <div className="text-right flex flex-col items-end">
            <span
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-mono font-semibold ${
                isDark
                  ? 'bg-indigo-950/90 text-indigo-300 border border-indigo-700/60'
                  : 'bg-indigo-100 text-indigo-700'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              NFC Ready
            </span>
            <span
              className={`text-[9px] font-mono mt-0.5 ${
                isDark ? 'text-slate-400' : 'text-slate-500'
              }`}
            >
              {clockSec}
            </span>
          </div>
        </div>

        {/* Student Profile Identity Section */}
        <div className="flex items-center gap-3 relative z-10 py-1">
          <div className="relative">
            <img
              src={profile.photoUrl}
              alt={profile.name}
              className="w-15 h-15 rounded-2xl object-cover ring-2 ring-cyan-400/40 shadow-md"
            />
            <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-secondary text-white flex items-center justify-center text-[10px] shadow">
              <span className="material-symbols-outlined text-[13px]">verified</span>
            </span>
          </div>

          <div className="min-w-0 flex-1">
            <h3 className="text-base font-bold truncate leading-tight">
              {profile.name}
            </h3>
            <p
              className={`text-xs truncate mt-0.5 ${
                isDark ? 'text-slate-300' : 'text-slate-600'
              }`}
            >
              {profile.school}
            </p>
            <div className="flex items-center gap-2 mt-1.5 flex-wrap">
              <span
                className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-semibold ${
                  isDark
                    ? 'bg-indigo-900/60 text-indigo-300 border border-indigo-700/40'
                    : 'bg-indigo-100 text-indigo-700'
                }`}
              >
                {profile.id}
              </span>
              <span
                className={`text-[10px] font-mono ${
                  isDark ? 'text-cyan-400 font-medium' : 'text-slate-700 font-semibold'
                }`}
              >
                Tier 4 Pass
              </span>
            </div>
          </div>
        </div>

        {/* Card Footer: UWB Auto-Broadcast & Show Pass Button */}
        <div
          className={`mt-3.5 pt-2.5 flex items-center justify-between relative z-10 border-t ${
            isDark ? 'border-slate-800/80' : 'border-indigo-100'
          }`}
        >
          <div className="flex items-center gap-1.5">
            <div className="flex items-end gap-0.5 h-3 text-cyan-400">
              <span className="w-0.5 h-2 bg-cyan-400 animate-pulse" />
              <span className="w-0.5 h-3 bg-cyan-400 animate-pulse delay-75" />
              <span className="w-0.5 h-1.5 bg-cyan-400 animate-pulse delay-150" />
            </div>
            <span
              className={`text-[10px] font-mono ${
                isDark ? 'text-slate-300' : 'text-slate-600'
              }`}
            >
              UWB Broadcast
            </span>
          </div>

          <button
            onClick={() => setShowQrModal(true)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md active:scale-95 transition-all cursor-pointer ${
              isDark
                ? 'bg-white text-slate-950 hover:bg-slate-100'
                : 'bg-slate-900 text-white hover:bg-slate-800'
            }`}
          >
            <span className="material-symbols-outlined text-[15px]">qr_code_2</span>
            <span>{t.showPass}</span>
          </button>
        </div>
      </div>

      {/* QR Code / Digital Pass Modal */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-3xl p-5 max-w-xs w-full shadow-2xl text-center space-y-3.5 border border-outline-variant/30">
            <div className="flex justify-between items-center">
              <span className="font-bold text-xs text-on-surface uppercase tracking-wider">
                Cryptographic Pass
              </span>
              <button
                onClick={() => setShowQrModal(false)}
                className="w-7 h-7 rounded-full bg-surface-container text-on-surface-variant hover:text-on-surface flex items-center justify-center cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            </div>

            <div className="p-3 bg-surface-container-low rounded-2xl border border-outline-variant/30 flex flex-col items-center justify-center">
              <div className="w-40 h-40 bg-white p-2 rounded-xl shadow-inner flex flex-col items-center justify-center">
                <svg className="w-full h-full text-slate-900" viewBox="0 0 100 100">
                  <rect x="5" y="5" width="25" height="25" fill="none" stroke="currentColor" strokeWidth="6" />
                  <rect x="12" y="12" width="11" height="11" fill="currentColor" />
                  <rect x="70" y="5" width="25" height="25" fill="none" stroke="currentColor" strokeWidth="6" />
                  <rect x="77" y="12" width="11" height="11" fill="currentColor" />
                  <rect x="5" y="70" width="25" height="25" fill="none" stroke="currentColor" strokeWidth="6" />
                  <rect x="12" y="77" width="11" height="11" fill="currentColor" />
                  <line x1="35" y1="10" x2="65" y2="10" stroke="currentColor" strokeWidth="4" strokeDasharray="3 3" />
                  <line x1="35" y1="20" x2="65" y2="20" stroke="currentColor" strokeWidth="4" strokeDasharray="5 3" />
                  <line x1="10" y1="35" x2="90" y2="35" stroke="currentColor" strokeWidth="4" strokeDasharray="6 4" />
                  <line x1="10" y1="50" x2="90" y2="50" stroke="currentColor" strokeWidth="5" strokeDasharray="4 2 6" />
                  <line x1="10" y1="65" x2="90" y2="65" stroke="currentColor" strokeWidth="4" strokeDasharray="3 5 2" />
                  <line x1="35" y1="80" x2="65" y2="80" stroke="currentColor" strokeWidth="4" strokeDasharray="4 4" />
                  <line x1="35" y1="90" x2="65" y2="90" stroke="currentColor" strokeWidth="4" strokeDasharray="6 2" />
                </svg>
              </div>
              <span className="font-mono text-xs font-semibold text-secondary mt-2">
                {qrToken}
              </span>
              <span className="text-[10px] text-on-surface-variant font-mono">
                Auto-rotates every 30s
              </span>
            </div>

            <p className="text-[11px] text-on-surface-variant">
              Hold within 5cm of turnstile optical reader.
            </p>

            <button
              onClick={() => setShowQrModal(false)}
              className="w-full py-2.5 rounded-xl bg-secondary text-white text-xs font-bold cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* Proximity Radar Component */}
      <div
        className={`w-full rounded-2xl p-4 shadow-xs border transition-colors space-y-3 ${
          isDark
            ? 'bg-[#101728] border-slate-800 text-white'
            : 'bg-surface-container-lowest border-outline-variant/30 text-on-surface'
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className={`w-6 h-6 rounded-lg flex items-center justify-center ${
                isDark ? 'bg-blue-950 text-cyan-400' : 'bg-secondary-fixed text-secondary'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">radar</span>
            </div>
            <h3 className="font-bold text-sm">
              {t.proximityRadar}
            </h3>
          </div>
          <div className="flex items-center gap-1.5">
            {highContrast && (
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-indigo-600 text-white animate-pulse">
                SUNLIGHT RADAR
              </span>
            )}
            <span
              className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                highContrast
                  ? 'bg-black text-white dark:bg-white dark:text-black font-bold'
                  : isDark
                  ? 'text-cyan-400 bg-cyan-950/80 border border-cyan-800/50'
                  : 'text-secondary bg-surface-container-high'
              }`}
            >
              &lt; 3.0m Range
            </span>
          </div>
        </div>

        {/* Circular Radar HUD Simulation */}
        <div
          className={`relative w-full h-44 rounded-2xl overflow-hidden flex items-center justify-center border ${
            highContrast
              ? 'border-2 border-indigo-600 dark:border-cyan-400 bg-black'
              : isDark
              ? 'bg-[#090f1d] border-slate-800/90'
              : 'bg-surface-container-low border-slate-200'
          }`}
        >
          {/* Concentric distance rings */}
          <div
            className={`radar-hud-ring absolute w-40 h-40 rounded-full border ${
              highContrast
                ? 'border-2 border-indigo-500 dark:border-cyan-400 opacity-100'
                : isDark
                ? 'border-blue-500/15'
                : 'border-secondary/20'
            }`}
          />
          <div
            className={`radar-hud-ring absolute w-28 h-28 rounded-full border ${
              highContrast
                ? 'border-2 border-indigo-500 dark:border-cyan-400 opacity-100'
                : isDark
                ? 'border-blue-500/25'
                : 'border-secondary/30'
            }`}
          />
          <div
            className={`radar-hud-ring absolute w-16 h-16 rounded-full border ${
              highContrast
                ? 'border-2 border-indigo-500 dark:border-cyan-400 opacity-100'
                : isDark
                ? 'border-blue-500/35'
                : 'border-secondary/40'
            }`}
          />

          {/* Center Student Node */}
          <div className="relative z-10 w-4 h-4 rounded-full bg-cyan-400 shadow-[0_0_12px_#38bdf8] flex items-center justify-center">
            <span className="w-2 h-2 rounded-full bg-white animate-ping" />
          </div>

          {/* Dynamic Radar Sweep Animation */}
          <div className="absolute inset-0 origin-center animate-spin pointer-events-none" style={{ animationDuration: '4s' }}>
            <div className={`w-1/2 h-1/2 bg-gradient-to-tr ${isDark ? 'from-cyan-500/20' : 'from-secondary/30'} to-transparent transform -rotate-45`} />
          </div>

          {/* Nearest Active Portal: Lab 402 Target Marker */}
          <div
            className={`absolute z-20 flex items-center gap-1.5 px-2.5 py-1 rounded-full shadow-lg backdrop-blur-md transition-all duration-300 ${
              currentDistance <= 1.5
                ? 'bg-emerald-500 text-white animate-pulse shadow-emerald-500/50'
                : isDark
                ? 'bg-[#142038] text-white border border-cyan-400/40'
                : 'bg-surface-container-lowest/90 text-on-surface border border-secondary/30'
            }`}
            style={{
              top: `${Math.min(72, Math.max(22, 50 - currentDistance * 3))}%`,
              right: `${Math.min(72, Math.max(15, 20 + currentDistance * 3))}%`,
            }}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                currentDistance <= 1.5 ? 'bg-white' : 'bg-cyan-400 animate-ping'
              }`}
            />
            <span className="text-[11px] font-mono font-bold">
              {nearestBeacon.name} ({currentDistance.toFixed(1)}m)
            </span>
          </div>

          {/* Secondary Target: Turnstile B */}
          <div
            className={`absolute bottom-3 left-3 z-10 flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-mono ${
              isDark
                ? 'bg-[#142038]/90 text-slate-300 border border-slate-700/50'
                : 'bg-surface-container/80 text-on-surface-variant'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
            <span>Turnstile B (4.5m)</span>
          </div>

          <div className="absolute bottom-2 right-3 text-[9px] font-mono text-slate-400">
            UWB 7.9 GHz
          </div>
        </div>

        {/* Current status banner */}
        <div
          className={`p-2.5 rounded-xl flex items-center justify-between text-xs transition-colors ${
            currentDistance <= 1.5
              ? 'bg-emerald-950/80 text-emerald-200 border border-emerald-500/50'
              : isDark
              ? 'bg-[#0d1424] text-slate-300 border border-slate-800'
              : 'bg-surface-container-low text-on-surface border border-slate-200'
          }`}
        >
          <div className="flex items-center gap-2 min-w-0">
            <span className="material-symbols-outlined text-[18px] text-cyan-400 shrink-0">
              {currentDistance <= 1.5 ? 'lock_open' : 'sensors'}
            </span>
            <span className="text-[11px] font-medium truncate">
              {currentDistance <= 1.5
                ? `Auto-unlocked for ${nearestBeacon.name}`
                : 'Auto-unlocks within 1.5m'}
            </span>
          </div>
          <span
            className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded shrink-0 ${
              currentDistance <= 1.5 ? 'bg-emerald-500 text-white' : 'bg-slate-800 text-slate-300'
            }`}
          >
            {currentDistance <= 1.5 ? 'UNLOCKED' : 'READY'}
          </span>
        </div>
      </div>

      {/* Seamless Access Traces Section */}
      <div
        className={`w-full rounded-2xl p-4 shadow-xs border transition-colors space-y-3 ${
          isDark
            ? 'bg-[#101728] border-slate-800 text-white'
            : 'bg-surface-container-lowest border-outline-variant/30 text-on-surface'
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className={`w-6 h-6 rounded-lg flex items-center justify-center ${
                isDark ? 'bg-blue-950 text-cyan-400' : 'bg-secondary-fixed text-secondary'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">history</span>
            </div>
            <h3 className="font-bold text-sm">{t.recentTraces}</h3>
          </div>
          <span
            className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
              isDark
                ? 'text-cyan-400 bg-cyan-950/80 border border-cyan-800/50'
                : 'text-secondary bg-surface-container-high'
            }`}
          >
            Live Logs
          </span>
        </div>

        {/* Trace List */}
        <div className="space-y-1.5 pt-0.5">
          {traces.slice(0, 3).map((trace) => (
            <div
              key={trace.id}
              className={`p-2.5 rounded-xl transition-colors flex items-start justify-between gap-2 ${
                isDark
                  ? 'bg-[#0d1424] hover:bg-[#141f36] border border-slate-800/80'
                  : 'bg-surface-container-low/70 hover:bg-surface-container'
              }`}
            >
              <div className="flex items-start gap-2 min-w-0">
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                    isDark ? 'bg-slate-800 text-cyan-400' : 'bg-surface-container text-secondary'
                  }`}
                >
                  <span className="material-symbols-outlined text-[15px]">
                    {trace.type === 'walk-through'
                      ? 'door_front'
                      : trace.type === 'instant-pass'
                      ? 'qr_code_scanner'
                      : 'how_to_reg'}
                  </span>
                </div>
                <div className="min-w-0">
                  <span className="font-bold text-xs block truncate leading-tight">
                    {trace.location}
                  </span>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span
                      className={`px-1.5 py-0.2 rounded text-[9px] font-mono font-semibold ${
                        isDark ? 'bg-cyan-950 text-cyan-300' : 'bg-surface-container text-secondary'
                      }`}
                    >
                      {trace.type}
                    </span>
                    <span
                      className={`text-[9px] font-mono ${
                        isDark ? 'text-slate-400' : 'text-on-surface-variant'
                      }`}
                    >
                      {trace.doorCode}
                    </span>
                  </div>
                </div>
              </div>
              <span
                className={`text-[10px] font-mono shrink-0 ${
                  isDark ? 'text-slate-400' : 'text-on-surface-variant'
                }`}
              >
                {trace.time}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Hardware Status */}
      <div className="grid grid-cols-2 gap-2.5">
        <div
          className={`p-3 rounded-xl border ${
            isDark ? 'bg-[#101728] border-slate-800 text-white' : 'bg-surface-container-lowest border-outline-variant/30 text-on-surface'
          }`}
        >
          <div className="flex items-center justify-between text-[11px]">
            <span className={isDark ? 'text-slate-400' : 'text-on-surface-variant'}>BLE 5.3</span>
            <span className="material-symbols-outlined text-cyan-400 text-xs">bluetooth</span>
          </div>
          <span className="text-sm font-bold block mt-1">Active</span>
          <span className="text-[9px] font-mono text-slate-400">0.02%/hr drain</span>
        </div>

        <div
          className={`p-3 rounded-xl border ${
            isDark ? 'bg-[#101728] border-slate-800 text-white' : 'bg-surface-container-lowest border-outline-variant/30 text-on-surface'
          }`}
        >
          <div className="flex items-center justify-between text-[11px]">
            <span className={isDark ? 'text-slate-400' : 'text-on-surface-variant'}>Latency</span>
            <span className="material-symbols-outlined text-emerald-400 text-xs">speed</span>
          </div>
          <span className="text-sm font-bold block mt-1">14 ms</span>
          <span className="text-[9px] font-mono text-slate-400">Mesh Handshake</span>
        </div>
      </div>

      {/* Quick SOS Trigger Banner */}
      <div className="w-full bg-gradient-to-r from-rose-950/90 via-red-950/90 to-rose-950/90 text-white rounded-2xl p-3 flex items-center justify-between shadow-lg border border-red-800/50">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-red-600 text-white flex items-center justify-center font-bold text-xs shadow-md">
            SOS
          </div>
          <div>
            <h4 className="font-bold text-xs text-white">{t.safetyTab} SOS</h4>
            <p className="text-[10px] text-red-200">{t.holdSos}</p>
          </div>
        </div>
        <button
          onClick={onOpenSos}
          className="px-3 py-1 rounded-xl bg-red-600 text-white font-bold text-xs shadow-md hover:bg-red-500 active:scale-95 transition-all cursor-pointer"
        >
          Trigger
        </button>
      </div>
    </div>
  );
};
