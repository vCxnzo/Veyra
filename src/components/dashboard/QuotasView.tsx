import React, { useState } from 'react';
import { 
  CheckSquare, 
  Settings, 
  Users, 
  AlertTriangle, 
  CheckCircle2, 
  Save, 
  Sliders 
} from 'lucide-react';
import { QuotaConfig, StaffMember } from '../../types';
import { Badge } from '../common/Badge';

interface QuotasViewProps {
  quotaConfigs: QuotaConfig[];
  staffList: StaffMember[];
  onUpdateQuotas: (updated: QuotaConfig[]) => void;
  onToast: (title: string, message?: string) => void;
}

export const QuotasView: React.FC<QuotasViewProps> = ({
  quotaConfigs,
  staffList,
  onUpdateQuotas,
  onToast,
}) => {
  const [activeTab, setActiveTab] = useState<'Compliance' | 'Configuration'>('Compliance');
  const [configs, setConfigs] = useState<QuotaConfig[]>(quotaConfigs);

  const handleConfigChange = (index: number, field: keyof QuotaConfig, value: any) => {
    const updated = [...configs];
    updated[index] = { ...updated[index], [field]: value };
    setConfigs(updated);
  };

  const handleSaveConfig = () => {
    onUpdateQuotas(configs);
    onToast('Quota Rules Updated', 'Weekly staff quota requirements saved successfully.');
  };

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Quota Management System</h1>
          <p className="text-xs text-slate-400 mt-1">Set mandatory shift & training targets by rank and track staff compliance.</p>
        </div>

        <div className="flex items-center gap-2 p-1 rounded-xl bg-slate-900 border border-slate-800 text-xs">
          <button
            onClick={() => setActiveTab('Compliance')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              activeTab === 'Compliance' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Staff Compliance
          </button>
          <button
            onClick={() => setActiveTab('Configuration')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              activeTab === 'Configuration' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Quota Rules Configuration
          </button>
        </div>
      </div>

      {/* COMPLIANCE VIEW */}
      {activeTab === 'Compliance' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400">Total Staff Tracked</span>
              <p className="text-2xl font-extrabold text-white">{staffList.length}</p>
              <p className="text-[11px] text-emerald-400">100% active sync</p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400">Compliant (100% Met)</span>
              <p className="text-2xl font-extrabold text-emerald-400">
                {staffList.filter((s) => s.quotaCompletedShifts >= s.quotaWeeklyShifts).length}
              </p>
              <p className="text-[11px] text-slate-400">Meets weekly target</p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400">At Risk / Missing</span>
              <p className="text-2xl font-extrabold text-rose-400">
                {staffList.filter((s) => s.quotaCompletedShifts < s.quotaWeeklyShifts).length}
              </p>
              <p className="text-[11px] text-rose-400 font-medium">Pending weekend shifts</p>
            </div>
          </div>

          <div className="rounded-2xl bg-slate-900/80 border border-slate-800 overflow-hidden shadow-xl">
            <div className="p-4 border-b border-slate-800 bg-slate-950/60">
              <h3 className="text-sm font-semibold text-white">Staff Weekly Compliance List</h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-[11px] font-semibold text-slate-400 uppercase tracking-wider bg-slate-950/40">
                    <th className="py-3.5 px-4">Staff Member</th>
                    <th className="py-3.5 px-4">Rank</th>
                    <th className="py-3.5 px-4">Shift Quota</th>
                    <th className="py-3.5 px-4">Session Quota</th>
                    <th className="py-3.5 px-4">Compliance Progress</th>
                    <th className="py-3.5 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-xs">
                  {staffList.map((staff) => {
                    const shiftPercent = Math.min(
                      100,
                      Math.round((staff.quotaCompletedShifts / staff.quotaWeeklyShifts) * 100)
                    );
                    const isMet = shiftPercent >= 100;

                    return (
                      <tr key={staff.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-3.5 px-4">
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

                        <td className="py-3.5 px-4 font-medium text-slate-200">{staff.rank}</td>

                        <td className="py-3.5 px-4 font-mono">
                          <span className={staff.quotaCompletedShifts >= staff.quotaWeeklyShifts ? 'text-emerald-400 font-bold' : 'text-slate-300'}>
                            {staff.quotaCompletedShifts} / {staff.quotaWeeklyShifts}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 font-mono text-slate-300">
                          {staff.quotaCompletedSessions} / {staff.quotaWeeklySessions}
                        </td>

                        <td className="py-3.5 px-4 w-48">
                          <div className="space-y-1">
                            <div className="flex justify-between text-[10px]">
                              <span className="text-slate-400">{shiftPercent}%</span>
                              <span className={isMet ? 'text-emerald-400 font-bold' : 'text-amber-400'}>
                                {isMet ? 'Target Met' : 'In Progress'}
                              </span>
                            </div>
                            <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                              <div
                                className={`h-full rounded-full ${isMet ? 'bg-emerald-500' : 'bg-amber-500'}`}
                                style={{ width: `${shiftPercent}%` }}
                              />
                            </div>
                          </div>
                        </td>

                        <td className="py-3.5 px-4">
                          <Badge variant={isMet ? 'emerald' : 'amber'}>
                            {isMet ? 'Compliant' : 'At Risk'}
                          </Badge>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* CONFIGURATION VIEW */}
      {activeTab === 'Configuration' && (
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-sm font-semibold text-white">Rank Quota Rules</h3>
              <p className="text-xs text-slate-400">Define weekly mandatory requirements for each staff tier.</p>
            </div>
            <button
              onClick={handleSaveConfig}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs transition-colors flex items-center gap-2 shadow-lg shadow-indigo-600/20"
            >
              <Save className="w-4 h-4" /> Save Configuration
            </button>
          </div>

          <div className="space-y-4">
            {configs.map((config, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-slate-950 border border-slate-800 grid grid-cols-1 sm:grid-cols-4 gap-4 items-center">
                <div>
                  <span className="text-xs font-bold text-white block">{config.rank}</span>
                  <span className="text-[10px] text-slate-500">Tier Rule</span>
                </div>

                <div>
                  <label className="block text-[10px] text-slate-400 mb-1">Shifts Per Week</label>
                  <input
                    type="number"
                    value={config.shiftsPerWeek}
                    onChange={(e) => handleConfigChange(idx, 'shiftsPerWeek', parseInt(e.target.value) || 0)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-[10px] text-slate-400 mb-1">Sessions Per Week</label>
                  <input
                    type="number"
                    value={config.sessionsPerWeek}
                    onChange={(e) => handleConfigChange(idx, 'sessionsPerWeek', parseInt(e.target.value) || 0)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-[10px] text-slate-400 mb-1">Grace Period (Days)</label>
                  <input
                    type="number"
                    value={config.gracePeriodDays}
                    onChange={(e) => handleConfigChange(idx, 'gracePeriodDays', parseInt(e.target.value) || 0)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
