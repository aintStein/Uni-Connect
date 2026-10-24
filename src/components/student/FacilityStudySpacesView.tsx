import React, { useState } from 'react';
import { FacilityStudySpace, Language } from '../../types';
import { FACILITY_SPACES, TRANSLATIONS } from '../../data/mockCampusData';

interface FacilityStudySpacesViewProps {
  language: Language;
}

export const FacilityStudySpacesView: React.FC<FacilityStudySpacesViewProps> = ({ language }) => {
  const [facilities, setFacilities] = useState<FacilityStudySpace[]>(FACILITY_SPACES);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showSavedOnly, setShowSavedOnly] = useState(false);
  const [densityAlertActive, setDensityAlertActive] = useState(true);
  const t = TRANSLATIONS[language];

  const filtered = facilities.filter((f) => {
    const matchesCat = selectedCategory === 'all' || f.category === selectedCategory;
    const matchesSaved = !showSavedOnly || f.isSaved;
    return matchesCat && matchesSaved;
  });

  const toggleSave = (id: string) => {
    setFacilities((prev) =>
      prev.map((f) => (f.id === id ? { ...f, isSaved: !f.isSaved } : f))
    );
  };

  return (
    <div className="flex flex-col w-full gap-4 pb-24">
      {/* Privacy-Safe Telemetry Banner */}
      <div className="w-full bg-surface-container-high/70 rounded-2xl p-4 shadow-sm border border-slate-200/50 dark:border-slate-800">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-secondary-fixed flex items-center justify-center shrink-0 mt-0.5 text-secondary">
            <span className="material-symbols-outlined text-[18px]">sensors</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[11px] font-mono text-secondary uppercase tracking-wider font-semibold">
                Spatial Mesh v4.2
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-surface-container-lowest text-[10px] font-mono text-on-surface-variant">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-ping" />
                Syncing
              </span>
            </div>
            <h2 className="text-sm font-bold text-on-surface mt-0.5 leading-snug">
              Live Facility Density & Study Spaces
            </h2>
            <p className="text-xs text-on-surface-variant mt-1">
              Privacy-Safe Telemetry • Anonymous RF density without camera or device tracking
            </p>
          </div>
        </div>
      </div>

      {/* Filter & Sort Strip */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3.5 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all shadow-xs ${
              selectedCategory === 'all'
                ? 'bg-secondary text-white'
                : 'bg-surface-container-high text-on-surface hover:bg-surface-container-highest'
            }`}
          >
            All Facilities
          </button>
          <button
            onClick={() => setSelectedCategory('study')}
            className={`px-3.5 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all shadow-xs ${
              selectedCategory === 'study'
                ? 'bg-secondary text-white'
                : 'bg-surface-container-high text-on-surface hover:bg-surface-container-highest'
            }`}
          >
            Study & Quiet Rooms
          </button>
          <button
            onClick={() => setSelectedCategory('sports')}
            className={`px-3.5 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all shadow-xs ${
              selectedCategory === 'sports'
                ? 'bg-secondary text-white'
                : 'bg-surface-container-high text-on-surface hover:bg-surface-container-highest'
            }`}
          >
            Sports & Gym
          </button>
          <button
            onClick={() => setSelectedCategory('dining')}
            className={`px-3.5 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all shadow-xs ${
              selectedCategory === 'dining'
                ? 'bg-secondary text-white'
                : 'bg-surface-container-high text-on-surface hover:bg-surface-container-highest'
            }`}
          >
            Dining & Social
          </button>
        </div>

        {/* Sorting & Saved Toggles */}
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-1.5 text-on-surface-variant text-xs font-mono">
            <span className="material-symbols-outlined text-[16px] text-secondary">tune</span>
            <span>Sort: Least Crowded First</span>
          </div>
          <button
            onClick={() => setShowSavedOnly(!showSavedOnly)}
            className={`flex items-center gap-1 text-[11px] font-mono px-3 py-1 rounded-full transition-colors ${
              showSavedOnly
                ? 'bg-secondary text-white font-semibold'
                : 'bg-secondary-fixed/50 text-secondary hover:bg-secondary-fixed'
            }`}
          >
            <span className="material-symbols-outlined text-[14px]">star</span>
            <span>My Saved ({facilities.filter((f) => f.isSaved).length})</span>
          </button>
        </div>
      </div>

      {/* Top Optimal Study Choice Hero */}
      <div className="w-full bg-surface-container-lowest rounded-3xl p-5 shadow-sm border border-slate-200/60 dark:border-slate-800">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-secondary text-[20px]">verified</span>
            <span className="text-[11px] font-mono font-bold text-secondary uppercase tracking-wider">
              Optimal Study Choice
            </span>
          </div>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[11px] font-mono font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            Calm & Spacious
          </span>
        </div>

        <div className="flex gap-3.5 items-start">
          <img
            className="w-20 h-20 rounded-2xl object-cover shrink-0 shadow-sm"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDzzR6_yoEThvUTwqLbf5tl0fMkvzTXTc3FNHoADxgeYqnv9X2JjPjbE0wrRS7ejgrVJDrxaxF0PBO2sT5Gab_aIVx_QKCXBx5HBK_a21UBJ33ws00W5Dv6mHKiI4HzkGKwJjZyYvg73QKoAn_DA8MYFqiQ1ifDoyTkc5idsvm0Dj4gZQ0DGiiY212ZfincET09oKBzgTQnb6oZfoEB19kkoH-AdHAYf94-VRiOwSudWxyuz1MjafUH"
            alt="West Campus Quiet Pavilion"
          />
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-sm text-on-surface truncate">
              West Campus Quiet Pavilion
            </h3>
            <p className="text-xs text-on-surface-variant mt-0.5">North Quad • Building 4B (Floor 2)</p>
            <div className="flex items-center gap-2 mt-2 text-[11px] font-mono text-on-surface-variant flex-wrap">
              <span className="inline-flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px] text-secondary">schedule</span>
                Calm until ~3:30 PM
              </span>
              <span>•</span>
              <span className="inline-flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px] text-secondary">wifi</span>
                Wi-Fi 6E
              </span>
            </div>
          </div>
        </div>

        {/* Micro Highlights Grid */}
        <div className="grid grid-cols-3 gap-2 mt-3 pt-3 bg-surface-container-low rounded-2xl p-3 border border-slate-200/40 dark:border-slate-800/60">
          <div className="text-center">
            <span className="text-[10px] font-mono text-on-surface-variant block">Desk Outlets</span>
            <span className="font-bold text-xs text-on-surface mt-0.5 block">Abundant</span>
          </div>
          <div className="text-center">
            <span className="text-[10px] font-mono text-on-surface-variant block">Sound Level</span>
            <span className="font-bold text-xs text-on-surface mt-0.5 block">Silent Zone</span>
          </div>
          <div className="text-center">
            <span className="text-[10px] font-mono text-on-surface-variant block">Natural Light</span>
            <span className="font-bold text-xs text-on-surface mt-0.5 block">High / Sky</span>
          </div>
        </div>

        <div className="flex items-center gap-2 mt-3 pt-1">
          <button
            onClick={() => alert('Walking route initiated: 3 min walk across North Commons.')}
            className="flex-1 h-11 rounded-xl bg-secondary text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-xs hover:bg-secondary-container transition-all"
          >
            <span className="material-symbols-outlined text-[18px]">near_me</span>
            <span>Walk There (3 min)</span>
          </button>
          <button
            onClick={() => toggleSave('fac-quiet-pavilion')}
            className="w-11 h-11 rounded-xl bg-surface-container flex items-center justify-center text-secondary hover:bg-surface-container-high transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">
              {facilities.find((f) => f.id === 'fac-quiet-pavilion')?.isSaved
                ? 'bookmark'
                : 'bookmark_border'}
            </span>
          </button>
        </div>
      </div>

      {/* Facility Cards List */}
      <div className="flex flex-col gap-3">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="w-full bg-surface-container-lowest rounded-2xl p-4 shadow-sm border border-slate-200/60 dark:border-slate-800 space-y-2.5 hover:bg-surface-container-low transition-colors"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <h4 className="font-bold text-xs text-on-surface truncate">{item.name}</h4>
                  {item.isSaved && (
                    <span className="material-symbols-outlined text-secondary text-[16px]">star</span>
                  )}
                </div>
                <p className="text-[11px] text-on-surface-variant mt-0.5">{item.location}</p>
              </div>

              <span
                className={`shrink-0 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold ${
                  item.statusType === 'calm'
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                    : item.statusType === 'moderate'
                    ? 'bg-secondary-fixed text-on-secondary-fixed'
                    : item.statusType === 'busy'
                    ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                    : 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300'
                }`}
              >
                {item.statusLabel}
              </span>
            </div>

            {/* Vibe / Atmosphere */}
            <div className="text-xs text-on-surface-variant flex items-center gap-2 flex-wrap">
              <span>{item.vibeText}</span>
            </div>

            {/* Subzones or Tip */}
            {item.subzones && (
              <div className="grid grid-cols-2 gap-2 pt-1">
                {item.subzones.map((sz, idx) => (
                  <div
                    key={idx}
                    className="p-2 rounded-xl bg-surface-container-low flex items-center justify-between text-xs"
                  >
                    <span className="text-on-surface-variant">{sz.label}</span>
                    <span className="font-mono font-bold text-on-surface">{sz.value}</span>
                  </div>
                ))}
              </div>
            )}

            {item.tip && (
              <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200/60 dark:border-amber-800/60 text-xs text-amber-900 dark:text-amber-200 flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary text-[18px] shrink-0">
                  tips_and_updates
                </span>
                <span>{item.tip}</span>
              </div>
            )}

            {/* Crowd Rhythm Bar if Available */}
            {item.hourlyRhythm && (
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between text-[11px] font-mono mb-1">
                  <span className="text-on-surface-variant">Today's Crowd Rhythm</span>
                  <span className="text-secondary font-semibold">Easing after 8:30 PM</span>
                </div>
                <div className="w-full bg-surface-container-high h-2.5 rounded-full overflow-hidden flex">
                  <div className="bg-emerald-400 h-full" style={{ width: '25%' }} />
                  <div className="bg-cyan-400 h-full" style={{ width: '25%' }} />
                  <div className="bg-secondary h-full" style={{ width: '35%' }} />
                  <div className="bg-emerald-400 h-full" style={{ width: '15%' }} />
                </div>
                <div className="flex justify-between text-[10px] font-mono text-on-surface-variant mt-1">
                  <span>7 AM</span>
                  <span>12 PM</span>
                  <span className="font-bold text-secondary">Now (Peak)</span>
                  <span>10 PM</span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Detailed Hourly Rhythm Forecast Bar Graph */}
      <div className="w-full bg-surface-container-lowest rounded-3xl p-5 shadow-sm border border-slate-200/60 dark:border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary text-[20px]">analytics</span>
            <h3 className="font-bold text-sm text-on-surface">Facility Rhythm Predictor</h3>
          </div>
          <span className="text-[11px] font-mono text-on-surface-variant">Historic Pattern</span>
        </div>
        <p className="text-xs text-on-surface-variant">
          Synthesized from anonymized campus Wi-Fi density trends over the past 4 weeks.
        </p>

        {/* Hourly Bars */}
        <div className="flex items-end justify-between gap-1 h-28 pt-2 px-1">
          {[
            { hour: '08:00', label: 'Low', height: '25%', color: 'bg-emerald-400' },
            { hour: '10:00', label: 'Mod', height: '48%', color: 'bg-cyan-400' },
            { hour: '12:00', label: 'Peak', height: '85%', color: 'bg-secondary', isPeak: true },
            { hour: '14:00', label: 'Busy', height: '70%', color: 'bg-secondary/80' },
            { hour: '16:00', label: 'Busy', height: '65%', color: 'bg-secondary/70' },
            { hour: '18:00', label: 'Mod', height: '45%', color: 'bg-cyan-400' },
            { hour: '20:00', label: 'Calm', height: '20%', color: 'bg-emerald-400' },
          ].map((bar, i) => (
            <div key={i} className="flex flex-col items-center flex-1 gap-1">
              <span
                className={`text-[9px] font-mono ${
                  bar.isPeak ? 'font-bold text-secondary' : 'text-on-surface-variant'
                }`}
              >
                {bar.label}
              </span>
              <div className={`w-full ${bar.color} rounded-t-md`} style={{ height: bar.height }} />
              <span className="text-[10px] font-mono text-on-surface-variant">{bar.hour}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Smart Density Ping Toggle */}
      <div className="w-full bg-surface-container-high/60 rounded-3xl p-4 shadow-sm border border-slate-200/50 dark:border-slate-800 flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0 pr-2">
            <div className="w-10 h-10 rounded-2xl bg-secondary text-white flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[20px]">notifications_active</span>
            </div>
            <div className="min-w-0">
              <h4 className="font-bold text-xs text-on-surface truncate">Smart Density Ping</h4>
              <p className="text-[11px] text-on-surface-variant truncate">
                Alert me when Gym drops to Moderate or Calm
              </p>
            </div>
          </div>
          <button
            onClick={() => setDensityAlertActive(!densityAlertActive)}
            className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
              densityAlertActive ? 'bg-secondary' : 'bg-slate-300 dark:bg-slate-700'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white shadow transition-transform ${
                densityAlertActive ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        <div className="flex items-center gap-1.5 text-secondary text-[11px] font-mono pt-1">
          <span className="material-symbols-outlined text-[16px]">
            {densityAlertActive ? 'notifications_paused' : 'notifications_off'}
          </span>
          <span>
            {densityAlertActive
              ? 'Haptic nudge will trigger automatically once crowds ease'
              : 'Density alerts paused for today'}
          </span>
        </div>
      </div>
    </div>
  );
};
