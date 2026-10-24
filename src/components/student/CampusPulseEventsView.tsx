import React, { useState } from 'react';
import { Language } from '../../types';

interface CampusPulseEventsViewProps {
  language: Language;
  onOpenFacilities?: () => void;
}

export const CampusPulseEventsView: React.FC<CampusPulseEventsViewProps> = ({
  onOpenFacilities,
}) => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [heroRsvp, setHeroRsvp] = useState(false);
  const [reservedCards, setReservedCards] = useState<{ [id: string]: boolean }>({});
  const [showPassModal, setShowPassModal] = useState(false);

  const toggleCardReserved = (id: string) => {
    setReservedCards((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="flex flex-col w-full pb-6 space-y-4">
      {/* Campus Official System Broadcast Banner */}
      <div className="relative overflow-hidden rounded-xl bg-primary-container text-on-primary p-4 shadow-md">
        <div className="absolute -right-6 -bottom-6 w-28 h-28 rounded-full bg-secondary/20 blur-xl pointer-events-none"></div>
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-surface-container-highest/20 text-tertiary-fixed-dim shrink-0 flex items-center justify-center">
            <span
              className="material-symbols-outlined text-[20px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              wifi_tethering
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded-full bg-tertiary-fixed-dim/20 text-tertiary-fixed-dim font-label-sm text-label-sm uppercase tracking-wider">
                Infrastructure Notice
              </span>
              <span className="font-label-sm text-label-sm text-on-primary-container">
                02:00 AM - 04:00 AM
              </span>
            </div>
            <p className="font-headline-sm text-headline-sm text-on-primary leading-tight">
              Campus Wi-Fi 6 Upgrade Tonight
            </p>
            <p className="font-body-sm text-body-sm text-inverse-primary/90 mt-1">
              Offline Bluetooth mesh door access remains 100% functional. Academic keycards and badges
              will authenticate seamlessly without latency.
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Category Horizontal Scroll */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 -mx-margin px-margin no-scrollbar">
        {[
          { id: 'all', label: 'All Events', icon: 'stream' },
          { id: 'academic', label: 'Academic', icon: 'school' },
          { id: 'tech', label: 'Career & Tech', icon: 'terminal' },
          { id: 'student-life', label: 'Student Life', icon: 'celebration' },
          { id: 'safety', label: 'Safety Workshops', icon: 'health_and_safety' },
        ].map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveFilter(cat.id)}
            className={`filter-chip px-3.5 py-1.5 rounded-full font-body-sm text-body-sm whitespace-nowrap transition-all flex items-center gap-1.5 ${
              activeFilter === cat.id
                ? 'bg-secondary text-on-secondary shadow-sm font-medium'
                : 'bg-surface-container-high text-on-surface hover:bg-surface-container-highest'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">{cat.icon}</span>
            <span>{cat.label}</span>
          </button>
        ))}
      </div>

      {/* Featured Event Card (Hero Component) */}
      <div className="rounded-xl bg-surface-container-lowest shadow-md overflow-hidden flex flex-col">
        {/* Image Header with Telemetry Badges */}
        <div className="relative w-full h-44">
          <img
            className="w-full h-full object-cover"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBBdQr7j3XG0HCNhqhHnyBM_mABQ4R5Bn9sTbU1_dOTek6jzEpPU71P1XyMFgB8Sjuhvy4y_D8ASLBARc3EfnwEyvRIeCnZ0LBJWqBg8Aw58nFfSHC09CF6JcukQMBiXzY2kQaVhIfhQR_aSZgfDF1w973tWZT8D_vZ7cVDu_nMbQndaCWPJFxUh3O76qCsGOXKlYRS5UAY78B9z8D9oLX_E6jjZx-HCTQX10yLTgtbr2L-0XcZZC3F"
            alt="Hackathon Showcase"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary-container/90 via-primary-container/30 to-transparent"></div>
          {/* Top Live Badges */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-container-lowest/90 backdrop-blur-md shadow-sm">
              <span className="w-2 h-2 rounded-full bg-secondary-container animate-ping"></span>
              <span className="font-label-sm text-label-sm text-on-surface font-semibold tracking-wide uppercase">
                Featured Pulse
              </span>
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-tertiary-container/80 backdrop-blur-md text-tertiary-fixed-dim font-label-sm text-label-sm">
              <span className="material-symbols-outlined text-[14px]">cell_tower</span>
              Ultra-Wideband Node A4
            </span>
          </div>
          {/* Time Overlay in Image Base */}
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-on-primary">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[18px] text-tertiary-fixed-dim">
                calendar_today
              </span>
              <span className="font-headline-sm text-headline-sm text-surface-container-lowest font-medium">
                Tomorrow, 10:00 AM
              </span>
            </div>
            <span className="font-label-sm text-label-sm px-2 py-0.5 rounded bg-surface-container-highest/30 backdrop-blur-sm text-surface-container-lowest">
              All Day Event
            </span>
          </div>
        </div>

        {/* Body Information */}
        <div className="p-4 flex flex-col gap-3">
          <div>
            <h2 className="font-headline-md text-headline-md text-on-surface leading-tight">
              Annual Campus Hackathon &amp; AI Showcase
            </h2>
            <div className="flex items-center gap-1.5 text-on-surface-variant mt-1">
              <span className="material-symbols-outlined text-[16px] text-secondary">near_me</span>
              <span className="font-body-sm text-body-sm">Innovation Center • Grand Atrium Hall</span>
            </div>
          </div>

          {/* Occupancy & Telemetry Gauge */}
          <div className="p-3 rounded-lg bg-surface-container-low flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-secondary">group</span>
                <span className="font-body-sm text-body-sm text-on-surface font-medium">
                  Capacity Telemetry
                </span>
              </div>
              <span className="font-label-md text-label-md text-secondary font-semibold">
                142 / 200 RSVPs
              </span>
            </div>
            {/* Progress Bar */}
            <div className="w-full h-2 rounded-full bg-surface-container-highest overflow-hidden">
              <div
                className="h-full bg-secondary rounded-full transition-all duration-500"
                style={{ width: '71%' }}
              ></div>
            </div>
            <div className="flex items-center justify-between font-label-sm text-label-sm text-on-surface-variant">
              <span>71% Booked</span>
              <span className="text-on-tertiary-container">58 seats remaining</span>
            </div>
          </div>

          {/* RSVP Action Bar */}
          <div className="pt-1 flex items-center gap-2">
            <button
              onClick={() => setHeroRsvp(!heroRsvp)}
              className={`flex-1 py-2.5 px-4 rounded-lg font-body-md text-body-md font-medium transition-all shadow-sm flex items-center justify-center gap-2 ${
                heroRsvp
                  ? 'bg-secondary text-on-secondary'
                  : 'bg-primary hover:bg-inverse-surface text-on-primary'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">event_available</span>
              <span>
                {heroRsvp ? 'RSVP Confirmed • Badge Linked' : 'RSVP & Add to Smart Schedule'}
              </span>
            </button>
            <button
              onClick={() => alert('Beacon Node A4: Innovation Center Grand Atrium (Level 1).')}
              className="w-11 h-11 rounded-lg bg-surface-container-high hover:bg-surface-container-highest text-on-surface flex items-center justify-center shrink-0 transition-colors"
              title="Locate Room Beacon"
            >
              <span className="material-symbols-outlined text-[20px] text-secondary">explore</span>
            </button>
          </div>
        </div>
      </div>

      {/* Real-Time Campus Feed Header */}
      <div className="flex items-center justify-between pt-2">
        <div className="flex items-center gap-2">
          <span className="font-headline-sm text-headline-sm text-on-surface">Upcoming Syncs</span>
          <span className="px-2 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-sm text-label-sm">
            3 Live
          </span>
        </div>
        <button
          onClick={() => alert('Calendar synced with campus academic registry.')}
          className="flex items-center gap-1 text-secondary font-label-md text-label-md hover:underline"
        >
          <span>Auto-Sync</span>
          <span className="material-symbols-outlined text-[16px]">sync</span>
        </button>
      </div>

      {/* Event Feed Items */}
      <div className="flex flex-col space-y-3">
        {/* Card 1: Resume & Tech Networking Night */}
        <div className="p-4 rounded-xl bg-surface-container-lowest shadow-sm flex flex-col gap-3 transition-transform active:scale-[0.99]">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3 min-w-0">
              <div className="w-12 h-12 rounded-lg bg-surface-container flex flex-col items-center justify-center shrink-0 text-on-surface">
                <span className="font-label-sm text-label-sm text-secondary font-bold uppercase">
                  Today
                </span>
                <span className="font-headline-sm text-headline-sm font-bold leading-none">17</span>
              </div>
              <div className="min-w-0">
                <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-tertiary-fixed/60 text-on-tertiary-fixed font-label-sm text-label-sm mb-1">
                  <span className="material-symbols-outlined text-[12px] text-on-tertiary-container">
                    verified
                  </span>
                  <span>RSVP Confirmed</span>
                </div>
                <h3 className="font-headline-sm text-headline-sm text-on-surface truncate">
                  Resume &amp; Tech Industry Networking Night
                </h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant flex items-center gap-1 mt-0.5">
                  <span className="material-symbols-outlined text-[14px]">schedule</span>
                  5:30 PM – 8:00 PM • Student Union Main Hall
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-none bg-surface-container-low/60 p-2.5 rounded-lg">
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary-container opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-secondary"></span>
              </span>
              <span className="font-label-sm text-label-sm text-on-surface-variant">
                Badge Tap Reader Ready • Beacon B12
              </span>
            </div>
            <button
              onClick={() => setShowPassModal(true)}
              className="px-3 py-1 rounded bg-secondary-fixed text-on-secondary-fixed font-label-sm text-label-sm font-semibold flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[14px]">qr_code_scanner</span>
              Pass
            </button>
          </div>
        </div>

        {/* Card 2: Campus Night Safety & Self Defense */}
        <div className="p-4 rounded-xl bg-surface-container-lowest shadow-sm flex flex-col gap-3 transition-transform active:scale-[0.99]">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3 min-w-0">
              <div className="w-12 h-12 rounded-lg bg-surface-container flex flex-col items-center justify-center shrink-0 text-on-surface">
                <span className="font-label-sm text-label-sm text-on-surface-variant font-bold uppercase">
                  Thu
                </span>
                <span className="font-headline-sm text-headline-sm font-bold leading-none">19</span>
              </div>
              <div className="min-w-0">
                <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-surface-container-high text-on-surface font-label-sm text-label-sm mb-1">
                  <span className="material-symbols-outlined text-[12px] text-error">security</span>
                  <span>Campus Security Initiative</span>
                </div>
                <h3 className="font-headline-sm text-headline-sm text-on-surface truncate">
                  Campus Night Safety &amp; Self Defense
                </h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant flex items-center gap-1 mt-0.5">
                  <span className="material-symbols-outlined text-[14px]">schedule</span>
                  6:00 PM – 7:30 PM • Recreation Center Studio 2
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-1.5 text-on-surface-variant">
              <span className="material-symbols-outlined text-[16px] text-tertiary-fixed-dim">
                sensors
              </span>
              <span className="font-label-sm text-label-sm">
                Capacity: {reservedCards['c2'] ? '35' : '34'} / 45 Spots Reserved
              </span>
            </div>
            <button
              onClick={() => toggleCardReserved('c2')}
              className={`px-3 py-1.5 rounded-lg font-body-sm text-body-sm font-medium transition-all flex items-center gap-1 ${
                reservedCards['c2']
                  ? 'bg-secondary-fixed text-on-secondary-fixed font-semibold'
                  : 'bg-surface-container-high hover:bg-surface-container-highest text-on-surface'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">
                {reservedCards['c2'] ? 'check' : 'add_circle'}
              </span>
              <span>{reservedCards['c2'] ? 'Saved' : 'Reserve'}</span>
            </button>
          </div>
        </div>

        {/* Card 3: Cybersecurity & IoT Privacy Roundtable */}
        <div className="p-4 rounded-xl bg-surface-container-lowest shadow-sm flex flex-col gap-3 transition-transform active:scale-[0.99]">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3 min-w-0">
              <div className="w-12 h-12 rounded-lg bg-surface-container flex flex-col items-center justify-center shrink-0 text-on-surface">
                <span className="font-label-sm text-label-sm text-on-surface-variant font-bold uppercase">
                  Fri
                </span>
                <span className="font-headline-sm text-headline-sm font-bold leading-none">20</span>
              </div>
              <div className="min-w-0">
                <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-secondary-fixed/50 text-on-secondary-fixed-variant font-label-sm text-label-sm mb-1">
                  <span className="material-symbols-outlined text-[12px]">code</span>
                  <span>Engineering Credit Eligible</span>
                </div>
                <h3 className="font-headline-sm text-headline-sm text-on-surface truncate">
                  Cybersecurity &amp; IoT Privacy Roundtable
                </h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant flex items-center gap-1 mt-0.5">
                  <span className="material-symbols-outlined text-[14px]">schedule</span>
                  3:00 PM – 4:30 PM • Science Block B, Room 302
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-1.5 text-on-surface-variant">
              <span className="material-symbols-outlined text-[16px] text-secondary">
                wifi_protected_setup
              </span>
              <span className="font-label-sm text-label-sm">Hybrid Stream Available</span>
            </div>
            <button
              onClick={() => toggleCardReserved('c3')}
              className={`px-3 py-1.5 rounded-lg font-body-sm text-body-sm font-medium transition-all flex items-center gap-1 ${
                reservedCards['c3']
                  ? 'bg-secondary-fixed text-on-secondary-fixed font-semibold'
                  : 'bg-surface-container-high hover:bg-surface-container-highest text-on-surface'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">
                {reservedCards['c3'] ? 'check' : 'add_circle'}
              </span>
              <span>{reservedCards['c3'] ? 'Saved' : 'Reserve'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Campus Community Map Quick-Beacon Snapshot */}
      <div className="rounded-xl bg-surface-container-lowest shadow-sm p-4 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px] text-secondary">map</span>
            <span className="font-headline-sm text-headline-sm text-on-surface">
              Live Campus Activity Hotspots
            </span>
          </div>
          <span className="font-label-sm text-label-sm text-on-tertiary-container font-medium">
            35 Beacons Active
          </span>
        </div>

        <div
          className="w-full h-36 bg-cover bg-center rounded-lg relative overflow-hidden shadow-inner flex items-end p-3 cursor-pointer"
          data-location="University Quadrangle and Innovation Hub"
          onClick={onOpenFacilities}
          style={{
            backgroundImage:
              "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDzUm32xZo_8k7bAkT5udNfusWXHniBSYTu7jkE6US_RXxERpcVhKdlOXYVGwS3O4Nj_e-wydApKSERis3-9LQwg-SZCVyhmBbSG6cvouM-qviE9i7AqlU4Gl6cNXINbAI_QjU4ySBDdMC2xqj0DR0Oj0o94ufHXEMftgqRGKHGdHjkle65dukmYC6yaln9f-gF_PE6a4kQ7xXl3grYOg1WKU6hkIIYZKu6DkO46BEo4zQdaOpCVc8g')",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-primary-container/80 via-transparent to-transparent pointer-events-none"></div>
          <div className="relative z-10 flex items-center justify-between w-full text-on-primary">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-tertiary-fixed-dim animate-pulse"></span>
              <span className="font-body-sm text-body-sm text-surface-container-lowest font-medium">
                High Student Footfall at Innovation Quad
              </span>
            </div>
            <span className="px-2 py-0.5 rounded bg-surface-container-highest/20 backdrop-blur-md font-label-sm text-label-sm text-surface-container-lowest">
              Open Map
            </span>
          </div>
        </div>
      </div>

      {/* Pass QR Modal */}
      {showPassModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-2xl p-6 max-w-xs w-full shadow-2xl text-center space-y-4">
            <div className="flex justify-between items-center">
              <span className="font-headline-sm text-headline-sm text-on-surface">Event Pass</span>
              <button onClick={() => setShowPassModal(false)}>
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            </div>
            <div className="p-4 bg-surface-container-low rounded-xl flex flex-col items-center">
              <span className="material-symbols-outlined text-5xl text-secondary">qr_code_2</span>
              <p className="font-headline-sm text-headline-sm text-on-surface mt-2">
                Tech Networking Night
              </p>
              <span className="font-label-sm text-label-sm text-secondary font-mono mt-1">
                PASS: #NET-STU-8841-B12
              </span>
            </div>
            <button
              onClick={() => setShowPassModal(false)}
              className="w-full py-2.5 rounded-lg bg-secondary text-white font-semibold text-xs"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
