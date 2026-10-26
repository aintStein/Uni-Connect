import React, { useState } from 'react';
import { ZoneOccupancy, Language } from '../../types';
import { ZONE_OCCUPANCIES, TRANSLATIONS } from '../../data/mockCampusData';

interface HeadcountZonesViewProps {
  language?: Language;
}

export const HeadcountZonesView: React.FC<HeadcountZonesViewProps> = ({ language = 'en' }) => {
  const t = TRANSLATIONS[language];
  const [zones, setZones] = useState<ZoneOccupancy[]>(ZONE_OCCUPANCIES);
  const [totalHeadcount, setTotalHeadcount] = useState(3842);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'high' | 'academic' | 'rec'>('all');
  const [isSyncing, setIsSyncing] = useState(false);

  const handleSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      const delta = Math.floor(Math.random() * 9) - 4;
      setTotalHeadcount((prev) => prev + delta);
      setIsSyncing(false);
    }, 600);
  };

  const handleExportCsv = () => {
    const header = 'Zone Code,Zone Name,Current Occupancy,Max Capacity,Occupancy Rate,Status\n';
    const rows = zones
      .map(
        (z) =>
          `"${z.code}","${z.name}",${z.currentCount},${z.maxCapacity},"${z.percentage}%","${z.statusLabel}"`
      )
      .join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `campus-telemetry-headcount-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const filteredZones = zones.filter((z) => {
    const matchesSearch =
      z.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      z.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      z.subtext.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (selectedFilter === 'high') return z.percentage >= 85;
    if (selectedFilter === 'academic') return z.code.includes('A101') || z.code.includes('SEB') || z.code.includes('LIB');
    if (selectedFilter === 'rec') return z.code.includes('REC') || z.code.includes('DINING');
    return true;
  });

  return (
    <div className="flex flex-col w-full gap-4 pb-28">
      {/* Dynamic Operational Broadcast Banner */}
      <div className="w-full bg-secondary text-white rounded-3xl p-4 shadow-md flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-8 h-8 rounded-full bg-secondary-container text-white flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[18px]">cell_tower</span>
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-mono uppercase tracking-wider text-secondary-fixed font-bold">
                Telemetry Link v4.8
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-secondary-fixed animate-ping" />
            </div>
            <p className="text-xs text-white/90 truncate mt-0.5">
              LiDAR mesh + 84 5G gNodeB Cells sync in 4s
            </p>
          </div>
        </div>

        <button
          onClick={handleSync}
          disabled={isSyncing}
          className="px-3 py-1.5 rounded-xl bg-white text-slate-900 text-xs font-semibold shrink-0 shadow-xs active:scale-95 transition-transform flex items-center gap-1"
        >
          <span
            className={`material-symbols-outlined text-[16px] ${
              isSyncing ? 'animate-spin text-secondary' : ''
            }`}
          >
            refresh
          </span>
          <span>Sync</span>
        </button>
      </div>

      {/* Total Campus Headcount Summary Hero Card */}
      <div className="w-full bg-surface-container-lowest border border-slate-200/60 dark:border-slate-800 rounded-3xl p-5 shadow-sm flex flex-col gap-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5 text-on-surface-variant">
              <span className="material-symbols-outlined text-[16px]">domain</span>
              <span className="text-[11px] font-mono uppercase tracking-wider font-semibold">
                Campus-Wide Presence
              </span>
            </div>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-bold font-mono text-on-surface tracking-tight">
                {totalHeadcount.toLocaleString()}
              </span>
              <span className="text-xs text-on-surface-variant font-mono">/ 5,650 Max</span>
            </div>
            <p className="text-xs text-on-surface-variant mt-0.5">
              Students, Faculty & Verified Visitors
            </p>
          </div>

          <div className="flex flex-col items-end gap-1">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-surface-container-high text-on-surface text-[11px] font-mono font-bold">
              <span className="material-symbols-outlined text-[14px] text-secondary">trending_up</span>
              +128 (15m)
            </span>
            <span className="text-[11px] font-mono text-on-surface-variant">
              {((totalHeadcount / 5650) * 100).toFixed(1)}% Campus Load
            </span>
          </div>
        </div>

        {/* Capacity Bar Segmented Gauge */}
        <div className="flex flex-col gap-1.5 pt-1">
          <div className="w-full h-3 bg-surface-container rounded-full overflow-hidden p-0.5 flex">
            <div
              className="h-full bg-secondary rounded-full transition-all duration-700"
              style={{ width: `${Math.min(100, (totalHeadcount / 5650) * 100)}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-on-surface-variant text-[10px] font-mono">
            <span>0</span>
            <span>2,825 Nominal (50%)</span>
            <span className="text-error font-bold">5,650 Cap</span>
          </div>
        </div>

        {/* Mini Telemetry Strip */}
        <div className="grid grid-cols-3 gap-2 pt-1">
          <div className="bg-surface-container-low rounded-2xl p-2.5 flex flex-col">
            <span className="text-[10px] font-mono text-on-surface-variant">5G NR Links</span>
            <span className="font-bold font-mono text-xs text-on-surface mt-0.5">3,914 Dev</span>
          </div>
          <div className="bg-surface-container-low rounded-2xl p-2.5 flex flex-col">
            <span className="text-[10px] font-mono text-on-surface-variant">Turnstiles / Hr</span>
            <span className="font-bold font-mono text-xs text-on-surface mt-0.5">1,420 Tap</span>
          </div>
          <div className="bg-surface-container-low rounded-2xl p-2.5 flex flex-col">
            <span className="text-[10px] font-mono text-on-surface-variant">vs Yesterday</span>
            <span className="font-bold font-mono text-xs text-secondary mt-0.5">+14.2% Peak</span>
          </div>
        </div>
      </div>

      {/* Anomaly & Overcrowding Detection Alert Card */}
      <div className="w-full bg-error-container text-on-error-container rounded-3xl p-4 shadow-sm border border-red-200 dark:border-red-900/60 flex flex-col gap-2.5">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-xl bg-error text-white flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[18px]">hevc</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-1">
              <span className="font-bold text-xs truncate">{t.anomalyDetected}</span>
              <span className="text-[10px] font-mono bg-error text-white px-2 py-0.2 rounded font-bold">
                14:15:08
              </span>
            </div>
            <p className="text-xs mt-1 leading-snug">
              Threshold alert triggered in Turing Hall foyer. Over-density delta (+42 arrivals/min)
              exceeded acoustic envelope.
            </p>
          </div>
        </div>

        <div className="bg-white/95 dark:bg-slate-900/95 border border-slate-300 dark:border-slate-700 shadow-sm rounded-xl p-2.5 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <span className="material-symbols-outlined text-indigo-600 dark:text-cyan-400 text-[18px] shrink-0">hvac</span>
            <span className="truncate font-semibold text-xs text-slate-900 dark:text-slate-100">
              Ventilation Stage 3 auto-boosted • Usher 04 pinged
            </span>
          </div>
          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300 shrink-0">
            Active
          </span>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="flex flex-col gap-2">
        <div className="relative w-full">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search zone, lab, building, or sensor ID..."
            className="w-full h-11 pl-10 pr-10 bg-surface-container-lowest border border-slate-200/60 dark:border-slate-800 rounded-2xl text-xs text-on-surface placeholder:text-on-surface-variant shadow-xs focus:outline-none focus:border-secondary"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto py-1 no-scrollbar">
          {[
            { id: 'all', label: language === 'zh' ? '全域监控 (12)' : language === 'ms' ? 'Semua Zon (12)' : language === 'id' ? 'Semua Zona (12)' : language === 'kk' ? 'Барлық аймақтар (12)' : 'All Zones (12)' },
            { id: 'high', label: language === 'zh' ? '高密集 (>85%)' : language === 'ms' ? 'Kepadatan Tinggi (>85%)' : language === 'id' ? 'Kepadatan Tinggi (>85%)' : language === 'kk' ? 'Жоғары тығыздық (>85%)' : 'High Density (>85%)' },
            { id: 'academic', label: language === 'zh' ? '教学与实验区' : language === 'ms' ? 'Akademik & Makmal' : language === 'id' ? 'Akademik & Lab' : language === 'kk' ? 'Оқу және зертханалар' : 'Academic & Labs' },
            { id: 'rec', label: language === 'zh' ? '文体与生活区' : language === 'ms' ? 'Rekreasi & Kafeteria' : language === 'id' ? 'Rekreasi & Kantin' : language === 'kk' ? 'Спорт және асхана' : 'Recreation & Dining' },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setSelectedFilter(f.id as typeof selectedFilter)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all shadow-xs ${
                selectedFilter === f.id
                  ? 'bg-secondary text-white'
                  : 'bg-surface-container-high text-on-surface hover:bg-surface-container-highest'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Section Header */}
      <div className="flex items-center justify-between px-1 pt-1">
        <div className="flex items-center gap-1.5">
          <span className="material-symbols-outlined text-secondary text-[18px]">grid_view</span>
          <h3 className="font-bold text-sm text-on-surface">Granular Zone Densities</h3>
        </div>
        <span className="text-[11px] font-mono text-on-surface-variant">5 Monitored Sectors</span>
      </div>

      {/* Granular Zone Breakdown Cards */}
      <div className="flex flex-col space-y-3">
        {filteredZones.map((z) => (
          <div
            key={z.id}
            className="bg-surface-container-lowest border border-slate-200/60 dark:border-slate-800 rounded-3xl p-4 shadow-sm flex flex-col gap-3"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                      z.statusLevel === 'critical'
                        ? 'bg-error-container text-on-error-container'
                        : z.statusLevel === 'elevated'
                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                        : 'bg-surface-container-high text-on-surface'
                    }`}
                  >
                    {z.statusLevel === 'critical' && (
                      <span className="material-symbols-outlined text-[12px]">warning</span>
                    )}
                    {z.statusLabel}
                  </span>
                  <span className="text-[10px] font-mono text-on-surface-variant">{z.code}</span>
                </div>
                <h4 className="font-bold text-xs text-on-surface mt-1 truncate">{z.name}</h4>
                <p className="text-[11px] text-on-surface-variant mt-0.5 leading-tight">
                  {z.subtext}
                </p>
              </div>

              <div className="text-right shrink-0">
                <span className="text-base font-bold font-mono text-on-surface block">
                  {z.currentCount}{' '}
                  <span className="text-xs text-on-surface-variant font-normal">/ {z.maxCapacity}</span>
                </span>
                <span
                  className={`text-[10px] font-mono font-semibold ${
                    z.statusLevel === 'critical' ? 'text-error' : 'text-secondary'
                  }`}
                >
                  {z.deltaText}
                </span>
              </div>
            </div>

            {/* Capacity gauge */}
            <div className="w-full h-2 bg-surface-container rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${
                  z.statusLevel === 'critical'
                    ? 'bg-error'
                    : z.statusLevel === 'elevated'
                    ? 'bg-amber-500'
                    : 'bg-secondary'
                }`}
                style={{ width: `${z.percentage}%` }}
              />
            </div>

            {/* Subfloor chips */}
            {z.subfloors && (
              <div className="grid grid-cols-3 gap-1.5 pt-1">
                {z.subfloors.map((sf, idx) => (
                  <div
                    key={idx}
                    className="bg-surface-container-low rounded-xl p-2 text-center text-xs"
                  >
                    <span className="text-[10px] font-mono text-on-surface-variant block">
                      {sf.label}
                    </span>
                    <span className="font-bold font-mono text-on-surface">{sf.count}</span>
                    <span className="text-[10px] font-mono text-secondary block mt-0.5">
                      {sf.note}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* 24-Hour Diurnal Waveform Chart */}
      <div className="w-full bg-surface-container-lowest border border-slate-200/60 dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-sm text-on-surface">24-Hour Diurnal Waveform</h3>
            <p className="text-xs text-on-surface-variant">Live vs. 7-Day Baseline Occupancy Curve</p>
          </div>
          <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed font-bold">
            +14% vs Yest
          </span>
        </div>

        {/* Micro SVG Sparkline Chart */}
        <div className="w-full h-32 bg-surface-container-low rounded-2xl p-3 relative flex flex-col justify-end overflow-hidden border border-slate-200/40 dark:border-slate-800">
          <svg className="w-full h-24 overflow-visible" viewBox="0 0 320 80" preserveAspectRatio="none">
            {/* Baseline dashed curve */}
            <path
              d="M 0 68 Q 40 65 80 50 T 160 22 T 240 28 T 320 62"
              fill="none"
              stroke="#76777d"
              strokeDasharray="3 3"
              strokeWidth="1.5"
              opacity="0.6"
            />
            {/* Active live curve */}
            <path
              d="M 0 72 Q 40 62 80 44 T 160 14 T 240 18 T 320 54"
              fill="none"
              stroke="#4b41e1"
              strokeWidth="2.5"
            />
            <circle cx="240" cy="18" r="5" fill="#4b41e1" className="animate-pulse" />
          </svg>

          <div className="flex items-center justify-between text-[10px] font-mono text-on-surface-variant pt-2">
            <span>06:00</span>
            <span>10:00</span>
            <span className="text-secondary font-bold">NOW (14:20)</span>
            <span>18:00</span>
            <span>22:00</span>
          </div>
        </div>

        <div className="flex items-center justify-between text-[11px] font-mono text-on-surface-variant">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-secondary" />
            <span>Actual Count</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-slate-500" />
            <span>7-Day Moving Avg</span>
          </div>
          <div className="flex items-center gap-1 text-on-surface font-semibold">
            <span className="material-symbols-outlined text-[14px] text-secondary">schedule</span>
            <span>Peak: 15:30 (4,100)</span>
          </div>
        </div>
      </div>

      {/* Export & Print Action Buttons */}
      <div className="w-full pt-1 flex items-center gap-3">
        <button
          onClick={handleExportCsv}
          className="flex-1 h-12 bg-primary text-white rounded-2xl font-semibold text-xs flex items-center justify-center gap-2 active:scale-98 transition-transform shadow-sm hover:bg-slate-900"
        >
          <span className="material-symbols-outlined text-[18px]">ios_share</span>
          <span>{t.exportLog} (CSV)</span>
        </button>

        <button
          onClick={() => window.print()}
          className="w-12 h-12 bg-surface-container-lowest border border-slate-200/60 dark:border-slate-800 text-on-surface rounded-2xl flex items-center justify-center shrink-0 active:scale-95 transition-transform shadow-xs"
          title="Print Occupancy Summary"
        >
          <span className="material-symbols-outlined text-[20px]">print</span>
        </button>
      </div>
    </div>
  );
};
