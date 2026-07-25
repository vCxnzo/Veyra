import React, { useState } from 'react';
import {
  Search,
  Bell,
  Plus,
  ChevronRight,
  User,
} from 'lucide-react';

import {
  DashboardTab,
  Community,
} from '../../types';


interface HeaderUser {
  username: string;
  displayName: string;
  avatar?: string | null;
}


interface HeaderProps {
  activeTab: DashboardTab;
  activeCommunity: Community;
  currentUser: HeaderUser | null;
  onOpenCreateShift?: () => void;
  onOpenAddStaff?: () => void;
  onToast: (title: string, message?: string) => void;
}


export const Header: React.FC<HeaderProps> = ({
  activeTab,
  activeCommunity,
  currentUser,
  onOpenCreateShift,
  onOpenAddStaff,
  onToast,
}) => {
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');


  const tabTitles: Record<DashboardTab, string> = {
    overview: 'Community Overview',
    staff: 'Staff Directory & Profiles',
    activity: 'Staff Activity Analytics',
    shifts: 'Shift Management & Logs',
    quotas: 'Weekly Staff Quotas',
    applications: 'HR Applications & Reviews',
    hr: 'Human Resources & LOAs',
    moderation: 'Moderation Cases & Appeals',
    roblox: 'Roblox Group & Rank Sync',
    analytics: 'Analytics & Insights',
    settings: 'Community Settings',
  };


  const handleSearchSubmit = (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (searchQuery.trim()) {
      onToast(
        'Global Search Executed',
        `Searching records for "${searchQuery}" in ${activeCommunity.name}`
      );
    }
  };


  const displayedName =
    currentUser?.displayName ||
    currentUser?.username ||
    'Veyra User';


  const displayedUsername =
    currentUser?.username ||
    'Roblox User';


  return (
    <header className="h-16 bg-slate-950/90 border-b border-slate-800/80 px-6 flex items-center justify-between sticky top-0 z-20 backdrop-blur-md">

      {/* Breadcrumb / Title */}

      <div className="flex items-center gap-2">
        <span className="text-xs text-slate-400 font-medium">
          {activeCommunity.name}
        </span>

        <ChevronRight className="w-3.5 h-3.5 text-slate-600" />

        <h1 className="text-sm font-bold text-white tracking-tight">
          {tabTitles[activeTab]}
        </h1>
      </div>


      {/* Center Search Bar */}

      <form
        onSubmit={handleSearchSubmit}
        className="hidden md:flex items-center w-72 relative"
      >
        <Search className="w-4 h-4 text-slate-500 absolute left-3" />

        <input
          type="text"
          placeholder="Search staff, shifts, cases..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
        />
      </form>


      {/* Right Quick Actions */}

      <div className="flex items-center gap-3">

        {activeTab === 'shifts' && onOpenCreateShift && (
          <button
            onClick={onOpenCreateShift}
            className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium transition-colors flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />

            Host Shift
          </button>
        )}


        {activeTab === 'staff' && onOpenAddStaff && (
          <button
            onClick={onOpenAddStaff}
            className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium transition-colors flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />

            Add Staff
          </button>
        )}


        {/* Notifications Bell */}

        <div className="relative">

          <button
            onClick={() =>
              setNotificationsOpen(!notificationsOpen)
            }
            className="p-2 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white transition-colors relative"
          >
            <Bell className="w-4 h-4" />

            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
          </button>


          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-4 z-50 space-y-3">

              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <h4 className="text-xs font-bold text-white">
                  Community Notifications
                </h4>

                <span className="text-[10px] text-indigo-400 font-mono">
                  3 New
                </span>
              </div>


              <div className="space-y-2 text-xs">

                <div className="p-2 rounded-lg bg-slate-950 border border-slate-800">
                  <p className="font-semibold text-white">
                    Shift Completed
                  </p>

                  <p className="text-slate-400 text-[11px]">
                    Shift #101 hosted by {displayedName} finished with 14 participants.
                  </p>
                </div>


                <div className="p-2 rounded-lg bg-slate-950 border border-slate-800">
                  <p className="font-semibold text-white">
                    New HR Application
                  </p>

                  <p className="text-slate-400 text-[11px]">
                    Brandon_Dev submitted a Supervisor application.
                  </p>
                </div>

              </div>

            </div>
          )}

        </div>


        {/* User Avatar */}

        <div className="flex items-center gap-2.5 pl-2 border-l border-slate-800">

          {currentUser?.avatar ? (
            <img
              src={currentUser.avatar}
              alt={`${displayedName}'s Roblox avatar`}
              className="w-8 h-8 rounded-lg object-cover ring-2 ring-indigo-500/30"
            />
          ) : (
            <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center ring-2 ring-indigo-500/30">
              <User className="w-4 h-4 text-slate-400" />
            </div>
          )}


          <div className="hidden lg:block text-left">

            <span className="text-xs font-semibold text-white block leading-none">
              {displayedName}
            </span>

            <span className="text-[10px] text-slate-400 block mt-0.5">
              @{displayedUsername}
            </span>

          </div>

        </div>

      </div>

    </header>
  );
};