import React, { useState, useEffect } from 'react';
import { Language } from '../../types';
import { TRANSLATIONS } from '../../data/mockCampusData';

interface SecurityPortalLoginProps {
  onAuthenticateSuccess: () => void;
  language?: Language;
}

export const SecurityPortalLogin: React.FC<SecurityPortalLoginProps> = ({
  onAuthenticateSuccess,
  language = 'en',
}) => {
  const t = TRANSLATIONS[language];
  const [authMode, setAuthMode] = useState<'biometric' | 'pin'>('biometric');
  const [isFaceMode, setIsFaceMode] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [scanStatus, setScanStatus] = useState('Touch to Scan');
  const [utcTime, setUtcTime] = useState('00:00:00 UTC');
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [pinDigits, setPinDigits] = useState(['8', '4', '1', '', '', '']);

  useEffect(() => {
    const clockTimer = setInterval(() => {
      const now = new Date();
      const hrs = String(now.getUTCHours()).padStart(2, '0');
      const mins = String(now.getUTCMinutes()).padStart(2, '0');
      const secs = String(now.getUTCSeconds()).padStart(2, '0');
      setUtcTime(`${hrs}:${mins}:${secs} UTC`);
    }, 1000);
    return () => clearInterval(clockTimer);
  }, []);

  const triggerScan = () => {
    if (isScanning) return;
    setIsScanning(true);
    setScanStatus('Verifying...');

    setTimeout(() => {
      setScanStatus('Authorized');
      setAlertMessage('Biometric cryptographic hash matches Enclave: Tier 4 Confirmed.');
      setTimeout(() => {
        onAuthenticateSuccess();
      }, 700);
    }, 1100);
  };

  const handlePinAuth = () => {
    setAlertMessage('Validating RSA-SecurID sync packet with Central Operations...');
    setTimeout(() => {
      setAlertMessage('Token Accepted. Dispatch terminal unlock ready.');
      setTimeout(() => {
        onAuthenticateSuccess();
      }, 600);
    }, 800);
  };

  return (
    <div className="flex flex-col w-full pb-24 gap-4">
      {/* Top Telemetry & Status Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
          <span className="text-[10px] font-mono uppercase tracking-wider text-on-surface-variant font-medium">
            NODE: SEC-HUB-EAST // 04
          </span>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-surface-container-high rounded-full">
          <span className="material-symbols-outlined text-secondary text-[13px]">lock_clock</span>
          <span className="text-[11px] font-mono font-semibold text-on-surface">{utcTime}</span>
        </div>
      </div>

      {/* Shield Emblem & Header */}
      <div className="flex flex-col items-center text-center mt-2">
        <div className="relative flex items-center justify-center w-20 h-20 mb-3">
          <div className="absolute inset-0 rounded-full bg-secondary-fixed opacity-40 blur-md animate-pulse" />
          <div className="relative flex items-center justify-center w-16 h-16 rounded-2xl bg-primary-container text-white shadow-md">
            <span className="material-symbols-outlined text-secondary-fixed text-3xl">
              shield_person
            </span>
            <span className="material-symbols-outlined absolute -top-1 -right-1 text-tertiary-fixed text-base">
              verified
            </span>
          </div>
        </div>

        <div className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full bg-surface-container-highest mb-2">
          <span className="material-symbols-outlined text-error text-xs">security</span>
          <span className="text-[10px] font-mono font-bold text-on-surface uppercase tracking-wider">
            Tier 3+ Clearance Required
          </span>
        </div>

        <h1 className="text-xl font-bold text-on-surface tracking-tight">
          {t.securityPortal}
        </h1>
        <p className="text-xs text-on-surface-variant mt-1 max-w-xs">
          Uni Connect Central Sentinel · High-Security Administrative Gateway
        </p>
      </div>

      {/* Main Security Authentication Box */}
      <div className="p-5 rounded-3xl bg-surface-container-low border border-slate-200/60 dark:border-slate-800 shadow-sm flex flex-col gap-4">
        {/* Mode Switcher */}
        <div className="grid grid-cols-2 p-1 bg-surface-container rounded-2xl gap-1">
          <button
            onClick={() => setAuthMode('biometric')}
            className={`py-2 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
              authMode === 'biometric'
                ? 'bg-surface text-on-surface shadow-xs'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-base">fingerprint</span>
            <span>Biometrics</span>
          </button>

          <button
            onClick={() => setAuthMode('pin')}
            className={`py-2 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
              authMode === 'pin'
                ? 'bg-surface text-on-surface shadow-xs'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-base">pin</span>
            <span>Credential PIN</span>
          </button>
        </div>

        {/* Biometric Interactive View */}
        {authMode === 'biometric' ? (
          <div className="flex flex-col items-center py-2">
            <div className="relative w-44 h-44 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full bg-secondary-fixed opacity-30 animate-ping" />
              <div className="absolute inset-3 rounded-full bg-surface-container-highest animate-pulse" />

              <button
                onClick={triggerScan}
                className={`relative z-10 w-28 h-28 rounded-full bg-primary-container text-white flex flex-col items-center justify-center shadow-xl active:scale-95 transition-all group cursor-pointer ${
                  isScanning ? 'ring-4 ring-cyan-400' : ''
                }`}
              >
                <span className="material-symbols-outlined text-4xl text-secondary-fixed group-hover:scale-110 transition-transform">
                  {scanStatus === 'Authorized'
                    ? 'check_circle'
                    : isFaceMode
                    ? 'face'
                    : 'fingerprint'}
                </span>
                <span className="text-[11px] font-mono mt-1 text-on-primary-container font-semibold">
                  {scanStatus}
                </span>
              </button>

              {/* Dynamic Scanning Line */}
              {isScanning && (
                <div className="absolute w-28 h-1 bg-cyan-400 rounded-full animate-bounce shadow-lg shadow-cyan-400 pointer-events-none" />
              )}
            </div>

            <div className="mt-4 flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-container-high text-on-surface-variant text-[11px] font-mono">
              <span className="material-symbols-outlined text-secondary text-sm">memory</span>
              <span>256-bit Hardware Enclave • TLS 1.3</span>
            </div>

            <button
              onClick={() => {
                setIsFaceMode(!isFaceMode);
                setScanStatus(isFaceMode ? 'Touch to Scan' : 'Look at Sensor');
              }}
              className="mt-3 inline-flex items-center gap-1 text-secondary text-xs font-semibold hover:underline"
            >
              <span className="material-symbols-outlined text-sm">
                {isFaceMode ? 'fingerprint' : 'face'}
              </span>
              <span>{isFaceMode ? 'Switch to TouchID Sensor' : 'Switch to Sentinel FaceID'}</span>
            </button>
          </div>
        ) : (
          /* Credential PIN View */
          <div className="flex flex-col gap-3 py-1">
            <div>
              <label className="block text-[10px] font-mono font-semibold uppercase tracking-wider text-on-surface-variant mb-1">
                University Admin Identity
              </label>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-3 text-on-surface-variant text-base">
                  badge
                </span>
                <input
                  type="text"
                  defaultValue="ADM-8821-SEC"
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-surface text-on-surface font-mono text-xs border border-slate-200 dark:border-slate-800"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-[10px] font-mono font-semibold uppercase tracking-wider text-on-surface-variant">
                  Hardware Enclave Token PIN
                </label>
                <span className="text-[10px] font-mono text-secondary font-bold">RSA-SecurID</span>
              </div>

              <div className="grid grid-cols-6 gap-1.5">
                {pinDigits.map((digit, idx) => (
                  <input
                    key={idx}
                    type="password"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => {
                      const newArr = [...pinDigits];
                      newArr[idx] = e.target.value;
                      setPinDigits(newArr);
                    }}
                    placeholder="•"
                    className="text-center py-2 rounded-xl bg-surface text-on-surface font-mono font-bold text-sm border border-slate-200 dark:border-slate-800 focus:border-secondary"
                  />
                ))}
              </div>
            </div>

            <button
              onClick={handlePinAuth}
              className="w-full py-2.5 rounded-xl bg-secondary text-white font-semibold text-xs hover:bg-secondary-container transition-all flex items-center justify-center gap-2 shadow-xs"
            >
              <span className="material-symbols-outlined text-base">key</span>
              <span>Authorize Cryptographic Token</span>
            </button>
          </div>
        )}

        {/* Active Incident / Officer Quick Context Card */}
        <div className="p-3 rounded-2xl bg-surface-container flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-secondary-fixed flex items-center justify-center text-on-secondary-fixed font-bold text-xs">
              DS
            </div>
            <div>
              <div className="text-xs font-bold text-on-surface">Officer D. Sutton</div>
              <div className="text-[11px] font-mono text-on-surface-variant">
                Shift: Alpha · Zone Central Lab
              </div>
            </div>
          </div>
          <button
            onClick={() => alert('Officer quick-switch initiated: Supervisor credentials confirmed.')}
            className="px-2.5 py-1.5 rounded-lg bg-surface text-on-surface text-[11px] font-medium hover:bg-surface-container-highest transition-colors flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-xs">sync_alt</span>
            <span>Switch</span>
          </button>
        </div>
      </div>

      {/* Alert Banner if Active */}
      {alertMessage && (
        <div className="p-3 rounded-2xl bg-secondary-fixed/50 text-on-secondary-fixed flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary text-sm">vibration</span>
            <span>{alertMessage}</span>
          </div>
          <button onClick={() => setAlertMessage(null)}>
            <span className="material-symbols-outlined text-sm">close</span>
          </button>
        </div>
      )}

      {/* Statutory Security Audit Notice */}
      <div className="p-3.5 rounded-2xl bg-surface-container-lowest border border-slate-200/60 dark:border-slate-800 flex items-start gap-2.5">
        <span className="material-symbols-outlined text-secondary text-base mt-0.5">policy</span>
        <p className="text-xs text-on-surface-variant leading-relaxed">
          Security Audit Notice: All authentication requests, biometric matches, and tactical camera
          stream requests are cryptographically signed and archived under{' '}
          <strong className="text-on-surface">FERPA / Campus Safety Directive 404-B</strong>.
        </p>
      </div>

      {/* Emergency Bypass Zone */}
      <div className="pt-2 flex flex-col gap-2">
        <button
          onClick={() => {
            alert('TACTICAL EMERGENCY BYPASS EXECUTED: All perimeter gates open for emergency responders.');
            onAuthenticateSuccess();
          }}
          className="w-full py-3 rounded-2xl bg-error-container text-on-error-container font-bold text-xs flex items-center justify-center gap-2 active:scale-98 transition-all shadow-sm"
        >
          <span className="material-symbols-outlined text-base">crisis_alert</span>
          <span>Declare Tactical Emergency Bypass</span>
        </button>

        <div className="flex items-center justify-center gap-3 text-[11px] font-mono text-on-surface-variant pt-1">
          <span>Radio Dispatched: 462.550 MHz</span>
          <span>•</span>
          <span className="text-secondary font-semibold">NOC Online</span>
        </div>
      </div>
    </div>
  );
};
