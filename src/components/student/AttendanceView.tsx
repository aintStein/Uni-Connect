import React, { useState } from 'react';
import { Language, CourseAssignment } from '../../types';
import {
  WEEKLY_SCHEDULE,
  COURSE_ASSIGNMENTS,
  COURSE_MATERIALS,
  TRANSLATIONS,
} from '../../data/mockCampusData';
import { SwitchToggle } from '../common/SwitchToggle';

interface AttendanceViewProps {
  currentDistance: number;
  language: Language;
}

export const AttendanceView: React.FC<AttendanceViewProps> = ({ currentDistance, language }) => {
  const [activeSubTab, setActiveSubTab] = useState<'schedule' | 'coursework' | 'studyhub'>('schedule');
  const [selectedDay, setSelectedDay] = useState<'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri'>('Thu');
  const [assignments, setAssignments] = useState<CourseAssignment[]>(COURSE_ASSIGNMENTS);
  const [assignmentFilter, setAssignmentFilter] = useState<'all' | 'due-soon' | 'submitted' | 'graded'>('all');
  const [policyActive, setPolicyActive] = useState(true);

  // Modals state
  const [submittingAssignment, setSubmittingAssignment] = useState<CourseAssignment | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [submissionReceipt, setSubmissionReceipt] = useState<string | null>(null);
  const [repoInput, setRepoInput] = useState('https://github.com/alex-morgan/coursework-repo');
  const [notesInput, setNotesInput] = useState('');
  const [fileNameInput, setFileNameInput] = useState('alex_morgan_coursework_submission.zip');
  const [academicIntegrityChecked, setAcademicIntegrityChecked] = useState(true);

  // Feedback modal
  const [viewingAssignment, setViewingAssignment] = useState<CourseAssignment | null>(null);

  // Office Hours modal
  const [showOfficeHoursModal, setShowOfficeHoursModal] = useState(false);
  const [selectedProf, setSelectedProf] = useState('Dr. Vance (CS302)');
  const [officeHoursBooked, setOfficeHoursBooked] = useState(false);

  // Lecture notes preview modal
  const [showLectureNotesModal, setShowLectureNotesModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // GPA Target Calculator state
  const [targetCsScore, setTargetCsScore] = useState(95);
  const [targetMathScore, setTargetMathScore] = useState(90);

  const t = TRANSLATIONS[language];

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const currentDayData = WEEKLY_SCHEDULE.find((d) => d.day === selectedDay) || WEEKLY_SCHEDULE[3];

  const filteredAssignments = assignments.filter((a) => {
    if (assignmentFilter === 'all') return true;
    if (assignmentFilter === 'due-soon') return a.status === 'due-soon' || a.status === 'in-progress';
    if (assignmentFilter === 'submitted') return a.status === 'submitted';
    if (assignmentFilter === 'graded') return a.status === 'graded';
    return true;
  });

  const handleOpenSubmitModal = (assignment: CourseAssignment) => {
    setSubmittingAssignment(assignment);
    setUploadProgress(0);
    setIsUploading(false);
    setSubmissionReceipt(null);
    setNotesInput('');
  };

  const handleExecuteSubmission = (e: React.FormEvent) => {
    e.preventDefault();
    if (!submittingAssignment) return;

    setIsUploading(true);
    let prog = 0;
    const interval = setInterval(() => {
      prog += 25;
      setUploadProgress(prog);
      if (prog >= 100) {
        clearInterval(interval);
        setIsUploading(false);
        const receiptCode = `RECEIPT-${submittingAssignment.courseCode}-${Date.now().toString().slice(-4)}`;
        setSubmissionReceipt(receiptCode);

        // Update local assignment state to submitted
        setAssignments((prev) =>
          prev.map((item) =>
            item.id === submittingAssignment.id
              ? {
                  ...item,
                  status: 'submitted',
                  submittedDate: 'Just Now • On Time',
                  attachedFile: fileNameInput,
                  repoUrl: repoInput,
                }
              : item
          )
        );
      }
    }, 250);
  };

  // GPA calculation logic
  const projectedGpa = (
    3.8 +
    (targetCsScore / 100) * 0.1 +
    (targetMathScore / 100) * 0.08
  ).toFixed(2);

  return (
    <div className="flex flex-col w-full gap-4 pb-12">
      {/* Top Academic Context Header */}
      <div className="flex items-center justify-between pt-1">
        <div className="flex flex-col">
          <span className="text-[10px] font-mono text-on-surface-variant uppercase tracking-wider font-semibold">
            Academic Term 2024–25 • 18 Credits
          </span>
          <h1 className="text-xl font-bold text-on-surface tracking-tight">
            Schedule &amp; Coursework
          </h1>
        </div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed shadow-sm">
          <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
          <span className="text-xs font-semibold font-mono">Beacon Synced</span>
        </div>
      </div>

      {/* Segmented Navigation Tabs */}
      <div className="grid grid-cols-3 gap-1 bg-surface-container-low p-1 rounded-2xl border border-slate-200/50 dark:border-slate-800">
        <button
          onClick={() => setActiveSubTab('schedule')}
          className={`py-2 px-1 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            activeSubTab === 'schedule'
              ? 'bg-surface-container-lowest text-on-surface shadow-xs'
              : 'text-on-surface-variant hover:text-on-surface'
          }`}
        >
          <span className="material-symbols-outlined text-[16px]">calendar_today</span>
          <span>{t.scheduleTabLabel}</span>
        </button>

        <button
          onClick={() => setActiveSubTab('coursework')}
          className={`py-2 px-1 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 relative ${
            activeSubTab === 'coursework'
              ? 'bg-surface-container-lowest text-on-surface shadow-xs'
              : 'text-on-surface-variant hover:text-on-surface'
          }`}
        >
          <span className="material-symbols-outlined text-[16px]">assignment</span>
          <span>{t.courseworkTabLabel}</span>
          <span className="w-2 h-2 rounded-full bg-error absolute top-2 right-2 animate-ping" />
          <span className="w-1.5 h-1.5 rounded-full bg-error absolute top-2.5 right-2.5" />
        </button>

        <button
          onClick={() => setActiveSubTab('studyhub')}
          className={`py-2 px-1 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            activeSubTab === 'studyhub'
              ? 'bg-surface-container-lowest text-on-surface shadow-xs'
              : 'text-on-surface-variant hover:text-on-surface'
          }`}
        >
          <span className="material-symbols-outlined text-[16px]">school</span>
          <span>{t.studyHubTabLabel}</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* SUB-TAB 1: SCHEDULE & ATTENDANCE */}
      {/* ========================================================================= */}
      {activeSubTab === 'schedule' && (
        <div className="flex flex-col gap-4 animate-in fade-in duration-200">
          {/* Active Live Class Card (Thursday CS302) */}
          <div className="relative overflow-hidden rounded-3xl bg-surface-container-lowest shadow-md p-5 border border-slate-200/60 dark:border-slate-800 flex flex-col gap-3">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary-container/15 text-secondary text-xs font-bold font-mono">
                <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  check_circle
                </span>
                PRESENT • AUTO-SIGNED IN
              </span>
              <span className="text-xs font-mono text-on-surface-variant flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px] text-secondary">cell_tower</span>
                5G Node: TH-5G-04 (-48dBm)
              </span>
            </div>

            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="text-xs font-mono font-bold text-secondary">CS302</span>
                <h2 className="text-base font-bold text-on-surface">Distributed Cloud Systems</h2>
                <p className="text-xs text-on-surface-variant mt-0.5">
                  Dr. Vance • Turing Hall 102
                </p>
              </div>
              <button
                onClick={() => setShowLectureNotesModal(true)}
                className="w-10 h-10 rounded-2xl bg-surface-container-high flex items-center justify-center text-on-surface shrink-0 hover:bg-secondary hover:text-white transition-colors"
                title="View Lecture Notes"
              >
                <span className="material-symbols-outlined text-[20px]">sticky_note_2</span>
              </button>
            </div>

            {/* Time progress bar */}
            <div className="rounded-2xl bg-surface-container-low p-3.5 flex flex-col gap-1.5 border border-slate-200/40 dark:border-slate-800">
              <div className="flex items-center justify-between text-on-surface text-xs font-semibold">
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[18px] text-secondary">timelapse</span>
                  <span>1h 48m in class (08:00 AM – 11:00 AM)</span>
                </div>
                <span className="font-mono text-secondary">60% Elapsed</span>
              </div>
              <div className="w-full h-2 rounded-full bg-surface-container-highest overflow-hidden">
                <div className="h-full bg-secondary rounded-full transition-all duration-700" style={{ width: '60%' }} />
              </div>
              <div className="flex items-center justify-between text-[11px] font-mono text-on-surface-variant mt-0.5">
                <span>Checked In: 08:02 AM</span>
                <span>Seat Density: 38/45 (High)</span>
              </div>
            </div>
          </div>

          {/* Interactive Day-by-Day Timetable Switcher */}
          <div className="bg-surface-container-lowest rounded-3xl p-4 shadow-sm border border-slate-200/60 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-on-surface">Weekly Timetable Schedule</h3>
              <span className="text-xs font-mono text-secondary font-semibold">
                Week 8 of 15
              </span>
            </div>

            {/* Day Selector Pills */}
            <div className="grid grid-cols-5 gap-1.5">
              {(['Mon', 'Tue', 'Wed', 'Thu', 'Fri'] as const).map((d) => (
                <button
                  key={d}
                  onClick={() => setSelectedDay(d)}
                  className={`py-2 rounded-2xl text-xs font-bold transition-all flex flex-col items-center justify-center ${
                    selectedDay === d
                      ? 'bg-secondary text-white shadow-sm'
                      : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'
                  }`}
                >
                  <span>{d}</span>
                  {d === 'Thu' && (
                    <span className={`text-[9px] mt-0.5 ${selectedDay === d ? 'text-white/90' : 'text-secondary font-semibold'}`}>
                      Today
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Day's Class List */}
            <div className="space-y-2 pt-1">
              <div className="text-[11px] font-mono uppercase text-on-surface-variant font-bold">
                {currentDayData.dayFull} Classes ({currentDayData.classes.length} scheduled)
              </div>

              {currentDayData.classes.map((cls) => (
                <div
                  key={cls.id}
                  className="rounded-2xl bg-surface-container-low p-3.5 flex items-start justify-between gap-3 border border-slate-200/40 dark:border-slate-800 transition-all hover:bg-surface-container"
                >
                  <div className="flex gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-surface-container-high text-on-surface flex items-center justify-center shrink-0 mt-0.5">
                      <span className="material-symbols-outlined text-[18px]">menu_book</span>
                    </div>
                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-mono font-bold text-secondary">{cls.code}</span>
                        <span className="text-xs font-bold text-on-surface truncate">{cls.name}</span>
                      </div>
                      <span className="text-[11px] text-on-surface-variant truncate mt-0.5">
                        {cls.timeRange} • {cls.location}
                      </span>
                      {cls.topic && (
                        <span className="text-[10px] text-secondary font-mono mt-1 line-clamp-1">
                          Topic: {cls.topic}
                        </span>
                      )}
                    </div>
                  </div>

                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold shrink-0 ${
                      cls.status === 'active'
                        ? 'bg-emerald-500/15 text-emerald-600'
                        : cls.status === 'ready'
                        ? 'bg-secondary-fixed/50 text-secondary'
                        : 'bg-surface-container text-on-surface-variant'
                    }`}
                  >
                    {cls.status === 'active' ? 'Active Now' : cls.timeRemaining || 'Scheduled'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Term Attendance Rate & Policy */}
          <div className="bg-surface-container-lowest rounded-3xl p-5 shadow-sm border border-slate-200/60 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold text-sm font-mono">
                96.5%
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-on-surface">{t.termAttendance}</span>
                <span className="text-[11px] text-on-surface-variant font-mono">
                  42 Attended • 1 Excused • 0 Missed
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-on-surface-variant font-medium">Auto-Sign</span>
              <SwitchToggle
                checked={policyActive}
                onChange={() => setPolicyActive(!policyActive)}
                ariaLabel="Auto-Sign In Policy"
              />
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-TAB 2: COURSEWORK & ASSIGNMENT SUBMISSIONS */}
      {/* ========================================================================= */}
      {activeSubTab === 'coursework' && (
        <div className="flex flex-col gap-4 animate-in fade-in duration-200">
          {/* Coursework Metrics Strip */}
          <div className="grid grid-cols-4 gap-1.5 sm:gap-2">
            <div className="bg-surface-container-lowest p-2 sm:p-3 rounded-2xl border border-slate-200/60 dark:border-slate-800 text-center">
              <span className="text-[9px] sm:text-[10px] font-mono text-on-surface-variant block uppercase">Due Soon</span>
              <span className="text-sm sm:text-base font-bold text-error font-mono">2</span>
            </div>
            <div className="bg-surface-container-lowest p-2 sm:p-3 rounded-2xl border border-slate-200/60 dark:border-slate-800 text-center">
              <span className="text-[9px] sm:text-[10px] font-mono text-on-surface-variant block uppercase">Submitted</span>
              <span className="text-sm sm:text-base font-bold text-secondary font-mono">1</span>
            </div>
            <div className="bg-surface-container-lowest p-2 sm:p-3 rounded-2xl border border-slate-200/60 dark:border-slate-800 text-center">
              <span className="text-[9px] sm:text-[10px] font-mono text-on-surface-variant block uppercase">Graded</span>
              <span className="text-sm sm:text-base font-bold text-emerald-600 font-mono">2</span>
            </div>
            <div className="bg-surface-container-lowest p-2 sm:p-3 rounded-2xl border border-slate-200/60 dark:border-slate-800 text-center">
              <span className="text-[9px] sm:text-[10px] font-mono text-on-surface-variant block uppercase">Term GPA</span>
              <span className="text-sm sm:text-base font-bold text-on-surface font-mono">3.88</span>
            </div>
          </div>

          {/* Assignment Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {[
              { id: 'all', label: `All (${assignments.length})` },
              { id: 'due-soon', label: 'Due Soon (2)' },
              { id: 'submitted', label: 'Submitted (1)' },
              { id: 'graded', label: 'Graded (2)' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setAssignmentFilter(f.id as typeof assignmentFilter)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  assignmentFilter === f.id
                    ? 'bg-secondary text-white shadow-xs'
                    : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Assignments List */}
          <div className="space-y-3">
            {filteredAssignments.map((asg) => (
              <div
                key={asg.id}
                className="bg-surface-container-lowest rounded-3xl p-4 shadow-sm border border-slate-200/60 dark:border-slate-800 flex flex-col gap-3 transition-all hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-secondary bg-secondary-fixed/40 px-2 py-0.5 rounded-md">
                        {asg.courseCode}
                      </span>
                      <span className="text-xs font-bold text-on-surface truncate">
                        {asg.courseName}
                      </span>
                    </div>
                    <h3 className="font-bold text-sm text-on-surface mt-1.5 leading-snug">
                      {asg.title}
                    </h3>
                  </div>

                  {/* Status Badges */}
                  <span
                    className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold shrink-0 ${
                      asg.status === 'due-soon'
                        ? 'bg-red-500/15 text-red-600 dark:text-red-400'
                        : asg.status === 'in-progress'
                        ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400'
                        : asg.status === 'submitted'
                        ? 'bg-blue-500/15 text-blue-600 dark:text-blue-400'
                        : 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                    }`}
                  >
                    {asg.status === 'due-soon'
                      ? 'Due Tomorrow'
                      : asg.status === 'in-progress'
                      ? `Due in ${asg.daysRemaining}d`
                      : asg.status === 'submitted'
                      ? 'Under Review'
                      : asg.grade || 'Graded'}
                  </span>
                </div>

                <p className="text-xs text-on-surface-variant leading-relaxed">
                  {asg.description}
                </p>

                {/* Sub details */}
                <div className="flex items-center justify-between text-[11px] font-mono text-on-surface-variant bg-surface-container-low p-2.5 rounded-xl border border-slate-200/40 dark:border-slate-800">
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px] text-secondary">event</span>
                    <span>Deadline: {asg.dueDate} ({asg.dueTime})</span>
                  </div>
                  <span className="font-semibold text-secondary">{asg.weightPercentage}% of Grade</span>
                </div>

                {/* Card Actions */}
                <div className="flex items-center gap-2 pt-1">
                  {asg.status === 'due-soon' || asg.status === 'in-progress' ? (
                    <button
                      onClick={() => handleOpenSubmitModal(asg)}
                      className="flex-1 py-2.5 rounded-xl bg-secondary text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs hover:bg-secondary/90 transition-all cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[18px]">upload_file</span>
                      <span>Submit Coursework</span>
                    </button>
                  ) : asg.status === 'submitted' ? (
                    <button
                      onClick={() => setViewingAssignment(asg)}
                      className="flex-1 py-2.5 rounded-xl bg-surface-container text-on-surface font-semibold text-xs flex items-center justify-center gap-1.5 hover:bg-surface-container-high transition-colors cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[18px]">receipt_long</span>
                      <span>View Submission Receipt</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => setViewingAssignment(asg)}
                      className="flex-1 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs hover:bg-emerald-700 transition-colors cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[18px]">grade</span>
                      <span>View Feedback &amp; Rubric</span>
                    </button>
                  )}

                  <button
                    onClick={() => triggerToast(`Syllabus rubric for ${asg.courseCode} opened`)}
                    className="px-3 py-2.5 rounded-xl bg-surface-container text-on-surface-variant hover:text-on-surface text-xs font-semibold flex items-center gap-1 transition-colors"
                  >
                    <span className="material-symbols-outlined text-[16px]">help_outline</span>
                    <span>Rubric</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-TAB 3: STUDY HUB & COURSE SETTLING SUITE */}
      {/* ========================================================================= */}
      {activeSubTab === 'studyhub' && (
        <div className="flex flex-col gap-4 animate-in fade-in duration-200">
          {/* Lecture Materials & Download Packs */}
          <div className="bg-surface-container-lowest rounded-3xl p-5 shadow-sm border border-slate-200/60 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary text-[22px]">download_for_offline</span>
                <h3 className="font-bold text-sm text-on-surface">Course Materials &amp; Slides</h3>
              </div>
              <span className="text-[10px] font-mono text-on-surface-variant bg-surface-container px-2 py-0.5 rounded-full">
                4 New This Week
              </span>
            </div>

            <div className="space-y-2">
              {COURSE_MATERIALS.map((mat) => (
                <div
                  key={mat.id}
                  className="p-3 bg-surface-container-low rounded-2xl flex items-center justify-between border border-slate-200/40 dark:border-slate-800"
                >
                  <div className="flex items-center gap-2.5 min-w-0 pr-2">
                    <div className="w-8 h-8 rounded-xl bg-secondary/15 text-secondary flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-[18px]">
                        {mat.type === 'slides' ? 'slideshow' : mat.type === 'lab' ? 'terminal' : 'description'}
                      </span>
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="font-bold text-xs text-on-surface truncate">{mat.title}</span>
                      <span className="text-[10px] font-mono text-on-surface-variant">
                        {mat.courseCode} • Week {mat.week} • {mat.size}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => triggerToast(`Downloading ${mat.title}...`)}
                    className="p-2 rounded-xl bg-surface-container text-secondary hover:bg-secondary hover:text-white transition-colors cursor-pointer shrink-0"
                    title="Download Material"
                  >
                    <span className="material-symbols-outlined text-[18px]">download</span>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Book Office Hours / Faculty Support */}
          <div className="bg-gradient-to-r from-indigo-900 to-slate-900 text-white rounded-3xl p-5 shadow-md space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-wider text-indigo-300 font-semibold">
                Faculty Consultation
              </span>
              <span className="px-2 py-0.5 rounded-full bg-white/20 text-[10px] font-mono text-white">
                1-on-1 Slots
              </span>
            </div>
            <h3 className="font-bold text-base text-white">Book Academic Office Hours</h3>
            <p className="text-xs text-white/80 leading-relaxed">
              Need help settling Project 2 or eigenvalue proofs? Reserve a 15-minute slot with Dr. Vance or Prof. Chen.
            </p>
            <button
              onClick={() => {
                setOfficeHoursBooked(false);
                setShowOfficeHoursModal(true);
              }}
              className="py-2.5 px-4 rounded-xl bg-white text-slate-900 font-bold text-xs shadow hover:bg-slate-100 transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[18px]">event_available</span>
              <span>{t.bookOfficeHours}</span>
            </button>
          </div>

          {/* Target Grade & GPA Calculator */}
          <div className="bg-surface-container-lowest rounded-3xl p-5 shadow-sm border border-slate-200/60 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary text-[22px]">calculate</span>
                <h3 className="font-bold text-sm text-on-surface">{t.gpaCalculator}</h3>
              </div>
              <span className="text-xs font-mono font-bold text-secondary bg-surface-container px-2.5 py-0.5 rounded-full">
                Proj: {projectedGpa} / 4.00
              </span>
            </div>

            <p className="text-xs text-on-surface-variant">
              Simulate your expected coursework and exam performance to settle target semester honors.
            </p>

            <div className="space-y-3 pt-1">
              <div>
                <div className="flex justify-between text-xs font-mono mb-1">
                  <span className="text-on-surface">CS302 Project 2 Score Goal:</span>
                  <span className="font-bold text-secondary">{targetCsScore}%</span>
                </div>
                <input
                  type="range"
                  min="60"
                  max="100"
                  value={targetCsScore}
                  onChange={(e) => setTargetCsScore(Number(e.target.value))}
                  className="w-full h-2 bg-surface-container rounded-lg appearance-none cursor-pointer accent-secondary"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-mono mb-1">
                  <span className="text-on-surface">MATH210 Problem Set Goal:</span>
                  <span className="font-bold text-secondary">{targetMathScore}%</span>
                </div>
                <input
                  type="range"
                  min="60"
                  max="100"
                  value={targetMathScore}
                  onChange={(e) => setTargetMathScore(Number(e.target.value))}
                  className="w-full h-2 bg-surface-container rounded-lg appearance-none cursor-pointer accent-secondary"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 1: SUBMIT ASSIGNMENT MODAL */}
      {/* ========================================================================= */}
      {submittingAssignment && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-3xl p-5 max-w-md w-full shadow-2xl space-y-4 border border-slate-200/60 dark:border-slate-800 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary text-[22px]">upload_file</span>
                <h3 className="font-bold text-sm text-on-surface">Submit Coursework</h3>
              </div>
              <button
                onClick={() => setSubmittingAssignment(null)}
                className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-on-surface cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            </div>

            {submissionReceipt ? (
              <div className="py-4 text-center space-y-3">
                <div className="w-14 h-14 rounded-full bg-emerald-500/15 text-emerald-600 mx-auto flex items-center justify-center">
                  <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                    task_alt
                  </span>
                </div>
                <h4 className="font-bold text-base text-on-surface">Assignment Submitted Successfully</h4>
                <div className="p-3 bg-surface-container-low rounded-2xl text-xs font-mono text-on-surface space-y-1">
                  <div>Course: <span className="text-secondary font-bold">{submittingAssignment.courseCode}</span></div>
                  <div>Receipt: <span className="text-emerald-600 font-bold">{submissionReceipt}</span></div>
                  <div>Timestamp: {new Date().toLocaleTimeString()} (On Time)</div>
                  <div>SHA-256 Hash: 88bf3a921d...410f</div>
                </div>
                <button
                  onClick={() => setSubmittingAssignment(null)}
                  className="w-full py-2.5 rounded-xl bg-secondary text-white font-bold text-xs shadow cursor-pointer"
                >
                  Done &amp; Return to Coursework
                </button>
              </div>
            ) : (
              <form onSubmit={handleExecuteSubmission} className="space-y-3.5">
                <div className="p-3 bg-surface-container-low rounded-2xl border border-slate-200/40 dark:border-slate-800">
                  <span className="text-[10px] font-mono text-secondary font-bold uppercase">
                    {submittingAssignment.courseCode} • {submittingAssignment.weightPercentage}% Final Grade
                  </span>
                  <h4 className="font-bold text-xs text-on-surface mt-0.5">{submittingAssignment.title}</h4>
                  <span className="text-[11px] text-on-surface-variant block mt-1">
                    Due: {submittingAssignment.dueDate} at {submittingAssignment.dueTime}
                  </span>
                </div>

                {/* File Attachment Dropzone */}
                <div>
                  <label className="text-xs font-bold text-on-surface block mb-1">
                    Upload Deliverable Archive (.zip, .pdf, .py, .ts)
                  </label>
                  <div className="p-4 rounded-2xl border-2 border-dashed border-secondary/40 bg-surface-container-low text-center flex flex-col items-center justify-center cursor-pointer hover:bg-surface-container transition-colors">
                    <span className="material-symbols-outlined text-3xl text-secondary mb-1">cloud_upload</span>
                    <span className="text-xs font-bold text-on-surface">{fileNameInput}</span>
                    <span className="text-[10px] text-on-surface-variant mt-0.5">
                      File verified (3.4 MB) • Ready to transmit
                    </span>
                  </div>
                </div>

                {/* Git Repository Input */}
                <div>
                  <label className="text-xs font-bold text-on-surface block mb-1">
                    Git Repository URL (Optional)
                  </label>
                  <input
                    type="url"
                    value={repoInput}
                    onChange={(e) => setRepoInput(e.target.value)}
                    placeholder="https://github.com/..."
                    className="w-full p-2.5 rounded-xl bg-surface-container border border-slate-300 dark:border-slate-700 text-xs text-on-surface focus:outline-none focus:ring-2 focus:ring-secondary font-mono"
                  />
                </div>

                {/* Notes to Instructor */}
                <div>
                  <label className="text-xs font-bold text-on-surface block mb-1">
                    Notes to Instructor / TA
                  </label>
                  <textarea
                    rows={2}
                    value={notesInput}
                    onChange={(e) => setNotesInput(e.target.value)}
                    placeholder="e.g. Test suites pass with 100% code coverage on Go 1.22..."
                    className="w-full p-2.5 rounded-xl bg-surface-container border border-slate-300 dark:border-slate-700 text-xs text-on-surface focus:outline-none focus:ring-2 focus:ring-secondary resize-none"
                  />
                </div>

                {/* Academic Integrity Check */}
                <label className="flex items-start gap-2.5 cursor-pointer text-xs text-on-surface pt-1">
                  <input
                    type="checkbox"
                    checked={academicIntegrityChecked}
                    onChange={(e) => setAcademicIntegrityChecked(e.target.checked)}
                    required
                    className="w-4 h-4 rounded text-secondary focus:ring-secondary mt-0.5"
                  />
                  <span className="text-[11px] text-on-surface-variant leading-snug">
                    I certify that this submission is my own original work and adheres to the university academic honor code.
                  </span>
                </label>

                {/* Upload Progress Bar if submitting */}
                {isUploading && (
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-mono">
                      <span>Encrypting &amp; uploading...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-surface-container-high overflow-hidden">
                      <div className="h-full bg-secondary transition-all duration-200" style={{ width: `${uploadProgress}%` }} />
                    </div>
                  </div>
                )}

                <div className="pt-2 flex flex-col gap-2">
                  <button
                    type="submit"
                    disabled={isUploading}
                    className="w-full py-3 rounded-2xl bg-secondary text-white font-bold text-xs shadow-md hover:bg-secondary/90 transition-all cursor-pointer disabled:opacity-50"
                  >
                    {isUploading ? 'Transmitting...' : 'Confirm Final Submission'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setSubmittingAssignment(null)}
                    className="w-full py-2 rounded-xl bg-surface-container text-xs text-on-surface font-semibold hover:bg-surface-container-high cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: FEEDBACK & SUBMISSION RECEIPT MODAL */}
      {/* ========================================================================= */}
      {viewingAssignment && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-3xl p-5 max-w-sm w-full shadow-2xl space-y-4 border border-slate-200/60 dark:border-slate-800">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-sm text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary">
                  {viewingAssignment.status === 'graded' ? 'grade' : 'receipt_long'}
                </span>
                <span>
                  {viewingAssignment.status === 'graded' ? 'Instructor Grade & Feedback' : 'Submission Receipt'}
                </span>
              </h3>
              <button
                onClick={() => setViewingAssignment(null)}
                className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-on-surface cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            </div>

            <div className="p-3 bg-surface-container-low rounded-2xl space-y-1">
              <span className="text-[10px] font-mono text-secondary font-bold uppercase">
                {viewingAssignment.courseCode} • {viewingAssignment.instructor}
              </span>
              <h4 className="font-bold text-xs text-on-surface">{viewingAssignment.title}</h4>
            </div>

            {viewingAssignment.status === 'graded' ? (
              <div className="space-y-3">
                <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-center">
                  <span className="text-[10px] font-mono uppercase text-emerald-700 dark:text-emerald-300 font-bold block">
                    Awarded Grade
                  </span>
                  <span className="text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400">
                    {viewingAssignment.grade}
                  </span>
                </div>

                <div className="p-3 rounded-2xl bg-surface-container-low text-xs space-y-1 border border-slate-200/40 dark:border-slate-800">
                  <span className="font-bold text-on-surface block">Professor Feedback:</span>
                  <p className="text-on-surface-variant leading-relaxed italic">
                    "{viewingAssignment.feedback}"
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-2 text-xs font-mono p-3 bg-surface-container-low rounded-2xl border border-slate-200/40 dark:border-slate-800">
                <div className="text-secondary font-bold">STATUS: Verified &amp; Pending TA Grading</div>
                <div>Submitted: {viewingAssignment.submittedDate}</div>
                <div>Deliverable: {viewingAssignment.attachedFile || 'archive.zip'}</div>
                {viewingAssignment.repoUrl && <div className="truncate">Repo: {viewingAssignment.repoUrl}</div>}
              </div>
            )}

            <button
              onClick={() => setViewingAssignment(null)}
              className="w-full py-2.5 rounded-xl bg-secondary text-white font-bold text-xs cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: BOOK OFFICE HOURS */}
      {/* ========================================================================= */}
      {showOfficeHoursModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-3xl p-5 max-w-sm w-full shadow-2xl space-y-4 border border-slate-200/60 dark:border-slate-800">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-sm text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary">event_available</span>
                <span>Book Faculty Office Hours</span>
              </h3>
              <button
                onClick={() => setShowOfficeHoursModal(false)}
                className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-on-surface cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            </div>

            {officeHoursBooked ? (
              <div className="py-4 text-center space-y-2">
                <span className="material-symbols-outlined text-4xl text-emerald-500">check_circle</span>
                <h4 className="font-bold text-sm text-on-surface">Office Hours Confirmed</h4>
                <p className="text-xs text-on-surface-variant">
                  Slot booked with {selectedProf} for Friday 14:00. A calendar invite has been sent to your student inbox.
                </p>
                <button
                  onClick={() => setShowOfficeHoursModal(false)}
                  className="w-full py-2.5 rounded-xl bg-secondary text-white font-bold text-xs mt-2 cursor-pointer"
                >
                  Done
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-bold text-on-surface block mb-1">Select Professor</label>
                  <select
                    value={selectedProf}
                    onChange={(e) => setSelectedProf(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-surface-container border border-slate-300 dark:border-slate-700 text-xs text-on-surface"
                  >
                    <option value="Dr. Vance (CS302)">Dr. Vance (CS302) • Mon/Wed 14:00-16:00</option>
                    <option value="Prof. Chen (MATH210)">Prof. Chen (MATH210) • Tue/Thu 11:00-13:00</option>
                    <option value="Dr. Sarah Lin (CS310)">Dr. Sarah Lin (CS310) • Fri 13:00-15:00</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-on-surface block mb-1">Select Time Slot</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button className="p-2 rounded-xl bg-secondary text-white text-xs font-semibold">
                      Fri 14:00 – 14:15
                    </button>
                    <button className="p-2 rounded-xl bg-surface-container text-on-surface text-xs font-semibold">
                      Fri 14:15 – 14:30
                    </button>
                  </div>
                </div>

                <button
                  onClick={() => setOfficeHoursBooked(true)}
                  className="w-full py-3 rounded-2xl bg-secondary text-white font-bold text-xs shadow-md mt-2 cursor-pointer"
                >
                  Confirm Reservation
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 4: LECTURE NOTES MODAL */}
      {/* ========================================================================= */}
      {showLectureNotesModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-3xl p-5 max-w-sm w-full shadow-2xl space-y-3 border border-slate-200/60 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-on-surface">CS302 Today's Lecture Notes</h3>
              <button
                onClick={() => setShowLectureNotesModal(false)}
                className="w-7 h-7 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            </div>
            <div className="p-3 bg-surface-container-low rounded-2xl text-xs space-y-2 text-on-surface">
              <p className="font-semibold text-secondary">• Topic: Byzantine Fault Tolerance &amp; Raft Election</p>
              <p>• Raft leader election randomized timeout: 150ms–300ms.</p>
              <p>• Heartbeat ping broadcast frequency: every 50ms.</p>
              <p>• Project 2 log replication test harness due tomorrow at 23:59.</p>
            </div>
            <button
              onClick={() => setShowLectureNotesModal(false)}
              className="w-full py-2.5 rounded-xl bg-secondary text-white font-bold text-xs cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white px-4 py-2 rounded-2xl shadow-xl text-xs font-mono flex items-center gap-2 animate-in fade-in duration-150">
          <span className="material-symbols-outlined text-emerald-400 text-[18px]">check_circle</span>
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};
