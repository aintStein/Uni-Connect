import React, { useState, useRef, useEffect } from 'react';
import { Language } from '../../types';
import { TRANSLATIONS } from '../../data/mockCampusData';

interface SafetySosViewProps {
  language: Language;
}

export const SafetySosView: React.FC<SafetySosViewProps> = ({ language }) => {
  const t = TRANSLATIONS[language];
  // SOS Hold State (Reduced to 1.5s)
  const [isHolding, setIsHolding] = useState(false);
  const [holdProgress, setHoldProgress] = useState(0); // 0 to 1
  const [sosTriggered, setSosTriggered] = useState(false);
  const [activeModal, setActiveModal] = useState<
    'escort' | 'silent' | 'medical' | 'incident' | 'route' | 'audit' | 'recorder' | null
  >(null);

  // General Incident & Harassment Reporting State
  const [incidentCategory, setIncidentCategory] = useState('sexual_harassment');
  const [incidentDescription, setIncidentDescription] = useState('');
  const [incidentLocation, setIncidentLocation] = useState('North Commons Plaza • Post #14');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [requestCounselor, setRequestCounselor] = useState(true);
  const [incidentSubmitted, setIncidentSubmitted] = useState(false);
  const [incidentCaseId, setIncidentCaseId] = useState('');
  const [evidenceAttached, setEvidenceAttached] = useState(false);

  // Evidence Audio & Video Recorder State
  const [recordMode, setRecordMode] = useState<'video' | 'audio'>('video');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const [recordedMediaUrl, setRecordedMediaUrl] = useState<string | null>(null);
  const [recordedMediaType, setRecordedMediaType] = useState<'video' | 'audio' | null>(null);
  const [isEvidenceSaved, setIsEvidenceSaved] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);

  const holdTimerRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const holdDuration = 1500; // Exactly 1.5 seconds per user request
  const fullDash = 440;

  const videoPreviewRef = useRef<HTMLVideoElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const recordingTimerRef = useRef<number | null>(null);

  const playAlertTone = () => {
    try {
      const audioCtx = new (window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
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

  // Clean up media recorder stream when modal closes
  useEffect(() => {
    if (activeModal !== 'recorder') {
      stopMediaRecording(false);
    }
  }, [activeModal]);

  // Handle start recording (Audio or Video)
  const startMediaRecording = async (mode: 'video' | 'audio') => {
    setRecordMode(mode);
    setRecordedMediaUrl(null);
    setIsEvidenceSaved(false);
    setRecordingSeconds(0);
    setCameraError(null);
    recordedChunksRef.current = [];

    let stream: MediaStream | null = null;
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const constraints: MediaStreamConstraints =
          mode === 'video'
            ? { video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } }, audio: true }
            : { audio: true, video: false };
        stream = await navigator.mediaDevices.getUserMedia(constraints);
      }
    } catch (err) {
      console.warn('Device media access unavailable; utilizing high-fidelity simulated sensor preview:', err);
      setCameraError('Microphone/Camera in simulation mode (browser permissions restricted)');
    }

    setMediaStream(stream);

    if (stream && videoPreviewRef.current && mode === 'video') {
      videoPreviewRef.current.srcObject = stream;
      videoPreviewRef.current.play().catch(() => {});
    }

    setIsRecording(true);

    if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
    recordingTimerRef.current = window.setInterval(() => {
      setRecordingSeconds((prev) => prev + 1);
    }, 1000);

    if (stream && typeof MediaRecorder !== 'undefined') {
      try {
        const mimeType = mode === 'video' ? 'video/webm' : 'audio/webm';
        const recorder = new MediaRecorder(stream, { mimeType: MediaRecorder.isTypeSupported(mimeType) ? mimeType : undefined });
        recorder.ondataavailable = (event) => {
          if (event.data && event.data.size > 0) {
            recordedChunksRef.current.push(event.data);
          }
        };
        recorder.onstop = () => {
          const blob = new Blob(recordedChunksRef.current, {
            type: mode === 'video' ? 'video/webm' : 'audio/webm',
          });
          const url = URL.createObjectURL(blob);
          setRecordedMediaUrl(url);
          setRecordedMediaType(mode);
        };
        recorder.start(500);
        mediaRecorderRef.current = recorder;
      } catch (e) {
        console.warn('MediaRecorder setup error', e);
      }
    }
  };

  // Handle stop recording
  const stopMediaRecording = (createFallbackIfMissing = true) => {
    setIsRecording(false);
    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current);
      recordingTimerRef.current = null;
    }

    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      try {
        mediaRecorderRef.current.stop();
      } catch {}
    }

    if (mediaStream) {
      mediaStream.getTracks().forEach((track) => track.stop());
      setMediaStream(null);
    }

    if (createFallbackIfMissing && !recordedMediaUrl) {
      // Set simulated evidence clip
      setRecordedMediaUrl('simulated-evidence');
      setRecordedMediaType(recordMode);
    }
  };

  const handleSaveEvidence = () => {
    setIsEvidenceSaved(true);
    setEvidenceAttached(true);
  };

  const dashOffset = fullDash - holdProgress * fullDash;
  const remainingSec = Math.max(0, 1.5 - holdProgress * 1.5).toFixed(1);

  const handleIncidentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const randomCaseNum = Math.floor(1000 + Math.random() * 9000);
    setIncidentCaseId(`SAFE-${randomCaseNum}-PRIORITY`);
    setIncidentSubmitted(true);
  };

  const formatSeconds = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col w-full gap-4 pb-12">
      {/* Live Security Telemetry & Proximity Anchor Strip */}
      <div className="w-full bg-surface-container-lowest rounded-2xl p-4 shadow-sm border border-slate-200/60 dark:border-slate-800 flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-secondary animate-ping" />
            <span className="w-2 h-2 rounded-full bg-secondary -ml-2" />
            <span className="text-xs font-mono text-secondary uppercase tracking-wider font-semibold">
              Campus 5G Mesh Active
            </span>
          </div>
          <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-surface-container text-xs text-on-surface-variant font-mono">
            <span className="material-symbols-outlined text-[14px]">wifi_tethering</span>
            <span>UWB Anchor Online</span>
          </div>
        </div>

        <div className="flex items-center justify-between bg-surface-container-low p-3 rounded-xl">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-full bg-surface-container-highest flex items-center justify-center shrink-0 text-secondary">
              <span className="material-symbols-outlined text-[20px]">near_me</span>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[10px] font-mono text-on-surface-variant uppercase tracking-wider">
                {t.currentSafePoint}
              </span>
              <span className="font-bold text-xs text-on-surface truncate">
                North Commons Plaza • Post #14
              </span>
            </div>
          </div>
          <span className="text-[11px] font-mono text-secondary bg-surface-container-highest px-2 py-1 rounded-md shrink-0 font-semibold">
            ±0.8m Accuracy
          </span>
        </div>
      </div>

      {/* 999 Emergency Hotline - Top Priority Banner */}
      <div className="bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white p-4 rounded-3xl shadow-lg border border-red-500/30 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0">
              <span
                className="material-symbols-outlined text-white text-[24px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                emergency
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-mono uppercase tracking-wider text-white/80 font-semibold">
                National &amp; Campus Emergency Line
              </span>
              <h3 className="font-bold text-base text-white tracking-tight">
                {t.dispatchTeam}
              </h3>
            </div>
          </div>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/25 backdrop-blur-xs text-[10px] font-mono font-bold text-white shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            24/7 Priority
          </span>
        </div>

        <p className="text-xs text-white/90 leading-relaxed">
          Direct instant link to <strong>999 Emergency Dispatch</strong> (Police, Ambulance, Fire) and
          on-campus rapid response patrol units.
        </p>

        <div className="flex items-center gap-2 pt-1">
          <a
            href="tel:999"
            aria-label="Call 999 Hotline Now"
            className="flex-1 py-3 px-4 rounded-2xl bg-white text-error font-bold text-xs flex items-center justify-center gap-2 shadow-md hover:bg-slate-100 active:scale-98 transition-all"
          >
            <span
              className="material-symbols-outlined text-[20px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              call
            </span>
            <span>{t.call999Now}</span>
          </a>
          <button
            onClick={() => setActiveModal('recorder')}
            className="py-3 px-3.5 rounded-2xl bg-white/20 hover:bg-white/30 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">videocam</span>
            <span>Record</span>
          </button>
        </div>
      </div>

      {/* Hero SOS Tactile Dispatch Station (1.5s Hold Duration) */}
      <div className="relative w-full rounded-3xl bg-surface-container-lowest p-6 shadow-md border border-slate-200/60 dark:border-slate-800 flex flex-col items-center text-center overflow-hidden">
        {/* Ambient Pulse Glow Backing */}
        <div
          className={`absolute -top-12 left-1/2 -translate-x-1/2 w-48 h-48 rounded-full blur-3xl pointer-events-none transition-all ${
            sosTriggered ? 'bg-error/40 animate-ping' : 'bg-error-container/40'
          }`}
        />

        <div className="flex items-center justify-between w-full mb-3 z-10">
          <div className="flex items-center gap-1.5">
            <span
              className="material-symbols-outlined text-error text-[20px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              local_police
            </span>
            <span className="text-xs text-error font-semibold uppercase tracking-wider">
              Police &amp; 999 Linked
            </span>
          </div>
          <span className="text-xs text-on-surface-variant bg-surface-container px-2.5 py-0.5 rounded-full font-mono">
            Fast Hold: 1.5s
          </span>
        </div>

        {/* Hold-to-Activate SOS Button (1.5s) */}
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
            />
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
            />
          </svg>

          <button
            onMouseDown={startHold}
            onTouchStart={startHold}
            aria-label="Hold for 1.5 seconds to trigger Emergency SOS"
            className={`absolute w-36 h-36 rounded-full bg-error text-on-error flex flex-col items-center justify-center shadow-xl transition-transform duration-150 cursor-pointer focus:outline-none ${
              sosTriggered
                ? 'scale-105 ring-4 ring-emerald-400 bg-emerald-600'
                : isHolding
                ? 'scale-95'
                : 'active:scale-95'
            }`}
          >
            <span
              className="material-symbols-outlined text-[36px] animate-bounce"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              {sosTriggered ? 'verified_user' : 'sos'}
            </span>
            <span className="text-base tracking-wide mt-0.5 font-bold">
              {sosTriggered ? 'SENT' : t.holdSos}
            </span>
            <span className="text-[10px] text-on-error/90 uppercase tracking-tight font-semibold">
              {sosTriggered ? 'DISPATCH ON ROUTE' : 'Emergency'}
            </span>
          </button>
        </div>

        <div className="z-10 mt-2 flex flex-col items-center">
          <div
            className={`text-sm font-semibold transition-colors ${
              sosTriggered
                ? 'text-emerald-600 font-bold'
                : isHolding
                ? 'text-error font-bold'
                : 'text-on-surface'
            }`}
          >
            {sosTriggered
              ? 'EMERGENCY BEACON TRANSMITTED!'
              : isHolding
              ? `Keep holding... ${remainingSec}s`
              : t.pressAndHold}
          </div>
          <p className="text-xs text-on-surface-variant max-w-[290px] mt-1 text-center">
            {sosTriggered
              ? 'GPS coordinates transmitted to 999 Hotline & Campus Police Patrol Unit #07.'
              : 'Triggers priority alarm and broadcasts live location to 999 emergency services.'}
          </p>

          {/* Post-SOS Audio & Video Recording Action Banner */}
          {sosTriggered ? (
            <div className="mt-4 w-full bg-error-container/20 border border-error/30 rounded-2xl p-4 flex flex-col gap-2.5 animate-in fade-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-error animate-ping" />
                  <span className="text-xs font-bold text-error uppercase tracking-wider">
                    {t.recordEvidence}
                  </span>
                </div>
                <span className="text-[10px] font-mono text-on-surface-variant bg-surface-container px-2 py-0.5 rounded-full">
                  FERPA Protected
                </span>
              </div>
              <p className="text-xs text-on-surface text-left">
                Capture live audio and video from your camera and mic to provide instant evidence for
                first responders.
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setActiveModal('recorder');
                    startMediaRecording('video');
                  }}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-error text-white font-semibold text-xs flex items-center justify-center gap-1.5 shadow-sm hover:bg-error/90 transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px]">videocam</span>
                  <span>{t.videoSound}</span>
                </button>
                <button
                  onClick={() => {
                    setActiveModal('recorder');
                    startMediaRecording('audio');
                  }}
                  className="py-2.5 px-3 rounded-xl bg-surface-container text-on-surface font-semibold text-xs flex items-center gap-1.5 hover:bg-surface-container-highest transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px]">mic</span>
                  <span>{t.audioOnly}</span>
                </button>
              </div>

              <div className="flex items-center justify-between pt-1">
                <button
                  onClick={() => {
                    setSosTriggered(false);
                    setHoldProgress(0);
                  }}
                  className="text-[11px] text-on-surface-variant hover:text-on-surface underline font-mono"
                >
                  Reset Test Beacon
                </button>
                <span className="text-[11px] text-emerald-600 font-semibold font-mono">
                  ✓ Dispatch Acknowledged
                </span>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setActiveModal('recorder')}
              className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-container hover:bg-surface-container-high text-xs text-on-surface font-medium transition-colors"
            >
              <span className="material-symbols-outlined text-[16px] text-error">videocam</span>
              <span>Open Sound &amp; Video Recorder</span>
            </button>
          )}
        </div>

        {/* Safety Code Active Strip */}
        <div className="mt-4 pt-3 w-full flex items-center justify-center gap-2 border-t border-slate-100 dark:border-slate-800">
          <span className="material-symbols-outlined text-[16px] text-secondary">security</span>
          <span className="text-[11px] text-on-surface-variant font-mono">
            Silent PIN deactivation available • Zero-retention encrypted
          </span>
        </div>
      </div>

      {/* Rapid Action Safety Tiles (2x2 Grid) */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between px-1">
          <span className="font-bold text-sm text-on-surface">{t.rapidAssistance}</span>
          <span className="text-xs text-secondary font-mono font-medium">Priority 24/7</span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {/* 1. Request Campus Escort */}
          <button
            onClick={() => setActiveModal('escort')}
            className="bg-surface-container-lowest p-4 rounded-2xl text-left flex flex-col justify-between shadow-sm border border-slate-200/50 dark:border-slate-800 hover:bg-surface-container-low transition-all group"
          >
            <div className="flex items-center justify-between w-full">
              <div className="w-10 h-10 rounded-xl bg-surface-container-high flex items-center justify-center text-secondary group-hover:scale-105 transition-transform">
                <span className="material-symbols-outlined text-[22px]">directions_walk</span>
              </div>
              <span className="text-[10px] font-mono text-secondary font-semibold bg-secondary-fixed/50 px-2 py-0.5 rounded-full">
                4m ETA
              </span>
            </div>
            <div className="mt-3">
              <span className="font-bold text-xs text-on-surface block leading-tight">
                {t.campusEscort}
              </span>
              <span className="text-[11px] text-on-surface-variant block mt-1 leading-snug">
                Companion to dorm, library, or parked vehicle
              </span>
            </div>
          </button>

          {/* 2. Silent Distress Signal */}
          <button
            onClick={() => setActiveModal('silent')}
            className="bg-surface-container-lowest p-4 rounded-2xl text-left flex flex-col justify-between shadow-sm border border-slate-200/50 dark:border-slate-800 hover:bg-surface-container-low transition-all group"
          >
            <div className="flex items-center justify-between w-full">
              <div className="w-10 h-10 rounded-xl bg-surface-container-high flex items-center justify-center text-on-surface group-hover:scale-105 transition-transform">
                <span className="material-symbols-outlined text-[22px]">volume_off</span>
              </div>
              <span className="w-2 h-2 rounded-full bg-secondary" />
            </div>
            <div className="mt-3">
              <span className="font-bold text-xs text-on-surface block leading-tight">
                {t.silentDistress}
              </span>
              <span className="text-[11px] text-on-surface-variant block mt-1 leading-snug">
                Discreet telemetry alert with zero noise
              </span>
            </div>
          </button>

          {/* 3. Medical Emergency */}
          <button
            onClick={() => setActiveModal('medical')}
            className="bg-surface-container-lowest p-4 rounded-2xl text-left flex flex-col justify-between shadow-sm border border-slate-200/50 dark:border-slate-800 hover:bg-surface-container-low transition-all group"
          >
            <div className="flex items-center justify-between w-full">
              <div className="w-10 h-10 rounded-xl bg-error-container/60 flex items-center justify-center text-error group-hover:scale-105 transition-transform">
                <span
                  className="material-symbols-outlined text-[22px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  medical_services
                </span>
              </div>
              <span className="text-[10px] font-mono text-error font-semibold bg-error-container px-2 py-0.5 rounded-full">
                Urgent
              </span>
            </div>
            <div className="mt-3">
              <span className="font-bold text-xs text-on-surface block leading-tight">
                {t.medicalSos}
              </span>
              <span className="text-[11px] text-on-surface-variant block mt-1 leading-snug">
                Direct link to Health Center &amp; EMT Squad
              </span>
            </div>
          </button>

          {/* 4. General Incident & Harassment Reporting */}
          <button
            onClick={() => {
              setIncidentSubmitted(false);
              setActiveModal('incident');
            }}
            className="bg-surface-container-lowest p-4 rounded-2xl text-left flex flex-col justify-between shadow-sm border border-slate-200/50 dark:border-slate-800 hover:bg-surface-container-low transition-all group"
          >
            <div className="flex items-center justify-between w-full">
              <div className="w-10 h-10 rounded-xl bg-surface-container-high flex items-center justify-center text-secondary group-hover:scale-105 transition-transform">
                <span className="material-symbols-outlined text-[22px]">shield_person</span>
              </div>
              <span className="text-[10px] font-mono text-secondary font-semibold bg-secondary-fixed/50 px-2 py-0.5 rounded-full">
                Confidential
              </span>
            </div>
            <div className="mt-3">
              <span className="font-bold text-xs text-on-surface block leading-tight">
                {t.reportHazard}
              </span>
              <span className="text-[11px] text-on-surface-variant block mt-1 leading-snug">
                Sexual harassment, safety threats, or hazards
              </span>
            </div>
          </button>
        </div>
      </div>

      {/* Lit Safe Pathways Radar Map */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-secondary text-[20px]">explore</span>
            <span className="font-bold text-xs text-on-surface">{t.litPathways}</span>
          </div>
          <span className="text-[10px] font-mono text-secondary bg-surface-container-high px-2 py-0.5 rounded-full">
            3 Blue Lights Nearby
          </span>
        </div>

        <div className="relative w-full rounded-3xl overflow-hidden shadow-sm bg-surface-container-lowest border border-slate-200/60 dark:border-slate-800">
          <div
            className="w-full h-40 bg-cover bg-center"
            data-location="Stanford University Campus Oval, California"
            style={{
              backgroundImage:
                "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDzUm32xZo_8k7bAkT5udNfusWXHniBSYTu7jkE6US_RXxERpcVhKdlOXYVGwS3O4Nj_e-wydApKSERis3-9LQwg-SZCVyhmBbSG6cvouM-qviE9i7AqlU4Gl6cNXINbAI_QjU4ySBDdMC2xqj0DR0Oj0o94ufHXEMftgqRGKHGdHjkle65dukmYC6yaln9f-gF_PE6a4kQ7xXl3grYOg1WKU6hkIIYZKu6DkO46BEo4zQdaOpCVc8g')",
            }}
          />

          <div className="p-4 flex flex-col gap-2 bg-surface-container-lowest">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-secondary" />
                <span className="font-bold text-xs text-on-surface">
                  North Quad Night Lighting: Optimal
                </span>
              </div>
              <span className="text-[11px] font-mono text-on-surface-variant">
                Auto-patrol on route
              </span>
            </div>

            <div className="flex items-center justify-between text-xs text-on-surface-variant bg-surface-container-low px-3 py-2 rounded-xl">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px] text-secondary">flare</span>
                <span>
                  Nearest Blue Light Post: <strong>#12 (45m East)</strong>
                </span>
              </div>
              <button
                onClick={() => setActiveModal('route')}
                className="text-xs text-secondary font-bold hover:underline"
              >
                Route Me
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Privacy & Zero-Knowledge Verification */}
      <div className="bg-surface-container-low rounded-3xl p-4 flex flex-col gap-2 text-on-surface border border-slate-200/40 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[20px] text-secondary">verified_user</span>
          <span className="font-bold text-xs text-on-surface">Zero-Knowledge Telemetry &amp; Privacy</span>
        </div>
        <p className="text-xs text-on-surface-variant leading-relaxed">
          Your location and identity are strictly protected under FERPA guidelines. Reports of sexual
          harassment and threats are treated with trauma-informed confidentiality, and audio/video
          evidence is stored in an encrypted student vault.
        </p>
        <div className="flex items-center justify-between pt-1">
          <span className="text-[10px] font-mono text-on-surface-variant">
            ISO 27001 &amp; Title IX / FERPA Compliant
          </span>
          <button
            onClick={() => setActiveModal('audit')}
            className="text-[11px] text-secondary font-semibold hover:underline"
          >
            Audit Logs
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODAL: Evidence Recorder (Sound & Video) */}
      {/* ========================================================================= */}
      {activeModal === 'recorder' && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-3xl p-5 max-w-md w-full shadow-2xl space-y-4 border border-slate-200/60 dark:border-slate-800 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-error text-[22px]">videocam</span>
                <h3 className="font-bold text-sm text-on-surface">
                  Emergency Evidence Recorder
                </h3>
              </div>
              <button
                onClick={() => {
                  stopMediaRecording(false);
                  setActiveModal(null);
                }}
                className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-on-surface"
              >
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            </div>

            {/* Mode Selector */}
            <div className="grid grid-cols-2 gap-2 bg-surface-container-low p-1 rounded-2xl">
              <button
                type="button"
                onClick={() => {
                  if (!isRecording) {
                    setRecordMode('video');
                    setRecordedMediaUrl(null);
                  }
                }}
                className={`py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                  recordMode === 'video'
                    ? 'bg-surface-container-lowest text-on-surface shadow-xs'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">videocam</span>
                <span>Video &amp; Sound</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  if (!isRecording) {
                    setRecordMode('audio');
                    setRecordedMediaUrl(null);
                  }
                }}
                className={`py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                  recordMode === 'audio'
                    ? 'bg-surface-container-lowest text-on-surface shadow-xs'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">mic</span>
                <span>Audio Only (Discreet)</span>
              </button>
            </div>

            {/* Viewfinder / Recording Canvas */}
            <div className="relative w-full h-52 bg-slate-950 rounded-2xl overflow-hidden flex flex-col items-center justify-center border border-slate-800 shadow-inner">
              {recordMode === 'video' ? (
                <>
                  {mediaStream ? (
                    <video
                      ref={videoPreviewRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-full object-cover transform scale-x-[-1]"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center p-4 text-center">
                      <span className="material-symbols-outlined text-4xl text-slate-500 mb-2">
                        videocam
                      </span>
                      <span className="text-xs text-slate-300 font-mono">
                        Camera Viewfinder Active
                      </span>
                      <span className="text-[10px] text-slate-400 mt-1 max-w-[220px]">
                        {cameraError || 'Ready to capture incident video evidence'}
                      </span>
                    </div>
                  )}
                </>
              ) : (
                <div className="flex flex-col items-center justify-center p-4 text-center">
                  <div
                    className={`w-16 h-16 rounded-full flex items-center justify-center mb-2 transition-transform ${
                      isRecording ? 'bg-error/20 scale-110' : 'bg-slate-800'
                    }`}
                  >
                    <span
                      className={`material-symbols-outlined text-3xl ${
                        isRecording ? 'text-error animate-pulse' : 'text-slate-400'
                      }`}
                    >
                      mic
                    </span>
                  </div>
                  <span className="text-xs text-slate-200 font-mono">Discreet Sound Recorder</span>
                  <span className="text-[10px] text-slate-400 mt-0.5">
                    Records ambient surroundings, conversation, or distress audio
                  </span>
                </div>
              )}

              {/* Live Status Overlay */}
              <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-xs text-[11px] font-mono text-white">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      isRecording ? 'bg-red-500 animate-ping' : 'bg-slate-400'
                    }`}
                  />
                  <span>{isRecording ? `REC ${formatSeconds(recordingSeconds)}` : 'STANDBY'}</span>
                </div>
                <div className="px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-xs text-[10px] font-mono text-slate-300">
                  GPS: North Commons #14
                </div>
              </div>

              {/* Dynamic Sound Waveform simulation while recording */}
              {isRecording && (
                <div className="absolute bottom-3 left-6 right-6 flex items-end justify-center gap-1 h-6 pointer-events-none">
                  {[40, 75, 90, 60, 85, 30, 95, 70, 50, 80, 65, 90, 45, 80].map((h, idx) => (
                    <div
                      key={idx}
                      className="w-1 bg-red-500 rounded-full animate-pulse"
                      style={{
                        height: `${h}%`,
                        animationDuration: `${0.3 + (idx % 4) * 0.15}s`,
                      }}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Recorder Controls */}
            <div className="flex items-center justify-center gap-3">
              {!isRecording ? (
                <button
                  type="button"
                  onClick={() => startMediaRecording(recordMode)}
                  className="py-3 px-6 rounded-2xl bg-error text-white font-bold text-xs flex items-center gap-2 shadow-md hover:bg-error/90 active:scale-98 transition-all"
                >
                  <span
                    className="material-symbols-outlined text-[20px]"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    fiber_manual_record
                  </span>
                  <span>Start Recording {recordMode === 'video' ? 'Video' : 'Audio'}</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => stopMediaRecording(true)}
                  className="py-3 px-6 rounded-2xl bg-slate-900 text-white font-bold text-xs flex items-center gap-2 shadow-md hover:bg-black active:scale-98 transition-all"
                >
                  <span
                    className="material-symbols-outlined text-[20px] text-red-500"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    stop
                  </span>
                  <span>Stop &amp; Review ({formatSeconds(recordingSeconds)})</span>
                </button>
              )}
            </div>

            {/* Recorded Evidence Preview & Save */}
            {recordedMediaUrl && (
              <div className="p-3.5 bg-surface-container-low rounded-2xl space-y-2.5 border border-slate-200/50 dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-secondary text-[20px]">
                      check_circle
                    </span>
                    <span className="text-xs font-bold text-on-surface">
                      Evidence Clip Ready ({formatSeconds(recordingSeconds || 8)})
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-secondary bg-surface-container px-2 py-0.5 rounded-full font-semibold">
                    Encrypted WebM
                  </span>
                </div>

                <p className="text-[11px] text-on-surface-variant">
                  Recorded at North Commons Plaza • Post #14. Encrypted with hardware signature hash.
                </p>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleSaveEvidence}
                    disabled={isEvidenceSaved}
                    className={`flex-1 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${
                      isEvidenceSaved
                        ? 'bg-emerald-600 text-white'
                        : 'bg-secondary text-white hover:bg-secondary/90'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      {isEvidenceSaved ? 'task_alt' : 'lock'}
                    </span>
                    <span>
                      {isEvidenceSaved
                        ? 'Saved to Incident Vault'
                        : 'Save to Secure 999 Vault'}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setRecordedMediaUrl(null);
                      setRecordingSeconds(0);
                      setIsEvidenceSaved(false);
                    }}
                    className="py-2.5 px-3 rounded-xl bg-surface-container text-on-surface text-xs font-semibold hover:bg-surface-container-highest"
                  >
                    Retake
                  </button>
                </div>
              </div>
            )}

            <p className="text-[10px] text-on-surface-variant text-center font-mono">
              Evidence is secured according to criminal justice information standards (CJIS).
            </p>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: General Incident & Sexual Harassment Reporting */}
      {/* ========================================================================= */}
      {activeModal === 'incident' && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-3xl p-5 max-w-md w-full shadow-2xl space-y-4 border border-slate-200/60 dark:border-slate-800 max-h-[92vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary text-[22px]">
                  shield_person
                </span>
                <h3 className="font-bold text-sm text-on-surface">
                  Report Incident / Harassment
                </h3>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-on-surface"
              >
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            </div>

            {incidentSubmitted ? (
              <div className="py-6 text-center space-y-3">
                <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 mx-auto flex items-center justify-center shadow-sm">
                  <span
                    className="material-symbols-outlined text-3xl"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    check_circle
                  </span>
                </div>
                <h4 className="font-bold text-base text-on-surface">Report Securely Received</h4>
                <div className="p-3 bg-surface-container-low rounded-2xl text-xs font-mono text-on-surface">
                  Case Tracking ID:{' '}
                  <span className="text-secondary font-bold">{incidentCaseId}</span>
                </div>
                <p className="text-xs text-on-surface-variant max-w-sm mx-auto leading-relaxed">
                  Your report has been encrypted and routed to dedicated confidential campus
                  advocates and emergency safety desk.
                </p>

                {requestCounselor && (
                  <div className="p-3 rounded-2xl bg-secondary-fixed/30 border border-secondary/30 text-xs text-left text-on-surface space-y-1">
                    <div className="font-bold text-secondary flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[16px]">support_agent</span>
                      <span>Confidential Advocate Assigned</span>
                    </div>
                    <p className="text-[11px] text-on-surface-variant">
                      A trauma-informed counselor will reach out via secure message or you can call
                      the 24/7 confidential campus hotline anytime.
                    </p>
                  </div>
                )}

                <div className="pt-2 flex flex-col gap-2">
                  <a
                    href="tel:999"
                    className="w-full py-2.5 rounded-xl bg-error text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow"
                  >
                    <span className="material-symbols-outlined text-[18px]">call</span>
                    <span>Call 999 Hotline If In Danger</span>
                  </a>
                  <button
                    onClick={() => setActiveModal(null)}
                    className="w-full py-2.5 rounded-xl bg-surface-container text-xs text-on-surface font-semibold hover:bg-surface-container-high"
                  >
                    Close Report
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleIncidentSubmit} className="space-y-3.5">
                {/* Confidentiality Notice */}
                <div className="p-3 rounded-2xl bg-secondary-fixed/20 border border-secondary/20 flex items-start gap-2 text-xs text-on-surface">
                  <span className="material-symbols-outlined text-secondary text-[18px] shrink-0 mt-0.5">
                    lock
                  </span>
                  <p className="leading-snug text-[11px] text-on-surface-variant">
                    <strong>Confidential &amp; Safe Reporting.</strong> Students can report any
                    concerns, including sexual harassment, assault, stalking, or hazards. You may
                    submit anonymously.
                  </p>
                </div>

                {/* Incident Category Selector */}
                <div>
                  <label className="text-xs font-bold text-on-surface block mb-1.5">
                    Incident or Concern Category
                  </label>
                  <select
                    value={incidentCategory}
                    onChange={(e) => setIncidentCategory(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-surface-container border border-slate-300 dark:border-slate-700 text-xs text-on-surface font-medium focus:ring-2 focus:ring-secondary focus:outline-none"
                  >
                    <option value="sexual_harassment">
                      ⚠️ Sexual Harassment or Misconduct (Priority Confidential Support)
                    </option>
                    <option value="stalking_threat">
                      Stalking, Threat, or Intimidation
                    </option>
                    <option value="physical_assault">Physical Assault or Violence</option>
                    <option value="suspicious_activity">Suspicious Person or Activity</option>
                    <option value="medical_mental">Medical Emergency or Mental Health Crisis</option>
                    <option value="theft_vandalism">Theft, Burglary, or Property Damage</option>
                    <option value="facility_hazard">
                      Facility Hazard (Lighting, Ice, Spill, Broken Door)
                    </option>
                    <option value="other">Other Campus Safety Concern</option>
                  </select>
                </div>

                {/* Location */}
                <div>
                  <label className="text-xs font-bold text-on-surface block mb-1">
                    Location of Incident
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={incidentLocation}
                      onChange={(e) => setIncidentLocation(e.target.value)}
                      placeholder="e.g. North Commons Plaza, Library 3rd Floor"
                      className="w-full pl-8 pr-3 py-2 rounded-xl bg-surface-container border border-slate-300 dark:border-slate-700 text-xs text-on-surface focus:ring-2 focus:ring-secondary focus:outline-none"
                    />
                    <span className="material-symbols-outlined text-[16px] text-secondary absolute left-2.5 top-2.5">
                      location_on
                    </span>
                  </div>
                </div>

                {/* Details Description */}
                <div>
                  <label className="text-xs font-bold text-on-surface block mb-1">
                    Description &amp; Details
                  </label>
                  <textarea
                    rows={3}
                    value={incidentDescription}
                    onChange={(e) => setIncidentDescription(e.target.value)}
                    placeholder="Describe what occurred, who was involved, time, and any urgent safety details..."
                    className="w-full p-2.5 rounded-xl bg-surface-container border border-slate-300 dark:border-slate-700 text-xs text-on-surface focus:ring-2 focus:ring-secondary focus:outline-none resize-none"
                  />
                </div>

                {/* Evidence Attachment Option */}
                <div className="p-3 bg-surface-container-low rounded-2xl flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-secondary text-[20px]">
                      perm_media
                    </span>
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-on-surface">Evidence Attachment</span>
                      <span className="text-[10px] text-on-surface-variant">
                        {evidenceAttached
                          ? 'Sound / Video Evidence Attached'
                          : 'No clip recorded yet'}
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveModal('recorder')}
                    className="px-2.5 py-1.5 rounded-xl bg-surface-container text-xs font-semibold text-secondary hover:bg-surface-container-high flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-[16px]">videocam</span>
                    <span>{evidenceAttached ? 'Re-record' : 'Record Now'}</span>
                  </button>
                </div>

                {/* Confidentiality & Anonymous Options */}
                <div className="space-y-2 pt-1 border-t border-slate-100 dark:border-slate-800">
                  <label className="flex items-center gap-2.5 cursor-pointer text-xs text-on-surface">
                    <input
                      type="checkbox"
                      checked={isAnonymous}
                      onChange={(e) => setIsAnonymous(e.target.checked)}
                      className="w-4 h-4 rounded text-secondary focus:ring-secondary"
                    />
                    <span>
                      <strong>Submit Anonymously</strong> (Do not attach my name or Student ID)
                    </span>
                  </label>

                  <label className="flex items-center gap-2.5 cursor-pointer text-xs text-on-surface">
                    <input
                      type="checkbox"
                      checked={requestCounselor}
                      onChange={(e) => setRequestCounselor(e.target.checked)}
                      className="w-4 h-4 rounded text-secondary focus:ring-secondary"
                    />
                    <span>
                      Connect me with a confidential trauma-informed student counselor
                    </span>
                  </label>
                </div>

                {/* Submit Actions */}
                <div className="pt-2 flex flex-col gap-2">
                  <button
                    type="submit"
                    className="w-full py-3 rounded-2xl bg-secondary text-white font-bold text-xs shadow-md hover:bg-secondary/90 transition-colors"
                  >
                    Submit Confidential Case Report
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveModal(null)}
                    className="w-full py-2 rounded-xl bg-surface-container text-xs text-on-surface font-semibold hover:bg-surface-container-high"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* OTHER MODALS: Escort, Silent, Medical, Route, Audit */}
      {/* ========================================================================= */}
      {activeModal === 'escort' && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-3xl p-6 max-w-sm w-full shadow-2xl space-y-4 border border-slate-200/60 dark:border-slate-800">
            <h3 className="font-bold text-base text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary">directions_walk</span>
              <span>Request Campus Escort</span>
            </h3>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              A certified safety officer will meet you at North Commons Plaza • Post #14.
            </p>
            <div className="p-3 bg-surface-container-low rounded-2xl text-xs font-mono">
              📍 Current Location: North Commons Plaza (±0.8m)
              <div className="text-secondary font-bold mt-1">Estimated ETA: 4 minutes</div>
            </div>
            <button
              onClick={() => {
                alert('Campus Escort Dispatched. An officer is en route to North Commons Plaza #14.');
                setActiveModal(null);
              }}
              className="w-full py-3 rounded-2xl bg-secondary text-white font-bold text-xs shadow"
            >
              Confirm Escort Request
            </button>
            <button
              onClick={() => setActiveModal(null)}
              className="w-full py-2.5 rounded-2xl bg-surface-container text-xs text-on-surface font-semibold"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {activeModal === 'silent' && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-3xl p-6 max-w-sm w-full shadow-2xl space-y-4 text-center border border-slate-200/60 dark:border-slate-800">
            <span className="material-symbols-outlined text-4xl text-secondary">volume_off</span>
            <h3 className="font-bold text-base text-on-surface">Silent Distress Active</h3>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              Encrypted coordinates transmitted discreetly to Campus Police and 999 Hotline without
              audio alarms or screen warnings.
            </p>
            <button
              onClick={() => setActiveModal(null)}
              className="w-full py-3 rounded-2xl bg-secondary text-white font-bold text-xs"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {activeModal === 'medical' && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-3xl p-6 max-w-sm w-full shadow-2xl space-y-4 border border-slate-200/60 dark:border-slate-800">
            <h3 className="font-bold text-base text-error flex items-center gap-2">
              <span className="material-symbols-outlined">medical_services</span>
              <span>Medical Emergency Alert</span>
            </h3>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              Priority connection to Health Center EMT squad and 999 Emergency Dispatch.
            </p>
            <div className="flex flex-col gap-2">
              <a
                href="tel:999"
                className="w-full py-3 rounded-2xl bg-error text-white font-bold text-xs flex items-center justify-center gap-2 shadow"
              >
                <span className="material-symbols-outlined text-[18px]">call</span>
                <span>Call 999 Ambulance Directly</span>
              </a>
              <button
                onClick={() => {
                  alert('Campus EMT squad dispatched to North Commons Plaza Post #14.');
                  setActiveModal(null);
                }}
                className="w-full py-2.5 rounded-2xl bg-surface-container text-xs text-on-surface font-semibold"
              >
                Transmit Digital Medical SOS
              </button>
            </div>
            <button
              onClick={() => setActiveModal(null)}
              className="w-full py-2 rounded-xl text-xs text-on-surface-variant hover:text-on-surface"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {activeModal === 'route' && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-3xl p-6 max-w-sm w-full shadow-2xl space-y-4 border border-slate-200/60 dark:border-slate-800">
            <h3 className="font-bold text-base text-on-surface">Route to Blue Light #12</h3>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              Walk 45 meters East along the lit quad pathway. Tower has high-output LED beacon and
              direct voice dispatch link to 999 services.
            </p>
            <button
              onClick={() => setActiveModal(null)}
              className="w-full py-3 rounded-2xl bg-secondary text-white text-xs font-bold shadow"
            >
              Start Guidance
            </button>
          </div>
        </div>
      )}

      {activeModal === 'audit' && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-3xl p-6 max-w-sm w-full shadow-2xl space-y-3 border border-slate-200/60 dark:border-slate-800">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-base text-on-surface">Telemetry Audit Trail</h3>
              <button onClick={() => setActiveModal(null)}>
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            </div>
            <div className="p-3 bg-surface-container-low rounded-2xl text-[11px] font-mono space-y-1.5 max-h-48 overflow-y-auto">
              <div>[20:00:12] Triangulation hash: 88bf3a... (On-Device)</div>
              <div>[20:00:10] Sensor match: BLE 5.3 + 6E spatial mesh</div>
              <div>[20:00:05] Emergency Link: 999 Hotline Gateway Verified</div>
              <div>[20:00:00] Title IX &amp; FERPA Privacy: Directive 404-B Verified</div>
            </div>
            <button
              onClick={() => setActiveModal(null)}
              className="w-full py-2.5 rounded-2xl bg-secondary text-white text-xs font-semibold"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
