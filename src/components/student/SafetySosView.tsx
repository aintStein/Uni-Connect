import React, { useState, useRef, useEffect } from 'react';
import { Language } from '../../types';

interface SafetySosViewProps {
  language: Language;
}

export const SafetySosView: React.FC<SafetySosViewProps> = () => {
  const [isHolding, setIsHolding] = useState(false);
  const [holdProgress, setHoldProgress] = useState(0); // 0 to 1
  const [sosTriggered, setSosTriggered] = useState(false);
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [hazardSubmitted, setHazardSubmitted] = useState(false);
  const [hazardCategory, setHazardCategory] = useState('lighting');

  const holdTimerRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const holdDuration = 3000;
  const fullDash = 440;

  const playAlertTone = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(440, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.3);
      gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.6);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.6);
    } catch {
      // Audio not supported or blocked
    }
  };

  const startHold = (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (sosTriggered) return;
    setIsHolding(true);
    startTimeRef.current = Date.now();

    const updateFrame = () => {
      if (!startTimeRef.current) return;
      const elapsed = Date.now() - startTimeRef.current;
      const prog = Math.min(elapsed / holdDuration, 1);
      setHoldProgress(prog);

      if (prog < 1) {
        holdTimerRef.current = requestAnimationFrame(updateFrame);
      } else {
        setSosTriggered(true);
        setIsHolding(false);
        playAlertTone();
        if (navigator.vibrate) {
          navigator.vibrate([200, 100, 200, 100, 400]);
        }
      }
    };

    holdTimerRef.current = requestAnimationFrame(updateFrame);
  };

  const cancelHold = () => {
    if (sosTriggered) return;
    if (holdTimerRef.current) {
      cancelAnimationFrame(holdTimerRef.current);
    }
    setIsHolding(false);
    setHoldProgress(0);
    startTimeRef.current = null;
  };

  useEffect(() => {
    const handleUp = () => cancelHold();
    window.addEventListener('mouseup', handleUp);
    window.addEventListener('touchend', handleUp);
    return () => {
      window.removeEventListener('mouseup', handleUp);
      window.removeEventListener('touchend', handleUp);
    };
  }, [sosTriggered]);

  const dashOffset = fullDash - holdProgress * fullDash;
  const remainingSec = Math.max(0, 3 - holdProgress * 3).toFixed(1);

  return (
    <div className="flex flex-col w-full gap-space-lg pb-6">
      {/* Live Security Telemetry & Proximity Anchor Strip */}
      <div className="w-full bg-surface-container-lowest rounded-xl p-space-md shadow-sm flex flex-col gap-space-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-space-xs">
            <span className="w-2.5 h-2.5 rounded-full bg-secondary animate-ping"></span>
            <span className="w-2 h-2 rounded-full bg-secondary -ml-2"></span>
            <span className="font-label-sm text-label-sm text-secondary uppercase tracking-wider font-semibold">
              Campus Mesh Protected
            </span>
          </div>
          <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-surface-container-high">
            <span className="material-symbols-outlined text-[14px] text-on-surface-variant">
              wifi_tethering
            </span>
            <span className="font-label-sm text-label-sm text-on-surface-variant">
              5G Beacon Ultra-Wideband
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between bg-surface-container-low p-2.5 rounded-lg">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-8 h-8 rounded-full bg-surface-container-highest flex items-center justify-center shrink-0 text-on-surface">
              <span className="material-symbols-outlined text-[18px]">near_me</span>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-label-sm text-label-sm text-on-surface-variant uppercase">
                Current Safe Point
              </span>
              <span className="font-headline-sm text-headline-sm text-on-surface truncate">
                North Commons Plaza • Post #14
              </span>
            </div>
          </div>
          <span className="font-label-sm text-label-sm text-secondary bg-surface-container-highest px-2 py-1 rounded-md shrink-0">
            Accuracy ±0.8m
          </span>
        </div>
      </div>

      {/* Hero SOS Tactile Dispatch Station */}
      <div className="relative w-full rounded-2xl bg-surface-container-lowest p-space-lg shadow-md flex flex-col items-center text-center overflow-hidden">
        {/* Ambient Pulse Glow Backing */}
        <div
          className={`absolute -top-12 left-1/2 -translate-x-1/2 w-48 h-48 rounded-full blur-3xl pointer-events-none transition-all ${
            sosTriggered ? 'bg-error/40 animate-ping' : 'bg-error-container/40'
          }`}
        ></div>

        <div className="flex items-center justify-between w-full mb-space-md z-10">
          <div className="flex items-center gap-1.5">
            <span
              className="material-symbols-outlined text-error text-[20px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              local_police
            </span>
            <span className="font-label-sm text-label-sm text-error font-semibold uppercase tracking-wider">
              Campus Police Linked
            </span>
          </div>
          <span className="font-label-sm text-label-sm text-on-surface-variant bg-surface-container-low px-2 py-0.5 rounded-full">
            Response Avg 94s
          </span>
        </div>

        {/* Hold-to-Activate SOS Button with Interactive Circumference Ring */}
        <div className="relative flex items-center justify-center my-2 select-none touch-none">
          <svg className="w-48 h-48 -rotate-90 transform pointer-events-none" viewBox="0 0 160 160">
            <circle
              className="text-surface-container-high"
              cx="80"
              cy="80"
              fill="transparent"
              r="70"
              stroke="currentColor"
              strokeWidth="6"
            ></circle>
            <circle
              className="text-error transition-all duration-75 ease-linear"
              cx="80"
              cy="80"
              fill="transparent"
              r="70"
              stroke="currentColor"
              strokeDasharray={fullDash}
              strokeDashoffset={dashOffset}
              strokeLinecap="round"
              strokeWidth="7"
            ></circle>
          </svg>

          <button
            onMouseDown={startHold}
            onTouchStart={startHold}
            aria-label="Hold for 3 seconds to trigger Emergency SOS"
            className={`absolute w-36 h-36 rounded-full bg-error text-on-error flex flex-col items-center justify-center shadow-lg transition-transform duration-150 cursor-pointer focus:outline-none ${
              sosTriggered ? 'scale-105 ring-4 ring-emerald-400' : isHolding ? 'scale-95' : 'active:scale-95'
            }`}
          >
            <span
              className="material-symbols-outlined text-[36px] animate-bounce"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              {sosTriggered ? 'verified_user' : 'sos'}
            </span>
            <span className="font-headline-sm text-headline-sm tracking-wide mt-0.5 font-bold">
              {sosTriggered ? 'SENT' : 'HOLD 3s'}
            </span>
            <span className="font-label-sm text-label-sm text-on-error/85 uppercase tracking-tighter">
              {sosTriggered ? 'POLICE EN ROUTE' : 'Emergency'}
            </span>
          </button>
        </div>

        <div className="z-10 mt-2 flex flex-col items-center">
          <div
            className={`font-body-md text-body-md font-medium transition-colors ${
              sosTriggered
                ? 'text-emerald-600 font-bold'
                : isHolding
                ? 'text-error font-bold'
                : 'text-on-surface'
            }`}
          >
            {sosTriggered
              ? 'DISPATCH TRANSMITTED!'
              : isHolding
              ? `Keep holding... ${remainingSec}s`
              : 'Press and hold trigger ring'}
          </div>
          <p className="font-body-sm text-body-sm text-on-surface-variant max-w-[280px] mt-1 text-center">
            {sosTriggered
              ? 'GPS coordinates, live UWB beacon node, and biometric ID transmitted to Patrol Unit #07.'
              : 'Instantly broadcasts coordinates, current room beacon, and prioritizes live Campus Police Dispatch.'}
          </p>

          {sosTriggered && (
            <button
              onClick={() => {
                setSosTriggered(false);
                setHoldProgress(0);
              }}
              className="mt-3 px-3.5 py-1 rounded-lg bg-surface-container text-xs font-semibold hover:bg-surface-container-highest"
            >
              Reset Test Beacon
            </button>
          )}
        </div>

        {/* Safety Code Active Strip */}
        <div className="mt-4 pt-3 w-full flex items-center justify-center gap-2 border-t border-slate-100 dark:border-slate-800">
          <span className="material-symbols-outlined text-[16px] text-secondary">security</span>
          <span className="font-label-sm text-label-sm text-on-surface-variant">
            Silent PIN deactivation available once sent
          </span>
        </div>
      </div>

      {/* Rapid Action Safety Tiles (2x2 Grid) */}
      <div className="flex flex-col gap-space-xs">
        <div className="flex items-center justify-between px-1">
          <span className="font-headline-sm text-headline-sm text-on-surface">Rapid Assistance</span>
          <span className="font-label-sm text-label-sm text-secondary font-medium">Priority 24/7</span>
        </div>

        <div className="grid grid-cols-2 gap-space-sm mt-1">
          {/* 1. Request Campus Escort */}
          <button
            onClick={() => setActiveModal('escort')}
            className="bg-surface-container-lowest p-space-md rounded-xl text-left flex flex-col justify-between shadow-sm hover:bg-surface-container-low transition-colors group"
          >
            <div className="flex items-center justify-between w-full">
              <div className="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center text-secondary group-hover:scale-105 transition-transform">
                <span className="material-symbols-outlined text-[22px]">directions_walk</span>
              </div>
              <span className="font-label-sm text-label-sm text-secondary font-semibold bg-secondary-fixed/50 px-1.5 py-0.5 rounded">
                4m ETA
              </span>
            </div>
            <div className="mt-3">
              <span className="font-headline-sm text-headline-sm text-on-surface block leading-tight">
                Campus Escort
              </span>
              <span className="font-body-sm text-body-sm text-on-surface-variant block mt-1">
                Companion to dorm, library, or parked car
              </span>
            </div>
          </button>

          {/* 2. Silent Distress Signal */}
          <button
            onClick={() => setActiveModal('silent')}
            className="bg-surface-container-lowest p-space-md rounded-xl text-left flex flex-col justify-between shadow-sm hover:bg-surface-container-low transition-colors group"
          >
            <div className="flex items-center justify-between w-full">
              <div className="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center text-on-surface group-hover:scale-105 transition-transform">
                <span className="material-symbols-outlined text-[22px]">volume_off</span>
              </div>
              <span className="w-2 h-2 rounded-full bg-secondary"></span>
            </div>
            <div className="mt-3">
              <span className="font-headline-sm text-headline-sm text-on-surface block leading-tight">
                Silent Distress
              </span>
              <span className="font-body-sm text-body-sm text-on-surface-variant block mt-1">
                Discreet telemetry alert with zero audio
              </span>
            </div>
          </button>

          {/* 3. Medical Emergency */}
          <button
            onClick={() => setActiveModal('medical')}
            className="bg-surface-container-lowest p-space-md rounded-xl text-left flex flex-col justify-between shadow-sm hover:bg-surface-container-low transition-colors group"
          >
            <div className="flex items-center justify-between w-full">
              <div className="w-10 h-10 rounded-lg bg-error-container/60 flex items-center justify-center text-error group-hover:scale-105 transition-transform">
                <span
                  className="material-symbols-outlined text-[22px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  medical_services
                </span>
              </div>
              <span className="font-label-sm text-label-sm text-error font-semibold bg-error-container px-1.5 py-0.5 rounded">
                Urgent
              </span>
            </div>
            <div className="mt-3">
              <span className="font-headline-sm text-headline-sm text-on-surface block leading-tight">
                Medical SOS
              </span>
              <span className="font-body-sm text-body-sm text-on-surface-variant block mt-1">
                Direct link to Health Center EMT squad
              </span>
            </div>
          </button>

          {/* 4. Report Incident/Hazard */}
          <button
            onClick={() => setActiveModal('hazard')}
            className="bg-surface-container-lowest p-space-md rounded-xl text-left flex flex-col justify-between shadow-sm hover:bg-surface-container-low transition-colors group"
          >
            <div className="flex items-center justify-between w-full">
              <div className="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center text-on-surface-variant group-hover:scale-105 transition-transform">
                <span className="material-symbols-outlined text-[22px]">add_a_photo</span>
              </div>
              <span className="material-symbols-outlined text-[16px] text-on-surface-variant">
                arrow_forward
              </span>
            </div>
            <div className="mt-3">
              <span className="font-headline-sm text-headline-sm text-on-surface block leading-tight">
                Report Hazard
              </span>
              <span className="font-body-sm text-body-sm text-on-surface-variant block mt-1">
                Submit photo of broken light, ice, or spill
              </span>
            </div>
          </button>
        </div>
      </div>

      {/* 5G Campus Safety & Lit Safe Pathways Radar Map */}
      <div className="flex flex-col gap-space-xs">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-secondary text-[20px]">explore</span>
            <span className="font-headline-sm text-headline-sm text-on-surface">
              Lit Pathways &amp; Call Boxes
            </span>
          </div>
          <span className="font-label-sm text-label-sm text-secondary bg-surface-container-high px-2 py-0.5 rounded-full">
            3 Blue Lights Nearby
          </span>
        </div>

        <div className="relative w-full rounded-2xl overflow-hidden shadow-sm bg-surface-container-lowest">
          <div
            className="w-full h-44 bg-cover bg-center"
            data-location="Stanford University Campus Oval, California"
            style={{
              backgroundImage:
                "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDzUm32xZo_8k7bAkT5udNfusWXHniBSYTu7jkE6US_RXxERpcVhKdlOXYVGwS3O4Nj_e-wydApKSERis3-9LQwg-SZCVyhmBbSG6cvouM-qviE9i7AqlU4Gl6cNXINbAI_QjU4ySBDdMC2xqj0DR0Oj0o94ufHXEMftgqRGKHGdHjkle65dukmYC6yaln9f-gF_PE6a4kQ7xXl3grYOg1WKU6hkIIYZKu6DkO46BEo4zQdaOpCVc8g')",
            }}
          ></div>

          <div className="p-space-md flex flex-col gap-space-sm bg-surface-container-lowest">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-secondary"></span>
                <span className="font-label-md text-label-md text-on-surface font-semibold">
                  North Quad Night Lighting: Optimal
                </span>
              </div>
              <span className="font-label-sm text-label-sm text-on-surface-variant">
                Auto-patrol on route
              </span>
            </div>

            <div className="flex items-center justify-between text-body-sm text-on-surface-variant bg-surface-container-low px-3 py-2 rounded-lg">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px] text-secondary">flare</span>
                <span>
                  Nearest Blue Light Post: <strong>#12 (45m East)</strong>
                </span>
              </div>
              <button
                onClick={() => setActiveModal('route')}
                className="font-label-sm text-label-sm text-secondary font-semibold hover:underline"
              >
                Route Me
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Campus Safety Dispatchers On Duty */}
      <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col gap-space-sm">
        <div className="flex items-center justify-between">
          <span className="font-headline-sm text-headline-sm text-on-surface">
            Dispatch Team On Duty
          </span>
          <span className="font-label-sm text-label-sm text-secondary font-semibold">
            Desk 04 Online
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              className="w-11 h-11 rounded-full object-cover shadow-sm"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBoAL0nJN4_c_Lk5MvNnLEVUG6ROqQGagECsJB2xUJWu8IKMSAFB8q_L8MP_FpjwfWo2An4xmsfRqrZNAAkl9htQNy-wJWpNpvTLcmGpWE7kT-oN3HpySJG-LnNU7y66wV5FFrTVcbAg5EJTJ7-vg-L7phHkzmARJ7mG4_A1UtxXSzyFaPpDIAUACuSj9RAQrAloE5rq4yJka3F6xdl1gAfmX04I09NhWtEyVe1e1S-5sdvI9RyAjZW"
              alt="Officer Vance"
            />
            <div className="flex flex-col">
              <span className="font-headline-sm text-headline-sm text-on-surface">
                Officer D. Vance
              </span>
              <span className="font-body-sm text-body-sm text-on-surface-variant">
                North Sector Patrol • Radio Unit #7
              </span>
            </div>
          </div>

          <a
            aria-label="Direct Dispatch Phone Call"
            className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface hover:bg-secondary-fixed transition-colors"
            href="tel:911"
          >
            <span className="material-symbols-outlined text-[20px]">call</span>
          </a>
        </div>
      </div>

      {/* Background Privacy & Telemetry Transparency */}
      <div className="bg-surface-container-low rounded-xl p-space-md flex flex-col gap-space-xs text-on-surface">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[20px] text-on-surface-variant">
            encrypted
          </span>
          <span className="font-headline-sm text-headline-sm text-on-surface">
            Zero-Knowledge Telemetry
          </span>
        </div>
        <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
          Your real-time 5G coordinate and beacon triangulation are strictly processed on-device and
          encrypted. Data is broadcasted{' '}
          <span className="font-semibold text-on-surface">
            only when an SOS or Escort is manually initiated
          </span>{' '}
          and is solely accessible to certified campus first responders.
        </p>
        <div className="flex items-center justify-between pt-2">
          <span className="font-label-sm text-label-sm text-on-surface-variant">
            Certified FERPA &amp; State Privacy Compliant
          </span>
          <button
            onClick={() => setActiveModal('audit')}
            className="font-label-sm text-label-sm text-secondary font-medium hover:underline"
          >
            Audit Logs
          </button>
        </div>
      </div>

      {/* Modals */}
      {activeModal === 'escort' && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-2xl p-6 max-w-sm w-full shadow-2xl space-y-4">
            <h3 className="font-headline-sm text-headline-sm text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary">directions_walk</span>
              <span>Request Campus Escort</span>
            </h3>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              A certified safety officer will meet you at North Commons Plaza • Post #14.
            </p>
            <div className="p-3 bg-surface-container-low rounded-xl text-xs font-mono">
              📍 Current Location: North Commons Plaza (±0.8m)
              <div className="text-secondary font-semibold mt-1">Estimated ETA: 4 minutes</div>
            </div>
            <button
              onClick={() => {
                alert('Campus Escort Dispatched. Officer Vance is en route.');
                setActiveModal(null);
              }}
              className="w-full py-2.5 rounded-lg bg-secondary text-white font-semibold text-xs"
            >
              Confirm Escort Request
            </button>
            <button
              onClick={() => setActiveModal(null)}
              className="w-full py-2 rounded-lg bg-surface-container text-xs text-on-surface"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {activeModal === 'silent' && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-2xl p-6 max-w-sm w-full shadow-2xl space-y-4 text-center">
            <span className="material-symbols-outlined text-4xl text-secondary">volume_off</span>
            <h3 className="font-headline-sm text-headline-sm text-on-surface">Silent Distress Active</h3>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Encrypted coordinates transmitted discreetly to Campus Police Desk #04 without audio or screen alarms.
            </p>
            <button
              onClick={() => setActiveModal(null)}
              className="w-full py-2.5 rounded-lg bg-primary text-white font-semibold text-xs"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {activeModal === 'medical' && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-2xl p-6 max-w-sm w-full shadow-2xl space-y-4">
            <h3 className="font-headline-sm text-headline-sm text-error flex items-center gap-2">
              <span className="material-symbols-outlined">medical_services</span>
              <span>Medical Emergency Alert</span>
            </h3>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Connecting priority link to Health Center EMT squad and 911 dispatch.
            </p>
            <button
              onClick={() => {
                alert('Campus EMT squad dispatched to North Commons Plaza Post #14.');
                setActiveModal(null);
              }}
              className="w-full py-2.5 rounded-lg bg-error text-white font-semibold text-xs"
            >
              Transmit Medical SOS
            </button>
            <button
              onClick={() => setActiveModal(null)}
              className="w-full py-2 rounded-lg bg-surface-container text-xs text-on-surface"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {activeModal === 'hazard' && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-2xl p-6 max-w-sm w-full shadow-2xl space-y-3">
            <div className="flex justify-between items-center">
              <h3 className="font-headline-sm text-headline-sm text-on-surface">Report Campus Hazard</h3>
              <button onClick={() => setActiveModal(null)}>
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            </div>
            {hazardSubmitted ? (
              <div className="py-6 text-center space-y-2">
                <span className="material-symbols-outlined text-3xl text-emerald-500">
                  check_circle
                </span>
                <p className="font-body-sm text-body-sm text-on-surface font-semibold">
                  Hazard report submitted to Facilities Desk #04.
                </p>
              </div>
            ) : (
              <>
                <div>
                  <label className="font-label-sm text-label-sm text-on-surface-variant block mb-1">
                    Hazard Category
                  </label>
                  <select
                    value={hazardCategory}
                    onChange={(e) => setHazardCategory(e.target.value)}
                    className="w-full p-2 rounded-lg bg-surface-container border text-xs text-on-surface"
                  >
                    <option value="lighting">Broken Pathway Light</option>
                    <option value="ice">Ice / Slippery Walkway</option>
                    <option value="spill">Chemical or Water Spill</option>
                    <option value="door">Sensor Malfunction</option>
                  </select>
                </div>
                <div className="p-3 bg-surface-container-low rounded-xl border border-dashed text-center text-xs text-on-surface-variant">
                  <span className="material-symbols-outlined text-2xl block text-on-surface-variant mb-1">
                    add_a_photo
                  </span>
                  <span>Tap to snap photo (Simulated)</span>
                </div>
                <button
                  onClick={() => setHazardSubmitted(true)}
                  className="w-full py-2.5 rounded-lg bg-secondary text-white text-xs font-semibold"
                >
                  Submit Photo &amp; Location
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {activeModal === 'route' && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-2xl p-6 max-w-sm w-full shadow-2xl space-y-4">
            <h3 className="font-headline-sm text-headline-sm text-on-surface">Route to Blue Light #12</h3>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Walk 45 meters East along the lit quad pathway. Tower has high-output LED beacon and direct voice dispatch link.
            </p>
            <button
              onClick={() => setActiveModal(null)}
              className="w-full py-2.5 rounded-lg bg-secondary text-white text-xs font-semibold"
            >
              Start Guidance
            </button>
          </div>
        </div>
      )}

      {activeModal === 'audit' && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-2xl p-6 max-w-sm w-full shadow-2xl space-y-3">
            <div className="flex justify-between items-center">
              <h3 className="font-headline-sm text-headline-sm text-on-surface">Telemetry Audit Trail</h3>
              <button onClick={() => setActiveModal(null)}>
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            </div>
            <div className="p-3 bg-surface-container-low rounded-xl text-[11px] font-mono space-y-1.5 max-h-48 overflow-y-auto">
              <div>[20:00:12] Triangulation hash: 88bf3a... (On-Device)</div>
              <div>[20:00:10] Sensor match: BLE 5.3 + 6E spatial mesh</div>
              <div>[20:00:00] FERPA Compliance: Directive 404-B Verified</div>
            </div>
            <button
              onClick={() => setActiveModal(null)}
              className="w-full py-2 rounded-lg bg-primary text-white text-xs font-semibold"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
