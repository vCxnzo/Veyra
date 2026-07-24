import React, { useState } from 'react';
import {
  ViewMode,
  DashboardTab,
  Community,
  StaffMember,
  Shift,
  QuotaConfig,
  Application,
  ModerationCase,
  ActivityLog,
  RankSyncRule,
  LeaveOfAbsence,
  ToastMessage
} from './types';

import {
  MOCK_COMMUNITIES,
  MOCK_STAFF,
  MOCK_SHIFTS,
  MOCK_QUOTAS,
  MOCK_APPLICATIONS,
  MOCK_MODERATION_CASES,
  MOCK_ACTIVITY_LOGS,
  MOCK_RANK_SYNC,
  MOCK_LOAS,
  MOCK_ANALYTICS
} from './data/mockData';

// Landing & Auth
import { LandingPage } from './components/landing/LandingPage';
import { LoginPage } from './components/auth/LoginPage';

// Dashboard Shell & Views
import { Sidebar } from './components/dashboard/Sidebar';
import { Header } from './components/dashboard/Header';
import { OverviewView } from './components/dashboard/OverviewView';
import { StaffView } from './components/dashboard/StaffView';
import { ActivityView } from './components/dashboard/ActivityView';
import { ShiftsView } from './components/dashboard/ShiftsView';
import { QuotasView } from './components/dashboard/QuotasView';
import { ApplicationsView } from './components/dashboard/ApplicationsView';
import { HRView } from './components/dashboard/HRView';
import { ModerationView } from './components/dashboard/ModerationView';
import { RobloxView } from './components/dashboard/RobloxView';
import { AnalyticsView } from './components/dashboard/AnalyticsView';
import { SettingsView } from './components/dashboard/SettingsView';

// Common
import { ToastContainer } from './components/common/Toast';
import { SupportModal } from './components/landing/SupportModal';

export default function App() {

  // ============================================================
  // TOP LEVEL NAVIGATION & AUTHENTICATION
  // ============================================================

  const [viewMode, setViewMode] = useState<ViewMode>('landing');
  const [activeTab, setActiveTab] = useState<DashboardTab>('overview');

  // User starts unauthenticated
  const [isAuthenticated, setIsAuthenticated] = useState(false);


  // ============================================================
  // COMMUNITIES
  // ============================================================

  const [communities] = useState<Community[]>(MOCK_COMMUNITIES);

  const [activeCommunity, setActiveCommunity] =
    useState<Community>(MOCK_COMMUNITIES[0]);


  // ============================================================
  // DATA COLLECTIONS STATE
  // ============================================================

  const [staffList, setStaffList] =
    useState<StaffMember[]>(MOCK_STAFF);

  const [shifts, setShifts] =
    useState<Shift[]>(MOCK_SHIFTS);

  const [quotaConfigs, setQuotaConfigs] =
    useState<QuotaConfig[]>(MOCK_QUOTAS);

  const [applications, setApplications] =
    useState<Application[]>(MOCK_APPLICATIONS);

  const [cases, setCases] =
    useState<ModerationCase[]>(MOCK_MODERATION_CASES);

  const [activityLogs, setActivityLogs] =
    useState<ActivityLog[]>(MOCK_ACTIVITY_LOGS);

  const [rankSyncRules, setRankSyncRules] =
    useState<RankSyncRule[]>(MOCK_RANK_SYNC);

  const [loas, setLoas] =
    useState<LeaveOfAbsence[]>(MOCK_LOAS);


  // ============================================================
  // GLOBAL TOASTS & SUPPORT MODAL
  // ============================================================

  const [toasts, setToasts] =
    useState<ToastMessage[]>([]);

  const [supportModalOpen, setSupportModalOpen] =
    useState(false);


  // ============================================================
  // TOAST FUNCTIONS
  // ============================================================

  const addToast = (
    title: string,
    message?: string,
    type: 'success' | 'error' | 'info' = 'success'
  ) => {

    const id =
      Math.random().toString(36).substring(2, 9);

    setToasts((prev) => [
      ...prev,
      {
        id,
        title,
        message,
        type
      }
    ]);

    setTimeout(() => {
      setToasts((prev) =>
        prev.filter((t) => t.id !== id)
      );
    }, 4000);
  };


  const dismissToast = (id: string) => {

    setToasts((prev) =>
      prev.filter((t) => t.id !== id)
    );

  };


  // ============================================================
  // AUTHENTICATION
  // ============================================================

  const handleLoginSuccess = (
    provider: 'roblox' | 'discord'
  ) => {

    // Mark the user as authenticated
    setIsAuthenticated(true);

    // Open dashboard
    setViewMode('dashboard');

    // Show success message
    addToast(
      'Authenticated Successfully',
      `Logged in via ${
        provider === 'roblox'
          ? 'Roblox OAuth'
          : 'Discord OAuth'
      }`
    );

  };


  const handleLogout = () => {

    // Remove authentication
    setIsAuthenticated(false);

    // Return to landing page
    setViewMode('landing');

    // Reset dashboard tab
    setActiveTab('overview');

    // Notify user
    addToast(
      'Logged Out',
      'You have been safely logged out of Veyra.'
    );

  };


  // ============================================================
  // STAFF ACTIONS
  // ============================================================

  const handleAddStaff = (
    newStaff: Partial<StaffMember>
  ) => {

    const created: StaffMember = {

      id: `staff-${Date.now()}`,

      name:
        newStaff.name ||
        'New Staff',

      discordUsername:
        newStaff.discordUsername ||
        'new_staff',

      discordAvatar:
        newStaff.discordAvatar ||
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',

      robloxUsername:
        newStaff.robloxUsername ||
        'NewRobloxUser',

      robloxAvatar:
        newStaff.robloxAvatar ||
        'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150',

      robloxId:
        newStaff.robloxId ||
        '90128301',

      rank:
        newStaff.rank ||
        'Junior Staff',

      rankTier:
        newStaff.rankTier ||
        2,

      department:
        newStaff.department ||
        'Operations',

      activityScore:
        85,

      quotaWeeklyShifts:
        5,

      quotaCompletedShifts:
        0,

      quotaWeeklySessions:
        2,

      quotaCompletedSessions:
        0,

      status:
        'Active',

      joinDate:
        new Date().toISOString().split('T')[0],

      lastActive:
        'Just now',

    };

    setStaffList((prev) => [
      created,
      ...prev
    ]);

    addToast(
      'Staff Onboarded',
      `${created.name} (@${created.robloxUsername}) added to ${activeCommunity.name}`
    );

  };


  const handlePromoteStaff = (
    staffId: string
  ) => {

    setStaffList((prev) =>
      prev.map((s) =>
        s.id === staffId
          ? {
              ...s,
              rank: 'Senior Staff',
              rankTier: s.rankTier + 1
            }
          : s
      )
    );

  };


  const handleDemoteStaff = (
    staffId: string
  ) => {

    setStaffList((prev) =>
      prev.map((s) =>
        s.id === staffId
          ? {
              ...s,
              rank: 'Junior Staff',
              rankTier: Math.max(
                1,
                s.rankTier - 1
              )
            }
          : s
      )
    );

  };


  const handleWarnStaff = (
    staffId: string
  ) => {

    const staff =
      staffList.find(
        (s) => s.id === staffId
      );

    if (!staff) return;

    const newCase: ModerationCase = {

      id:
        `CASE-${Math.floor(
          800 +
          Math.random() * 200
        )}`,

      userId:
        staff.id,

      targetUsername:
        staff.name,

      targetRoblox:
        staff.robloxUsername,

      action:
        'Warning',

      moderatorName:
        'Matthew (General Manager)',

      reason:
        'Official warning logged for quota inactivity.',

      date:
        new Date()
          .toISOString()
          .replace('T', ' ')
          .substring(0, 16),

      status:
        'Active',

    };

    setCases((prev) => [
      newCase,
      ...prev
    ]);

  };


  // ============================================================
  // SHIFT ACTIONS
  // ============================================================

  const handleCreateShift = (
    newShift: Partial<Shift>
  ) => {

    const created: Shift = {

      id:
        `shift-${Math.floor(
          200 +
          Math.random() * 800
        )}`,

      hostName:
        newShift.hostName ||
        'Matthew',

      hostAvatar:
        newShift.hostAvatar ||
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',

      robloxUsername:
        newShift.robloxUsername ||
        'MatthewRBX',

      startTime:
        'Just now',

      durationMinutes:
        newShift.durationMinutes ||
        45,

      participantsCount:
        1,

      participants:
        [
          newShift.robloxUsername ||
          'MatthewRBX'
        ],

      status:
        'Active',

      type:
        newShift.type ||
        'Regular Shift',

      notes:
        newShift.notes ||
        'In-game floor shift',

    };

    setShifts((prev) => [
      created,
      ...prev
    ]);

    addToast(
      'Shift Hosted',
      `Active shift started in ${activeCommunity.name}`
    );

  };


  const handleEndShift = (
    shiftId: string
  ) => {

    setShifts((prev) =>
      prev.map((s) =>
        s.id === shiftId
          ? {
              ...s,
              status: 'Completed' as const
            }
          : s
      )
    );

  };


  // ============================================================
  // APPLICATION ACTIONS
  // ============================================================

  const handleApproveApplication = (
    id: string,
    notes?: string
  ) => {

    setApplications((prev) =>
      prev.map((a) =>
        a.id === id
          ? {
              ...a,
              status:
                'Approved' as const,
              reviewer:
                'Matthew (GM)',
              reviewerNotes:
                notes
            }
          : a
      )
    );

  };


  const handleDenyApplication = (
    id: string,
    notes?: string
  ) => {

    setApplications((prev) =>
      prev.map((a) =>
        a.id === id
          ? {
              ...a,
              status:
                'Denied' as const,
              reviewer:
                'Matthew (GM)',
              reviewerNotes:
                notes
            }
          : a
      )
    );

  };


  const handleRequestInterview = (
    id: string
  ) => {

    setApplications((prev) =>
      prev.map((a) =>
        a.id === id
          ? {
              ...a,
              status:
                'Interview Requested' as const,
              reviewer:
                'Matthew (GM)'
            }
          : a
      )
    );

  };


  // ============================================================
  // LOA ACTIONS
  // ============================================================

  const handleApproveLOA = (
    id: string
  ) => {

    setLoas((prev) =>
      prev.map((l) =>
        l.id === id
          ? {
              ...l,
              status:
                'Approved' as const,
              approvedBy:
                'Matthew (GM)'
            }
          : l
      )
    );

  };


  const handleDenyLOA = (
    id: string
  ) => {

    setLoas((prev) =>
      prev.map((l) =>
        l.id === id
          ? {
              ...l,
              status:
                'Denied' as const
            }
          : l
      )
    );

  };


  // ============================================================
  // CASE ACTIONS
  // ============================================================

  const handleCreateCase = (
    newCase: Partial<ModerationCase>
  ) => {

    const created: ModerationCase = {

      id:
        `CASE-${Math.floor(
          900 +
          Math.random() * 100
        )}`,

      userId:
        `usr-${Date.now()}`,

      targetUsername:
        newCase.targetUsername ||
        'UnknownUser',

      targetRoblox:
        newCase.targetRoblox ||
        'UnknownRoblox',

      action:
        newCase.action ||
        'Warning',

      moderatorName:
        newCase.moderatorName ||
        'Matthew (GM)',

      reason:
        newCase.reason ||
        'General violation',

      date:
        new Date()
          .toISOString()
          .replace('T', ' ')
          .substring(0, 16),

      status:
        'Active',

    };

    setCases((prev) => [
      created,
      ...prev
    ]);

    addToast(
      'Case Logged',
      `Disciplinary case ${created.id} issued for @${created.targetRoblox}`
    );

  };


  const handleToggleAutoSync = (
    id: string
  ) => {

    setRankSyncRules((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              autoSync:
                !r.autoSync
            }
          : r
      )
    );

    addToast(
      'Rank Sync Toggled',
      'Updated Discord role mapping rule.'
    );

  };


  // ============================================================
  // RENDER
  // ============================================================

  return (

    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased">

      {/* ======================================================
          1. PUBLIC MARKETING WEBSITE
      ====================================================== */}

      {viewMode === 'landing' && (

        <LandingPage

          onNavigateLogin={() =>
            setViewMode('login')
          }

          onNavigateDashboard={() => {

            if (isAuthenticated) {

              setViewMode('dashboard');

              addToast(
                'Welcome to Veyra',
                `Connected to ${activeCommunity.name} dashboard.`
              );

            } else {

              setViewMode('login');

            }

          }}

          onToast={addToast}

        />

      )}


      {/* ======================================================
          2. LOGIN PAGE
      ====================================================== */}

      {viewMode === 'login' && (

        <LoginPage

          onNavigateHome={() =>
            setViewMode('landing')
          }

          onLoginSuccess={
            handleLoginSuccess
          }

        />

      )}


      {/* ======================================================
          3. AUTHENTICATED DASHBOARD
      ====================================================== */}

      {viewMode === 'dashboard' && isAuthenticated && (

        <div className="flex h-screen overflow-hidden bg-slate-950">

          {/* SIDEBAR */}

          <Sidebar

            activeTab={activeTab}

            onTabChange={(tab) =>
              setActiveTab(tab)
            }

            communities={communities}

            activeCommunity={
              activeCommunity
            }

            onSelectCommunity={(comm) => {

              setActiveCommunity(comm);

              addToast(
                'Switched Community',
                `Now managing ${comm.name}`
              );

            }}

            onNavigateHome={() => {

              setViewMode('landing');

            }}

            onOpenSupport={() =>
              setSupportModalOpen(true)
            }

          />


          {/* MAIN CONTENT */}

          <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">

            <Header

              activeTab={activeTab}

              activeCommunity={
                activeCommunity
              }

              onToast={addToast}

            />


            <main className="flex-1 pb-12">


              {/* OVERVIEW */}

              {activeTab === 'overview' && (

                <OverviewView

                  community={
                    activeCommunity
                  }

                  shifts={
                    shifts
                  }

                  activityLogs={
                    activityLogs
                  }

                  onNavigateTab={(tab) =>
                    setActiveTab(tab)
                  }

                  onOpenCreateShift={() =>
                    setActiveTab('shifts')
                  }

                />

              )}


              {/* STAFF */}

              {activeTab === 'staff' && (

                <StaffView

                  staffList={
                    staffList
                  }

                  onAddStaff={
                    handleAddStaff
                  }

                  onPromoteStaff={
                    handlePromoteStaff
                  }

                  onDemoteStaff={
                    handleDemoteStaff
                  }

                  onWarnStaff={
                    handleWarnStaff
                  }

                  onToast={
                    addToast
                  }

                />

              )}


              {/* ACTIVITY */}

              {activeTab === 'activity' && (

                <ActivityView
                  staffList={
                    staffList
                  }
                />

              )}


              {/* SHIFTS */}

              {activeTab === 'shifts' && (

                <ShiftsView

                  shifts={
                    shifts
                  }

                  onCreateShift={
                    handleCreateShift
                  }

                  onEndShift={
                    handleEndShift
                  }

                  onToast={
                    addToast
                  }

                />

              )}


              {/* QUOTAS */}

              {activeTab === 'quotas' && (

                <QuotasView

                  quotaConfigs={
                    quotaConfigs
                  }

                  staffList={
                    staffList
                  }

                  onUpdateQuotas={(updated) =>
                    setQuotaConfigs(updated)
                  }

                  onToast={
                    addToast
                  }

                />

              )}


              {/* APPLICATIONS */}

              {activeTab === 'applications' && (

                <ApplicationsView

                  applications={
                    applications
                  }

                  onApproveApplication={
                    handleApproveApplication
                  }

                  onDenyApplication={
                    handleDenyApplication
                  }

                  onRequestInterview={
                    handleRequestInterview
                  }

                  onToast={
                    addToast
                  }

                />

              )}


              {/* HR */}

              {activeTab === 'hr' && (

                <HRView

                  loas={
                    loas
                  }

                  staffList={
                    staffList
                  }

                  onApproveLOA={
                    handleApproveLOA
                  }

                  onDenyLOA={
                    handleDenyLOA
                  }

                  onToast={
                    addToast
                  }

                />

              )}


              {/* MODERATION */}

              {activeTab === 'moderation' && (

                <ModerationView

                  cases={
                    cases
                  }

                  onCreateCase={
                    handleCreateCase
                  }

                  onToast={
                    addToast
                  }

                />

              )}


              {/* ROBLOX */}

              {activeTab === 'roblox' && (

                <RobloxView

                  community={
                    activeCommunity
                  }

                  rankSyncRules={
                    rankSyncRules
                  }

                  onToggleAutoSync={
                    handleToggleAutoSync
                  }

                  onToast={
                    addToast
                  }

                />

              )}


              {/* ANALYTICS */}

              {activeTab === 'analytics' && (

                <AnalyticsView
                  analyticsData={
                    MOCK_ANALYTICS
                  }
                />

              )}


              {/* SETTINGS */}

              {activeTab === 'settings' && (

                <SettingsView

                  community={
                    activeCommunity
                  }

                  onToast={
                    addToast
                  }

                />

              )}

            </main>

          </div>

        </div>

      )}


      {/* ======================================================
          GLOBAL SUPPORT MODAL
      ====================================================== */}

      <SupportModal

        isOpen={
          supportModalOpen
        }

        onClose={() =>
          setSupportModalOpen(false)
        }

        onToast={
          addToast
        }

      />


      {/* ======================================================
          GLOBAL TOASTS
      ====================================================== */}

      <ToastContainer

        toasts={
          toasts
        }

        onDismiss={
          dismissToast
        }

      />

    </div>

  );

}