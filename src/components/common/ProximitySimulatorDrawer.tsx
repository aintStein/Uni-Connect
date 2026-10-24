import React, { useState, useEffect } from 'react';
import { NearbyBeacon } from '../../types';

interface ProximitySimulatorDrawerProps {
  beacons: NearbyBeacon[];
  selectedBeaconId: string;
  onSelectBeacon: (id: string) => void;
  currentDistance: number;
  onDistanceChange: (dist: number) => void;
  isOpen: boolean;
  onToggleOpen: () => void;
  onSimulateUnlock: (beaconName: string) => void;
}

export const ProximitySimulatorDrawer: React.FC<ProximitySimulatorDrawerProps> = ({
  beacons,
  selectedBeaconId,
  onSelectBeacon,
  currentDistance,
  onDistanceChange,
  isOpen,
  onToggleOpen,
  onSimulateUnlock,
}) => {
  const [isAutoWalking, setIsAutoWalking] = useState(false);
  const selectedBeacon = beacons.find((b) => b.id === selectedBeaconId) || beacons[0];

  // Auto-walk simulation loop
  useEffect(() => {
    let interval: number | undefined;
    if (isAutoWalking) {
      interval = window.setInterval(() => {
        onDistanceChange(Math.max(0.4, Number((currentDistance - 0.3).toFixed(1))));
      }, 500);
    }
    return () => clearInterval(interval);
  }, [isAutoWalking, currentDistance, onDistanceChange]);

  // Threshold crossing trigger (< 1.5m)
  useEffect(() => {
    if (currentDistance <= 1.5 && selectedBeacon) {
      onSimulateUnlock(selectedBeacon.name);
    }
  }, [currentDistance, selectedBeacon]);

  // Calculate simulated RSSI based on distance
  const simulatedRssi = Math.round(-38 - Math.log2(Math.max(currentDistance, 0.5)) * 12);

  // Play audio cue using web audio
  const playTone = (freq: number) => {
    try {
      const audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.15);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.15);
    } catch {
      // Audio not supported or blocked
    }
  };

  return (
    <>
      {/* Floating Pill Trigger to Open/Close Simulator */}
      <div className="fixed bottom-20 left-0 right-0 max-w-md mx-auto w-full z-40 pointer-events-none px-3 flex justify-end">
        <button
          onClick={() => {
            onToggleOpen();
            playTone(880);
          }}
          className={`pointer-events-auto flex items-center gap-1.5 px-3 py-1.5 rounded-full shadow-xl border text-[11px] font-semibold font-mono transition-all duration-200 cursor-pointer ${
            currentDistance <= 1.5
              ? 'bg-emerald-600 text-white border-emerald-400 animate-pulse'
              : 'bg-primary-container text-tertiary-fixed-dim border-slate-700/60 hover:bg-slate-900'
          }`}
          title="Toggle Proximity & Beacon Telemetry Simulator"
        >
          <span className="material-symbols-outlined text-[15px]">sensors</span>
          <span>
            {currentDistance <= 1.5 ? 'UNLOCK (≤1.5m)' : `RADAR: ${currentDistance.toFixed(1)}m`}
          </span>
          <span className="material-symbols-outlined text-[13px]">
            {isOpen ? 'expand_more' : 'tune'}
          </span>
        </button>
      </div>

      {/* Slide-Up Bottom Drawer Sheet */}
      {isOpen && (
        <div className="fixed inset-x-0 bottom-0 z-50 p-3 max-w-md mx-auto pointer-events-auto">
          <div className="bg-surface-container-lowest/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800 rounded-3xl p-4 shadow-2xl space-y-3.5">
            {/* Drawer Header & Grab Handle */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-secondary-fixed flex items-center justify-center text-secondary">
                  <span className="material-symbols-outlined text-[18px]">cell_tower</span>
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-on-surface">
                    UWB Proximity Simulator
                  </h3>
                  <span className="text-[11px] text-on-surface-variant font-mono">
                    Direct distance & beacon triangulation test bench
                  </span>
                </div>
              </div>
              <button
                onClick={onToggleOpen}
                className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-on-surface"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            {/* Target Portal Selection */}
            <div>
              <label className="block text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider mb-1.5">
                Targeted Campus Portal / Beacon
              </label>
              <div className="grid grid-cols-2 gap-2">
                {beacons.map((beacon) => (
                  <button
                    key={beacon.id}
                    onClick={() => {
                      onSelectBeacon(beacon.id);
                      onDistanceChange(beacon.distanceMeters);
                      playTone(660);
                    }}
                    className={`p-2 rounded-xl text-left border text-xs transition-all ${
                      selectedBeaconId === beacon.id
                        ? 'border-secondary bg-secondary-fixed/30 text-on-surface font-semibold'
                        : 'border-slate-200 dark:border-slate-800 bg-surface-container-low text-on-surface-variant hover:bg-surface-container'
                    }`}
                  >
                    <div className="truncate font-medium">{beacon.name}</div>
                    <div className="text-[10px] font-mono text-secondary mt-0.5">
                      {beacon.code} • {beacon.frequencyGhz}GHz
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Distance Slider & Metric Display */}
            <div className="p-3.5 rounded-2xl bg-surface-container-low border border-slate-200/60 dark:border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs text-on-surface-variant block">Simulated Distance</span>
                  <span className="text-2xl font-bold font-mono tracking-tight text-on-surface">
                    {currentDistance.toFixed(1)} <span className="text-sm font-normal">meters</span>
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs text-on-surface-variant block">Signal Strength</span>
                  <span
                    className={`text-sm font-bold font-mono ${
                      simulatedRssi > -60
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : 'text-secondary'
                    }`}
                  >
                    {simulatedRssi} dBm
                  </span>
                </div>
              </div>

              {/* Slider Input */}
              <input
                type="range"
                min="0.2"
                max="12.0"
                step="0.1"
                value={currentDistance}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  onDistanceChange(val);
                  if (val <= 1.5 && currentDistance > 1.5) {
                    playTone(980);
                  }
                }}
                className="w-full accent-secondary h-2 bg-surface-container-highest rounded-lg cursor-pointer"
              />

              <div className="flex justify-between text-[10px] font-mono text-on-surface-variant">
                <span>0.2m (Contactless Tap)</span>
                <span className="font-semibold text-secondary">1.5m Auto-Pass Threshold</span>
                <span>12.0m (Far Field)</span>
              </div>
            </div>

            {/* Quick Action Test Buttons */}
            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={() => {
                  onDistanceChange(0.8);
                  playTone(980);
                }}
                className="flex-1 py-2 px-3 rounded-xl bg-secondary text-on-secondary text-xs font-semibold hover:bg-secondary-container transition-all flex items-center justify-center gap-1.5 shadow-sm"
              >
                <span className="material-symbols-outlined text-[16px]">door_open</span>
                <span>Jump to 0.8m (Unlock)</span>
              </button>

              <button
                onClick={() => {
                  setIsAutoWalking(!isAutoWalking);
                  if (!isAutoWalking && currentDistance <= 0.8) {
                    onDistanceChange(6.5);
                  }
                }}
                className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all flex items-center gap-1.5 ${
                  isAutoWalking
                    ? 'bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-950/60 dark:text-amber-200'
                    : 'bg-surface-container text-on-surface border-slate-200 dark:border-slate-700'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">
                  {isAutoWalking ? 'pause' : 'directions_walk'}
                </span>
                <span>{isAutoWalking ? 'Stop Walk' : 'Auto-Walk'}</span>
              </button>

              <button
                onClick={() => {
                  onDistanceChange(6.5);
                  setIsAutoWalking(false);
                }}
                className="py-2 px-3 rounded-xl bg-surface-container text-on-surface-variant text-xs hover:text-on-surface"
                title="Reset to 6.5m"
              >
                <span className="material-symbols-outlined text-[16px]">restart_alt</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
