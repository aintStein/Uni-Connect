import React, { useState } from 'react';
import { Language } from '../../types';

interface AttendanceViewProps {
  currentDistance: number;
  language: Language;
}

export const AttendanceView: React.FC<AttendanceViewProps> = () => {
  const [policyActive, setPolicyActive] = useState(true);
  const [showNotes, setShowNotes] = useState(false);

  return (
    <div className="flex flex-col w-full gap-space-lg pb-6">
      <div className="flex items-center justify-between pt-space-xs">
        <div className="flex flex-col">
          <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
            Academic Term 2024–25
          </span>
          <h1 className="font-headline-lg text-headline-lg text-on-surface">
            Automated Attendance
          </h1>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed shadow-sm">
          <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
          <span className="font-label-sm text-label-sm font-semibold">Beacon Synced</span>
        </div>
      </div>

      <div className="relative overflow-hidden rounded-xl bg-surface-container-lowest shadow-md p-space-lg flex flex-col gap-space-md">
        <div className="flex items-center justify-between gap-space-sm flex-wrap">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-secondary-container/15 text-secondary font-label-sm text-label-sm font-semibold">
            <span
              className="material-symbols-outlined text-[16px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              check_circle
            </span>
            PRESENT • AUTO-SIGNED IN
          </span>
          <span className="font-label-sm text-label-sm text-on-surface-variant flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">wifi</span>
            Beacon: TH-AP-04 (RSSI: -48dBm)
          </span>
        </div>

        <div className="flex flex-col">
          <div className="flex items-start justify-between gap-2">
            <div>
              <span className="font-label-md text-label-md text-secondary font-semibold">CS302</span>
              <h2 className="font-headline-md text-headline-md text-on-surface">
                Distributed Cloud Systems
              </h2>
            </div>
            <div className="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center text-on-surface shrink-0">
              <span className="material-symbols-outlined text-[24px]">terminal</span>
            </div>
          </div>
          <div className="flex items-center gap-space-sm mt-1 text-on-surface-variant font-body-sm text-body-sm">
            <span className="inline-flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px]">schedule</span>
              08:00 AM – 11:00 AM (3 hrs)
            </span>
            <span>•</span>
            <span className="inline-flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px]">pin_drop</span>
              Turing Hall 102
            </span>
          </div>
        </div>

        <div className="rounded-lg bg-surface-container-low p-space-md flex flex-col gap-space-xs">
          <div className="flex items-center justify-between text-on-surface">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[18px] text-secondary">
                timelapse
              </span>
              <span className="font-headline-sm text-headline-sm">1h 48m in class</span>
            </div>
            <span className="font-label-sm text-label-sm text-on-surface-variant font-semibold">
              60% Elapsed
            </span>
          </div>
          <div className="w-full h-2 rounded-full bg-surface-container-highest overflow-hidden">
            <div
              className="h-full bg-secondary rounded-full transition-all duration-700"
              style={{ width: '60%' }}
            ></div>
          </div>
          <div className="flex items-center justify-between font-label-sm text-label-sm text-on-surface-variant mt-1">
            <span>Checked In: 08:02 AM</span>
            <span>Target: 11:00 AM</span>
          </div>
        </div>

        <div className="flex items-start gap-space-sm p-space-sm rounded-lg bg-surface-container/60">
          <span className="material-symbols-outlined text-secondary text-[20px] shrink-0 mt-0.5">
            sensors
          </span>
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            Auto checkout will trigger at 11:00 AM or when your distance departures the classroom
            perimeter threshold (&gt;70% RSSI decay).
          </p>
        </div>

        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-2">
            <div className="flex -space-x-1.5 overflow-hidden">
              <img
                className="inline-block h-6 w-6 rounded-full ring-2 ring-surface-container-lowest object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDMA4knf0wbRy8ZjiBn2TtzNIc9ap7A451zTsKWlvXn_E6-b3BmUmIJhumjSTtUTjSnlBO326Eddd8dE7ziYXvogf7-E_5Eawb2b2Bzms6nUKjQ6zC8Uh2LV0fdhIcsP7JmyzrqaiTY1uLjq-6YY3nAx69gTWumuI7QSJVHpDDNEfOfpOcP9Q4UyYSDaxS4J0LGTk8-XcT4jkP9GD9uZZKt1zmaSeyCdDAn1I9Jm8h1ICoOEDE_2W-a"
                alt="Peer"
              />
              <img
                className="inline-block h-6 w-6 rounded-full ring-2 ring-surface-container-lowest object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDx93FgD_ZgDtyJpxOf5r2EtfZd_r1AHigO5zLJIbpsebRI7_6SNOhG9ETrlFRR3sPBohbbRmQE3u8dWwGRLy1Ci22PmwbN-ENvho3cxoMwdqTk7Z-a-OM18x6ggp9R2Jwdz0afyqmfDopBZ9dt9kzlnYSFGRQRxLd8tEgmLH2UZZB3CuXOqv2eWbo3EHBKhoHXpdSYhX22w0OsXIv26R3cKxqfhkhL-LUqVYx4mqoBeQcny6zpYp_H"
                alt="Peer"
              />
              <img
                className="inline-block h-6 w-6 rounded-full ring-2 ring-surface-container-lowest object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDN3OhQtehpWPbx0X1c6Po3kU7_5hrb0tCQJ-ADRHGTk-A3VXKPmFUJHZnNoY7v0FDzJtR7wWhYQZon_LPKDOl3wZlKCIXq5sj65N_fnlFcFchzgwmDb049RMdt-zonidGVdMJHb8jpYegRTg4p0AJZX2hUNApHBresWOm6QPCgCFvqSxxziqqEpMo_iYOoMg7CTh1EqjLhT2wZX7EsgJfkanf-cSC3aKke2A4bwRubsWItvpaWhMla"
                alt="Peer"
              />
            </div>
            <span className="font-label-sm text-label-sm text-on-surface-variant font-medium">
              Dr. Vance + 37 peers
            </span>
          </div>

          <button
            onClick={() => setShowNotes(!showNotes)}
            className="px-3 py-1.5 rounded-lg bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-body-sm text-body-sm font-semibold transition-colors flex items-center gap-1"
          >
            <span>Lab Notes</span>
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </button>
        </div>
      </div>

      {/* Lab Notes Modal */}
      {showNotes && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-xl p-6 max-w-sm w-full shadow-2xl space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <span className="font-label-sm text-label-sm text-secondary font-bold">CS302</span>
                <h3 className="font-headline-sm text-headline-sm text-on-surface">Lab Notes: Raft Consensus</h3>
              </div>
              <button onClick={() => setShowNotes(false)}>
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            </div>
            <div className="p-3 bg-surface-container-low rounded-lg text-body-sm space-y-2">
              <p>• Leader election timeout: randomized 150ms-300ms.</p>
              <p>• Heartbeat ping broadcast every 50ms.</p>
              <p>• Project 2 due Friday midnight.</p>
            </div>
            <button
              onClick={() => setShowNotes(false)}
              className="w-full py-2 rounded-lg bg-secondary text-white font-semibold text-xs"
            >
              Close Notes
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-space-md">
        <div className="rounded-xl bg-surface-container-lowest p-space-md shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="font-label-sm text-label-sm text-on-surface-variant font-semibold uppercase">
              Room Density
            </span>
            <span className="material-symbols-outlined text-secondary text-[20px]">group</span>
          </div>
          <div className="my-2">
            <div className="flex items-baseline gap-1">
              <span className="font-headline-lg text-headline-lg text-on-surface font-bold">38</span>
              <span className="font-label-md text-label-md text-on-surface-variant">/ 45 Seats</span>
            </div>
            <span className="font-label-sm text-label-sm text-secondary font-medium">
              84% Capacity • High
            </span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-surface-container-highest overflow-hidden">
            <div className="h-full bg-secondary rounded-full" style={{ width: '84.4%' }}></div>
          </div>
        </div>

        <div className="rounded-xl bg-surface-container-lowest p-space-md shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="font-label-sm text-label-sm text-on-surface-variant font-semibold uppercase">
              5G Telemetry
            </span>
            <span className="material-symbols-outlined text-secondary text-[20px]">cell_tower</span>
          </div>
          <div className="my-2">
            <div className="flex items-baseline gap-1">
              <span className="font-headline-lg text-headline-lg text-on-surface font-bold">4.2</span>
              <span className="font-label-md text-label-md text-on-surface-variant">ms latency</span>
            </div>
            <span className="font-label-sm text-label-sm text-on-surface-variant">
              Mesh Beacon Active
            </span>
          </div>
          <div className="flex items-center gap-1">
            <span className="h-1.5 flex-1 rounded-full bg-secondary"></span>
            <span className="h-1.5 flex-1 rounded-full bg-secondary"></span>
            <span className="h-1.5 flex-1 rounded-full bg-secondary"></span>
            <span className="h-1.5 flex-1 rounded-full bg-secondary"></span>
          </div>
        </div>
      </div>

      <div className="rounded-xl bg-surface-container-lowest p-space-lg shadow-sm flex flex-col gap-space-md">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-headline-sm text-headline-sm text-on-surface">Term Attendance</h3>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Target minimum requirement: 85%
            </p>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-sm text-label-sm font-semibold">
            Exemplary
          </span>
        </div>

        <div className="flex items-center gap-space-lg py-1">
          <div className="relative w-24 h-24 shrink-0 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-surface-container-highest"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="currentColor"
                strokeWidth="3.5"
              ></path>
              <path
                className="text-secondary"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="currentColor"
                strokeDasharray="96.5, 100"
                strokeLinecap="round"
                strokeWidth="3.5"
              ></path>
            </svg>
            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className="font-headline-md text-headline-md font-bold text-on-surface">
                96.5<span className="text-[12px] font-normal">%</span>
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-2 flex-1 justify-center">
            <div className="flex items-center justify-between">
              <span className="font-body-sm text-body-sm text-on-surface-variant flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-secondary"></span>
                Attended Sessions
              </span>
              <span className="font-label-md text-label-md font-bold text-on-surface">42</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-body-sm text-body-sm text-on-surface-variant flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-secondary-fixed-dim"></span>
                Excused Absences
              </span>
              <span className="font-label-md text-label-md font-bold text-on-surface">1</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-body-sm text-body-sm text-on-surface-variant flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-surface-tint"></span>
                Unexcused Missed
              </span>
              <span className="font-label-md text-label-md font-bold text-on-surface">0</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-space-sm">
        <div className="flex items-center justify-between">
          <h3 className="font-headline-sm text-headline-sm text-on-surface">Today's Schedule</h3>
          <span className="font-label-sm text-label-sm text-on-surface-variant font-medium">
            Thursday • Week 8
          </span>
        </div>

        <div className="flex flex-col gap-space-sm">
          <div className="rounded-xl bg-surface-container-lowest p-space-md shadow-sm flex items-center justify-between gap-space-sm transition-all hover:bg-surface-container-low/40">
            <div className="flex items-center gap-space-md min-w-0">
              <div className="w-10 h-10 rounded-lg bg-secondary-container text-on-secondary-container flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[20px]">laptop_chromebook</span>
              </div>
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-headline-sm text-headline-sm text-on-surface truncate">
                    Distributed Cloud Systems
                  </span>
                </div>
                <span className="font-body-sm text-body-sm text-on-surface-variant truncate">
                  08:00 AM – 11:00 AM • Turing Hall 102
                </span>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-secondary-container/15 text-secondary font-label-sm text-label-sm font-semibold shrink-0">
              Active
            </span>
          </div>

          <div className="rounded-xl bg-surface-container-lowest p-space-md shadow-sm flex items-center justify-between gap-space-sm transition-all hover:bg-surface-container-low/40">
            <div className="flex items-center gap-space-md min-w-0">
              <div className="w-10 h-10 rounded-lg bg-surface-container-high text-on-surface flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[20px]">functions</span>
              </div>
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-headline-sm text-headline-sm text-on-surface truncate">
                    Linear Algebra &amp; Graph Theory
                  </span>
                </div>
                <span className="font-body-sm text-body-sm text-on-surface-variant truncate">
                  01:00 PM – 02:30 PM • Gauss Annex 304
                </span>
              </div>
            </div>
            <div className="flex flex-col items-end shrink-0">
              <span className="px-2 py-0.5 rounded-full bg-surface-container-high text-on-surface-variant font-label-sm text-label-sm font-semibold">
                Beacon Ready
              </span>
              <span className="font-label-sm text-label-sm text-on-surface-variant mt-0.5">
                In 2h 00m
              </span>
            </div>
          </div>

          <div className="rounded-xl bg-surface-container-lowest p-space-md shadow-sm flex items-center justify-between gap-space-sm transition-all hover:bg-surface-container-low/40">
            <div className="flex items-center gap-space-md min-w-0">
              <div className="w-10 h-10 rounded-lg bg-surface-container-high text-on-surface flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[20px]">forum</span>
              </div>
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-headline-sm text-headline-sm text-on-surface truncate">
                    Technical Communications
                  </span>
                </div>
                <span className="font-body-sm text-body-sm text-on-surface-variant truncate">
                  03:00 PM – 04:30 PM • Humanities Hall 12
                </span>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-surface-container-low text-on-surface-variant font-label-sm text-label-sm shrink-0">
              Upcoming
            </span>
          </div>
        </div>
      </div>

      <div className="rounded-xl bg-surface-container-low p-space-md flex items-center justify-between">
        <div className="flex items-center gap-space-sm">
          <span className="material-symbols-outlined text-secondary text-[22px]">verified_user</span>
          <div className="flex flex-col">
            <span className="font-headline-sm text-headline-sm text-on-surface">
              Auto-Sign In Policy
            </span>
            <span className="font-body-sm text-body-sm text-on-surface-variant">
              Validated via physical hardware cryptographic tokens
            </span>
          </div>
        </div>
        <button
          className="px-3 py-1.5 rounded-lg bg-surface-container-lowest text-on-surface font-body-sm text-body-sm font-semibold shadow-sm hover:bg-surface transition-colors"
          onClick={() => setPolicyActive(!policyActive)}
        >
          {policyActive ? 'Active' : 'Paused'}
        </button>
      </div>
    </div>
  );
};
