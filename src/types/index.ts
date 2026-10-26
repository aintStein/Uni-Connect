export type Persona = 'student' | 'security';

export type StudentTab = 'access' | 'attendance' | 'safety' | 'events' | 'facilities' | 'settings';

export type SecurityTab = 'feeds' | 'headcount' | 'access' | 'alerts';

export type Language = 'en' | 'zh' | 'ms' | 'id' | 'kk';

export type ThemeMode = 'light' | 'dark' | 'system';

export interface StudentProfile {
  name: string;
  id: string;
  school: string;
  tier: string;
  photoUrl: string;
  avatarUrl: string;
  wifiStatus: string;
  beaconMeshStatus: string;
}

export interface AccessTrace {
  id: string;
  location: string;
  subLocation: string;
  type: 'walk-through' | 'instant-pass' | 'auto-clearance' | 'verified-entry';
  time: string;
  isToday: boolean;
  doorCode: string;
}

export interface NearbyBeacon {
  id: string;
  name: string;
  code: string;
  distanceMeters: number;
  rssiDbm: number;
  frequencyGhz: number;
  isLocked: boolean;
  isAutoPassCapable: boolean;
}

export interface ScheduleClass {
  id: string;
  code: string;
  name: string;
  timeRange: string;
  location: string;
  status: 'active' | 'ready' | 'upcoming';
  durationHours: number;
  timeRemaining?: string;
  instructor: string;
  roomCapacity: number;
  roomEnrolled: number;
  credits?: number;
  topic?: string;
}

export interface CourseAssignment {
  id: string;
  courseCode: string;
  courseName: string;
  title: string;
  description: string;
  dueDate: string;
  dueTime: string;
  daysRemaining: number;
  weightPercentage: number;
  status: 'due-soon' | 'in-progress' | 'submitted' | 'graded';
  submissionType: 'file-repo' | 'pdf-doc' | 'code-zip';
  submittedDate?: string;
  grade?: string;
  score?: number;
  maxScore?: number;
  feedback?: string;
  instructor: string;
  attachedFile?: string;
  repoUrl?: string;
}

export interface DaySchedule {
  day: 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri';
  dayFull: string;
  classes: ScheduleClass[];
}

export interface CourseMaterial {
  id: string;
  courseCode: string;
  title: string;
  type: 'slides' | 'lab' | 'reading' | 'cheatsheet';
  size: string;
  week: number;
}

export interface CampusEvent {
  id: string;
  title: string;
  category: 'academic' | 'tech' | 'student-life' | 'safety';
  dayLabel: string;
  dayNumber: string;
  time: string;
  location: string;
  badgeTag: string;
  beaconId: string;
  isRsvpConfirmed: boolean;
  capacityTotal: number;
  capacityReserved: number;
  isFeatured?: boolean;
  imageUrl?: string;
}

export interface FacilityStudySpace {
  id: string;
  name: string;
  location: string;
  category: 'study' | 'sports' | 'dining';
  statusLabel: string;
  statusType: 'calm' | 'moderate' | 'busy' | 'full';
  deskOutlets?: string;
  soundLevel?: string;
  naturalLight?: string;
  vibeText: string;
  subzones?: { label: string; value: string }[];
  isSaved?: boolean;
  tip?: string;
  imageUrl?: string;
  hourlyRhythm?: { [hour: string]: number };
}

export interface CameraFeedItem {
  id: string;
  camId: string;
  name: string;
  resolution: string;
  streamUrl: string;
  personsCount: number;
  velocityMs: number;
  audioDb: number;
  meshNode: string;
  ptzMode: string;
  isThermal: boolean;
  heatCalibration?: string;
  flowVector?: string;
  statusText: string;
  isCriticalAlert?: boolean;
}

export interface ZoneOccupancy {
  id: string;
  code: string;
  name: string;
  subtext: string;
  currentCount: number;
  maxCapacity: number;
  percentage: number;
  statusLevel: 'nominal' | 'moderate' | 'elevated' | 'critical';
  statusLabel: string;
  deltaText: string;
  wifiClients: number;
  subfloors?: { label: string; count: number; note: string }[];
}

export interface PortalTelemetry {
  id: string;
  sector: string;
  name: string;
  description: string;
  isLocked: boolean;
  statusBadge: string;
  throughputToday: number;
  flowState: string;
  holdingForceKn?: number;
  magneticSealEngaged?: boolean;
  autoPassActive?: boolean;
  hourlyFlux?: number;
}
