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
      <nav className="fixed bottom-0 left-0 right-0 z-40 max-w-md mx-auto w-full pb-safe bg-white dark:bg-[#0a0f1d] border-t border-slate-200 dark:border-slate-800 shadow-[0_-4px_20px_rgba(0,0,0,0.12)] transition-colors">
        <div className="flex justify-around items-center h-16 px-1">
          {/* Access / Keycard Tab */}
          <button
            onClick={() => onSelectStudentTab('access')}
            aria-current={studentTab === 'access' ? 'page' : undefined}
            className={`flex flex-col items-center justify-center min-w-[56px] min-h-[46px] py-1 px-1 rounded-xl transition-all cursor-pointer ${
              studentTab === 'access'
                ? 'text-blue-600 dark:text-cyan-400 bg-blue-50 dark:bg-cyan-950/60 font-bold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 font-medium'
            }`}
          >
            <span
              className="material-symbols-outlined text-[22px]"
              style={studentTab === 'access' ? { fontVariationSettings: "'FILL' 1" } : {}}
            >
              key
            </span>
            <span className="font-semibold text-[11px] mt-0.5 tracking-tight leading-tight">{t.accessTab}</span>
          </button>

          {/* Attendance Tab */}
          <button
            onClick={() => onSelectStudentTab('attendance')}
            aria-current={studentTab === 'attendance' ? 'page' : undefined}
            className={`flex flex-col items-center justify-center min-w-[56px] min-h-[46px] py-1 px-1 rounded-xl transition-all cursor-pointer ${
              studentTab === 'attendance'
                ? 'text-blue-600 dark:text-cyan-400 bg-blue-50 dark:bg-cyan-950/60 font-bold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 font-medium'
            }`}
          >
            <span
              className="material-symbols-outlined text-[22px]"
              style={studentTab === 'attendance' ? { fontVariationSettings: "'FILL' 1" } : {}}
            >
              calendar_month
            </span>
            <span className="font-semibold text-[11px] mt-0.5 tracking-tight leading-tight">{t.attendanceTab}</span>
          </button>

          {/* Safety & SOS Tab */}
          <button
            onClick={() => onSelectStudentTab('safety')}
            aria-current={studentTab === 'safety' ? 'page' : undefined}
            className={`flex flex-col items-center justify-center min-w-[56px] min-h-[46px] py-1 px-1 rounded-xl transition-all cursor-pointer ${
              studentTab === 'safety'
                ? 'text-blue-600 dark:text-cyan-400 bg-blue-50 dark:bg-cyan-950/60 font-bold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 font-medium'
            }`}
          >
            <span
              className="material-symbols-outlined text-[22px]"
              style={studentTab === 'safety' ? { fontVariationSettings: "'FILL' 1" } : {}}
            >
              shield_with_heart
            </span>
            <span className="font-semibold text-[11px] mt-0.5 tracking-tight leading-tight">{t.safetyTab}</span>
          </button>

          {/* Events & Campus Pulse Tab */}
          <button
            onClick={() => onSelectStudentTab('events')}
            aria-current={studentTab === 'events' ? 'page' : undefined}
            className={`flex flex-col items-center justify-center min-w-[56px] min-h-[46px] py-1 px-1 rounded-xl transition-all cursor-pointer ${
              studentTab === 'events'
                ? 'text-blue-600 dark:text-cyan-400 bg-blue-50 dark:bg-cyan-950/60 font-bold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 font-medium'
            }`}
          >
            <span
              className="material-symbols-outlined text-[22px]"
              style={studentTab === 'events' ? { fontVariationSettings: "'FILL' 1" } : {}}
            >
              event_available
            </span>
            <span className="font-semibold text-[11px] mt-0.5 tracking-tight leading-tight">{t.eventsTab}</span>
          </button>

          {/* Facilities / Study Spaces Tab */}
          <button
            onClick={() => onSelectStudentTab('facilities')}
            aria-current={studentTab === 'facilities' ? 'page' : undefined}
            className={`flex flex-col items-center justify-center min-w-[56px] min-h-[46px] py-1 px-1 rounded-xl transition-all cursor-pointer ${
              studentTab === 'facilities'
                ? 'text-blue-600 dark:text-cyan-400 bg-blue-50 dark:bg-cyan-950/60 font-bold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 font-medium'
            }`}
          >
            <span
              className="material-symbols-outlined text-[22px]"
              style={studentTab === 'facilities' ? { fontVariationSettings: "'FILL' 1" } : {}}
            >
              local_library
            </span>
            <span className="font-semibold text-[11px] mt-0.5 tracking-tight leading-tight">{t.facilitiesTab}</span>
          </button>
        </div>
      </nav>
    );
  }

  // Security Sentinel Operations Bottom Bar
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 max-w-md mx-auto w-full pb-safe bg-white dark:bg-[#0a0f1d] border-t border-slate-200 dark:border-slate-800 shadow-[0_-4px_20px_rgba(0,0,0,0.12)] transition-colors">
      <div className="flex justify-around items-center h-16 px-1">
        <button
          onClick={() => onSelectSecurityTab('feeds')}
          aria-current={securityTab === 'feeds' ? 'page' : undefined}
          className={`flex flex-col items-center justify-center min-w-[64px] min-h-[46px] py-1 px-2.5 rounded-xl transition-all cursor-pointer ${
            securityTab === 'feeds'
              ? 'text-blue-600 dark:text-cyan-400 bg-blue-50 dark:bg-cyan-950/60 font-bold'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 font-medium'
          }`}
        >
          <span
            className="material-symbols-outlined text-[22px]"
            style={securityTab === 'feeds' ? { fontVariationSettings: "'FILL' 1" } : {}}
          >
            videocam
          </span>
          <span className="font-semibold text-[11px] mt-0.5 tracking-tight leading-tight">{t.liveFeeds}</span>
        </button>

        <button
          onClick={() => onSelectSecurityTab('headcount')}
          aria-current={securityTab === 'headcount' ? 'page' : undefined}
          className={`flex flex-col items-center justify-center min-w-[64px] min-h-[46px] py-1 px-2.5 rounded-xl transition-all cursor-pointer ${
            securityTab === 'headcount'
              ? 'text-blue-600 dark:text-cyan-400 bg-blue-50 dark:bg-cyan-950/60 font-bold'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 font-medium'
          }`}
        >
          <span
            className="material-symbols-outlined text-[22px]"
            style={securityTab === 'headcount' ? { fontVariationSettings: "'FILL' 1" } : {}}
          >
            groups
          </span>
          <span className="font-semibold text-[11px] mt-0.5 tracking-tight leading-tight">{t.headcount}</span>
        </button>

        <button
          onClick={() => onSelectSecurityTab('access')}
          aria-current={securityTab === 'access' ? 'page' : undefined}
          className={`flex flex-col items-center justify-center min-w-[64px] min-h-[46px] py-1 px-2.5 rounded-xl transition-all cursor-pointer ${
            securityTab === 'access'
              ? 'text-blue-600 dark:text-cyan-400 bg-blue-50 dark:bg-cyan-950/60 font-bold'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 font-medium'
          }`}
        >
          <span
            className="material-symbols-outlined text-[22px]"
            style={securityTab === 'access' ? { fontVariationSettings: "'FILL' 1" } : {}}
          >
            lock_open
          </span>
          <span className="font-semibold text-[11px] mt-0.5 tracking-tight leading-tight">{t.accessControls}</span>
        </button>

        <button
          onClick={() => onSelectSecurityTab('alerts')}
          aria-current={securityTab === 'alerts' ? 'page' : undefined}
          className={`flex flex-col items-center justify-center min-w-[64px] min-h-[46px] py-1 px-2.5 rounded-xl transition-all relative cursor-pointer ${
            securityTab === 'alerts'
              ? 'text-blue-600 dark:text-cyan-400 bg-blue-50 dark:bg-cyan-950/60 font-bold'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 font-medium'
          }`}
        >
          <div className="relative">
            <span
              className="material-symbols-outlined text-[22px]"
              style={securityTab === 'alerts' ? { fontVariationSettings: "'FILL' 1" } : {}}
            >
              security
            </span>
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-error ring-2 ring-white dark:ring-[#0a0f1d]" />
          </div>
          <span className="font-semibold text-[11px] mt-0.5 tracking-tight leading-tight">
            {language === 'zh' ? '指挥网关' : language === 'ms' ? 'Gerbang' : language === 'id' ? 'Gerbang' : language === 'kk' ? 'Шлюз' : 'Sentinel'}
          </span>
        </button>
      </div>
    </nav>
  );
};
