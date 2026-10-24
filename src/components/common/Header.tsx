import React, { useState } from 'react';
import { Persona, Language } from '../../types';
import { TRANSLATIONS } from '../../data/mockCampusData';

interface HeaderProps {
  currentPersona: Persona;
  onTogglePersona: () => void;
  language: Language;
  onOpenSettings: () => void;
  wifiConnected?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentPersona,
  onTogglePersona,
  language,
  onOpenSettings,
  wifiConnected = true,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const t = TRANSLATIONS[language];

  const notifications = [
    {
      id: 'notif-1',
      title: 'Infrastructure Maintenance',
      time: '10m ago',
      desc: 'Campus Wi-Fi 6 upgrade scheduled for tonight 02:00 - 04:00 AM.',
      icon: 'wifi_tethering',
      color: 'text-secondary',
    },
    {
      id: 'notif-2',
      title: 'Lecture Attendance Verified',
      time: '42m ago',
      desc: 'Auto-signed in to CS302 Distributed Cloud Systems at Turing Hall 102.',
      icon: 'check_circle',
      color: 'text-emerald-500',
    },
    {
      id: 'notif-3',
      title: 'Safety Patrol Broadcast',
      time: '2h ago',
      desc: 'North Quad Night Lighting is optimal. Campus Escort standby 24/7.',
      icon: 'local_police',
      color: 'text-blue-500',
    },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-40 max-w-md mx-auto w-full bg-surface/90 dark:bg-[#0b101d]/90 backdrop-blur-xl border-b border-slate-200/60 dark:border-slate-800/80 pt-safe">
      <div className="h-16 px-3.5 flex items-center justify-between gap-2">
        {/* Brand & Connection Telemetry */}
        <div className="flex items-center gap-2.5 min-w-0">
          <img
            alt="Uni Connect Logo"
            className="h-8 w-auto object-contain shrink-0"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBLGp5arT1RL522iyZ3EpwemWjDRI1_UM8t9tAIvywgygpl_mbjGNVtQKiU9qZ6BRd5wfbiwF85qvXQYRBG13hkzQGJ-OSFhhXR5nHgGdcUYqtRec976WyX3LfMTIWqQimWcki91SZ-33fzoA8hR7VnESM518dq7JuP2V9ZhczmdoQCt_4aDkA6uLSMyho4oC9u7_LtPxd4SyOmq__EkMgj_ffH5CljmtNZ2xhGBH-pFepI3erepqyy"
          />

          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-sm text-on-surface dark:text-white tracking-tight truncate">
                {currentPersona === 'student' ? 'Uni Connect' : 'Campus Sentinel'}
              </span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-surface-container-high/60 dark:bg-slate-800 max-w-fit">
              <span
                className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                  wifiConnected ? 'bg-secondary animate-pulse' : 'bg-amber-500'
                }`}
              />
              <span className="text-[10px] font-mono text-secondary dark:text-cyan-400 truncate">
                {t.wifiConnected}
              </span>
            </div>
          </div>
        </div>

        {/* Center / Right Control Island */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Dual-Mode Quick Role Toggle Button */}
          <button
            onClick={onTogglePersona}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-semibold border transition-all duration-200 shadow-xs cursor-pointer ${
              currentPersona === 'student'
                ? 'bg-secondary-fixed hover:bg-secondary-fixed-dim text-on-secondary-fixed border-secondary/20'
                : 'bg-primary text-white border-slate-700 hover:bg-slate-900'
            }`}
            title="Switch between Student Mobile App and Security Operations Sentinel"
          >
            <span className="material-symbols-outlined text-[15px]">
              {currentPersona === 'student' ? 'admin_panel_settings' : 'school'}
            </span>
            <span className="text-[11px] font-sans">
              {currentPersona === 'student' ? 'Security' : 'Student'}
            </span>
          </button>

          {/* Notifications Trigger */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              aria-label="Notifications"
              className="w-9 h-9 rounded-full flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors relative cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">notifications</span>
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-error ring-2 ring-surface" />
            </button>

            {/* Notifications Popover Drawer */}
            {showNotifications && (
              <div className="absolute right-0 top-11 w-76 bg-surface-container-lowest dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl p-3 z-50 space-y-2">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                  <span className="font-semibold text-xs text-on-surface dark:text-white">Campus Broadcasts</span>
                  <button
                    onClick={() => setShowNotifications(false)}
                    className="text-[11px] text-secondary dark:text-cyan-400 font-medium hover:underline"
                  >
                    Clear All
                  </button>
                </div>
                <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      className="p-2 rounded-xl bg-surface-container-low dark:bg-slate-800/80 hover:bg-surface-container transition-colors flex items-start gap-2"
                    >
                      <span className={`material-symbols-outlined text-[16px] shrink-0 mt-0.5 ${n.color}`}>
                        {n.icon}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-[11px] text-on-surface dark:text-white truncate">
                            {n.title}
                          </span>
                          <span className="text-[9px] text-on-surface-variant font-mono">
                            {n.time}
                          </span>
                        </div>
                        <p className="text-[10px] text-on-surface-variant dark:text-slate-400 mt-0.5 leading-snug">
                          {n.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Profile / Settings Button */}
          <button
            onClick={onOpenSettings}
            className="p-0.5 rounded-full ring-1 ring-outline-variant/40 hover:ring-secondary transition-all cursor-pointer"
            title="User Profile & System Settings"
          >
            <img
              alt="Alex Morgan"
              className="w-7 h-7 rounded-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDt-pNI22gUvuKJ2GDkQFkabxL1UIJeiEghHlKXYOe7QO7ImmZfzrKshHP-a-wMn1S5hpyJKepdTuahSl06eXUaEFqGirG7vC4GCDfKAB7vA0dHzUYHUuqF8SRgV4CM7kr1AiTz1P8srPSkd8uPScBW1y0I7AZVhJklAWLW1LDrg3JaejHkeeLC00XgEPWt26l5Twhh58C7eAImYpgCLgEPvA0_3OEvj0nzYFxSshFOeKmD__GcQhtE"
            />
          </button>
        </div>
      </div>
    </header>
  );
};
