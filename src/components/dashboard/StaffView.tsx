import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  UserPlus, 
  MoreVertical, 
  Sparkles, 
  ShieldAlert, 
  ArrowDown, 
  ArrowUp, 
  Edit, 
  Clock, 
  CheckCircle2, 
  FileText, 
  Calendar, 
  Award, 
  Activity,
  X,
  ChevronRight
} from 'lucide-react';
import { StaffMember, StaffStatus } from '../../types';
import { Badge } from '../common/Badge';
import { Modal } from '../common/Modal';

interface StaffViewProps {
  staffList: StaffMember[];
  onAddStaff: (newStaff: Partial<StaffMember>) => void;
  onPromoteStaff: (staffId: string) => void;
  onDemoteStaff: (staffId: string) => void;
  onWarnStaff: (staffId: string) => void;
  onToast: (title: string, message?: string) => void;
}

export const StaffView: React.FC<StaffViewProps> = ({
  staffList,
  onAddStaff,
  onPromoteStaff,
  onDemoteStaff,
  onWarnStaff,
  onToast,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);
  const [activeProfileTab, setActiveProfileTab] = useState<
    'overview' | 'shifts' | 'sessions' | 'applications' | 'promotions' | 'history' | 'loas'
  >('overview');

  const [addStaffModalOpen, setAddStaffModalOpen] = useState(false);
  const [newStaffForm, setNewStaffForm] = useState({
    name: '',
    discordUsername: '',
    robloxUsername: '',
    rank: 'Junior Staff',
    department: 'Operations' as StaffMember['department'],
  });

  const filteredStaff = staffList.filter((staff) => {
    const matchesSearch =
      staff.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      staff.robloxUsername.toLowerCase().includes(searchQuery.toLowerCase()) ||
      staff.discordUsername.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDept = departmentFilter === 'All' || staff.department === departmentFilter;
    const matchesStatus = statusFilter === 'All' || staff.status === statusFilter;
    return matchesSearch && matchesDept && matchesStatus;
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStaffForm.name || !newStaffForm.robloxUsername) return;
    onAddStaff({
      name: newStaffForm.name,
      discordUsername: newStaffForm.discordUsername || newStaffForm.name.toLowerCase(),
      discordAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
      robloxUsername: newStaffForm.robloxUsername,
      robloxAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150',
      robloxId: Math.floor(10000000 + Math.random() * 90000000).toString(),
      rank: newStaffForm.rank,
      rankTier: 3,
      department: newStaffForm.department,
      activityScore: 85,
      quotaWeeklyShifts: 5,
      quotaCompletedShifts: 1,
      quotaWeeklySessions: 2,
      quotaCompletedSessions: 0,
      status: 'Active',
      joinDate: new Date().toISOString().split('T')[0],
      lastActive: 'Just now',
    });
    setAddStaffModalOpen(false);
    setNewStaffForm({ name: '', discordUsername: '', robloxUsername: '', rank: 'Junior Staff', department: 'Operations' });
  };

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Staff Directory</h1>
          <p className="text-xs text-slate-400 mt-1">Manage team members, view activity profiles, and issue rank actions.</p>
        </div>
        <button
          onClick={() => setAddStaffModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs shadow-lg shadow-indigo-600/20 transition-all flex items-center justify-center gap-2"
        >
          <UserPlus className="w-4 h-4" /> Add Staff Member
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search name, Roblox or Discord..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        {/* Dropdowns */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <Filter className="w-3.5 h-3.5" />
            <span>Filters:</span>
          </div>

          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
          >
            <option value="All">All Departments</option>
            <option value="Executive">Executive</option>
            <option value="Operations">Operations</option>
            <option value="Human Resources">Human Resources</option>
            <option value="Moderation">Moderation</option>
            <option value="Public Relations">Public Relations</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active</option>
            <option value="On LOA">On LOA</option>
            <option value="Suspended">Suspended</option>
          </select>
        </div>
      </div>

      {/* Staff Table */}
      <div className="rounded-2xl bg-slate-900/80 border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-[11px] font-semibold text-slate-400 uppercase tracking-wider bg-slate-950/60">
                <th className="py-3.5 px-4">Staff Member</th>
                <th className="py-3.5 px-4">Roblox User</th>
                <th className="py-3.5 px-4">Rank & Dept</th>
                <th className="py-3.5 px-4">Activity Score</th>
                <th className="py-3.5 px-4">Quota Progress</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-xs">
              {filteredStaff.map((staff) => {
                const quotaPercent = Math.round(
                  ((staff.quotaCompletedShifts + staff.quotaCompletedSessions) /
                    (staff.quotaWeeklyShifts + staff.quotaWeeklySessions)) *
                    100
                );

                return (
                  <tr
                    key={staff.id}
                    onClick={() => setSelectedStaff(staff)}
                    className="hover:bg-slate-800/40 cursor-pointer transition-colors"
                  >
                    {/* Member */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={staff.discordAvatar}
                          alt={staff.name}
                          className="w-9 h-9 rounded-xl object-cover ring-1 ring-slate-700"
                        />
                        <div>
                          <span className="font-semibold text-white block">{staff.name}</span>
                          <span className="text-[10px] text-slate-400">@{staff.discordUsername}</span>
                        </div>
                      </div>
                    </td>

                    {/* Roblox */}
                    <td className="py-3.5 px-4 font-mono text-slate-300">
                      @{staff.robloxUsername}
                    </td>

                    {/* Rank & Dept */}
                    <td className="py-3.5 px-4">
                      <span className="font-medium text-white block">{staff.rank}</span>
                      <span className="text-[10px] text-indigo-400">{staff.department}</span>
                    </td>

                    {/* Activity Score */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white">{staff.activityScore}%</span>
                        <div className="w-16 h-1.5 rounded-full bg-slate-800 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              staff.activityScore >= 80
                                ? 'bg-emerald-500'
                                : staff.activityScore >= 60
                                ? 'bg-amber-500'
                                : 'bg-rose-500'
                            }`}
                            style={{ width: `${staff.activityScore}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    {/* Quota */}
                    <td className="py-3.5 px-4">
                      <span className="text-slate-300 block font-mono text-[11px]">
                        {staff.quotaCompletedShifts}/{staff.quotaWeeklyShifts} Shifts
                      </span>
                      <span className="text-[10px] text-slate-500">
                        {staff.quotaCompletedSessions}/{staff.quotaWeeklySessions} Sessions
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      <Badge
                        variant={
                          staff.status === 'Active'
                            ? 'emerald'
                            : staff.status === 'On LOA'
                            ? 'blue'
                            : 'rose'
                        }
                      >
                        {staff.status}
                      </Badge>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => setSelectedStaff(staff)}
                        className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-medium transition-colors"
                      >
                        View Profile
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* DETAILED STAFF PROFILE MODAL */}
      {selectedStaff && (
        <Modal
          isOpen={!!selectedStaff}
          onClose={() => setSelectedStaff(null)}
          title={`Staff Profile: ${selectedStaff.name}`}
          subtitle={`@${selectedStaff.robloxUsername} • ${selectedStaff.rank}`}
          maxWidth="3xl"
        >
          <div className="space-y-6">
            {/* Header Identity Card */}
            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <img
                  src={selectedStaff.discordAvatar}
                  alt={selectedStaff.name}
                  className="w-16 h-16 rounded-2xl object-cover ring-2 ring-indigo-500/40 shadow-xl"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-white">{selectedStaff.name}</h3>
                    <Badge variant={selectedStaff.status === 'Active' ? 'emerald' : 'blue'}>
                      {selectedStaff.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Discord: <span className="text-slate-200">@{selectedStaff.discordUsername}</span> • Roblox: <span className="text-slate-200">@{selectedStaff.robloxUsername}</span>
                  </p>
                  <p className="text-xs text-indigo-400 mt-0.5 font-medium">
                    {selectedStaff.rank} • {selectedStaff.department} Department
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    onPromoteStaff(selectedStaff.id);
                    onToast('Promoted Staff', `${selectedStaff.name} rank updated.`);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 text-xs font-semibold border border-emerald-500/30 transition-colors flex items-center gap-1"
                >
                  <ArrowUp className="w-3.5 h-3.5" /> Promote
                </button>

                <button
                  onClick={() => {
                    onDemoteStaff(selectedStaff.id);
                    onToast('Demoted Staff', `${selectedStaff.name} rank reduced.`);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-amber-600/20 hover:bg-amber-600/30 text-amber-300 text-xs font-semibold border border-amber-500/30 transition-colors flex items-center gap-1"
                >
                  <ArrowDown className="w-3.5 h-3.5" /> Demote
                </button>

                <button
                  onClick={() => {
                    onWarnStaff(selectedStaff.id);
                    onToast('Warning Issued', `Disciplinary warning logged for ${selectedStaff.name}`);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 text-xs font-semibold border border-rose-500/30 transition-colors flex items-center gap-1"
                >
                  <ShieldAlert className="w-3.5 h-3.5" /> Warn
                </button>
              </div>
            </div>

            {/* Sub-tabs */}
            <div className="flex border-b border-slate-800 gap-4 text-xs font-medium text-slate-400 overflow-x-auto">
              {[
                { id: 'overview', label: 'Overview' },
                { id: 'shifts', label: 'Shifts History' },
                { id: 'sessions', label: 'Training Sessions' },
                { id: 'applications', label: 'HR Applications' },
                { id: 'promotions', label: 'Promotions Log' },
                { id: 'history', label: 'Timeline' },
                { id: 'loas', label: 'LOA Records' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveProfileTab(tab.id as any)}
                  className={`pb-2 transition-colors whitespace-nowrap ${
                    activeProfileTab === tab.id
                      ? 'text-indigo-400 border-b-2 border-indigo-500 font-bold'
                      : 'hover:text-slate-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Profile Tab Content */}
            {activeProfileTab === 'overview' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                  <h4 className="font-semibold text-white uppercase text-[10px] tracking-wider text-slate-400">Activity Metrics</h4>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Activity Score:</span>
                    <span className="font-bold text-emerald-400">{selectedStaff.activityScore}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Weekly Shifts Completed:</span>
                    <span className="font-medium text-white">{selectedStaff.quotaCompletedShifts} / {selectedStaff.quotaWeeklyShifts}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Sessions Hosted:</span>
                    <span className="font-medium text-white">{selectedStaff.quotaCompletedSessions} / {selectedStaff.quotaWeeklySessions}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Joined Team:</span>
                    <span className="font-medium text-slate-300">{selectedStaff.joinDate}</span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <h4 className="font-semibold text-white uppercase text-[10px] tracking-wider text-slate-400">Executive Notes</h4>
                  <p className="text-slate-300 leading-relaxed italic">
                    "{selectedStaff.notes || 'Consistently meets weekly shift quotas. Recommended for high-rank training.'}"
                  </p>
                </div>
              </div>
            )}

            {activeProfileTab === 'history' && (
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-4 text-xs">
                <h4 className="font-semibold text-white">Staff Career Timeline</h4>
                <div className="space-y-3 relative pl-4 border-l border-indigo-500/30">
                  <div className="relative">
                    <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-emerald-400" />
                    <p className="text-white font-semibold">Promoted to {selectedStaff.rank}</p>
                    <p className="text-slate-500 text-[10px]">May 2026 • Approved by Management</p>
                  </div>
                  <div className="relative">
                    <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-indigo-400" />
                    <p className="text-white font-semibold">Passed Barista & Shift Host Exam</p>
                    <p className="text-slate-500 text-[10px]">March 2026 • 100% Score</p>
                  </div>
                  <div className="relative">
                    <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-slate-500" />
                    <p className="text-white font-semibold">Joined Hazel Cafe Staff Team</p>
                    <p className="text-slate-500 text-[10px]">{selectedStaff.joinDate}</p>
                  </div>
                </div>
              </div>
            )}

            {activeProfileTab !== 'overview' && activeProfileTab !== 'history' && (
              <div className="p-6 text-center text-xs text-slate-400 bg-slate-950 rounded-xl border border-slate-800">
                Detailed {activeProfileTab} logs filtered for @{selectedStaff.robloxUsername}.
              </div>
            )}
          </div>
        </Modal>
      )}

      {/* ADD STAFF MODAL */}
      <Modal
        isOpen={addStaffModalOpen}
        onClose={() => setAddStaffModalOpen(false)}
        title="Add Staff Member"
        subtitle="Onboard a new staff member into your community database"
        maxWidth="md"
      >
        <form onSubmit={handleAddSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Full Name / Display Tag</label>
            <input
              type="text"
              required
              placeholder="e.g. Jordan"
              value={newStaffForm.name}
              onChange={(e) => setNewStaffForm({ ...newStaffForm, name: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Roblox Username</label>
            <input
              type="text"
              required
              placeholder="e.g. JordanRBX"
              value={newStaffForm.robloxUsername}
              onChange={(e) => setNewStaffForm({ ...newStaffForm, robloxUsername: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Discord Username</label>
            <input
              type="text"
              placeholder="e.g. jordan_dev"
              value={newStaffForm.discordUsername}
              onChange={(e) => setNewStaffForm({ ...newStaffForm, discordUsername: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Initial Rank</label>
              <select
                value={newStaffForm.rank}
                onChange={(e) => setNewStaffForm({ ...newStaffForm, rank: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="Junior Staff">Junior Staff</option>
                <option value="Senior Staff">Senior Staff</option>
                <option value="Shift Supervisor">Shift Supervisor</option>
                <option value="HR Manager">HR Manager</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Department</label>
              <select
                value={newStaffForm.department}
                onChange={(e) => setNewStaffForm({ ...newStaffForm, department: e.target.value as any })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="Operations">Operations</option>
                <option value="Human Resources">Human Resources</option>
                <option value="Moderation">Moderation</option>
                <option value="Public Relations">Public Relations</option>
                <option value="Executive">Executive</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs transition-colors shadow-lg shadow-indigo-600/20 mt-2"
          >
            Confirm Staff Onboarding
          </button>
        </form>
      </Modal>
    </div>
  );
};
