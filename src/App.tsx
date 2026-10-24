import React, { useState, useEffect } from 'react';
import {
  Persona,
  StudentTab,
  SecurityTab,
  Language,
  ThemeMode,
  AccessTrace,
} from './types';
import {
  INITIAL_STUDENT_PROFILE,
  INITIAL_BEACONS,
  INITIAL_TRACES,
} from './data/mockCampusData';
import { Header } from './components/common/Header';
import { BottomNav } from './components/common/BottomNav';
import { ProximitySimulatorDrawer } from './components/common/ProximitySimulatorDrawer';
import { KeycardAccessView } from './components/student/KeycardAccessView';
import { AttendanceView } from './components/student/AttendanceView';
import { SafetySosView } from './components/student/SafetySosView';
import { CampusPulseEventsView } from './components/student/CampusPulseEventsView';
import { FacilityStudySpacesView } from './components/student/FacilityStudySpacesView';
import { SettingsPreferencesView } from './components/student/SettingsPreferencesView';
import { SecurityPortalLogin } from './components/security/SecurityPortalLogin';
import { LiveFeedsView } from './components/security/LiveFeedsView';
import { HeadcountZonesView } from './components/security/HeadcountZonesView';
import { AccessControlsView } from './components/security/AccessControlsView';

export default function App() {
  // Current user persona: student (default) or security
  const [currentPersona, setCurrentPersona] = useState<Persona>('student');
  const [studentTab, setStudentTab] = useState<StudentTab>('access');
  const [securityTab, setSecurityTab] = useState<SecurityTab>('feeds');

  // Localization and appearance
  const [language, setLanguage] = useState<Language>('en');
  const [themeMode, setThemeMode] = useState<ThemeMode>('light');
  const [highContrast, setHighContrast] = useState(false);

  // Sensor preferences
  const [handsFreeUnlock, setHandsFreeUnlock] = useState(true);
  const [autoAttendance, setAutoAttendance] = useState(true);
  const [sosHaptic, setSosHaptic] = useState(true);

  // Proximity simulator state
  const [beacons, setBeacons] = useState(INITIAL_BEACONS);
  const [selectedBeaconId, setSelectedBeaconId] = useState('beacon-lab-402');
  const [currentDistance, setCurrentDistance] = useState(1.2);
  const [isSimulatorOpen, setIsSimulatorOpen] = useState(false);
  const [traces, setTraces] = useState<AccessTrace[]>(INITIAL_TRACES);
  const [unlockedBeaconName, setUnlockedBeaconName] = useState<string | null>(null);

  // Apply dark mode and high-contrast classes to documentElement
  useEffect(() => {
    const root = document.documentElement;
    if (themeMode === 'dark') {
      root.classList.add('dark');
    } else if (themeMode === 'light') {
      root.classList.remove('dark');
    } else {
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    }

    if (highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }
  }, [themeMode, highContrast]);

  // Handle simulated unlock when proximity threshold is met
  const handleSimulateUnlock = (beaconName: string) => {
    if (unlockedBeaconName === beaconName) return;
    setUnlockedBeaconName(beaconName);

    // Add entry to access traces
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(
      now.getMinutes()
    ).padStart(2, '0')}`;
    const newTrace: AccessTrace = {
      id: `trace-${Date.now()}`,
      location: beaconName,
      subLocation: `Auto-unlocked via Proximity Radar (${currentDistance.toFixed(
        1
      )}m approach) • Handshake Verified`,
      type: 'walk-through',
      time: timeStr,
      isToday: true,
      doorCode: 'Door Pass #01',
    };

    setTraces((prev) => [newTrace, ...prev.slice(0, 5)]);

    // Reset lock announcement after 4s
    setTimeout(() => {
      setUnlockedBeaconName(null);
    }, 4000);
  };

  return (
    <div className="min-h-screen bg-slate-200/40 dark:bg-slate-950 flex justify-center selection:bg-secondary-fixed selection:text-on-secondary-fixed antialiased">
      <div
        className={`w-full max-w-md min-h-screen flex flex-col relative shadow-2xl transition-colors duration-200 border-x border-slate-200/50 dark:border-slate-800/80 ${
          currentPersona === 'student' && studentTab === 'access'
            ? 'bg-[#090e1a] text-white'
            : 'bg-surface text-on-surface'
        }`}
      >
        {/* Universal Fixed Header */}
        <Header
          currentPersona={currentPersona}
          onTogglePersona={() =>
            setCurrentPersona(currentPersona === 'student' ? 'security' : 'student')
          }
          language={language}
          onOpenSettings={() => {
            if (currentPersona === 'student') {
              setStudentTab('settings');
            } else {
              setCurrentPersona('student');
              setStudentTab('settings');
            }
          }}
        />

        {/* Main Content Viewport */}
        <main className="flex-1 w-full px-3.5 pt-18 pb-20 overflow-x-hidden">
          {/* Active Proximity Alert Toast */}
          {unlockedBeaconName && (
            <div className="fixed top-18 left-0 right-0 max-w-md mx-auto px-4 z-50 pointer-events-none transition-all duration-300">
              <div className="px-3 py-1.5 rounded-full bg-emerald-600 text-white shadow-xl flex items-center justify-center gap-1.5 text-xs font-mono font-semibold animate-bounce">
                <span className="material-symbols-outlined text-[16px]">lock_open</span>
                <span className="truncate">Auto-Unlocked: {unlockedBeaconName}</span>
              </div>
            </div>
          )}

        {/* Student Mode Screens */}
        {currentPersona === 'student' && (
          <>
            {studentTab === 'access' && (
              <KeycardAccessView
                profile={INITIAL_STUDENT_PROFILE}
                beacons={beacons}
                traces={traces}
                currentDistance={currentDistance}
                onOpenSos={() => setStudentTab('safety')}
                language={language}
              />
            )}

            {studentTab === 'attendance' && (
              <AttendanceView
                currentDistance={currentDistance}
                language={language}
              />
            )}

            {studentTab === 'safety' && (
              <SafetySosView language={language} />
            )}

            {studentTab === 'events' && (
              <CampusPulseEventsView language={language} />
            )}

            {studentTab === 'facilities' && (
              <FacilityStudySpacesView language={language} />
            )}

            {studentTab === 'settings' && (
              <SettingsPreferencesView
                profile={INITIAL_STUDENT_PROFILE}
                language={language}
                onSelectLanguage={setLanguage}
                themeMode={themeMode}
                onSelectTheme={setThemeMode}
                highContrast={highContrast}
                onToggleHighContrast={() => setHighContrast(!highContrast)}
                handsFreeUnlock={handsFreeUnlock}
                onToggleHandsFreeUnlock={() => setHandsFreeUnlock(!handsFreeUnlock)}
                autoAttendance={autoAttendance}
                onToggleAutoAttendance={() => setAutoAttendance(!autoAttendance)}
                sosHaptic={sosHaptic}
                onToggleSosHaptic={() => setSosHaptic(!sosHaptic)}
                onCloseSettings={() => setStudentTab('access')}
              />
            )}
          </>
        )}

        {/* Campus Operations & Security Sentinel Mode Screens */}
        {currentPersona === 'security' && (
          <>
            {securityTab === 'feeds' && <LiveFeedsView />}
            {securityTab === 'headcount' && <HeadcountZonesView />}
            {securityTab === 'access' && <AccessControlsView />}
            {securityTab === 'alerts' && (
              <SecurityPortalLogin
                onAuthenticateSuccess={() => {
                  alert('Officer Credentials Authenticated: Accessing Live CCTV Feeds');
                  setSecurityTab('feeds');
                }}
              />
            )}
          </>
        )}
      </main>

      {/* Floating Interactive Proximity Simulator Drawer */}
      <ProximitySimulatorDrawer
        beacons={beacons}
        selectedBeaconId={selectedBeaconId}
        onSelectBeacon={setSelectedBeaconId}
        currentDistance={currentDistance}
        onDistanceChange={setCurrentDistance}
        isOpen={isSimulatorOpen}
        onToggleOpen={() => setIsSimulatorOpen(!isSimulatorOpen)}
        onSimulateUnlock={handleSimulateUnlock}
      />

      {/* Universal Fixed Bottom Navigation Bar */}
      <BottomNav
        currentPersona={currentPersona}
        studentTab={studentTab}
        onSelectStudentTab={setStudentTab}
        securityTab={securityTab}
        onSelectSecurityTab={setSecurityTab}
        language={language}
      />
      </div>
    </div>
  );
}
