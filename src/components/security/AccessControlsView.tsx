import React, { useState, useRef, useEffect } from 'react';
import { PortalTelemetry, Language } from '../../types';
import { PORTAL_TELEMETRIES, TRANSLATIONS } from '../../data/mockCampusData';
import { SwitchToggle } from '../common/SwitchToggle';

interface AccessControlsViewProps {
  language?: Language;
}

export const AccessControlsView: React.FC<AccessControlsViewProps> = ({ language = 'en' }) => {
  const t = TRANSLATIONS[language];
  const [portals, setPortals] = useState<PortalTelemetry[]>(PORTAL_TELEMETRIES);
  const [isLockdownEngaged, setIsLockdownEngaged] = useState(false);
  const [lockdownHolding, setLockdownHolding] = useState(false);
  const [lockdownProgress, setLockdownProgress] = useState(0); // 0 to 100
  const [isEgressActive, setIsEgressActive] = useState(false);
  const [gateBUnlocked, setGateBUnlocked] = useState(false);
  const [gateBRemaining, setGateBRemaining] = useState(5);
  const [lab402SealEngaged, setLab402SealEngaged] = useState(true);
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [dispatchActive, setDispatchActive] = useState(false);
  const [dispatchToast, setDispatchToast] = useState<string | null>(null);

  const holdTimerRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const holdDuration = 3000;

  // 3s tactile hold for emergency lockdown
  const startLockdownHold = (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (isLockdownEngaged) return;
    setLockdownHolding(true);
    startTimeRef.current = Date.now();

    const update = () => {
      if (!startTimeRef.current) return;
      const elapsed = Date.now() - startTimeRef.current;
      const prog = Math.min((elapsed / holdDuration) * 100, 100);
      setLockdownProgress(prog);

      if (prog < 100) {
        holdTimerRef.current = requestAnimationFrame(update);
      } else {
        setIsLockdownEngaged(true);
        setLockdownHolding(false);
        if (navigator.vibrate) {
          navigator.vibrate([150, 50, 300]);
        }
      }
    };
    holdTimerRef.current = requestAnimationFrame(update);
  };

  const cancelLockdownHold = () => {
    if (isLockdownEngaged) return;
    if (holdTimerRef.current) cancelAnimationFrame(holdTimerRef.current);
    setLockdownHolding(false);
    setLockdownProgress(0);
    startTimeRef.current = null;
  };

  useEffect(() => {
    const handleUp = () => cancelLockdownHold();
    window.addEventListener('mouseup', handleUp);
    window.addEventListener('touchend', handleUp);
    return () => {
      window.removeEventListener('mouseup', handleUp);
      window.removeEventListener('touchend', handleUp);
    };
  }, [isLockdownEngaged]);

  // Pulse unlock for Gate B
  const triggerPulseUnlock = () => {
    setGateBUnlocked(true);
    setGateBRemaining(5);
    const interval = setInterval(() => {
      setGateBRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setGateBUnlocked(false);
          return 5;
        }
        return prev - 1;
      });
    }, 1000);
  };

  return (
    <div className="flex flex-col w-full gap-4 pb-28">
      {/* Network Infrastructure Diagnostics Bar */}
      <div className="w-full bg-surface-container-low border border-slate-200/60 dark:border-slate-800 rounded-3xl p-4 shadow-sm">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
            <span className="text-[11px] font-mono uppercase text-secondary font-bold tracking-wider">
              Mesh Subsystem
            </span>
          </div>
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-surface-container-highest text-on-surface text-[11px] font-mono font-semibold">
            <span className="material-symbols-outlined text-[14px] text-secondary">
              wifi_tethering
            </span>
            98.8% Node Health
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 mt-3 pt-1">
          <div className="flex items-center gap-2 bg-surface-container-lowest p-2.5 rounded-2xl border border-slate-200/40 dark:border-slate-800">
            <span className="material-symbols-outlined text-secondary text-[20px]">bluetooth</span>
            <div className="flex flex-col min-w-0">
              <span className="text-[10px] font-mono text-on-surface-variant truncate">
                BLE Beacons
              </span>
              <span className="text-xs font-bold font-mono text-on-surface">142 / 142 Active</span>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-surface-container-lowest p-2.5 rounded-2xl border border-slate-200/40 dark:border-slate-800">
            <span className="material-symbols-outlined text-secondary text-[20px]">radar</span>
            <div className="flex flex-col min-w-0">
              <span className="text-[10px] font-mono text-on-surface-variant truncate">
                UWB Anchors
              </span>
              <span className="text-xs font-bold font-mono text-on-surface">86 / 86 Synced</span>
            </div>
          </div>
        </div>
      </div>

      {/* Campus Master Overrides Card */}
      <div className="w-full bg-surface-container-lowest border border-slate-200/60 dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-4 relative overflow-hidden">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-error text-[20px]">gavel</span>
              <h3 className="font-bold text-sm text-on-surface">Campus Master Overrides</h3>
            </div>
            <p className="text-xs text-on-surface-variant mt-0.5">
              Authoritative state transitions with hardware perimeter verification
            </p>
          </div>
          <span className="text-[11px] font-mono font-bold text-secondary bg-secondary-fixed px-2.5 py-1 rounded-full uppercase tracking-wider">
            Tier 5 Auth
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          {/* 3-Second Hold Lockdown Action */}
          <div className="relative bg-error-container text-on-error-container rounded-2xl p-4 overflow-hidden select-none touch-none border border-red-200 dark:border-red-900/60 flex flex-col justify-between">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase font-bold tracking-wider text-error">
                  Tactile Interlock
                </span>
                <h4 className="font-bold text-sm text-on-error-container mt-0.5">
                  {t.masterLockdown}
                </h4>
              </div>
              <span className="material-symbols-outlined text-error text-[24px]">lock</span>
            </div>
            <p className="text-xs text-on-error-container/90 my-2 leading-snug">
              Instant solenoid drop across all turnstiles, perimeter gates, and elevators.
            </p>

            <button
              onMouseDown={startLockdownHold}
              onTouchStart={startLockdownHold}
              className={`relative w-full h-12 rounded-xl text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md overflow-hidden active:scale-[0.99] transition-transform ${
                isLockdownEngaged ? 'bg-slate-950 border-2 border-red-400' : 'bg-error'
              }`}
            >
              {/* Progress bar fill */}
              <div
                className="absolute left-0 top-0 bottom-0 bg-black/40 transition-all duration-75 pointer-events-none"
                style={{ width: `${lockdownProgress}%` }}
              />
              <span className="material-symbols-outlined text-[18px] relative z-10">touch_app</span>
              <span className="relative z-10 font-mono">
                {isLockdownEngaged
                  ? 'CAMPUS LOCKED DOWN'
                  : lockdownHolding
                  ? `Locking Down... ${((3000 - (lockdownProgress / 100) * 3000) / 1000).toFixed(1)}s`
                  : 'Hold 3s to Engage'}
              </span>
            </button>

            {isLockdownEngaged && (
              <button
                onClick={() => {
                  setIsLockdownEngaged(false);
                  setLockdownProgress(0);
                }}
                className="mt-2 text-[10px] font-mono text-center text-error font-bold underline"
              >
                Disengage Lockdown (Supervisor Reset)
              </button>
            )}
          </div>

          {/* Campus Free-Egress Evacuation Switch */}
          <div className="bg-surface-container-high rounded-2xl p-4 flex flex-col justify-between border border-slate-200/50 dark:border-slate-800">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase font-bold tracking-wider text-secondary">
                  Life Safety Protocol
                </span>
                <h4 className="font-bold text-sm text-on-surface mt-0.5">{t.freeEgress}</h4>
              </div>
              <span className="material-symbols-outlined text-secondary text-[24px]">door_open</span>
            </div>
            <p className="text-xs text-on-surface-variant my-2 leading-snug">
              Releases electromagnetic breakaways for open evacuation pathways campus-wide.
            </p>

            <button
              onClick={() => setIsEgressActive(!isEgressActive)}
              className="w-full h-12 bg-primary-container text-white rounded-xl font-bold text-xs flex items-center justify-between px-4 shadow-sm hover:opacity-95 active:scale-[0.99] transition-all"
            >
              <span className="flex items-center gap-1.5 font-mono">
                <span className="material-symbols-outlined text-[18px] text-cyan-300">
                  verified_user
                </span>
                Evac Pass-Through
              </span>
              <span
                className={`text-[10px] font-mono px-2.5 py-1 rounded-full font-bold ${
                  isEgressActive
                    ? 'bg-secondary text-white'
                    : 'bg-surface-container-highest text-on-surface'
                }`}
              >
                {isEgressActive ? 'ENGAGED' : 'STANDBY'}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Portal & Turnstile Telemetry Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-secondary text-[20px]">
              door_sliding
            </span>
            <h3 className="font-bold text-sm text-on-surface">Portal & Turnstile Telemetry</h3>
          </div>
          <span className="text-[11px] font-mono text-on-surface-variant">4 Hardware Hubs Active</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* 1. East Library Turnstile Gate B */}
          <div className="bg-surface-container-lowest border border-slate-200/60 dark:border-slate-800 rounded-3xl p-4 shadow-sm flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold tracking-wider text-secondary uppercase">
                  Sector 1 • Library Core
                </span>
                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold ${
                    gateBUnlocked ? 'bg-emerald-100 text-emerald-800' : 'bg-surface-container text-on-surface'
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      gateBUnlocked ? 'bg-emerald-500' : 'bg-secondary'
                    }`}
                  />
                  {gateBUnlocked ? `Unlocked (${gateBRemaining}s)` : 'Online & Locked'}
                </span>
              </div>
              <h4 className="font-bold text-xs text-on-surface mt-1">
                East Library Turnstile Gate B
              </h4>
              <p className="text-[11px] text-on-surface-variant mt-0.5">
                Dual-optical barrier with low-frequency UWB tap pad
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 bg-surface-container-low p-2.5 rounded-2xl">
              <div>
                <span className="text-[10px] font-mono text-on-surface-variant block">
                  Throughput Today
                </span>
                <span className="text-xs font-bold font-mono text-on-surface">1,482 passes</span>
              </div>
              <div>
                <span className="text-[10px] font-mono text-on-surface-variant block">Duty Cycle</span>
                <span className="text-xs font-bold font-mono text-secondary">Normal Flow</span>
              </div>
            </div>

            <button
              onClick={triggerPulseUnlock}
              disabled={gateBUnlocked}
              className={`w-full h-11 rounded-xl text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-xs transition-all ${
                gateBUnlocked
                  ? 'bg-emerald-600'
                  : 'bg-primary hover:bg-slate-900 active:scale-95'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">lock_clock</span>
              <span>
                {gateBUnlocked
                  ? `Hold to Unlock (${gateBRemaining}s window active)`
                  : 'Hold to Unlock (5s Pulse)'}
              </span>
            </button>
          </div>

          {/* 2. Sci & Eng Lab 402 Magnetic Door */}
          <div className="bg-surface-container-lowest border border-slate-200/60 dark:border-slate-800 rounded-3xl p-4 shadow-sm flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold tracking-wider text-error uppercase">
                  Biohazard / Research Tier 4
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-error-container text-on-error-container text-[10px] font-mono font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-error" />
                  Restrictive Access
                </span>
              </div>
              <h4 className="font-bold text-xs text-on-surface mt-1">
                Sci & Eng Lab 402 Magnetic Door
              </h4>
              <p className="text-[11px] text-on-surface-variant mt-0.5">
                1,200 lb electromagnetic shear lock with dual-biometric scanner
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 bg-surface-container-low p-2.5 rounded-2xl">
              <div>
                <span className="text-[10px] font-mono text-on-surface-variant block">
                  NFC / UWB Health
                </span>
                <span className="text-xs font-bold font-mono text-on-surface">Optimal (99%)</span>
              </div>
              <div>
                <span className="text-[10px] font-mono text-on-surface-variant block">
                  Holding Force
                </span>
                <span className="text-xs font-bold font-mono text-on-surface">5.3 kN Normal</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-xs font-medium text-on-surface">Emergency Magnetic Seal</span>
              <SwitchToggle
                checked={lab402SealEngaged}
                onChange={() => setLab402SealEngaged(!lab402SealEngaged)}
                ariaLabel="Emergency Magnetic Seal"
              />
            </div>
          </div>

          {/* 3. Student Union North Automated Door */}
          <div className="bg-surface-container-lowest border border-slate-200/60 dark:border-slate-800 rounded-3xl p-4 shadow-sm flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold tracking-wider text-secondary uppercase">
                  Campus Public Spine
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed text-[10px] font-mono font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-ping" />
                  Auto-Pass Active
                </span>
              </div>
              <h4 className="font-bold text-xs text-on-surface mt-1">
                Student Union North Automated Door
              </h4>
              <p className="text-[11px] text-on-surface-variant mt-0.5">
                Telescopic sliding glazed entryway with infrared curtain safety
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 bg-surface-container-low p-2.5 rounded-2xl">
              <div>
                <span className="text-[10px] font-mono text-on-surface-variant block">
                  Optical Curtain
                </span>
                <span className="text-xs font-bold font-mono text-on-surface">
                  Clear • 0 Obstruct
                </span>
              </div>
              <div>
                <span className="text-[10px] font-mono text-on-surface-variant block">
                  Hourly Flux
                </span>
                <span className="text-xs font-bold font-mono text-secondary">384 arrivals/hr</span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => alert('Student Union North Door held OPEN')}
                className="flex-1 h-10 bg-surface-container-high text-on-surface rounded-xl text-xs font-semibold hover:bg-surface-container-highest transition-colors flex items-center justify-center gap-1"
              >
                <span className="material-symbols-outlined text-[16px]">lock</span>
                <span>Hold Open</span>
              </button>
              <button
                onClick={() => alert('Door cycle initiated')}
                className="flex-1 h-10 bg-surface-container text-on-surface rounded-xl text-xs font-semibold hover:bg-surface-container-high transition-colors flex items-center justify-center gap-1"
              >
                <span className="material-symbols-outlined text-[16px]">refresh</span>
                <span>Cycle</span>
              </button>
            </div>
          </div>

          {/* 4. Sports Complex Turnstiles 1-4 */}
          <div className="bg-surface-container-lowest border border-slate-200/60 dark:border-slate-800 rounded-3xl p-4 shadow-sm flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold tracking-wider text-secondary uppercase">
                  Athletic Quad Hub
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-surface-container text-on-surface text-[10px] font-mono font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
                  Balanced Flow
                </span>
              </div>
              <h4 className="font-bold text-xs text-on-surface mt-1">
                Sports Complex Turnstiles 1–4
              </h4>
              <p className="text-[11px] text-on-surface-variant mt-0.5">
                Quad rotor bank linked with digital student NFC sports passes
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 bg-surface-container-low p-2.5 rounded-2xl">
              <div>
                <span className="text-[10px] font-mono text-on-surface-variant block">
                  Gateway Latency
                </span>
                <span className="text-xs font-bold font-mono text-on-surface">14 ms avg</span>
              </div>
              <div>
                <span className="text-[10px] font-mono text-on-surface-variant block">
                  Trip Rejections
                </span>
                <span className="text-xs font-bold font-mono text-on-surface">0.12% Daily</span>
              </div>
            </div>

            <button
              onClick={() => setDispatchToast('Ingress lanes rebalanced: Lanes 1 & 2 set to student rush mode')}
              className="w-full h-10 bg-surface-container-high text-on-surface rounded-xl text-xs font-semibold hover:bg-surface-container-highest transition-colors flex items-center justify-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[18px]">tune</span>
              <span>Rebalance Ingress Lanes</span>
            </button>
          </div>
        </div>
      </div>

      {/* Access Exceptions & Badge Flags */}
      <div className="w-full bg-surface-container-lowest border border-slate-200/60 dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-error text-[20px]">fmd_bad</span>
            <h3 className="font-bold text-sm text-on-surface">Access Exceptions & Visual Flags</h3>
          </div>
          <span className="text-[10px] font-mono font-bold bg-error-container text-on-error-container px-2.5 py-0.5 rounded-full">
            2 Critical Alerts
          </span>
        </div>

        {/* Exception 1: Unauthorized Badge Scan */}
        <div className="bg-surface-container-low rounded-2xl p-3.5 space-y-2 border border-slate-200/40 dark:border-slate-800">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-start gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-error-container text-on-error-container flex items-center justify-center shrink-0 mt-0.5">
                <span className="material-symbols-outlined text-[20px]">no_accounts</span>
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="font-bold text-xs text-on-surface">Unauthorized Badge Scan</h4>
                  <span className="text-[10px] font-mono bg-error text-white px-1.5 py-0.2 rounded font-bold">
                    Tier 5 Required
                  </span>
                </div>
                <p className="text-[11px] text-on-surface-variant mt-0.5 leading-snug">
                  Central Server Vault Room B • Keycard UID #8982-FX
                </p>
              </div>
            </div>
            <span className="text-[10px] font-mono text-on-surface-variant shrink-0">12 min ago</span>
          </div>

          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-1.5 text-[11px] text-on-surface-variant font-mono">
              <span className="w-2 h-2 rounded-full bg-error" />
              <span>Badge status: Temporarily Suspended</span>
            </div>
            <button
              onClick={() => setActiveModal('unauth-incident')}
              className="px-3 py-1 bg-primary text-white rounded-xl text-xs font-semibold hover:bg-slate-900 active:scale-95"
            >
              Review Incident
            </button>
          </div>
        </div>

        {/* Exception 2: Tailgating Optical Alert */}
        <div className="bg-surface-container-low rounded-2xl p-3.5 space-y-2 border border-slate-200/40 dark:border-slate-800">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-start gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-surface-container-highest text-secondary flex items-center justify-center shrink-0 mt-0.5">
                <span className="material-symbols-outlined text-[20px]">group_remove</span>
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="font-bold text-xs text-on-surface">Tailgating Optical Alert</h4>
                  <span className="text-[10px] font-mono bg-secondary-fixed text-on-secondary-fixed px-1.5 py-0.2 rounded font-bold">
                    Resolved
                  </span>
                </div>
                <p className="text-[11px] text-on-surface-variant mt-0.5 leading-snug">
                  North Entrance Turnstile 2 • Secondary silhouette matched
                </p>
              </div>
            </div>
            <span className="text-[10px] font-mono text-on-surface-variant shrink-0">34 min ago</span>
          </div>

          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-1.5 text-[11px] text-on-surface-variant font-mono">
              <span className="material-symbols-outlined text-secondary text-[14px]">verified</span>
              <span>Cleared by Officer Ramirez (Desk 01)</span>
            </div>
            <button
              onClick={() => setActiveModal('tailgate-log')}
              className="px-3 py-1 bg-surface-container-highest text-on-surface rounded-xl text-xs font-semibold hover:bg-surface-container"
            >
              Audit Log
            </button>
          </div>
        </div>
      </div>

      {/* Unblockable Security Dispatch Banner when active */}
      {dispatchActive && (
        <div className="w-full bg-error text-white rounded-3xl p-4 shadow-lg flex items-center justify-between gap-3 animate-in fade-in duration-200">
          <div className="flex items-center gap-3 min-w-0">
            <span className="material-symbols-outlined text-white text-[24px] animate-pulse" style={{ fontVariationSettings: "'FILL' 1" }}>
              local_police
            </span>
            <div className="min-w-0">
              <span className="text-[10px] font-mono uppercase tracking-wider text-white/80 font-semibold block">
                Fail-Safe Priority Override (800MHz Radio)
              </span>
              <span className="text-xs font-bold truncate block">
                Patrol Unit #07 Dispatched • Officer Vance En Route • GPS Locked
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setActiveModal('security-dispatch')}
              className="px-3 py-1.5 bg-white text-error rounded-xl text-xs font-bold shadow hover:bg-slate-100"
            >
              Dispatch Details
            </button>
            <button
              onClick={() => setDispatchActive(false)}
              className="px-2.5 py-1.5 bg-white/20 hover:bg-white/30 text-white rounded-xl text-xs font-semibold"
            >
              Stand Down
            </button>
          </div>
        </div>
      )}

      {/* Controller Firmware Bar */}
      <div className="w-full bg-surface-container-high rounded-3xl p-4 flex flex-col gap-3 border border-slate-200/50 dark:border-slate-800 shadow-sm">
        {/* Top Header Row with Icon, Title, and Badge */}
        <div className="flex items-start gap-3 min-w-0">
          <div className="w-9 h-9 rounded-2xl bg-secondary flex items-center justify-center text-white shrink-0 mt-0.5 shadow-xs">
            <span className="material-symbols-outlined text-[18px]">security_update_good</span>
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <span className="text-xs font-bold text-on-surface">
                Access Controller Firmware 4.19
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 text-[10px] font-mono font-bold whitespace-nowrap border border-emerald-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Unblockable Channel Active
              </span>
            </div>
            <p className="text-[11px] text-on-surface-variant font-mono mt-1 leading-relaxed">
              Dual redundant hardware link: Hardware override bypasses firmware lockouts
            </p>
          </div>
        </div>

        {/* Action Buttons Row: Stacks cleanly, 100% contained within card, no overflow */}
        <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-200/40 dark:border-slate-800/60">
          <button
            onClick={() => {
              setDispatchToast('Firmware telemetry log generated: access_audit_v419.csv');
              setTimeout(() => setDispatchToast(null), 3000);
            }}
            className="w-full py-2.5 px-3 bg-surface-container-lowest hover:bg-surface text-on-surface rounded-xl text-xs font-semibold shadow-xs border border-slate-200 dark:border-slate-700 flex items-center justify-center gap-1.5 active:scale-98 transition-all"
          >
            <span className="material-symbols-outlined text-[16px]">file_download</span>
            <span className="truncate">{t.exportLog}</span>
          </button>
          <button
            onClick={() => {
              setDispatchActive(true);
              setActiveModal('security-dispatch');
            }}
            className="w-full py-2.5 px-3 bg-error hover:bg-error/90 text-white rounded-xl text-xs font-bold shadow-md flex items-center justify-center gap-1.5 active:scale-98 transition-all"
          >
            <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              local_police
            </span>
            <span className="truncate">{t.securityDispatch}</span>
          </button>
        </div>
      </div>

      {/* Toast Feedback */}
      {dispatchToast && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white px-4 py-2 rounded-2xl shadow-xl text-xs font-mono flex items-center gap-2 animate-in fade-in duration-150">
          <span className="material-symbols-outlined text-emerald-400 text-[18px]">check_circle</span>
          <span>{dispatchToast}</span>
        </div>
      )}

      {/* Unblockable Security Dispatch Modal */}
      {activeModal === 'security-dispatch' && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-3xl p-6 max-w-sm w-full shadow-2xl space-y-4 border border-slate-200/60 dark:border-slate-800">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-sm text-error flex items-center gap-2">
                <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>local_police</span>
                <span>Tactical Security Dispatch</span>
              </h3>
              <button
                onClick={() => setActiveModal(null)}
                className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-on-surface"
              >
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            </div>

            <div className="p-3.5 bg-error-container/20 rounded-2xl space-y-2 border border-error/30">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-error font-bold uppercase tracking-wider">
                  Hardware Priority Link
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] font-mono text-emerald-600 font-bold">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  Signal 100%
                </span>
              </div>
              <p className="text-xs text-on-surface leading-relaxed">
                Emergency dispatch command transmitted via direct 800MHz tactical radio. Guaranteed transmission regardless of firmware cycle or lockdown.
              </p>
              <div className="p-2 bg-surface-container-low rounded-xl text-xs font-mono space-y-1">
                <div>• Unit: Patrol Car #07 (Officer D. Vance)</div>
                <div>• Sector: Academic Core / Turing Quad</div>
                <div>• Response Mode: Code 2 Priority (ETA 90s)</div>
              </div>
            </div>

            <div className="flex flex-col gap-2 pt-1">
              <a
                href="tel:999"
                className="w-full py-2.5 rounded-xl bg-error text-white font-bold text-xs flex items-center justify-center gap-2 shadow"
              >
                <span className="material-symbols-outlined text-[18px]">call</span>
                <span>Escalate to 999 National Emergency</span>
              </a>
              <button
                onClick={() => setActiveModal(null)}
                className="w-full py-2 rounded-xl bg-surface-container text-xs text-on-surface font-semibold hover:bg-surface-container-high"
              >
                Keep Active &amp; Dismiss
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Incident Review Modal */}
      {activeModal === 'unauth-incident' && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-sm w-full shadow-2xl space-y-4">
            <h3 className="font-bold text-sm text-on-surface flex items-center gap-2 text-error">
              <span className="material-symbols-outlined">warning</span>
              <span>Incident Review: Keycard #8982-FX</span>
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Badge scanned at Central Server Vault at 14:02 UTC. Holder possesses Tier 3, but Vault
              requires Tier 5 supervisor escort.
            </p>
            <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl text-xs font-mono">
              STATUS: Card Locked for 24h
            </div>
            <button
              onClick={() => setActiveModal(null)}
              className="w-full py-2.5 rounded-xl bg-secondary text-white text-xs font-semibold"
            >
              Acknowledge & Close
            </button>
          </div>
        </div>
      )}

      {/* Tailgate Modal */}
      {activeModal === 'tailgate-log' && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-sm w-full shadow-2xl space-y-4">
            <h3 className="font-bold text-sm text-on-surface">Tailgate Optical Event #9921</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Two silhouettes detected in turnstile lane 2 at 13:40 UTC. Verified as student carrying
              large robotics equipment bag.
            </p>
            <button
              onClick={() => setActiveModal(null)}
              className="w-full py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-semibold"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
