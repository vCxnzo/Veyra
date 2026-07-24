import React, { useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Activity, 
  Clock, 
  CheckSquare, 
  FileText, 
  ShieldAlert, 
  Calendar 
} from 'lucide-react';
import { AnalyticsData } from '../../types';
import { Badge } from '../common/Badge';

interface AnalyticsViewProps {
  analyticsData: AnalyticsData;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ analyticsData }) => {
  const [timeRange, setTimeRange] = useState<'7 Days' | '30 Days' | '90 Days' | '1 Year' | 'Custom'>('30 Days');

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Executive Analytics</h1>
          <p className="text-xs text-slate-400 mt-1">Deep operational insights across member retention, shift volume, and quota completion rates.</p>
        </div>

        {/* Date Filters */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900 border border-slate-800 text-xs">
          {(['7 Days', '30 Days', '90 Days', '1 Year', 'Custom'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                timeRange === range ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* Grid Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Member Growth Chart */}
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-indigo-400" /> Community & Member Growth ({timeRange})
              </h3>
              <p className="text-xs text-slate-400 font-mono">Roblox verified group members count over time</p>
            </div>
            <Badge variant="emerald">+14% Growth</Badge>
          </div>

          <div className="h-44 w-full flex items-end justify-between gap-3 pt-6 px-2 border-b border-slate-800">
            {analyticsData.memberGrowth.map((pt, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
                <span className="text-[10px] text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity font-mono">
                  {pt.members}
                </span>
                <div
                  className="w-full bg-gradient-to-t from-indigo-600 to-purple-500 rounded-t-lg transition-all"
                  style={{ height: `${(pt.members / 1300) * 100}%` }}
                />
                <span className="text-[11px] text-slate-500 font-medium">{pt.date}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Staff Shift Participation Chart */}
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-purple-400" /> Shift Participation & Output
              </h3>
              <p className="text-xs text-slate-400 font-mono">Weekly shift volume and staff server attendance</p>
            </div>
            <Badge variant="purple">High Engagement</Badge>
          </div>

          <div className="h-44 w-full flex items-end justify-between gap-3 pt-6 px-2 border-b border-slate-800">
            {analyticsData.activityTrends.map((bar, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
                <span className="text-[10px] text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity font-mono">
                  {bar.shifts} shifts
                </span>
                <div
                  className="w-full bg-gradient-to-t from-purple-600 to-pink-500 rounded-t-lg transition-all"
                  style={{ height: `${(bar.shifts / 35) * 100}%` }}
                />
                <span className="text-[11px] text-slate-500 font-medium">{bar.day}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quota Completion & Department Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quota Completion Rates */}
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <CheckSquare className="w-4 h-4 text-emerald-400" /> Quota Completion Rate By Rank
          </h3>
          <div className="space-y-3">
            {analyticsData.quotaCompletionRates.map((q, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300 font-medium">{q.rank}</span>
                  <span className="text-emerald-400 font-bold">{q.percentage}% Met</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full"
                    style={{ width: `${q.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Department Distribution */}
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <Activity className="w-4 h-4 text-amber-400" /> Department Staff Distribution
          </h3>
          <div className="space-y-3">
            {analyticsData.departmentDistribution.map((d, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                <span className="font-semibold text-white">{d.name}</span>
                <span className="text-indigo-400 font-bold font-mono">{d.count} Members</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
