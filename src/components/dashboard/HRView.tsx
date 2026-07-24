import React, { useState } from 'react';
import { 
  Building2, 
  Calendar, 
  FileText, 
  Plus, 
  CheckCircle, 
  XCircle, 
  UserCheck, 
  ShieldAlert, 
  Award,
  ChevronRight
} from 'lucide-react';
import { LeaveOfAbsence, StaffMember } from '../../types';
import { Badge } from '../common/Badge';
import { Modal } from '../common/Modal';

interface HRViewProps {
  loas: LeaveOfAbsence[];
  staffList: StaffMember[];
  onApproveLOA: (id: string) => void;
  onDenyLOA: (id: string) => void;
  onToast: (title: string, message?: string) => void;
}

export const HRView: React.FC<HRViewProps> = ({
  loas,
  staffList,
  onApproveLOA,
  onDenyLOA,
  onToast,
}) => {
  const [activeTab, setActiveTab] = useState<'LOAs' | 'Promotions' | 'Disciplinary'>('LOAs');
  const [requestLOAModalOpen, setRequestLOAModalOpen] = useState(false);

  const [loaStaff, setLoaStaff] = useState('Matthew');
  const [loaRoblox, setLoaRoblox] = useState('MatthewRBX');
  const [loaReason, setLoaReason] = useState('');
  const [loaStart, setLoaStart] = useState('2026-07-25');
  const [loaEnd, setLoaEnd] = useState('2026-07-30');

  const handleCreateLOA = (e: React.FormEvent) => {
    e.preventDefault();
    onToast('LOA Submitted', `Leave request for @${loaRoblox} submitted to HR Manager.`);
    setRequestLOAModalOpen(false);
    setLoaReason('');
  };

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Human Resources Portal</h1>
          <p className="text-xs text-slate-400 mt-1">Manage staff Leave of Absences (LOAs), disciplinary cases, and promotion pipelines.</p>
        </div>
        <button
          onClick={() => setRequestLOAModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs shadow-lg shadow-indigo-600/20 transition-all flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" /> Submit LOA Request
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-800 gap-6 text-xs font-medium text-slate-400">
        <button
          onClick={() => setActiveTab('LOAs')}
          className={`pb-3 flex items-center gap-2 transition-colors ${
            activeTab === 'LOAs' ? 'text-indigo-400 border-b-2 border-indigo-500 font-bold' : 'hover:text-slate-200'
          }`}
        >
          <Calendar className="w-4 h-4" /> Leave of Absences ({loas.length})
        </button>

        <button
          onClick={() => setActiveTab('Promotions')}
          className={`pb-3 flex items-center gap-2 transition-colors ${
            activeTab === 'Promotions' ? 'text-indigo-400 border-b-2 border-indigo-500 font-bold' : 'hover:text-slate-200'
          }`}
        >
          <Award className="w-4 h-4" /> Promotion Nominations (4)
        </button>

        <button
          onClick={() => setActiveTab('Disciplinary')}
          className={`pb-3 flex items-center gap-2 transition-colors ${
            activeTab === 'Disciplinary' ? 'text-indigo-400 border-b-2 border-indigo-500 font-bold' : 'hover:text-slate-200'
          }`}
        >
          <ShieldAlert className="w-4 h-4" /> Disciplinary Logs
        </button>
      </div>

      {/* LOA VIEW */}
      {activeTab === 'LOAs' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {loas.map((loa) => (
              <div key={loa.id} className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-white">{loa.staffName}</h3>
                    <p className="text-xs text-slate-400">Roblox: @{loa.robloxUsername}</p>
                  </div>
                  <Badge variant={loa.status === 'Approved' ? 'emerald' : loa.status === 'Denied' ? 'rose' : 'amber'}>
                    {loa.status}
                  </Badge>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1 text-xs text-slate-300">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Duration:</span>
                    <span className="font-mono text-indigo-300">{loa.startDate} to {loa.endDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Reason:</span>
                    <span className="text-slate-200 italic">"{loa.reason}"</span>
                  </div>
                  {loa.approvedBy && (
                    <div className="flex justify-between border-t border-slate-800 pt-1 mt-1">
                      <span className="text-slate-500">Approved By:</span>
                      <span className="text-slate-300">{loa.approvedBy}</span>
                    </div>
                  )}
                </div>

                {loa.status === 'Pending' && (
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={() => {
                        onApproveLOA(loa.id);
                        onToast('LOA Approved', `Leave approved for @${loa.robloxUsername}`);
                      }}
                      className="flex-1 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 text-xs font-semibold border border-emerald-500/30 transition-colors flex items-center justify-center gap-1"
                    >
                      <CheckCircle className="w-3.5 h-3.5" /> Approve LOA
                    </button>

                    <button
                      onClick={() => {
                        onDenyLOA(loa.id);
                        onToast('LOA Denied', `Leave denied for @${loa.robloxUsername}`);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 text-xs font-semibold border border-rose-500/30 transition-colors"
                    >
                      Deny
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PROMOTIONS VIEW */}
      {activeTab === 'Promotions' && (
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4 text-xs">
          <h3 className="text-sm font-bold text-white">Pending Promotion Nominations</h3>
          <div className="space-y-3">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div>
                <p className="font-bold text-white">Alex (Shift Supervisor) → HR Manager</p>
                <p className="text-slate-400 text-[11px]">Nominated by Matthew for maintaining 98% shift uptime.</p>
              </div>
              <button
                onClick={() => onToast('Promotion Approved', 'Rank synchronized with Roblox Group & Discord.')}
                className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white font-medium"
              >
                Approve Rank Up
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DISCIPLINARY VIEW */}
      {activeTab === 'Disciplinary' && (
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2 text-xs">
          <h3 className="text-sm font-bold text-white">Staff Disciplinary Audit Records</h3>
          <p className="text-slate-400">View complete cases on the dedicated Moderation tab.</p>
        </div>
      )}

      {/* SUBMIT LOA MODAL */}
      <Modal
        isOpen={requestLOAModalOpen}
        onClose={() => setRequestLOAModalOpen(false)}
        title="Submit Leave of Absence (LOA)"
        subtitle="Request temporary exemption from weekly shift quotas"
        maxWidth="md"
      >
        <form onSubmit={handleCreateLOA} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 mb-1">Roblox Username</label>
            <input
              type="text"
              required
              value={loaRoblox}
              onChange={(e) => setLoaRoblox(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 mb-1">Start Date</label>
              <input
                type="date"
                required
                value={loaStart}
                onChange={(e) => setLoaStart(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-slate-300 mb-1">End Date</label>
              <input
                type="date"
                required
                value={loaEnd}
                onChange={(e) => setLoaEnd(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 mb-1">Reason for LOA</label>
            <textarea
              rows={3}
              required
              placeholder="e.g. Exam week or personal travel..."
              value={loaReason}
              onChange={(e) => setLoaReason(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white focus:outline-none focus:border-indigo-500 resize-none"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-indigo-600 text-white font-medium shadow-lg shadow-indigo-600/20"
          >
            Submit LOA to HR
          </button>
        </form>
      </Modal>
    </div>
  );
};
