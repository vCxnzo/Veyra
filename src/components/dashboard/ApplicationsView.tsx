import React, { useState } from 'react';
import { 
  FileText, 
  Plus, 
  CheckCircle, 
  XCircle, 
  HelpCircle, 
  User, 
  Calendar, 
  ChevronRight,
  MessageSquare
} from 'lucide-react';
import { Application, ApplicationStatus } from '../../types';
import { Badge } from '../common/Badge';
import { Modal } from '../common/Modal';

interface ApplicationsViewProps {
  applications: Application[];
  onApproveApplication: (id: string, notes?: string) => void;
  onDenyApplication: (id: string, notes?: string) => void;
  onRequestInterview: (id: string) => void;
  onToast: (title: string, message?: string) => void;
}

export const ApplicationsView: React.FC<ApplicationsViewProps> = ({
  applications,
  onApproveApplication,
  onDenyApplication,
  onRequestInterview,
  onToast,
}) => {
  const [filterStatus, setFilterStatus] = useState<'All' | 'Pending' | 'Approved' | 'Denied'>('Pending');
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [reviewerNotes, setReviewerNotes] = useState('');
  const [createFormModalOpen, setCreateFormModalOpen] = useState(false);

  const filteredApps = applications.filter((app) => filterStatus === 'All' || app.status === filterStatus);

  const handleApprove = () => {
    if (!selectedApp) return;
    onApproveApplication(selectedApp.id, reviewerNotes);
    onToast('Application Approved', `@${selectedApp.robloxUsername} staff application accepted.`);
    setSelectedApp(null);
    setReviewerNotes('');
  };

  const handleDeny = () => {
    if (!selectedApp) return;
    onDenyApplication(selectedApp.id, reviewerNotes);
    onToast('Application Denied', `@${selectedApp.robloxUsername} staff application rejected.`);
    setSelectedApp(null);
    setReviewerNotes('');
  };

  const handleInterview = () => {
    if (!selectedApp) return;
    onRequestInterview(selectedApp.id);
    onToast('Interview Requested', `Discord DM sent to @${selectedApp.discordTag}`);
    setSelectedApp(null);
  };

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">HR Applications Portal</h1>
          <p className="text-xs text-slate-400 mt-1">Review staff submissions, grade questionnaires, and trigger automatic rank sync.</p>
        </div>
        <button
          onClick={() => setCreateFormModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs shadow-lg shadow-indigo-600/20 transition-all flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" /> Create Application Form
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex border-b border-slate-800 gap-6 text-xs font-medium text-slate-400">
        {(['Pending', 'Approved', 'Denied', 'All'] as const).map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`pb-3 transition-colors ${
              filterStatus === status
                ? 'text-indigo-400 border-b-2 border-indigo-500 font-bold'
                : 'hover:text-slate-200'
            }`}
          >
            {status} Applications ({applications.filter((a) => status === 'All' || a.status === status).length})
          </button>
        ))}
      </div>

      {/* Applications Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredApps.map((app) => (
          <div
            key={app.id}
            onClick={() => setSelectedApp(app)}
            className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all cursor-pointer space-y-4 group shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors">
                  {app.applicantName}
                </h3>
                <p className="text-xs text-slate-400">Roblox: @{app.robloxUsername}</p>
              </div>
              <Badge
                variant={
                  app.status === 'Approved'
                    ? 'emerald'
                    : app.status === 'Denied'
                    ? 'rose'
                    : app.status === 'Interview Requested'
                    ? 'blue'
                    : 'amber'
                }
              >
                {app.status}
              </Badge>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5 text-xs text-slate-300">
              <div className="flex justify-between">
                <span className="text-slate-500">Position Type:</span>
                <span className="font-semibold text-indigo-300">{app.type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Submitted Date:</span>
                <span className="font-mono text-slate-400">{app.submittedDate}</span>
              </div>
              {app.reviewer && (
                <div className="flex justify-between border-t border-slate-800/80 pt-1.5 mt-1.5">
                  <span className="text-slate-500">Reviewer:</span>
                  <span className="font-medium text-slate-300">{app.reviewer}</span>
                </div>
              )}
            </div>

            <button className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors flex items-center justify-center gap-1.5">
              Review Application Details <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>

      {/* FULL APPLICATION REVIEW MODAL */}
      {selectedApp && (
        <Modal
          isOpen={!!selectedApp}
          onClose={() => setSelectedApp(null)}
          title={`Review Submission: ${selectedApp.applicantName}`}
          subtitle={`Position: ${selectedApp.type} • Roblox: @${selectedApp.robloxUsername}`}
          maxWidth="2xl"
        >
          <div className="space-y-6">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
              <div>
                <span className="text-slate-400 block">Applicant Discord Tag</span>
                <span className="font-bold text-white text-sm">{selectedApp.discordTag}</span>
              </div>
              <Badge variant={selectedApp.status === 'Approved' ? 'emerald' : 'amber'}>
                {selectedApp.status}
              </Badge>
            </div>

            {/* Questions & Answers */}
            <div className="space-y-4">
              <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Questionnaire Responses</h4>
              {selectedApp.answers.map((qa, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5 text-xs">
                  <p className="font-semibold text-indigo-300">Q{idx + 1}: {qa.question}</p>
                  <p className="text-slate-200 leading-relaxed pl-2 border-l-2 border-indigo-500/30">
                    "{qa.answer}"
                  </p>
                </div>
              ))}
            </div>

            {/* Reviewer Notes Field */}
            {selectedApp.status === 'Pending' && (
              <div className="space-y-2">
                <label className="block text-xs font-medium text-slate-300">HR Reviewer Notes</label>
                <textarea
                  rows={2}
                  placeholder="Optional notes for HR audit log..."
                  value={reviewerNotes}
                  onChange={(e) => setReviewerNotes(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 resize-none"
                />
              </div>
            )}

            {/* Action Buttons */}
            {selectedApp.status === 'Pending' && (
              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={handleApprove}
                  className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs transition-colors flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20"
                >
                  <CheckCircle className="w-4 h-4" /> Approve & Promote
                </button>

                <button
                  onClick={handleInterview}
                  className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs transition-colors flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20"
                >
                  <MessageSquare className="w-4 h-4" /> Request Interview
                </button>

                <button
                  onClick={handleDeny}
                  className="py-2.5 px-4 rounded-xl bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/30 font-medium text-xs transition-colors flex items-center justify-center gap-2"
                >
                  <XCircle className="w-4 h-4" /> Reject
                </button>
              </div>
            )}
          </div>
        </Modal>
      )}

      {/* CREATE FORM MODAL */}
      <Modal
        isOpen={createFormModalOpen}
        onClose={() => setCreateFormModalOpen(false)}
        title="Create HR Application Form"
        subtitle="Publish a new staff recruitment form linked to Discord"
        maxWidth="md"
      >
        <div className="space-y-4 text-xs">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Form Title</label>
            <input
              type="text"
              placeholder="e.g. Q3 Shift Supervisor Application"
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Target Roblox Rank</label>
            <select className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500">
              <option value="Junior Staff">Junior Staff</option>
              <option value="Shift Supervisor">Shift Supervisor</option>
            </select>
          </div>

          <button
            onClick={() => {
              onToast('Form Created', 'New application form published to Discord channel #applications.');
              setCreateFormModalOpen(false);
            }}
            className="w-full py-2.5 rounded-xl bg-indigo-600 text-white font-medium text-xs transition-colors shadow-lg shadow-indigo-600/20 mt-2"
          >
            Publish Form
          </button>
        </div>
      </Modal>
    </div>
  );
};
