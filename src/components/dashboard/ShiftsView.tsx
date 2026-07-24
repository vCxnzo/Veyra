import React, { useState } from 'react';
import { 
  Clock, 
  Plus, 
  Users, 
  CheckCircle2, 
  XCircle, 
  Play, 
  StopCircle, 
  Calendar, 
  Check 
} from 'lucide-react';
import { Shift } from '../../types';
import { Badge } from '../common/Badge';
import { Modal } from '../common/Modal';

interface ShiftsViewProps {
  shifts: Shift[];
  onCreateShift: (newShift: Partial<Shift>) => void;
  onEndShift: (shiftId: string) => void;
  onToast: (title: string, message?: string) => void;
}

export const ShiftsView: React.FC<ShiftsViewProps> = ({
  shifts,
  onCreateShift,
  onEndShift,
  onToast,
}) => {
  const [activeShiftTab, setActiveShiftTab] = useState<'Active' | 'Scheduled' | 'History'>('Active');
  const [createModalOpen, setCreateModalOpen] = useState(false);

  const [formHost, setFormHost] = useState('Matthew');
  const [formRoblox, setFormRoblox] = useState('MatthewRBX');
  const [formType, setFormType] = useState<Shift['type']>('Regular Shift');
  const [formNotes, setFormNotes] = useState('');

  const activeShiftsList = shifts.filter((s) => s.status === 'Active');
  const scheduledShiftsList = shifts.filter((s) => s.status === 'Scheduled');
  const historyShiftsList = shifts.filter((s) => s.status === 'Completed' || s.status === 'Cancelled');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreateShift({
      hostName: formHost,
      hostAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
      robloxUsername: formRoblox,
      startTime: 'Just now',
      durationMinutes: 45,
      participantsCount: 1,
      participants: [formRoblox],
      status: 'Active',
      type: formType,
      notes: formNotes || 'Standard cafe shift.',
    });
    setCreateModalOpen(false);
    setFormNotes('');
  };

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Shift Management</h1>
          <p className="text-xs text-slate-400 mt-1">Monitor live in-game shifts, schedule training sessions, and view audit history.</p>
        </div>
        <button
          onClick={() => setCreateModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs shadow-lg shadow-indigo-600/20 transition-all flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" /> Host New Shift
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-800 gap-6 text-xs font-medium text-slate-400">
        <button
          onClick={() => setActiveShiftTab('Active')}
          className={`pb-3 flex items-center gap-2 transition-colors ${
            activeShiftTab === 'Active'
              ? 'text-indigo-400 border-b-2 border-indigo-500 font-bold'
              : 'hover:text-slate-200'
          }`}
        >
          <Clock className="w-4 h-4" /> Active Shifts ({activeShiftsList.length})
        </button>

        <button
          onClick={() => setActiveShiftTab('Scheduled')}
          className={`pb-3 flex items-center gap-2 transition-colors ${
            activeShiftTab === 'Scheduled'
              ? 'text-indigo-400 border-b-2 border-indigo-500 font-bold'
              : 'hover:text-slate-200'
          }`}
        >
          <Calendar className="w-4 h-4" /> Scheduled Shifts ({scheduledShiftsList.length})
        </button>

        <button
          onClick={() => setActiveShiftTab('History')}
          className={`pb-3 flex items-center gap-2 transition-colors ${
            activeShiftTab === 'History'
              ? 'text-indigo-400 border-b-2 border-indigo-500 font-bold'
              : 'hover:text-slate-200'
          }`}
        >
          <CheckCircle2 className="w-4 h-4" /> Shift History ({historyShiftsList.length})
        </button>
      </div>

      {/* ACTIVE SHIFTS VIEW */}
      {activeShiftTab === 'Active' && (
        <div className="space-y-4">
          {activeShiftsList.length === 0 ? (
            <div className="p-12 text-center bg-slate-900/60 rounded-2xl border border-slate-800 space-y-3">
              <Clock className="w-8 h-8 text-slate-600 mx-auto" />
              <h3 className="text-sm font-semibold text-white">No Active Shifts</h3>
              <p className="text-xs text-slate-400">Host a shift from the button above to begin tracking live floor activity.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeShiftsList.map((shift) => (
                <div key={shift.id} className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4 shadow-xl">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img src={shift.hostAvatar} alt={shift.hostName} className="w-10 h-10 rounded-xl object-cover ring-2 ring-indigo-500/30" />
                      <div>
                        <h3 className="text-sm font-bold text-white">Host: @{shift.robloxUsername}</h3>
                        <p className="text-xs text-indigo-400 font-medium">{shift.type}</p>
                      </div>
                    </div>
                    <Badge variant="emerald">Live In-Game</Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs bg-slate-950 p-3 rounded-xl border border-slate-800">
                    <div>
                      <span className="text-slate-500 block">Start Time</span>
                      <span className="text-slate-200 font-medium">{shift.startTime}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Duration</span>
                      <span className="text-slate-200 font-medium">{shift.durationMinutes} Minutes</span>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs font-semibold text-slate-300 mb-1">Participants ({shift.participantsCount} Staff)</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {shift.participants.map((p, idx) => (
                        <span key={idx} className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                          @{p}
                        </span>
                      ))}
                    </div>
                  </div>

                  {shift.notes && (
                    <p className="text-xs text-slate-400 italic bg-slate-950/40 p-2.5 rounded-lg border border-slate-800">
                      "{shift.notes}"
                    </p>
                  )}

                  <div className="flex items-center gap-2 pt-2">
                    <button
                      onClick={() => {
                        onEndShift(shift.id);
                        onToast('Shift Ended', `Shift hosted by @${shift.robloxUsername} concluded & logged.`);
                      }}
                      className="w-full py-2 rounded-xl bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/30 font-semibold text-xs transition-colors flex items-center justify-center gap-2"
                    >
                      <StopCircle className="w-4 h-4" /> Conclude Shift
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* SCHEDULED SHIFTS VIEW */}
      {activeShiftTab === 'Scheduled' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {scheduledShiftsList.map((shift) => (
              <div key={shift.id} className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img src={shift.hostAvatar} alt={shift.hostName} className="w-10 h-10 rounded-xl object-cover ring-2 ring-purple-500/30" />
                    <div>
                      <h3 className="text-sm font-bold text-white">Host: @{shift.robloxUsername}</h3>
                      <p className="text-xs text-purple-400 font-medium">{shift.type}</p>
                    </div>
                  </div>
                  <Badge variant="purple">Scheduled</Badge>
                </div>

                <div className="p-3 bg-slate-950 rounded-xl text-xs text-slate-300 border border-slate-800">
                  <span className="text-slate-500 block">Scheduled Time:</span>
                  <span className="font-semibold text-white">{shift.startTime}</span>
                </div>

                <button
                  onClick={() => onToast('Shift Started', `Shift hosted by @${shift.robloxUsername} is now active.`)}
                  className="w-full py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs transition-colors flex items-center justify-center gap-2"
                >
                  <Play className="w-4 h-4" /> Launch Scheduled Shift Now
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SHIFT HISTORY VIEW */}
      {activeShiftTab === 'History' && (
        <div className="rounded-2xl bg-slate-900/80 border border-slate-800 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-[11px] font-semibold text-slate-400 uppercase tracking-wider bg-slate-950/60">
                  <th className="py-3.5 px-4">Shift ID</th>
                  <th className="py-3.5 px-4">Host</th>
                  <th className="py-3.5 px-4">Type</th>
                  <th className="py-3.5 px-4">Start Time</th>
                  <th className="py-3.5 px-4">Duration</th>
                  <th className="py-3.5 px-4">Participants</th>
                  <th className="py-3.5 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-xs">
                {historyShiftsList.map((shift) => (
                  <tr key={shift.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4 font-mono text-indigo-400">{shift.id}</td>
                    <td className="py-3.5 px-4 font-semibold text-white">@{shift.robloxUsername}</td>
                    <td className="py-3.5 px-4 text-slate-300">{shift.type}</td>
                    <td className="py-3.5 px-4 text-slate-400">{shift.startTime}</td>
                    <td className="py-3.5 px-4 text-slate-300 font-mono">{shift.durationMinutes} mins</td>
                    <td className="py-3.5 px-4 font-bold text-white">{shift.participantsCount} Staff</td>
                    <td className="py-3.5 px-4">
                      <Badge variant={shift.status === 'Completed' ? 'emerald' : 'rose'}>{shift.status}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CREATE SHIFT MODAL */}
      <Modal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="Host New Shift"
        subtitle="Start an active floor shift or training session in game"
        maxWidth="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Shift Host Roblox Username</label>
            <input
              type="text"
              required
              value={formRoblox}
              onChange={(e) => setFormRoblox(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Shift Type</label>
            <select
              value={formType}
              onChange={(e) => setFormType(e.target.value as any)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
            >
              <option value="Regular Shift">Regular Shift</option>
              <option value="Training Session">Training Session</option>
              <option value="Inspection">Inspection</option>
              <option value="Special Event">Special Event</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Server Notes / Objective</label>
            <textarea
              rows={3}
              placeholder="e.g. Peak hour rush shift. Focus on register turnaround times."
              value={formNotes}
              onChange={(e) => setFormNotes(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 resize-none"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs transition-colors shadow-lg shadow-indigo-600/20"
          >
            Launch Active Shift
          </button>
        </form>
      </Modal>
    </div>
  );
};
