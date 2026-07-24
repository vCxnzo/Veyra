export type ViewMode = 'landing' | 'login' | 'dashboard';

export type DashboardTab = 
  | 'overview'
  | 'staff'
  | 'activity'
  | 'shifts'
  | 'quotas'
  | 'applications'
  | 'hr'
  | 'moderation'
  | 'roblox'
  | 'analytics'
  | 'settings';

export interface Community {
  id: string;
  name: string;
  robloxGroupId: string;
  robloxGroupName: string;
  discordServerId: string;
  discordServerName: string;
  iconUrl?: string;
  memberCount: number;
  staffCount: number;
  plan: 'FREE' | 'PREMIUM' | 'BUSINESS';
}

export type StaffStatus = 'Active' | 'On LOA' | 'Inactive' | 'Suspended';

export interface StaffMember {
  id: string;
  name: string;
  discordUsername: string;
  discordAvatar: string;
  robloxUsername: string;
  robloxAvatar: string;
  robloxId: string;
  rank: string;
  rankTier: number; // For promotion order
  department: 'Operations' | 'Human Resources' | 'Moderation' | 'Public Relations' | 'Executive';
  activityScore: number; // 0 - 100
  quotaWeeklyShifts: number;
  quotaCompletedShifts: number;
  quotaWeeklySessions: number;
  quotaCompletedSessions: number;
  status: StaffStatus;
  joinDate: string;
  lastActive: string;
  email?: string;
  bio?: string;
  notes?: string;
}

export interface Shift {
  id: string;
  hostName: string;
  hostAvatar: string;
  robloxUsername: string;
  startTime: string;
  durationMinutes: number;
  participantsCount: number;
  participants: string[];
  status: 'Active' | 'Completed' | 'Scheduled' | 'Cancelled';
  type: 'Regular Shift' | 'Training Session' | 'Inspection' | 'Special Event';
  notes?: string;
}

export interface QuotaConfig {
  rank: string;
  shiftsPerWeek: number;
  sessionsPerWeek: number;
  trainingsPerWeek?: number;
  gracePeriodDays: number;
}

export type ApplicationStatus = 'Pending' | 'Approved' | 'Denied' | 'Interview Requested';

export interface Application {
  id: string;
  applicantName: string;
  robloxUsername: string;
  discordTag: string;
  type: 'Staff Application' | 'Supervisor Application' | 'Moderator Application' | 'Department Transfer';
  submittedDate: string;
  status: ApplicationStatus;
  reviewer?: string;
  answers: { question: string; answer: string }[];
  reviewerNotes?: string;
}

export type CaseAction = 'Warning' | 'Kick' | 'Temporary Ban' | 'Permanent Ban' | 'Demotion' | 'Termination';

export interface ModerationCase {
  id: string;
  userId: string;
  targetUsername: string;
  targetRoblox: string;
  action: CaseAction;
  moderatorName: string;
  reason: string;
  date: string;
  status: 'Active' | 'Appealed' | 'Resolved' | 'Expired';
  proofUrl?: string;
  appealReason?: string;
}

export interface ActivityLog {
  id: string;
  user: string;
  avatar?: string;
  action: string;
  timestamp: string;
  type: 'promotion' | 'shift' | 'application' | 'warning' | 'verification' | 'system' | 'loa';
  target?: string;
}

export interface RankSyncRule {
  id: string;
  robloxRankId: number;
  robloxRankName: string;
  discordRoleId: string;
  discordRoleName: string;
  discordColor: string;
  autoSync: boolean;
  syncedUsersCount: number;
}

export interface LeaveOfAbsence {
  id: string;
  staffName: string;
  robloxUsername: string;
  reason: string;
  startDate: string;
  endDate: string;
  status: 'Pending' | 'Approved' | 'Denied' | 'Ended';
  approvedBy?: string;
}

export interface AnalyticsData {
  memberGrowth: { date: string; members: number; staff: number }[];
  activityTrends: { day: string; shifts: number; activityScore: number }[];
  departmentDistribution: { name: string; count: number }[];
  quotaCompletionRates: { rank: string; percentage: number }[];
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  title: string;
  message?: string;
}
