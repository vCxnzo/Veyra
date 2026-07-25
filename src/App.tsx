import React, { useEffect, useState } from 'react';

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
import LoginPage from './components/auth/LoginPage';

// Dashboard
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


// ============================================================
// BACKEND CONFIGURATION
// ============================================================

const API_URL =
    'https://api.veyra.one';



// ============================================================
// AUTH USER
// ============================================================

interface AuthUser {

  provider:
    'roblox' |
    'discord';

  id:
    string;

  username:
    string;

  displayName:
    string;

  avatar?:
    string |
    null;

}


// ============================================================
// AUTH RESPONSE
// ============================================================

interface AuthResponse {

  authenticated:
    boolean;

  user:
    AuthUser |
    null;

}


// ============================================================
// A=P
// ============================================================

export default function App() {

  

  // ============================================================
  // NAVIGATION
  // ============================================================

  const [
    viewMode,
    setViewMode
  ] =
    useState<ViewMode>(
      'landing'
    );


  const [
    activeTab,
    setActiveTab
  ] =
    useState<DashboardTab>(
      'overview'
    );


  // ============================================================
  // AUTHENTICATION
  // ============================================================

  const [
    isAuthenticated,
    setIsAuthenticated
  ] =
    useState(false);


  const [
    currentUser,
    setCurrentUser
  ] =
    useState<AuthUser | null>(
      null
    );


  const [
    checkingAuth,
    setCheckingAuth
  ] =
    useState(true);


  // ============================================================
  // COMMUNITIES
  // ============================================================

  const [
    communities
  ] =
    useState<Community[]>(
      MOCK_COMMUNITIES
    );


  const [
    activeCommunity,
    setActiveCommunity
  ] =
    useState<Community>(
      MOCK_COMMUNITIES[0]
    );


  // ============================================================
  // DATA
  // ============================================================

  const [
    staffList,
    setStaffList
  ] =
    useState<StaffMember[]>(
      MOCK_STAFF
    );


  const [
    shifts,
    setShifts
  ] =
    useState<Shift[]>(
      MOCK_SHIFTS
    );


  const [
    quotaConfigs,
    setQuotaConfigs
  ] =
    useState<QuotaConfig[]>(
      MOCK_QUOTAS
    );


  const [
    applications,
    setApplications
  ] =
    useState<Application[]>(
      MOCK_APPLICATIONS
    );


  const [
    cases,
    setCases
  ] =
    useState<ModerationCase[]>(
      MOCK_MODERATION_CASES
    );


  const [
    activityLogs
  ] =
    useState<ActivityLog[]>(
      MOCK_ACTIVITY_LOGS
    );


  const [
    rankSyncRules,
    setRankSyncRules
  ] =
    useState<RankSyncRule[]>(
      MOCK_RANK_SYNC
    );


  const [
    loas,
    setLoas
  ] =
    useState<LeaveOfAbsence[]>(
      MOCK_LOAS
    );


  // ============================================================
  // UI
  // ============================================================

  const [
    toasts,
    setToasts
  ] =
    useState<ToastMessage[]>(
      []
    );


  const [
    supportModalOpen,
    setSupportModalOpen
  ] =
    useState(false);


  // ============================================================
  // TOAST
  // ============================================================

  const addToast = (

    title:
      string,

    message?:
      string,

    type:
      'success' |
      'error' |
      'info' =
        'success'

  ) => {

    const id =
      Math.random()
        .toString(36)
        .substring(
          2,
          9
        );


    setToasts(
      (prev) => [

        ...prev,

        {
          id,
          title,
          message,
          type
        }

      ]
    );


    setTimeout(
      () => {

        setToasts(
          (prev) =>
            prev.filter(
              (toast) =>
                toast.id !== id
            )
        );

      },
      4000
    );

  };


  const dismissToast = (
    id:
      string
  ) => {

    setToasts(
      (prev) =>
        prev.filter(
          (toast) =>
            toast.id !== id
        )
    );

  };


  // ============================================================
  // AUTH CHECK
  // ============================================================

  useEffect(() => {

    const checkAuthentication =
      async () => {

        try {

          console.log(
            'Checking Veyra authentication...'
          );


          const response =
            await fetch(
              `${API_URL}/api/auth/me`,
              {
                method:
                  'GET',

                credentials:
                  'include',

                headers: {
                  'Accept':
                    'application/json'
                }
              }
            );


          if (
            !response.ok
          ) {

            throw new Error(
              `Auth request failed with status ${response.status}`
            );

          }


          const data:
            AuthResponse =
            await response.json();


          console.log(
            'Authentication response:',
            data
          );


          // ====================================================
          // USER IS LOGGED IN
          // ====================================================

          if (
            data.authenticated &&
            data.user
          ) {

            console.log(
              'User authenticated:',
              data.user
            );


            setCurrentUser(
              data.user
            );


            setIsAuthenticated(
              true
            );


            setViewMode(
              'dashboard'
            );


            setActiveTab(
              'overview'
            );


            // Remove OAuth query
            // from browser URL

            if (
              window.location.search
            ) {

              window.history.replaceState(
                {},
                document.title,
                window.location.pathname
              );

            }

          }


          // ====================================================
          // USER IS NOT LOGGED IN
          // ====================================================

          else {

            console.log(
              'No active Veyra session.'
            );


            setCurrentUser(
              null
            );


            setIsAuthenticated(
              false
            );


            setViewMode(
              'landing'
            );

          }

        }


        catch (
          error
        ) {

          console.error(
            'Authentication check failed:',
            error
          );


          setCurrentUser(
            null
          );


          setIsAuthenticated(
            false
          );


          setViewMode(
            'landing'
          );

        }


        finally {

          setCheckingAuth(
            false
          );

        }

      };


    checkAuthentication();

  }, []);


  // ============================================================
  // LOGIN SUCCESS
  // ============================================================

  const handleLoginSuccess =
    async () => {

      console.log(
        'Login success detected. Checking session...'
      );


      try {

        const response =
          await fetch(
            `${API_URL}/api/auth/me`,
            {
              method:
                'GET',

              credentials:
                'include',

              headers: {
                'Accept':
                  'application/json'
              }
            }
          );


        const data:
          AuthResponse =
          await response.json();


        console.log(
          'Post-login session:',
          data
        );


        if (
          data.authenticated &&
          data.user
        ) {

          setCurrentUser(
            data.user
          );


          setIsAuthenticated(
            true
          );


          setViewMode(
            'dashboard'
          );


          setActiveTab(
            'overview'
          );


          addToast(
            'Welcome to Veyra',
            `Welcome back, ${
              data.user.displayName ||
              data.user.username
            }!`
          );


          window.history.replaceState(
            {},
            document.title,
            window.location.pathname
          );

        }

        else {

          addToast(
            'Authentication Error',
            'Your session could not be verified.',
            'error'
          );

        }

      }

      catch (
        error
      ) {

        console.error(
          'Login verification failed:',
          error
        );


        addToast(
          'Authentication Error',
          'Unable to connect to the Veyra authentication server.',
          'error'
        );

      }

    };


  // ============================================================
  // LOGOUT
  // ============================================================

  const handleLogout =
    async () => {

      try {

        await fetch(
          `${API_URL}/api/auth/logout`,
          {
            method:
              'POST',

            credentials:
              'include'
          }
        );

      }

      catch (
        error
      ) {

        console.error(
          'Logout failed:',
          error
        );

      }


      setCurrentUser(
        null
      );


      setIsAuthenticated(
        false
      );


      setViewMode(
        'landing'
      );


      setActiveTab(
        'overview'
      );


      addToast(
        'Logged Out',
        'You have been safely logged out of Veyra.'
      );

    };


  // ============================================================
  // STAFF
  // ============================================================

  const handleAddStaff = (
    newStaff:
      Partial<StaffMember>
  ) => {

    const created:
      StaffMember = {

      id:
        `staff-${Date.now()}`,

      name:
        newStaff.name ||
        'New Staff',

      discordUsername:
        newStaff.discordUsername ||
        'new_staff',

      discordAvatar:
        newStaff.discordAvatar ||
        '',

      robloxUsername:
        newStaff.robloxUsername ||
        'NewRobloxUser',

      robloxAvatar:
        newStaff.robloxAvatar ||
        '',

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
        new Date()
          .toISOString()
          .split('T')[0],

      lastActive:
        'Just now',

    };


    setStaffList(
      (prev) => [
        created,
        ...prev
      ]
    );


    addToast(
      'Staff Onboarded',
      `${created.name} (@${created.robloxUsername}) added to ${activeCommunity.name}`
    );

  };


  const handlePromoteStaff = (
    staffId:
      string
  ) => {

    setStaffList(
      (prev) =>
        prev.map(
          (staff) =>
            staff.id === staffId
              ? {
                  ...staff,
                  rank:
                    'Senior Staff',
                  rankTier:
                    staff.rankTier + 1
                }
              : staff
        )
    );

  };


  const handleDemoteStaff = (
    staffId:
      string
  ) => {

    setStaffList(
      (prev) =>
        prev.map(
          (staff) =>
            staff.id === staffId
              ? {
                  ...staff,
                  rank:
                    'Junior Staff',
                  rankTier:
                    Math.max(
                      1,
                      staff.rankTier - 1
                    )
                }
              : staff
        )
    );

  };


  const handleWarnStaff = (
    staffId:
      string
  ) => {

    const staff =
      staffList.find(
        (item) =>
          item.id === staffId
      );


    if (
      !staff
    )
      return;


    const newCase:
      ModerationCase = {

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
        currentUser?.displayName ||
        'Veyra Admin',

      reason:
        'Official warning logged for quota inactivity.',

      date:
        new Date()
          .toISOString()
          .replace(
            'T',
            ' '
          )
          .substring(
            0,
            16
          ),

      status:
        'Active',

    };


    setCases(
      (prev) => [
        newCase,
        ...prev
      ]
    );

  };


  // ============================================================
  // SHIFTS
  // ============================================================

  const handleCreateShift = (
    newShift:
      Partial<Shift>
  ) => {

    const created:
      Shift = {

      id:
        `shift-${Math.floor(
          200 +
          Math.random() * 800
        )}`,

      hostName:
        currentUser?.displayName ||
        'Veyra User',

      hostAvatar:
        currentUser?.avatar ||
        '',

      robloxUsername:
        newShift.robloxUsername ||
        currentUser?.username ||
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
          currentUser?.username ||
          'Veyra User'
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


    setShifts(
      (prev) => [
        created,
        ...prev
      ]
    );


    addToast(
      'Shift Hosted',
      `Active shift started in ${activeCommunity.name}`
    );

  };


  const handleEndShift = (
    shiftId:
      string
  ) => {

    setShifts(
      (prev) =>
        prev.map(
          (shift) =>
            shift.id === shiftId
              ? {
                  ...shift,
                  status:
                    'Completed' as const
                }
              : shift
        )
    );

  };


  // ============================================================
  // APPLICATIONS
  // ============================================================

  const handleApproveApplication = (
    id:
      string,
    notes?:
      string
  ) => {

    setApplications(
      (prev) =>
        prev.map(
          (application) =>
            application.id === id
              ? {
                  ...application,
                  status:
                    'Approved' as const,
                  reviewer:
                    currentUser?.displayName ||
                    'Veyra Admin',
                  reviewerNotes:
                    notes
                }
              : application
        )
    );

  };


  const handleDenyApplication = (
    id:
      string,
    notes?:
      string
  ) => {

    setApplications(
      (prev) =>
        prev.map(
          (application) =>
            application.id === id
              ? {
                  ...application,
                  status:
                    'Denied' as const,
                  reviewer:
                    currentUser?.displayName ||
                    'Veyra Admin',
                  reviewerNotes:
                    notes
                }
              : application
        )
    );

  };


  const handleRequestInterview = (
    id:
      string
  ) => {

    setApplications(
      (prev) =>
        prev.map(
          (application) =>
            application.id === id
              ? {
                  ...application,
                  status:
                    'Interview Requested' as const,
                  reviewer:
                    currentUser?.displayName ||
                    'Veyra Admin'
                }
              : application
        )
    );

  };


  // ============================================================
  // LOA
  // ============================================================

  const handleApproveLOA = (
    id:
      string
  ) => {

    setLoas(
      (prev) =>
        prev.map(
          (loa) =>
            loa.id === id
              ? {
                  ...loa,
                  status:
                    'Approved' as const,
                  approvedBy:
                    currentUser?.displayName ||
                    'Veyra Admin'
                }
              : loa
        )
    );

  };


  const handleDenyLOA = (
    id:
      string
  ) => {

    setLoas(
      (prev) =>
        prev.map(
          (loa) =>
            loa.id === id
              ? {
                  ...loa,
                  status:
                    'Denied' as const
                }
              : loa
        )
    );

  };


  // ============================================================
  // MODERATION
  // ============================================================

  const handleCreateCase = (
    newCase:
      Partial<ModerationCase>
  ) => {

    const created:
      ModerationCase = {

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
        currentUser?.displayName ||
        'Veyra Admin',

      reason:
        newCase.reason ||
        'General violation',

      date:
        new Date()
          .toISOString()
          .replace(
            'T',
            ' '
          )
          .substring(
            0,
            16
          ),

      status:
        'Active',

    };


    setCases(
      (prev) => [
        created,
        ...prev
      ]
    );


    addToast(
      'Case Logged',
      `Disciplinary case ${created.id} issued for @${created.targetRoblox}`
    );

  };


  // ============================================================
  // RANK SYNC
  // ============================================================

  const handleToggleAutoSync = (
    id:
      string
  ) => {

    setRankSyncRules(
      (prev) =>
        prev.map(
          (rule) =>
            rule.id === id
              ? {
                  ...rule,
                  autoSync:
                    !rule.autoSync
                }
              : rule
        )
    );


    addToast(
      'Rank Sync Toggled',
      'Updated Discord role mapping rule.'
    );

  };


  // ============================================================
  // AUTH LOADING
  // ============================================================

  if (
    checkingAuth
  ) {

    return (

      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">

        <div className="text-center">

          <div className="w-10 h-10 border-2 border-slate-700 border-t-indigo-500 rounded-full animate-spin mx-auto mb-4" />

          <p className="text-sm text-slate-400">

            Checking your Veyra session...

          </p>

        </div>

      </div>

    );

  }


  // ============================================================
  // RENDER
  // ============================================================

  return (

    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased">


      {/* ======================================================
          LANDING
      ====================================================== */}

      {viewMode === 'landing' && (

        <LandingPage

          onNavigateLogin={() =>
            setViewMode(
              'login'
            )
          }


          onNavigateDashboard={() => {

            if (
              isAuthenticated
            ) {

              setViewMode(
                'dashboard'
              );


              addToast(
                'Welcome to Veyra',
                `Connected to ${activeCommunity.name} dashboard.`
              );

            }

            else {

              setViewMode(
                'login'
              );

            }

          }}


          onToast={
            addToast
          }

        />

      )}


      {/* ======================================================
          LOGIN
      ====================================================== */}

      {viewMode === 'login' && (

        <LoginPage

          onNavigateHome={() =>
            setViewMode(
              'landing'
            )
          }


          onLoginSuccess={
            handleLoginSuccess
          }

        />

      )}


      {/* ======================================================
          DASHBOARD
      ====================================================== */}

      {viewMode === 'dashboard' &&
        isAuthenticated && (

        <div className="flex h-screen overflow-hidden bg-slate-950">


          {/* SIDEBAR */}

          <Sidebar

            activeTab={
              activeTab
            }


            onTabChange={
              (tab) =>
                setActiveTab(
                  tab
                )
            }


            communities={
              communities
            }


            activeCommunity={
              activeCommunity
            }


            onSelectCommunity={
              (community) => {

                setActiveCommunity(
                  community
                );


                addToast(
                  'Switched Community',
                  `Now managing ${community.name}`
                );

              }
            }


            onNavigateHome={() =>
              setViewMode(
                'landing'
              )
            }


            onOpenSupport={() =>
              setSupportModalOpen(
                true
              )
            }

          />


          {/* MAIN */}

          <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">


            <Header

              activeTab={
                activeTab
              }


              activeCommunity={
                activeCommunity
              }


              onToast={
                addToast
              }

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

                  onNavigateTab={
                    (tab) =>
                      setActiveTab(
                        tab
                      )
                  }

                  onOpenCreateShift={() =>
                    setActiveTab(
                      'shifts'
                    )
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

                  onUpdateQuotas={
                    (updated) =>
                      setQuotaConfigs(
                        updated
                      )
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
          SUPPORT MODAL
      ====================================================== */}

      <SupportModal

        isOpen={
          supportModalOpen
        }

        onClose={() =>
          setSupportModalOpen(
            false
          )
        }

        onToast={
          addToast
        }

      />


      {/* ======================================================
          TOASTS
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