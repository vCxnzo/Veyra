import React from 'react';
import { 
  Users, 
  UserCheck, 
  FileText, 
  ShieldAlert, 
  Activity, 
  Clock, 
  TrendingUp, 
  ArrowUpRight, 
  CheckCircle2, 
  AlertTriangle, 
  ChevronRight, 
  Sparkles,
  Gamepad2
} from 'lucide-react';
import { Community, Shift, ActivityLog } from '../../types';
import { Badge } from '../common/Badge';

interface OverviewViewProps {
  community: Community;
  shifts: Shift[];
  activityLogs: ActivityLog[];
  onNavigateTab: (tab: any) => void;
  onOpenCreateShift: () => void;
}

export const OverviewView: React.FC<OverviewViewProps> = ({
  community,
  shifts,
  activityLogs,
  onNavigateTab,
  onOpenCreateShift,
}) => {
  const activeShifts = shifts.filter((s) => s.status === 'Active');

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Overview Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Good evening, Matthew.</h1>
          <p className="text-xs text-slate-400 mt-1">Here's what's happening in your community today.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenCreateShift}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs shadow-lg shadow-indigo-600/20 transition-all flex items-center gap-2"
          >
            <Clock className="w-4 h-4" /> Host New Shift
          </button>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Metric 1 */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2 hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Total Members</span>
            <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-white">{community.memberCount.toLocaleString()}</p>
          <p className="text-[11px] text-emerald-400 font-medium flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> +14.2% from last week
          </p>
        </div>

        {/* Metric 2 */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2 hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Active Staff</span>
            <div className="p-1.5 rounded-lg bg-purple-500/10 text-purple-400">
              <UserCheck className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-white">82</p>
          <p className="text-[11px] text-slate-400 font-medium">Across 5 departments</p>
        </div>

        {/* Metric 3 */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2 hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Applications</span>
            <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-white">24</p>
          <p className="text-[11px] text-amber-400 font-medium">12 pending HR review</p>
        </div>

        {/* Metric 4 */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2 hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Open Cases</span>
            <div className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400">
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-white">7</p>
          <p className="text-[11px] text-rose-400 font-medium">2 pending appeals</p>
        </div>

        {/* Metric 5 */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2 hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Staff Activity</span>
            <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-white">86%</p>
          <p className="text-[11px] text-emerald-400 font-medium">+8% quota completion</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Staff Activity Chart */}
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-white">Staff Activity Trend</h3>
              <p className="text-xs text-slate-400">Average weekly shift participation & score</p>
            </div>
            <Badge variant="indigo">This Week</Badge>
          </div>

          {/* SVG Line Chart Representation */}
          <div className="h-44 w-full flex items-end justify-between gap-3 pt-6 px-2 border-b border-slate-800">
            {[
              { day: 'Mon', height: '60%', score: '82%' },
              { day: 'Tue', height: '75%', score: '88%' },
              { day: 'Wed', height: '85%', score: '91%' },
              { day: 'Thu', height: '70%', score: '85%' },
              { day: 'Fri', height: '92%', score: '95%' },
              { day: 'Sat', height: '100%', score: '98%' },
              { day: 'Sun', height: '88%', score: '94%' },
            ].map((bar, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
                <span className="text-[10px] text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity font-mono">
                  {bar.score}
                </span>
                <div
                  className="w-full bg-gradient-to-t from-indigo-600 to-purple-500 rounded-t-lg transition-all group-hover:from-indigo-500 group-hover:to-purple-400"
                  style={{ height: bar.height }}
                />
                <span className="text-[11px] text-slate-500 font-medium">{bar.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Community Growth Chart */}
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-white">Community Growth</h3>
              <p className="text-xs text-slate-400">Roblox group members vs staff onboarding</p>
            </div>
            <Badge variant="emerald">Growth +14%</Badge>
          </div>

          <div className="h-44 w-full flex items-end justify-between gap-3 pt-6 px-2 border-b border-slate-800">
            {[
              { label: 'Jul 1', members: 1100, height: '45%' },
              { label: 'Jul 5', members: 1140, height: '55%' },
              { label: 'Jul 10', members: 1190, height: '70%' },
              { label: 'Jul 15', members: 1220, height: '80%' },
              { label: 'Jul 20', members: 1260, height: '90%' },
              { label: 'Jul 23', members: 1284, height: '100%' },
            ].map((pt, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
                <span className="text-[10px] text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity font-mono">
                  {pt.members}
                </span>
                <div
                  className="w-full bg-gradient-to-t from-emerald-600 to-teal-400 rounded-t-lg transition-all group-hover:from-emerald-500 group-hover:to-teal-300"
                  style={{ height: pt.height }}
                />
                <span className="text-[11px] text-slate-500 font-medium">{pt.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Active Shifts Section & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Shifts */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-indigo-400" /> Active & Live Shifts
              </h3>
              <p className="text-xs text-slate-400">Shifts currently running in game servers</p>
            </div>
            <button
              onClick={() => onNavigateTab('shifts')}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1"
            >
              View All <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {activeShifts.length === 0 ? (
              <div className="text-center py-8 bg-slate-950/60 rounded-xl border border-slate-800 text-slate-500 text-xs">
                No shifts actively running right now.
              </div>
            ) : (
              activeShifts.map((shift) => (
                <div
                  key={shift.id}
                  className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={shift.hostAvatar}
                      alt={shift.hostName}
                      className="w-10 h-10 rounded-xl object-cover ring-2 ring-indigo-500/30"
                    />
                    <div>
                      <h4 className="text-xs font-semibold text-white">Shift Host: @{shift.robloxUsername}</h4>
                      <p className="text-[11px] text-slate-400">Started {shift.startTime} • Duration {shift.durationMinutes}m</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <span className="text-xs font-bold text-indigo-300 block">{shift.participantsCount} On Floor</span>
                      <span className="text-[10px] text-emerald-400 font-medium block">Live Server</span>
                    </div>
                    <Badge variant="emerald">Active</Badge>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-semibold text-white">Recent Activity</h3>
            <span className="text-[10px] text-slate-500 font-mono">Real-time Stream</span>
          </div>

          <div className="space-y-3">
            {activityLogs.map((log) => (
              <div key={log.id} className="flex items-start gap-3 text-xs">
                <div className="mt-1 shrink-0">
                  {log.type === 'promotion' && <Sparkles className="w-4 h-4 text-amber-400" />}
                  {log.type === 'shift' && <Clock className="w-4 h-4 text-indigo-400" />}
                  {log.type === 'application' && <FileText className="w-4 h-4 text-purple-400" />}
                  {log.type === 'warning' && <AlertTriangle className="w-4 h-4 text-rose-400" />}
                  {log.type === 'verification' && <Gamepad2 className="w-4 h-4 text-emerald-400" />}
                  {log.type === 'loa' && <Activity className="w-4 h-4 text-blue-400" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-slate-200 leading-snug">
                    <span className="font-semibold text-white">{log.user}</span> {log.action}
                  </p>
                  <span className="text-[10px] text-slate-500 font-mono">{log.timestamp}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
