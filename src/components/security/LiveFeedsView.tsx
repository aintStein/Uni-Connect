import React, { useState, useEffect } from 'react';
import { CameraFeedItem, Language } from '../../types';
import { CAMERA_FEEDS, TRANSLATIONS } from '../../data/mockCampusData';

interface LiveFeedsViewProps {
  language?: Language;
}

export const LiveFeedsView: React.FC<LiveFeedsViewProps> = ({ language = 'en' }) => {
  const t = TRANSLATIONS[language];
  const [feeds, setFeeds] = useState<CameraFeedItem[]>(CAMERA_FEEDS);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [thermalMode, setThermalMode] = useState(true);
  const [nightVisionActive, setNightVisionActive] = useState(false);
  const [mosaicMode, setMosaicMode] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [liveClock, setLiveClock] = useState('00:00:00.00');
  const [activeModal, setActiveModal] = useState<string | null>(null);

  // High precision millisecond clock
  useEffect(() => {
    const clockTimer = setInterval(() => {
      const now = new Date();
      const hrs = String(now.getHours()).padStart(2, '0');
      const mins = String(now.getMinutes()).padStart(2, '0');
      const secs = String(now.getSeconds()).padStart(2, '0');
      const ms = String(Math.floor(now.getMilliseconds() / 10)).padStart(2, '0');
      setLiveClock(`${hrs}:${mins}:${secs}.${ms}`);
    }, 65);
    return () => clearInterval(clockTimer);
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2500);
  };

  const filteredFeeds =
    selectedCategory === 'all'
      ? feeds
      : selectedCategory === 'high-density'
      ? feeds.filter((f) => f.personsCount > 30)
      : selectedCategory === 'entrances'
      ? feeds.filter((f) => f.camId === 'CAM-08' || f.camId === 'CAM-04')
      : feeds.filter((f) => f.camId === 'CAM-12');

  return (
    <div className={`flex flex-col w-full gap-4 pb-28 ${nightVisionActive ? 'hue-rotate-90 saturate-200' : ''}`}>
      {/* Telemetry Status Bar */}
      <div className="bg-surface-container-low rounded-2xl p-3 shadow-xs border border-slate-200/50 dark:border-slate-800">
        <div className="flex items-center justify-between gap-2 overflow-x-auto no-scrollbar py-0.5">
          <div className="flex items-center gap-1.5 shrink-0 px-2.5 py-1 rounded-full bg-surface-container-lowest shadow-xs border border-slate-200/40 dark:border-slate-800">
            <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
            <span className="text-[11px] font-mono font-bold text-on-surface tracking-wide">
              FEEDS: 48/48 ONLINE
            </span>
          </div>

          <div className="flex items-center gap-1.5 shrink-0 px-2.5 py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed shadow-xs">
            <span className="material-symbols-outlined text-[14px]">psychology</span>
            <span className="text-[11px] font-mono font-semibold">AI ANOMALY: ACTIVE</span>
          </div>

          <div className="flex items-center gap-1.5 shrink-0 px-2.5 py-1 rounded-full bg-surface-container-lowest text-on-surface-variant shadow-xs border border-slate-200/40 dark:border-slate-800">
            <span className="material-symbols-outlined text-[14px] text-secondary">bolt</span>
            <span className="text-[11px] font-mono font-semibold text-on-surface">18ms</span>
          </div>
        </div>
      </div>

      {/* Filter Chips Bar */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
        {[
          { id: 'all', label: language === 'zh' ? '全部摄像头' : language === 'ms' ? 'Semua Kamera' : language === 'id' ? 'Semua Kamera' : language === 'kk' ? 'Барлық камералар' : 'All Cameras' },
          { id: 'high-density', label: language === 'zh' ? '高人流密集区' : language === 'ms' ? 'Zon Kepadatan Tinggi' : language === 'id' ? 'Zona Padat Orang' : language === 'kk' ? 'Тығыздығы жоғары аймақ' : 'High Density Zones' },
          { id: 'entrances', label: language === 'zh' ? '出入口及周界' : language === 'ms' ? 'Pintu Masuk & Perimeter' : language === 'id' ? 'Gerbang & Perimeter' : language === 'kk' ? 'Кіреберістер' : 'Entrances & Perimeters' },
          { id: 'labs', label: language === 'zh' ? '重点实验室' : language === 'ms' ? 'Makmal Utama' : language === 'id' ? 'Lab Utama' : language === 'kk' ? 'Негізгі зертханалар' : 'Critical Labs' },
        ].map((chip) => (
          <button
            key={chip.id}
            onClick={() => setSelectedCategory(chip.id)}
            className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all shadow-xs ${
              selectedCategory === chip.id
                ? 'bg-secondary text-white'
                : 'bg-surface-container-lowest text-on-surface-variant hover:text-on-surface border border-slate-200/60 dark:border-slate-800'
            }`}
          >
            {chip.label}
          </button>
        ))}
      </div>

      {/* Camera Streams Container */}
      <div className={mosaicMode ? 'grid grid-cols-1 sm:grid-cols-2 gap-4' : 'flex flex-col gap-4'}>
        {/* FEED 1: North Quad & Central Plaza (Large Primary View) */}
        <div className="bg-surface-container-lowest rounded-3xl border border-slate-200/60 dark:border-slate-800 shadow-md overflow-hidden relative">
          {/* Feed Header */}
          <div className="p-3.5 flex items-center justify-between bg-surface-container-lowest">
            <div className="flex items-center gap-2 min-w-0">
              <span className="w-2.5 h-2.5 rounded-full bg-error animate-ping" />
              <div className="flex flex-col min-w-0">
                <span className="font-bold text-xs text-on-surface truncate">
                  North Quad & Central Plaza
                </span>
                <span className="text-[10px] font-mono text-on-surface-variant">
                  CAM-04 • 1080P 60FPS • REC_LIVE
                </span>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded bg-surface-container-high text-on-surface text-[11px] font-mono">
              {liveClock}
            </span>
          </div>

          {/* Video Box with AI Bounding Boxes */}
          <div className="relative w-full aspect-video bg-slate-950 overflow-hidden group">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuA6RcZhegfDGECP884Di0CF-s_TnW63PGX2DmUCAYXJgnwy7nR2UNo31nLJ4gOKL749nfYjwRjTuyMvv0atuB0m_WzzBruxvzvhExyhIrIz4UeE38ptb7plFbtiinbJvrPajIjTDApJ7c1-GSoBnSNiuYOdJJ1TzaL3ukLzVrXIT7_PjkxjHRaoCe8MvQxpw9yCsjT3tzoQLUsbMsI-FMIK4DnHLLCu0hE104QViOXk45Ieo3qBr81R"
              alt="CCTV North Quad"
              className="w-full h-full object-cover"
            />

            {/* AI HUD Overlay */}
            <div className="absolute inset-0 pointer-events-none p-3 flex flex-col justify-between bg-gradient-to-t from-black/80 via-transparent to-black/40">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-black/75 backdrop-blur-md text-cyan-300 text-[10px] font-mono">
                  <span className="material-symbols-outlined text-[13px]">center_focus_strong</span>
                  <span>AI OBJECT TRACK: ACTIVE</span>
                </div>
                <div className="flex items-center gap-1 px-2 py-0.5 rounded bg-black/75 backdrop-blur-md text-white text-[10px] font-mono">
                  <span className="material-symbols-outlined text-[13px] text-indigo-400">graphic_eq</span>
                  <span>AUDIO: 54dB (NORMAL)</span>
                </div>
              </div>

              {/* Bounding boxes */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="absolute top-[28%] left-[34%] w-[18%] h-[36%] rounded border border-cyan-400 bg-secondary/15 backdrop-blur-[0.5px]">
                  <span className="absolute -top-4 left-0 px-1 py-0.2 rounded bg-secondary text-white text-[9px] font-mono">
                    ID#892 [98%]
                  </span>
                </div>
                <div className="absolute top-[38%] right-[26%] w-[14%] h-[32%] rounded border border-cyan-400 bg-secondary/15 backdrop-blur-[0.5px]">
                  <span className="absolute -top-4 left-0 px-1 py-0.2 rounded bg-secondary text-white text-[9px] font-mono">
                    ID#893 [94%]
                  </span>
                </div>
              </div>

              {/* Telemetry strip at bottom */}
              <div className="flex items-end justify-between pointer-events-auto">
                <div className="flex items-center gap-1.5">
                  <span className="px-2 py-0.5 rounded bg-secondary text-white text-[10px] font-mono font-bold">
                    PERSONS: 42
                  </span>
                  <span className="px-2 py-0.5 rounded bg-white/90 text-slate-900 text-[10px] font-mono font-bold">
                    VELOCITY: 1.2 m/s
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => showToast('Optic Zoom 2.0x Engaged')}
                    className="w-7 h-7 rounded bg-black/70 text-white hover:bg-black flex items-center justify-center"
                    title="Zoom in"
                  >
                    <span className="material-symbols-outlined text-[16px]">zoom_in</span>
                  </button>
                  <button
                    onClick={() => showToast('Camera Centered on North Path')}
                    className="w-7 h-7 rounded bg-black/70 text-white hover:bg-black flex items-center justify-center"
                    title="Zoom out"
                  >
                    <span className="material-symbols-outlined text-[16px]">zoom_out</span>
                  </button>
                  <button
                    onClick={() => showToast('Full Screen Stream Maximized')}
                    className="w-7 h-7 rounded bg-black/70 text-white hover:bg-black flex items-center justify-center"
                    title="Maximize"
                  >
                    <span className="material-symbols-outlined text-[16px]">fullscreen</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-3 bg-surface-container-low flex items-center justify-between text-xs text-on-surface-variant">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[16px] text-secondary">
                wifi_tethering
              </span>
              <span className="font-semibold text-on-surface">Mesh Node #04B</span>
              <span>•</span>
              <span>PTZ Lens: Auto-Patrol</span>
            </div>
            <button
              onClick={() => setActiveModal('cam-04-log')}
              className="px-3 py-1 rounded-xl bg-surface-container-lowest text-secondary font-bold text-xs shadow-xs hover:bg-secondary-fixed transition-colors"
            >
              Audit Log
            </button>
          </div>
        </div>

        {/* FEED 2: Science & Engineering Atrium (Thermal / FLIR Mode) */}
        <div className="bg-surface-container-lowest rounded-3xl border border-slate-200/60 dark:border-slate-800 shadow-md overflow-hidden">
          <div className="p-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2 min-w-0">
              <span className="w-2.5 h-2.5 rounded-full bg-secondary" />
              <div className="flex flex-col min-w-0">
                <span className="font-bold text-xs text-on-surface truncate">
                  Science & Engineering Atrium
                </span>
                <span className="text-[10px] font-mono text-on-surface-variant">
                  CAM-12 • THERMAL/FLIR OPTIC
                </span>
              </div>
            </div>
            <button
              onClick={() => {
                setThermalMode(!thermalMode);
                showToast(
                  thermalMode ? 'Thermal Sensor Disengaged (RGB Mode)' : 'IR Thermal Optic Activated (36.6°C)'
                );
              }}
              className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold flex items-center gap-1 transition-all ${
                thermalMode
                  ? 'bg-secondary text-white'
                  : 'bg-surface-container text-on-surface-variant'
              }`}
            >
              <span className="material-symbols-outlined text-[14px]">thermostat</span>
              <span>{thermalMode ? 'IR THERMAL: ON' : 'IR THERMAL: OFF'}</span>
            </button>
          </div>

          <div className="relative w-full aspect-video bg-slate-950 overflow-hidden">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAe1FbAtrkhN9VGqvO0rHuC_u3ClqkGtfHxJfuI6KUYdWn44WcYfdHCjxy6WJdhQSC7iiD3iUFScRRPF0-_381haBP7sGGywaqUkaebHWDABdBLCA8OXI3d4PBwwrvD6lnRuuZced-xc0P6x_XV2nb9JT--BSGTf7wU1RWUlb_PJBmpYjdlhQ5lwn_JPzEPQk1m5-MoB09ObcyhyDD-WQ78-kdvv1hl5YrmSnTrAZNkV0-jMHSzQhoB"
              alt="Thermal Atrium"
              className={`w-full h-full object-cover transition-all duration-300 ${
                thermalMode ? 'filter-none' : 'grayscale contrast-125'
              }`}
            />

            {/* Thermal overlay with SVG motion vectors */}
            <div className="absolute inset-0 pointer-events-none p-3 flex flex-col justify-between bg-gradient-to-b from-black/60 via-transparent to-black/70">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded bg-black/80 text-cyan-300 text-[10px] font-mono">
                  HEAT SENSOR: CALIBRATED 36.6°C
                </span>
                <span className="px-2 py-0.5 rounded bg-black/80 text-white text-[10px] font-mono">
                  FLIR V4.2
                </span>
              </div>

              {/* Vector Motion Curves */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 400 220">
                <path
                  d="M 100 160 L 160 120 L 210 130"
                  fill="none"
                  stroke="#acedff"
                  strokeDasharray="4,4"
                  strokeWidth="2"
                  opacity="0.8"
                />
                <circle cx="210" cy="130" r="4" fill="#acedff" />

                <path
                  d="M 260 80 L 300 75 L 330 95"
                  fill="none"
                  stroke="#645efb"
                  strokeDasharray="3,3"
                  strokeWidth="2"
                  opacity="0.9"
                />
                <circle cx="330" cy="95" r="4" fill="#645efb" />
              </svg>

              <div className="flex items-end justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="px-2 py-0.5 rounded bg-black/90 text-cyan-300 text-[10px] font-mono font-bold">
                    OCCUPANCY: 28 STUDENTS
                  </span>
                  <span className="px-2 py-0.5 rounded bg-black/80 text-white text-[10px] font-mono">
                    FLOW VECTOR: NORTH-EAST
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded bg-black/80 text-white text-[10px] font-mono">
                  60 FPS
                </span>
              </div>
            </div>
          </div>

          <div className="p-3 bg-surface-container-low flex items-center justify-between text-xs text-on-surface-variant">
            <span className="font-semibold text-on-surface">Zone 2 Atrium • HVAC Sync Nominal</span>
            <button
              onClick={() => showToast('Thermal FLIR calibration locked to 36.6°C')}
              className="px-3 py-1 rounded-xl bg-surface-container-lowest text-on-surface font-semibold text-xs shadow-xs hover:bg-surface-container-high transition-colors"
            >
              Calibrate Optic
            </button>
          </div>
        </div>

        {/* 2 Smaller Feeds: East Library & Sports Complex */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Feed 3: East Library Turnstiles */}
          <div className="bg-surface-container-lowest rounded-3xl border border-slate-200/60 dark:border-slate-800 shadow-md overflow-hidden flex flex-col justify-between">
            <div className="p-3 flex items-center justify-between">
              <div>
                <h4 className="font-bold text-xs text-on-surface">East Library Turnstiles</h4>
                <span className="text-[10px] font-mono text-on-surface-variant">
                  CAM-08 • ACCESS GATES
                </span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed text-[10px] font-mono font-bold">
                +14/MIN
              </span>
            </div>

            <div className="relative w-full aspect-video bg-slate-950 overflow-hidden">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBHJMZypDeYR-Yu0sxEnFQ1eTgqNt1Yl8foTj6Q7MWOcD-tIY7s5lA6DjrLZnoVyk-uhezuzRiEEyykehfVv0Pd8BcZxtYv46Po5YedH0_vmUBedFxDu2T8cD1aGOpFru6zPQ1sT10aW7VO2x41mdQV6OCgfWJFnTFSLDnWctM0mCkBLXSHDTUGuZ4oeZ8WkEFpa3OHypNOTBao-eOCphWiD1V6GrYDoC88Uzn79LVGQMUMvp69ofQZ"
                alt="Library Turnstiles"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 p-2.5 flex flex-col justify-between pointer-events-none bg-gradient-to-t from-black/80 via-transparent to-transparent">
                <div className="flex items-center justify-between">
                  <span className="px-1.5 py-0.5 rounded bg-white/80 text-slate-900 text-[10px] font-mono font-bold">
                    GATES 1-6
                  </span>
                  <span className="px-1.5 py-0.5 rounded bg-secondary text-white text-[10px] font-mono">
                    NFC ACTIVE
                  </span>
                </div>
                <div className="flex items-center justify-between text-white text-[10px] font-mono">
                  <span>ALL GATES CLEAR</span>
                  <span className="text-cyan-300">PASS: 812 TODAY</span>
                </div>
              </div>
            </div>

            <div className="p-2.5 bg-surface-container-low flex items-center justify-between text-xs">
              <span className="text-on-surface-variant">Throughput: Stable</span>
              <span className="font-mono font-bold text-secondary text-[11px]">NO QUEUE DELAY</span>
            </div>
          </div>

          {/* Feed 4: Sports Complex & Gym */}
          <div className="bg-surface-container-lowest rounded-3xl border border-slate-200/60 dark:border-slate-800 shadow-md overflow-hidden flex flex-col justify-between">
            <div className="p-3 flex items-center justify-between">
              <div>
                <h4 className="font-bold text-xs text-on-surface">Sports Complex & Gym</h4>
                <span className="text-[10px] font-mono text-on-surface-variant">
                  CAM-21 • MAIN ARENA
                </span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-error-container text-on-error-container text-[10px] font-mono font-bold">
                86% CAP
              </span>
            </div>

            <div className="relative w-full aspect-video bg-slate-950 overflow-hidden">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuB4hf9Oncy08C-h4wsBz0JsZH78dF5phqgF9fePowzTU4fyfNN8LVCcWh1OfgLz-2gIin1FqDDxS78RVW7BnKM63HzXRRpXD-XDywuA0cTEHWpquTGeZmiIR_Mbc86yNRtGFnpiTiwyqLHQIA2dB1jmEf0jiH9RsV7Aih-H1gTTTbKKT2S9i2-UmvbWUbIBsz-CtFouatEeTvlkFB9HABqX8uSqm6vZNq-226RFzTShoozZgTlce9_v"
                alt="Gym Arena"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 p-2.5 flex flex-col justify-between pointer-events-none bg-gradient-to-t from-black/80 via-transparent to-transparent">
                <div className="flex items-center justify-between">
                  <span className="px-1.5 py-0.5 rounded bg-error text-white text-[10px] font-mono font-bold flex items-center gap-1">
                    <span className="material-symbols-outlined text-[11px]">warning</span>
                    DENSITY THRESHOLD
                  </span>
                  <span className="px-1.5 py-0.5 rounded bg-black/80 text-white text-[10px] font-mono">
                    ZONE 4
                  </span>
                </div>
                <div className="flex items-center justify-between text-white text-[10px] font-mono">
                  <span>HEADCOUNT: 184/210</span>
                  <span>LANE C</span>
                </div>
              </div>
            </div>

            <div className="p-2.5 bg-surface-container-low flex items-center justify-between text-xs">
              <span className="text-on-surface-variant">Flow: Entry Heavy</span>
              <button
                onClick={() => showToast('Turnstile gate entry rate throttled to 5/min')}
                className="px-2.5 py-1 rounded-lg bg-surface-container-lowest text-error font-bold text-xs shadow-xs hover:bg-error-container"
              >
                Limit Access
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tactical Patrol Desk Toolbar */}
      <div className="bg-primary-container text-white rounded-3xl p-4 shadow-xl border border-slate-700/60 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary-fixed text-[18px]">tune</span>
            <h3 className="font-bold text-xs text-white">Tactical Patrol Desk</h3>
          </div>
          <span className="text-[10px] font-mono text-cyan-300">ENCRYPTED STREAM</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {/* Action 1: Snapshot */}
          <button
            onClick={() => showToast('HQ Frame Cached to Cloud Storage Vault')}
            className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-white text-xs font-medium border border-slate-700 transition-all shadow-xs"
          >
            <span className="material-symbols-outlined text-[18px] text-cyan-300">photo_camera</span>
            <span>Snapshot</span>
          </button>

          {/* Action 2: Dispatch */}
          <button
            onClick={() => showToast('Rapid Patrol Unit #03 Dispatched to Quad')}
            className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-secondary text-white hover:bg-secondary-container text-xs font-semibold transition-all shadow-md"
          >
            <span className="material-symbols-outlined text-[18px]">local_police</span>
            <span>Dispatch</span>
          </button>

          {/* Action 3: Full Mosaic */}
          <button
            onClick={() => {
              setMosaicMode(!mosaicMode);
              showToast(mosaicMode ? 'Standard Grid Layout' : '4-Up Synchronized Mosaic View');
            }}
            className={`flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-medium border transition-all ${
              mosaicMode
                ? 'bg-cyan-500 text-slate-950 border-cyan-400 font-bold'
                : 'bg-slate-900/80 hover:bg-slate-800 text-white border-slate-700'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">aspect_ratio</span>
            <span>{mosaicMode ? 'Standard' : 'Full Mosaic'}</span>
          </button>

          {/* Action 4: Night Vision */}
          <button
            onClick={() => {
              setNightVisionActive(!nightVisionActive);
              showToast(nightVisionActive ? 'Night Vision Filter Disengaged' : 'Low-Lux Night Vision Amplified');
            }}
            className={`flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-medium border transition-all ${
              nightVisionActive
                ? 'bg-emerald-500 text-slate-950 border-emerald-400 font-bold'
                : 'bg-slate-900/80 hover:bg-slate-800 text-white border-slate-700'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">nightlight</span>
            <span>Night Vision</span>
          </button>
        </div>
      </div>

      {/* Real-time Toast Feedback */}
      {toastMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 pointer-events-none transition-all duration-300">
          <div className="px-4 py-2 rounded-full bg-slate-900 text-white shadow-2xl border border-cyan-400/40 flex items-center gap-2 text-xs font-mono">
            <span className="material-symbols-outlined text-secondary-fixed text-[18px]">
              check_circle
            </span>
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Audit Log Modal */}
      {activeModal === 'cam-04-log' && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-sm w-full shadow-2xl space-y-3">
            <div className="flex justify-between items-center">
              <h4 className="font-bold text-xs text-on-surface">CAM-04 Telemetry Audit Log</h4>
              <button onClick={() => setActiveModal(null)}>
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-2xl border text-[11px] font-mono space-y-1.5 max-h-48 overflow-y-auto">
              <div>[19:25:52] Person cluster (42) tracking nominal</div>
              <div>[19:24:10] Audio envelope within baseline (54dB)</div>
              <div>[19:20:00] Auto-patrol PTZ cycle completed</div>
            </div>
            <button
              onClick={() => setActiveModal(null)}
              className="w-full py-2.5 rounded-xl bg-secondary text-white text-xs font-semibold"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
