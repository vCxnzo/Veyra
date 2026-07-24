import React, { useState } from 'react';
import { 
  Activity, 
  Clock, 
  CheckSquare, 
  FileText, 
  ShieldAlert, 
  Award, 
  Trophy, 
  TrendingUp, 
  Filter, 
  Calendar 
} from 'lucide-react';
import { StaffMember } from '../../types';
import { Badge } from '../common/Badge';

interface ActivityViewProps {
  staffList: StaffMember[];
}

export const ActivityView: React.FC<ActivityViewProps> = ({ staffList }) => {
  const [timeFilter, setTimeFilter] = useState<'Today' | 'This Week' | 'This Month' | 'Custom Range'>('This Week');

  // Sorted Leaderboard
  const leaderboardStaff = [...staffList].sort((a, b) => b.activityScore - a.activityScore);

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header & Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Staff Activity Analytics</h1>
          <p className="text-xs text-slate-400 mt-1">Real-time performance metrics, shift logging, and activity leaderboard.</p>
        </div>

        {/* Time Range Filter Buttons */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900 border border-slate-800">
          {(['Today', 'This Week', 'This Month', 'Custom Range'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeFilter(range)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                timeFilter === range
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-center space-y-1">
          <Activity className="w-4 h-4 text-emerald-400 mx-auto" />
          <span className="text-[10px] text-slate-400 block uppercase tracking-wider font-semibold">Activity Score</span>
          <span className="text-xl font-extrabold text-white">88%</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-center space-y-1">
          <Clock className="w-4 h-4 text-indigo-400 mx-auto" />
          <span className="text-[10px] text-slate-400 block uppercase tracking-wider font-semibold">Shifts Run</span>
          <span className="text-xl font-extrabold text-white">128</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-center space-y-1">
          <CheckSquare className="w-4 h-4 text-purple-400 mx-auto" />
          <span className="text-[10px] text-slate-400 block uppercase tracking-wider font-semibold">Sessions</span>
          <span className="text-xl font-extrabold text-white">42</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-center space-y-1">
          <FileText className="w-4 h-4 text-amber-400 mx-auto" />
          <span className="text-[10px] text-slate-400 block uppercase tracking-wider font-semibold">Applications</span>
          <span className="text-xl font-extrabold text-white">64</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-center space-y-1">
          <Award className="w-4 h-4 text-cyan-400 mx-auto" />
          <span className="text-[10px] text-slate-400 block uppercase tracking-wider font-semibold">Tickets</span>
          <span className="text-xl font-extrabold text-white">192</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-center space-y-1">
          <ShieldAlert className="w-4 h-4 text-rose-400 mx-auto" />
          <span className="text-[10px] text-slate-400 block uppercase tracking-wider font-semibold">Mod Actions</span>
          <span className="text-xl font-extrabold text-white">18</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-center space-y-1 col-span-2 sm:col-span-1">
          <Trophy className="w-4 h-4 text-amber-300 mx-auto" />
          <span className="text-[10px] text-slate-400 block uppercase tracking-wider font-semibold">Events</span>
          <span className="text-xl font-extrabold text-white">6</span>
        </div>
      </div>

      {/* Activity Over Time Chart */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-white">Activity Output Volume ({timeFilter})</h3>
            <p className="text-xs text-slate-400">Total shifts & sessions completed across departments</p>
          </div>
          <Badge variant="indigo">High Output</Badge>
        </div>

        <div className="h-48 w-full flex items-end justify-between gap-4 pt-6 px-2 border-b border-slate-800">
          {[
            { label: 'Mon', shifts: 12, sessions: 4 },
            { label: 'Tue', shifts: 18, sessions: 6 },
            { label: 'Wed', shifts: 22, sessions: 8 },
            { label: 'Thu', shifts: 15, sessions: 5 },
            { label: 'Fri', shifts: 28, sessions: 10 },
            { label: 'Sat', shifts: 34, sessions: 12 },
            { label: 'Sun', shifts: 30, sessions: 9 },
          ].map((bar, idx) => (
            <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
              <span className="text-[10px] text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity font-mono">
                {bar.shifts + bar.sessions} total
              </span>
              <div className="w-full flex items-end justify-center gap-1">
                <div
                  className="w-1/2 bg-indigo-500 rounded-t-md transition-all group-hover:bg-indigo-400"
                  style={{ height: `${bar.shifts * 4}px` }}
                />
                <div
                  className="w-1/2 bg-purple-500 rounded-t-md transition-all group-hover:bg-purple-400"
                  style={{ height: `${bar.sessions * 4}px` }}
                />
              </div>
              <span className="text-[11px] text-slate-500 font-medium">{bar.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Staff Leaderboard */}
      <div className="rounded-2xl bg-slate-900/80 border border-slate-800 overflow-hidden shadow-xl space-y-4 p-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Trophy className="w-4 h-4 text-amber-400" /> Staff Performance Leaderboard
            </h3>
            <p className="text-xs text-slate-400">Rankings calculated by activity score and quota completion</p>
          </div>
          <span className="text-xs text-slate-400 font-mono">Filtered by: {timeFilter}</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-[11px] font-semibold text-slate-400 uppercase tracking-wider bg-slate-950/60">
                <th className="py-3 px-4 w-12 text-center">Rank</th>
                <th className="py-3 px-4">Staff Member</th>
                <th className="py-3 px-4">Activity Score</th>
                <th className="py-3 px-4">Shifts</th>
                <th className="py-3 px-4">Sessions</th>
                <th className="py-3 px-4">Quota Status</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-xs">
              {leaderboardStaff.map((staff, idx) => {
                const rankNumber = idx + 1;
                const quotaPercent = Math.round(
                  ((staff.quotaCompletedShifts + staff.quotaCompletedSessions) /
                    (staff.quotaWeeklyShifts + staff.quotaWeeklySessions)) *
                    100
                );

                return (
                  <tr key={staff.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4 text-center font-bold font-mono">
                      {rankNumber === 1 && <span className="text-amber-400 text-sm">🥇 1</span>}
                      {rankNumber === 2 && <span className="text-slate-300 text-sm">🥈 2</span>}
                      {rankNumber === 3 && <span className="text-amber-600 text-sm">🥉 3</span>}
                      {rankNumber > 3 && <span className="text-slate-500">{rankNumber}</span>}
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={staff.discordAvatar}
                          alt={staff.name}
                          className="w-8 h-8 rounded-lg object-cover ring-1 ring-slate-700"
                        />
                        <div>
                          <span className="font-semibold text-white block">{staff.name}</span>
                          <span className="text-[10px] text-slate-400">@{staff.robloxUsername}</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4 font-bold text-emerald-400">{staff.activityScore}%</td>

                    <td className="py-3 px-4 font-mono text-slate-300">{staff.quotaCompletedShifts} Shifts</td>

                    <td className="py-3 px-4 font-mono text-slate-300">{staff.quotaCompletedSessions} Sessions</td>

                    <td className="py-3 px-4">
                      <Badge variant={quotaPercent >= 100 ? 'emerald' : quotaPercent >= 50 ? 'amber' : 'rose'}>
                        {quotaPercent}% Met
                      </Badge>
                    </td>

                    <td className="py-3 px-4">
                      <Badge variant={staff.status === 'Active' ? 'emerald' : 'blue'}>{staff.status}</Badge>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
