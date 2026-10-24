import React from 'react';
import { Persona, StudentTab, SecurityTab, Language } from '../../types';
import { TRANSLATIONS } from '../../data/mockCampusData';

interface BottomNavProps {
  currentPersona: Persona;
  studentTab: StudentTab;
  onSelectStudentTab: (tab: StudentTab) => void;
  securityTab: SecurityTab;
  onSelectSecurityTab: (tab: SecurityTab) => void;
  language: Language;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentPersona,
  studentTab,
  onSelectStudentTab,
  securityTab,
  onSelectSecurityTab,
  language,
}) => {
  const t = TRANSLATIONS[language];

  if (currentPersona === 'student') {
    return (
      <nav className="fixed bottom-0 left-0 right-0 z-40 max-w-md mx-auto w-full pb-safe bg-surface/90 dark:bg-[#0b101d]/90 backdrop-blur-xl border-t border-slate-200/60 dark:border-slate-800/80 shadow-[0_-2px_12px_rgba(0,0,0,0.03)]">
        <div className="flex justify-around items-center h-16 px-1">
          {/* Access / Keycard Tab */}
          <button
            onClick={() => onSelectStudentTab('access')}
            aria-current={studentTab === 'access' ? 'page' : undefined}
            className={`flex flex-col items-center justify-center min-w-[64px] min-h-[44px] py-1 px-2.5 rounded-xl transition-all cursor-pointer ${
              studentTab === 'access'
                ? 'text-secondary bg-surface-container-highest/60 dark:bg-slate-800 font-semibold'
                : 'text-on-surface-variant dark:text-slate-400 hover:text-on-surface'
            }`}
          >
            <span
              className="material-symbols-outlined text-[22px]"
              style={studentTab === 'access' ? { fontVariationSettings: "'FILL' 1" } : {}}
            >
              key
            </span>
            <span className="font-label-sm text-label-sm mt-0.5">{t.accessTab}</span>
          </button>

          {/* Attendance Tab */}
          <button
            onClick={() => onSelectStudentTab('attendance')}
            aria-current={studentTab === 'attendance' ? 'page' : undefined}
            className={`flex flex-col items-center justify-center min-w-[64px] min-h-[44px] py-1 px-2.5 rounded-xl transition-all cursor-pointer ${
              studentTab === 'attendance'
                ? 'text-secondary bg-surface-container-highest/60 dark:bg-slate-800 font-semibold'
                : 'text-on-surface-variant dark:text-slate-400 hover:text-on-surface'
            }`}
          >
            <span
              className="material-symbols-outlined text-[22px]"
              style={studentTab === 'attendance' ? { fontVariationSettings: "'FILL' 1" } : {}}
            >
              check_circle
            </span>
            <span className="font-label-sm text-label-sm mt-0.5">{t.attendanceTab}</span>
          </button>

          {/* Safety & SOS Tab */}
          <button
            onClick={() => onSelectStudentTab('safety')}
            aria-current={studentTab === 'safety' ? 'page' : undefined}
            className={`flex flex-col items-center justify-center min-w-[64px] min-h-[44px] py-1 px-2.5 rounded-xl transition-all cursor-pointer ${
              studentTab === 'safety'
                ? 'text-secondary bg-surface-container-highest/60 dark:bg-slate-800 font-semibold'
                : 'text-on-surface-variant dark:text-slate-400 hover:text-on-surface'
            }`}
          >
            <span
              className="material-symbols-outlined text-[22px]"
              style={studentTab === 'safety' ? { fontVariationSettings: "'FILL' 1" } : {}}
            >
              shield_with_heart
            </span>
            <span className="font-label-sm text-label-sm mt-0.5">{t.safetyTab}</span>
          </button>

          {/* Events & Campus Pulse Tab */}
          <button
            onClick={() => onSelectStudentTab('events')}
            aria-current={studentTab === 'events' ? 'page' : undefined}
            className={`flex flex-col items-center justify-center min-w-[64px] min-h-[44px] py-1 px-2.5 rounded-xl transition-all cursor-pointer ${
              studentTab === 'events'
                ? 'text-secondary bg-surface-container-highest/60 dark:bg-slate-800 font-semibold'
                : 'text-on-surface-variant dark:text-slate-400 hover:text-on-surface'
            }`}
          >
            <span
              className="material-symbols-outlined text-[22px]"
              style={studentTab === 'events' ? { fontVariationSettings: "'FILL' 1" } : {}}
            >
              event_available
            </span>
            <span className="font-label-sm text-label-sm mt-0.5">{t.eventsTab}</span>
          </button>
        </div>
      </nav>
    );
  }

  // Security Sentinel Operations Bottom Bar
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 max-w-md mx-auto w-full pb-safe bg-surface/90 dark:bg-[#0b101d]/90 backdrop-blur-xl border-t border-slate-200/60 dark:border-slate-800/80 shadow-[0_-2px_12px_rgba(0,0,0,0.04)]">
      <div className="flex justify-around items-center h-16 px-1">
        <button
          onClick={() => onSelectSecurityTab('feeds')}
          aria-current={securityTab === 'feeds' ? 'page' : undefined}
          className={`flex flex-col items-center justify-center min-w-[64px] min-h-[44px] py-1 px-2.5 rounded-xl transition-all cursor-pointer ${
            securityTab === 'feeds'
              ? 'text-secondary bg-surface-container-highest/60 dark:bg-slate-800 font-semibold'
              : 'text-on-surface-variant dark:text-slate-400 hover:text-on-surface'
          }`}
        >
          <span
            className="material-symbols-outlined text-[22px]"
            style={securityTab === 'feeds' ? { fontVariationSettings: "'FILL' 1" } : {}}
          >
            videocam
          </span>
          <span className="font-label-sm text-label-sm mt-0.5">{t.liveFeeds}</span>
        </button>

        <button
          onClick={() => onSelectSecurityTab('headcount')}
          aria-current={securityTab === 'headcount' ? 'page' : undefined}
          className={`flex flex-col items-center justify-center min-w-[64px] min-h-[44px] py-1 px-2.5 rounded-xl transition-all cursor-pointer ${
            securityTab === 'headcount'
              ? 'text-secondary bg-surface-container-highest/60 dark:bg-slate-800 font-semibold'
              : 'text-on-surface-variant dark:text-slate-400 hover:text-on-surface'
          }`}
        >
          <span
            className="material-symbols-outlined text-[22px]"
            style={securityTab === 'headcount' ? { fontVariationSettings: "'FILL' 1" } : {}}
          >
            groups
          </span>
          <span className="font-label-sm text-label-sm mt-0.5">{t.headcount}</span>
        </button>

        <button
          onClick={() => onSelectSecurityTab('access')}
          aria-current={securityTab === 'access' ? 'page' : undefined}
          className={`flex flex-col items-center justify-center min-w-[64px] min-h-[44px] py-1 px-2.5 rounded-xl transition-all cursor-pointer ${
            securityTab === 'access'
              ? 'text-secondary bg-surface-container-highest/60 dark:bg-slate-800 font-semibold'
              : 'text-on-surface-variant dark:text-slate-400 hover:text-on-surface'
          }`}
        >
          <span
            className="material-symbols-outlined text-[22px]"
            style={securityTab === 'access' ? { fontVariationSettings: "'FILL' 1" } : {}}
          >
            lock_open
          </span>
          <span className="font-label-sm text-label-sm mt-0.5">{t.accessControls}</span>
        </button>

        <button
          onClick={() => onSelectSecurityTab('alerts')}
          aria-current={securityTab === 'alerts' ? 'page' : undefined}
          className={`flex flex-col items-center justify-center min-w-[64px] min-h-[44px] py-1 px-2.5 rounded-xl transition-all relative cursor-pointer ${
            securityTab === 'alerts'
              ? 'text-secondary bg-surface-container-highest/60 dark:bg-slate-800 font-semibold'
              : 'text-on-surface-variant dark:text-slate-400 hover:text-on-surface'
          }`}
        >
          <div className="relative">
            <span
              className="material-symbols-outlined text-[22px]"
              style={securityTab === 'alerts' ? { fontVariationSettings: "'FILL' 1" } : {}}
            >
              security
            </span>
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-error ring-2 ring-surface" />
          </div>
          <span className="font-label-sm text-label-sm mt-0.5">Sentinel</span>
        </button>
      </div>
    </nav>
  );
};
