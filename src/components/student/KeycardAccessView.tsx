import React, { useState, useEffect } from 'react';
import { StudentProfile, NearbyBeacon, AccessTrace, Language } from '../../types';
import { TRANSLATIONS } from '../../data/mockCampusData';

interface KeycardAccessViewProps {
  profile: StudentProfile;
  beacons: NearbyBeacon[];
  traces: AccessTrace[];
  currentDistance: number;
  onOpenSos: () => void;
  language: Language;
}

export const KeycardAccessView: React.FC<KeycardAccessViewProps> = ({
  profile,
  beacons,
  traces,
  currentDistance,
  onOpenSos,
  language,
}) => {
  const [cardTheme, setCardTheme] = useState<'obsidian' | 'light'>('obsidian');
  const [showQrModal, setShowQrModal] = useState(false);
  const [clockSec, setClockSec] = useState('10:27:48.6');
  const [autoSync, setAutoSync] = useState(true);
  const [qrToken, setQrToken] = useState('UWB-8841-SEC-9921');
  const t = TRANSLATIONS[language];

  // High precision terminal clock for fraud prevention (updates ms)
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

  const isDark = cardTheme === 'obsidian';

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
                {language === 'zh' ? '实时遥测信号 • 在线' : 'Telemetry Stream'}
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
              Wi-Fi 6E &amp; Campus 5G Ultra • -48 dBm
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
            title="Toggle automated sensor synchronization"
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                autoSync ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'
              }`}
            />
            <span>{language === 'zh' ? '自动同步' : 'Auto-Sync'}</span>
          </button>

          <button
            onClick={() => setCardTheme(isDark ? 'light' : 'obsidian')}
            className={`w-7 h-7 rounded-full flex items-center justify-center text-xs transition-colors cursor-pointer ${
              isDark
                ? 'bg-slate-800 text-cyan-300 hover:bg-slate-700'
                : 'bg-surface-container text-on-surface-variant hover:text-on-surface'
            }`}
            title={isDark ? 'Switch to Daylight Theme' : 'Switch to Obsidian Theme'}
          >
            <span className="material-symbols-outlined text-[15px]">
              {isDark ? 'light_mode' : 'dark_mode'}
            </span>
          </button>
        </div>
      </div>

      {/* Holographic Obsidian / Smart Keycard */}
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
                {language === 'zh' ? '智能学生门禁卡 • SMART KEYCARD' : 'OBSIDIAN KEYCARD'}
              </span>
              <h2 className="text-base font-bold tracking-tight leading-tight">
                {language === 'zh' ? '都市联合大学 Metro University' : 'Metro University'}
              </h2>
            </div>
          </div>

          {/* NFC Primed status with Live running clock */}
          <div className="text-right flex flex-col items-end">
            <span
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-mono font-semibold ${
                isDark
                  ? 'bg-indigo-950/90 text-indigo-300 border border-indigo-700/60'
                  : 'bg-indigo-100 text-indigo-700'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              {language === 'zh' ? 'NFC 已就绪' : 'NFC Primed'}
            </span>
            <span
              className={`text-[9px] font-mono mt-0.5 ${
                isDark ? 'text-slate-400' : 'text-slate-500'
              }`}
            >
              {clockSec} SEC
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
              {language === 'zh' ? `${profile.name} (亚历克斯·摩根)` : profile.name}
            </h3>
            <p
              className={`text-xs truncate mt-0.5 ${
                isDark ? 'text-slate-300' : 'text-slate-600'
              }`}
            >
              {language === 'zh' ? '计算机与控制工程学院' : profile.school}
            </p>
            <div className="flex items-center gap-2 mt-1.5 flex-wrap">
              <span
                className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-semibold ${
                  isDark
                    ? 'bg-indigo-900/60 text-indigo-300 border border-indigo-700/40'
                    : 'bg-indigo-100 text-indigo-700'
                }`}
              >
                {language === 'zh' ? `学号: ${profile.id}` : profile.id}
              </span>
              <span
                className={`text-[10px] font-mono ${
                  isDark ? 'text-cyan-400 font-medium' : 'text-slate-700 font-semibold'
                }`}
              >
                {language === 'zh' ? '4级通行权限' : profile.tier}
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
          <div className="flex items-center gap-2">
            <div className="flex items-end gap-0.5 h-3.5 text-cyan-400">
              <span className="w-0.5 h-2.5 bg-cyan-400 animate-pulse" />
              <span className="w-0.5 h-3.5 bg-cyan-400 animate-pulse delay-75" />
              <span className="w-0.5 h-2 bg-cyan-400 animate-pulse delay-150" />
              <span className="w-0.5 h-3 bg-cyan-400 animate-pulse delay-100" />
            </div>
            <span
              className={`text-[10px] font-mono ${
                isDark ? 'text-slate-300' : 'text-slate-600'
              }`}
            >
              {language === 'zh' ? 'UWB 超宽带自动广播' : 'UWB Auto-Broadcast'}
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
            <span>{language === 'zh' ? '出示通行码' : 'Show Pass'}</span>
          </button>
        </div>
      </div>

      {/* QR Code / Digital Barcode Modal */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 max-w-xs w-full shadow-2xl text-center space-y-4 border border-slate-200 dark:border-slate-800">
            <div className="flex justify-between items-center">
              <span className="font-bold text-xs text-slate-900 dark:text-white uppercase tracking-wider">
                Cryptographic Access Pass
              </span>
              <button
                onClick={() => setShowQrModal(false)}
                className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 flex items-center justify-center cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            </div>

            {/* Simulated 2D Matrix / QR Code */}
            <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center">
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
              <span className="text-[10px] text-slate-500 font-mono">
                Auto-rotates every 30s • Hardware Signed
              </span>
            </div>

            <p className="text-[11px] text-slate-600 dark:text-slate-400">
              Hold within 5cm of optical reader or NFC turnstile antenna.
            </p>

            <button
              onClick={() => setShowQrModal(false)}
              className="w-full py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold cursor-pointer"
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
                isDark ? 'bg-blue-900/60 text-cyan-400' : 'bg-secondary-fixed text-secondary'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">radar</span>
            </div>
            <h3 className="font-bold text-sm">
              {language === 'zh' ? '近场感应雷达 Proximity Radar' : t.proximityRadar}
            </h3>
          </div>
          <span
            className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
              isDark
                ? 'text-cyan-400 bg-cyan-950/80 border border-cyan-800/50'
                : 'text-secondary bg-surface-container-high'
            }`}
          >
            {language === 'zh' ? '自动识别范围: <3.0米' : '• Auto-Range: <3.0m'}
          </span>
        </div>

        {/* Circular Radar HUD Simulation */}
        <div
          className={`relative w-full h-46 rounded-2xl overflow-hidden flex items-center justify-center border ${
            isDark
              ? 'bg-[#090f1d] border-slate-800/90'
              : 'bg-surface-container-low border-slate-200'
          }`}
        >
          {/* Concentric distance rings */}
          <div className={`absolute w-44 h-44 rounded-full border ${isDark ? 'border-blue-500/15' : 'border-secondary/20'}`} />
          <div className={`absolute w-32 h-32 rounded-full border ${isDark ? 'border-blue-500/25' : 'border-secondary/30'}`} />
          <div className={`absolute w-20 h-20 rounded-full border ${isDark ? 'border-blue-500/35' : 'border-secondary/40'}`} />
          <div className={`absolute w-8 h-8 rounded-full border ${isDark ? 'border-blue-500/45' : 'border-secondary/50'}`} />

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
              top: `${Math.min(75, Math.max(22, 50 - currentDistance * 3))}%`,
              right: `${Math.min(75, Math.max(15, 20 + currentDistance * 3))}%`,
            }}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                currentDistance <= 1.5 ? 'bg-white' : 'bg-cyan-400 animate-ping'
              }`}
            />
            <span className="text-[11px] font-mono font-bold">
              {language === 'zh'
                ? `402号实验室 (${currentDistance.toFixed(1)}米)`
                : `${nearestBeacon.name} (${currentDistance.toFixed(1)}m)`}
            </span>
          </div>

          {/* Secondary Target: Turnstile B */}
          <div
            className={`absolute bottom-4 left-4 z-10 flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-mono ${
              isDark
                ? 'bg-[#142038]/90 text-slate-300 border border-slate-700/50'
                : 'bg-surface-container/80 text-on-surface-variant'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
            <span>{language === 'zh' ? 'B区闸机通道 (4.5米)' : 'Turnstile B (4.5m)'}</span>
          </div>

          {/* Footnote telemetry */}
          <div className="absolute bottom-2 left-4 text-[9px] font-mono text-emerald-400">
            • {language === 'zh' ? '已进入感应区域' : 'Within Entry Field'}
          </div>
          <div className="absolute bottom-2 right-4 text-[9px] font-mono text-slate-400">
            {language === 'zh' ? '超宽带 7.9 GHz 频段' : 'Ultra-Wideband 7.9 GHz'}
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
                ? language === 'zh'
                  ? '无感近场通行已解锁: 402号实验室'
                  : `Hands-free proximity pass unlocked for ${nearestBeacon.name}`
                : language === 'zh'
                ? '接近至1.5米内自动无感解锁开门'
                : 'Approach within 1.5m for automated hands-free unlock'}
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
                isDark ? 'bg-blue-900/60 text-cyan-400' : 'bg-secondary-fixed text-secondary'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">history</span>
            </div>
            <h3 className="font-bold text-sm">
              {language === 'zh' ? '无感通行记录 Access' : 'Seamless Access Traces'}
            </h3>
          </div>
          <span
            className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
              isDark
                ? 'text-cyan-400 bg-cyan-950/80 border border-cyan-800/50'
                : 'text-secondary bg-surface-container-high'
            }`}
          >
            {language === 'zh' ? '实时感应日志' : 'Live Sensor Log'}
          </span>
        </div>

        {/* Background Auto-Pass Notice */}
        <div
          className={`p-2.5 rounded-xl text-xs flex items-center justify-between ${
            isDark
              ? 'bg-[#0d1424] text-slate-300 border border-slate-800'
              : 'bg-surface-container-low text-on-surface-variant'
          }`}
        >
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[16px] text-cyan-400">sensors</span>
            <span className="text-[11px]">
              {language === 'zh'
                ? '后台无感通行中 • 靠近门禁时 UWB 雷达自动完成近场身份校验并开门'
                : 'Background Auto-Pass Active • Portals unlock hands-free via UWB radar'}
            </span>
          </div>
          <span className="material-symbols-outlined text-[15px] text-cyan-400 shrink-0">info</span>
        </div>

        {/* Trace List */}
        <div className="space-y-2 pt-1">
          <div className="text-[9px] font-mono uppercase tracking-wider text-slate-400 px-1 flex justify-between">
            <span>{language === 'zh' ? '今日通行' : "TODAY'S TRACES"}</span>
            <span className="text-cyan-400">
              {language === 'zh' ? '3 次记录' : `${traces.filter((t) => t.isToday).length} ENTRIES`}
            </span>
          </div>

          {traces.map((trace) => (
            <div
              key={trace.id}
              className={`p-2.5 rounded-xl transition-colors flex items-start justify-between gap-2 ${
                isDark
                  ? 'bg-[#0d1424] hover:bg-[#141f36] border border-slate-800/80'
                  : 'bg-surface-container-low/70 hover:bg-surface-container'
              }`}
            >
              <div className="flex items-start gap-2.5 min-w-0">
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                    isDark ? 'bg-slate-800 text-cyan-400' : 'bg-surface-container text-secondary'
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px]">
                    {trace.type === 'walk-through'
                      ? 'door_front'
                      : trace.type === 'instant-pass'
                      ? 'qr_code_scanner'
                      : trace.type === 'auto-clearance'
                      ? 'how_to_reg'
                      : 'domain_verification'}
                  </span>
                </div>
                <div className="min-w-0">
                  <span className="font-bold text-xs block truncate leading-tight">
                    {trace.location}
                  </span>
                  <p
                    className={`text-[10px] leading-tight mt-0.5 ${
                      isDark ? 'text-slate-400' : 'text-on-surface-variant'
                    }`}
                  >
                    {trace.subLocation}
                  </p>
                  <div className="flex items-center gap-2 mt-1.5">
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

        <div
          className={`pt-1 flex items-center justify-between text-[9px] font-mono ${
            isDark ? 'text-slate-500' : 'text-on-surface-variant'
          }`}
        >
          <span>{language === 'zh' ? '• 由后台高精度测距传感器安全记录' : '• Logged via Background Distance Sensor'}</span>
          <span>{language === 'zh' ? '14天隐私自动清除保障' : 'Auto-Purged after 14 days'}</span>
        </div>
      </div>

      {/* Access Hardware Status */}
      <div
        className={`w-full rounded-2xl p-4 shadow-xs border transition-colors space-y-3 ${
          isDark
            ? 'bg-[#101728] border-slate-800 text-white'
            : 'bg-surface-container-lowest border-outline-variant/30 text-on-surface'
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-cyan-400 text-[18px]">cell_tower</span>
            <h3 className="font-bold text-sm">
              {language === 'zh' ? '门禁硬件工作状态' : 'Access Hardware Status'}
            </h3>
          </div>
          <span className="text-[10px] font-mono text-emerald-400 font-semibold">
            • {language === 'zh' ? '网络极佳 • Optimal' : 'Mesh Optimal'}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          <div
            className={`p-3 rounded-xl border ${
              isDark ? 'bg-[#0d1424] border-slate-800' : 'bg-surface-container-low border-slate-200'
            }`}
          >
            <div className="flex items-center justify-between text-[11px]">
              <span className={isDark ? 'text-slate-400' : 'text-on-surface-variant'}>
                {language === 'zh' ? '蓝牙低功耗 5.3' : 'Beacon BLE 5.3'}
              </span>
              <span className="material-symbols-outlined text-cyan-400 text-xs">bluetooth</span>
            </div>
            <span className="text-sm font-bold block mt-1">
              {language === 'zh' ? '运行中 (Active)' : 'Active'}
            </span>
            <span className="text-[9px] font-mono text-slate-400">
              {language === 'zh' ? '0.02% 电量消耗/小时' : '0.02% batt/hr bypass'}
            </span>
          </div>

          <div
            className={`p-3 rounded-xl border ${
              isDark ? 'bg-[#0d1424] border-slate-800' : 'bg-surface-container-low border-slate-200'
            }`}
          >
            <div className="flex items-center justify-between text-[11px]">
              <span className={isDark ? 'text-slate-400' : 'text-on-surface-variant'}>
                {language === 'zh' ? '超低延迟' : 'Latency'}
              </span>
              <span className="material-symbols-outlined text-emerald-400 text-xs">speed</span>
            </div>
            <span className="text-sm font-bold block mt-1">
              {language === 'zh' ? '14 毫秒' : '14 ms'}
            </span>
            <span className="text-[9px] font-mono text-slate-400">
              {language === 'zh' ? '快速本地握手响应' : 'Fast Local Handshake'}
            </span>
          </div>
        </div>
      </div>

      {/* Quick SOS Trigger Banner (Matching Image_11 & Image_13 bottom) */}
      <div className="w-full bg-gradient-to-r from-rose-950/90 via-red-950/90 to-rose-950/90 text-white rounded-2xl p-3.5 flex items-center justify-between shadow-lg border border-red-800/50">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-red-600 text-white flex items-center justify-center font-bold text-xs shadow-md">
            SOS
          </div>
          <div>
            <h4 className="font-bold text-xs text-white">
              {language === 'zh' ? '校园安全紧急 SOS' : 'Campus Safety SOS'}
            </h4>
            <p className="text-[10px] text-red-200">
              {language === 'zh' ? '长按发起求助 • 触发紧急警报' : 'Press & hold for emergency beacon'}
            </p>
          </div>
        </div>
        <button
          onClick={onOpenSos}
          className="px-3.5 py-1.5 rounded-xl bg-red-600 text-white font-bold text-xs shadow-md hover:bg-red-500 active:scale-95 transition-all cursor-pointer"
        >
          {language === 'zh' ? '长按发起' : 'Trigger'}
        </button>
      </div>
    </div>
  );
};
