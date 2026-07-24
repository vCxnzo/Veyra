import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Activity, 
  Clock, 
  CheckSquare, 
  FileText, 
  ShieldAlert, 
  SlidersHorizontal, 
  Gamepad2, 
  BarChart3, 
  Settings, 
  HelpCircle, 
  User, 
  ChevronDown, 
  LogOut, 
  Building2, 
  Check, 
  Plus,
  ExternalLink
} from 'lucide-react';
import { DashboardTab, Community } from '../../types';

interface SidebarProps {
  activeTab: DashboardTab;
  onTabChange: (tab: DashboardTab) => void;
  communities: Community[];
  activeCommunity: Community;
  onSelectCommunity: (comm: Community) => void;
  onNavigateHome: () => void;
  onOpenSupport: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  communities,
  activeCommunity,
  onSelectCommunity,
  onNavigateHome,
  onOpenSupport,
}) => {
  const [communityDropdownOpen, setCommunityDropdownOpen] = useState(false);

  const navItems: { id: DashboardTab; label: string; icon: React.ElementType; badge?: string }[] = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'staff', label: 'Staff', icon: Users, badge: '82' },
    { id: 'activity', label: 'Activity', icon: Activity },
    { id: 'shifts', label: 'Shifts', icon: Clock, badge: '1 Active' },
    { id: 'quotas', label: 'Quotas', icon: CheckSquare },
    { id: 'applications', label: 'Applications', icon: FileText, badge: '24' },
    { id: 'hr', label: 'HR', icon: Building2 },
    { id: 'moderation', label: 'Moderation', icon: ShieldAlert, badge: '7 Cases' },
    { id: 'roblox', label: 'Roblox Integration', icon: Gamepad2 },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-slate-950 border-r border-slate-800/80 flex flex-col justify-between shrink-0 h-screen sticky top-0 select-none z-30">
      <div className="flex flex-col gap-4 p-4 overflow-y-auto flex-1">
        {/* Brand Logo Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => onTabChange('overview')}>
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center font-black text-white text-base shadow-md shadow-indigo-600/30">
              V
            </div>
            <div>
              <span className="font-bold text-white text-sm tracking-tight block">Veyra</span>
              <span className="text-[10px] text-slate-400 font-mono -mt-1 block">Community OS</span>
            </div>
          </div>
          <button
            onClick={onNavigateHome}
            title="Return to Marketing Web"
            className="text-slate-400 hover:text-white p-1 rounded-md hover:bg-slate-800 transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
          </button>
        </div>

        {/* Community / Server Selector */}
        <div className="relative">
          <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1 block px-1">
            Active Community
          </label>
          <button
            onClick={() => setCommunityDropdownOpen(!communityDropdownOpen)}
            className="w-full bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl p-2.5 flex items-center justify-between text-left transition-colors"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
                {activeCommunity.name.charAt(0)}
              </div>
              <div className="min-w-0">
                <h4 className="text-xs font-semibold text-white truncate">{activeCommunity.name}</h4>
                <p className="text-[10px] text-slate-400 truncate">{activeCommunity.memberCount.toLocaleString()} Members</p>
              </div>
            </div>
            <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
          </button>

          {/* Community Switcher Dropdown */}
          {communityDropdownOpen && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-1.5 z-50 space-y-1">
              {communities.map((comm) => (
                <button
                  key={comm.id}
                  onClick={() => {
                    onSelectCommunity(comm);
                    setCommunityDropdownOpen(false);
                  }}
                  className={`w-full flex items-center justify-between p-2 rounded-lg text-xs font-medium transition-colors ${
                    activeCommunity.id === comm.id
                      ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'
                      : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="w-5 h-5 rounded bg-slate-800 flex items-center justify-center text-[10px] font-bold text-slate-300">
                      {comm.name.charAt(0)}
                    </span>
                    <span className="truncate">{comm.name}</span>
                  </div>
                  {activeCommunity.id === comm.id && <Check className="w-3.5 h-3.5 text-indigo-400 shrink-0" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Navigation Items */}
        <nav className="flex flex-col gap-1 pt-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white font-semibold shadow-md shadow-indigo-600/20'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span className="truncate">{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-md font-mono ${
                      isActive ? 'bg-indigo-700 text-indigo-100' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Footer Section */}
      <div className="p-4 border-t border-slate-800/80 space-y-1 bg-slate-950/80">
        <button
          onClick={onOpenSupport}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-slate-100 hover:bg-slate-900 transition-colors"
        >
          <HelpCircle className="w-4 h-4 text-slate-400" />
          <span>Help & Support</span>
        </button>

        <button
          onClick={() => onTabChange('settings')}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-slate-100 hover:bg-slate-900 transition-colors"
        >
          <User className="w-4 h-4 text-slate-400" />
          <div className="flex items-center justify-between w-full min-w-0">
            <span className="truncate">Matthew (GM)</span>
            <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Online
            </span>
          </div>
        </button>

        <button
          onClick={onNavigateHome}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-rose-400 hover:bg-rose-500/10 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};
