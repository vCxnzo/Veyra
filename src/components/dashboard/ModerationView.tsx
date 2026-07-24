import React, { useState } from 'react';
import { 
  ShieldAlert, 
  AlertTriangle, 
  Ban, 
  HelpCircle, 
  Plus, 
  Search, 
  CheckCircle2, 
  FileText,
  ExternalLink
} from 'lucide-react';
import { ModerationCase, CaseAction } from '../../types';
import { Badge } from '../common/Badge';
import { Modal } from '../common/Modal';

interface ModerationViewProps {
  cases: ModerationCase[];
  onCreateCase: (newCase: Partial<ModerationCase>) => void;
  onToast: (title: string, message?: string) => void;
}

export const ModerationView: React.FC<ModerationViewProps> = ({
  cases,
  onCreateCase,
  onToast,
}) => {
  const [selectedCase, setSelectedCase] = useState<ModerationCase | null>(null);
  const [newCaseModalOpen, setNewCaseModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const [formUser, setFormUser] = useState('');
  const [formRoblox, setFormRoblox] = useState('');
  const [formAction, setFormAction] = useState<CaseAction>('Warning');
  const [formReason, setFormReason] = useState('');

  const totalWarnings = cases.filter((c) => c.action === 'Warning').length;
  const activeBans = cases.filter((c) => c.action === 'Permanent Ban' || c.action === 'Temporary Ban').length;
  const openAppeals = cases.filter((c) => c.status === 'Appealed').length;

  const filteredCases = cases.filter(
    (c) =>
      c.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.targetRoblox.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.targetUsername.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreateCase({
      targetUsername: formUser || formRoblox,
      targetRoblox: formRoblox,
      action: formAction,
      moderatorName: 'Matthew (GM)',
      reason: formReason,
      date: new Date().toISOString().replace('T', ' ').substring(0, 16),
      status: 'Active',
    });
    setNewCaseModalOpen(false);
    setFormUser('');
    setFormRoblox('');
    setFormReason('');
  };

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Moderation Management</h1>
          <p className="text-xs text-slate-400 mt-1">Issue disciplinary warnings, manage bans, process appeals, and inspect proof logs.</p>
        </div>
        <button
          onClick={() => setNewCaseModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-medium text-xs shadow-lg shadow-rose-600/20 transition-all flex items-center justify-center gap-2"
        >
          <ShieldAlert className="w-4 h-4" /> Issue Moderation Action
        </button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400">Total Warnings</span>
          <p className="text-2xl font-extrabold text-amber-400">{totalWarnings}</p>
          <p className="text-[11px] text-slate-500">Staff & player logs</p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400">Active Bans</span>
          <p className="text-2xl font-extrabold text-rose-400">{activeBans}</p>
          <p className="text-[11px] text-rose-400 font-medium">In-game & Discord</p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400">Open Appeals</span>
          <p className="text-2xl font-extrabold text-blue-400">{openAppeals}</p>
          <p className="text-[11px] text-slate-400">Awaiting executive review</p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400">Total Cases</span>
          <p className="text-2xl font-extrabold text-white">{cases.length}</p>
          <p className="text-[11px] text-slate-400">Audit archival</p>
        </div>
      </div>

      {/* Search & Case Table */}
      <div className="rounded-2xl bg-slate-900/80 border border-slate-800 overflow-hidden shadow-xl space-y-4 p-4">
        <div className="relative max-w-sm">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search Case ID or username..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-rose-500"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-[11px] font-semibold text-slate-400 uppercase tracking-wider bg-slate-950/60">
                <th className="py-3.5 px-4">Case ID</th>
                <th className="py-3.5 px-4">User</th>
                <th className="py-3.5 px-4">Action</th>
                <th className="py-3.5 px-4">Moderator</th>
                <th className="py-3.5 px-4">Reason</th>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-xs">
              {filteredCases.map((c) => (
                <tr
                  key={c.id}
                  onClick={() => setSelectedCase(c)}
                  className="hover:bg-slate-800/40 cursor-pointer transition-colors"
                >
                  <td className="py-3.5 px-4 font-mono font-bold text-rose-400">{c.id}</td>
                  <td className="py-3.5 px-4 font-semibold text-white">@{c.targetRoblox}</td>
                  <td className="py-3.5 px-4">
                    <Badge variant={c.action === 'Warning' ? 'amber' : c.action.includes('Ban') ? 'rose' : 'purple'}>
                      {c.action}
                    </Badge>
                  </td>
                  <td className="py-3.5 px-4 text-slate-300">{c.moderatorName}</td>
                  <td className="py-3.5 px-4 text-slate-300 truncate max-w-xs">{c.reason}</td>
                  <td className="py-3.5 px-4 text-slate-500 font-mono text-[10px]">{c.date}</td>
                  <td className="py-3.5 px-4">
                    <Badge variant={c.status === 'Active' ? 'rose' : c.status === 'Appealed' ? 'blue' : 'slate'}>
                      {c.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* CASE INSPECTION MODAL */}
      {selectedCase && (
        <Modal
          isOpen={!!selectedCase}
          onClose={() => setSelectedCase(null)}
          title={`Case Details: ${selectedCase.id}`}
          subtitle={`Target: @${selectedCase.targetRoblox} • Action: ${selectedCase.action}`}
          maxWidth="lg"
        >
          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">Moderator:</span>
                <span className="font-semibold text-white">{selectedCase.moderatorName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Timestamp:</span>
                <span className="font-mono text-slate-300">{selectedCase.date}</span>
              </div>
              <div className="flex justify-between border-t border-slate-800 pt-2">
                <span className="text-slate-500">Reason:</span>
                <span className="text-slate-200 font-medium">{selectedCase.reason}</span>
              </div>
            </div>

            {selectedCase.proofUrl && (
              <div className="p-3 rounded-xl bg-indigo-950/30 border border-indigo-800/40 flex items-center justify-between">
                <span className="text-indigo-300 font-medium">Video/Screen Proof Attached</span>
                <a
                  href={selectedCase.proofUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-semibold"
                >
                  View Evidence <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            )}

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => {
                  onToast('Case Resolved', `${selectedCase.id} status updated to Resolved.`);
                  setSelectedCase(null);
                }}
                className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium"
              >
                Mark Case as Resolved
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* ISSUE CASE MODAL */}
      <Modal
        isOpen={newCaseModalOpen}
        onClose={() => setNewCaseModalOpen(false)}
        title="Issue Disciplinary Case"
        subtitle="Log a formal warning, kick, or ban for staff/players"
        maxWidth="md"
      >
        <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 mb-1">Target Roblox Username</label>
            <input
              type="text"
              required
              placeholder="e.g. ExploitUser_99"
              value={formRoblox}
              onChange={(e) => setFormRoblox(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white focus:outline-none focus:border-rose-500"
            />
          </div>

          <div>
            <label className="block text-slate-300 mb-1">Action Type</label>
            <select
              value={formAction}
              onChange={(e) => setFormAction(e.target.value as any)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white focus:outline-none focus:border-rose-500"
            >
              <option value="Warning">Warning</option>
              <option value="Kick">Kick</option>
              <option value="Temporary Ban">Temporary Ban</option>
              <option value="Permanent Ban">Permanent Ban</option>
              <option value="Demotion">Demotion</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-300 mb-1">Reason & Proof Notes</label>
            <textarea
              rows={3}
              required
              placeholder="Provide detailed violation reason..."
              value={formReason}
              onChange={(e) => setFormReason(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white focus:outline-none focus:border-rose-500 resize-none"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-medium shadow-lg shadow-rose-600/20"
          >
            Submit Disciplinary Action
          </button>
        </form>
      </Modal>
    </div>
  );
};
