import React, { useState } from 'react';
import { Persona, StudentTab, SecurityTab, Language, ThemeMode } from '../../types';
import { TRANSLATIONS } from '../../data/mockCampusData';

interface HeaderProps {
  currentPersona: Persona;
  onTogglePersona: () => void;
  language: Language;
  onOpenSettings: () => void;
  themeMode: ThemeMode;
  onToggleTheme: () => void;
  studentTab: StudentTab;
  onSelectStudentTab: (tab: StudentTab) => void;
  securityTab: SecurityTab;
  onSelectSecurityTab: (tab: SecurityTab) => void;
  wifiConnected?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentPersona,
  onTogglePersona,
  language,
  onOpenSettings,
  themeMode,
  onToggleTheme,
  studentTab,
  onSelectStudentTab,
  securityTab,
  onSelectSecurityTab,
  wifiConnected = true,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const t = TRANSLATIONS[language];

  const notifications = [
    {
      id: 'notif-1',
      title: '5G NR-U Active',
      time: '10m',
      desc: 'Campus 5G standalone mesh operating at full speed.',
      icon: 'wifi_tethering',
      color: 'text-secondary',
    },
    {
      id: 'notif-2',
      title: 'Class Verified',
      time: '42m',
      desc: 'Auto-signed in to CS302 Cloud Systems.',
      icon: 'check_circle',
      color: 'text-emerald-500',
    },
    {
      id: 'notif-3',
      title: 'Patrol Standby',
      time: '2h',
      desc: 'North Quad Safe Walk escorts active 24/7.',
      icon: 'local_police',
      color: 'text-blue-500',
    },
  ];


  return (
    <header className="fixed top-0 left-0 right-0 z-40 max-w-md mx-auto w-full bg-surface/90 backdrop-blur-xl border-b border-outline-variant/30 pt-safe transition-colors">
      <div className="h-16 px-3 flex items-center justify-between gap-1.5">
        {/* Brand & Connection Telemetry */}
        <div className="flex items-center gap-2 min-w-0">
          <img
            alt="Uni Connect"
            className="h-8 w-auto object-contain shrink-0"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBLGp5arT1RL522iyZ3EpwemWjDRI1_UM8t9tAIvywgygpl_mbjGNVtQKiU9qZ6BRd5wfbiwF85qvXQYRBG13hkzQGJ-OSFhhXR5nHgGdcUYqtRec976WyX3LfMTIWqQimWcki91SZ-33fzoA8hR7VnESM518dq7JuP2V9ZhczmdoQCt_4aDkA6uLSMyho4oC9u7_LtPxd4SyOmq__EkMgj_ffH5CljmtNZ2xhGBH-pFepI3erepqyy"
          />

          <div className="flex flex-col min-w-0">
            <span className="font-bold text-sm text-on-surface tracking-tight truncate leading-tight">
              {currentPersona === 'student' ? t.appName : t.securityPortal}
            </span>
            <div className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded-full bg-surface-container-high max-w-fit mt-0.5">
              <span
                className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                  wifiConnected ? 'bg-secondary animate-pulse' : 'bg-amber-500'
                }`}
              />
              <span className="text-[10px] font-mono text-secondary truncate">
                5G NR
              </span>
            </div>
          </div>
        </div>

        {/* Center / Right Control Island */}
        <div className="flex items-center gap-1 shrink-0">

          {/* Theme Toggle (Dark / Light Mode) */}
          <button
            onClick={onToggleTheme}
            className="w-8 h-8 rounded-full flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors cursor-pointer"
            title={themeMode === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle Dark / Light Theme"
          >
            <span className="material-symbols-outlined text-[19px]">
              {themeMode === 'dark' ? 'light_mode' : 'dark_mode'}
            </span>
          </button>

          {/* Persona Switcher Pill */}
          <button
            onClick={onTogglePersona}
            className={`flex items-center gap-1 px-2 py-1 rounded-xl text-xs font-semibold border transition-all duration-200 cursor-pointer ${
              currentPersona === 'student'
                ? 'bg-secondary-fixed hover:bg-secondary-fixed-dim text-on-secondary-fixed border-secondary/20'
                : 'bg-primary text-white border-slate-700 hover:bg-slate-900'
            }`}
            title="Toggle Student / Security Mode"
          >
            <span className="material-symbols-outlined text-[14px]">
              {currentPersona === 'student' ? 'admin_panel_settings' : 'school'}
            </span>
            <span className="text-[10px] font-sans">
              {currentPersona === 'student'
                ? (language === 'zh' ? '安保' : language === 'ms' ? 'Keselamatan' : language === 'id' ? 'Keamanan' : language === 'kk' ? 'Күзет' : 'Security')
                : (language === 'zh' ? '学生' : language === 'ms' ? 'Pelajar' : language === 'id' ? 'Mahasiswa' : language === 'kk' ? 'Студент' : 'Student')}
            </span>
          </button>

          {/* Notifications Trigger */}
          <div className="relative">
            <button
              onClick={() => {
                setShowNotifications(!showNotifications);
              }}
              aria-label="Notifications"
              className="w-8 h-8 rounded-full flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors relative cursor-pointer"
            >
              <span className="material-symbols-outlined text-[19px]">notifications</span>
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-error ring-1 ring-surface" />
            </button>

            {/* Notifications Popover */}
            {showNotifications && (
              <div className="absolute right-0 top-10 w-72 bg-surface-container-lowest border border-outline-variant/40 rounded-2xl shadow-xl p-3 z-50 space-y-2 animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between pb-1.5 border-b border-outline-variant/20">
                  <span className="font-semibold text-xs text-on-surface">Campus Alerts</span>
                  <button
                    onClick={() => setShowNotifications(false)}
                    className="text-[10px] text-secondary font-medium hover:underline cursor-pointer"
                  >
                    Clear
                  </button>
                </div>
                <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      className="p-2 rounded-xl bg-surface-container-low hover:bg-surface-container transition-colors flex items-start gap-2"
                    >
                      <span className={`material-symbols-outlined text-[16px] shrink-0 mt-0.5 ${n.color}`}>
                        {n.icon}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-[11px] text-on-surface truncate">
                            {n.title}
                          </span>
                          <span className="text-[9px] text-on-surface-variant font-mono">
                            {n.time}
                          </span>
                        </div>
                        <p className="text-[10px] text-on-surface-variant mt-0.5 leading-snug">
                          {n.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Profile Button */}
          <button
            onClick={onOpenSettings}
            className="p-0.5 rounded-full ring-1 ring-outline-variant/40 hover:ring-secondary transition-all cursor-pointer"
            title="Profile & Settings"
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
