import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { LifeBuoy, MessageSquare, Mail, Send, CheckCircle } from 'lucide-react';

interface SupportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onToast: (title: string, message?: string) => void;
}

export const SupportModal: React.FC<SupportModalProps> = ({ isOpen, onClose, onToast }) => {
  const [submitted, setSubmitted] = useState(false);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) return;
    setSubmitted(true);
    onToast('Support Ticket Created', 'Our Veyra community team will respond via email & Discord shortly.');
    setTimeout(() => {
      setSubmitted(false);
      setSubject('');
      setMessage('');
      onClose();
    }, 1500);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Veyra Support & Help Desk" subtitle="Get in touch with our team or join our Discord community server" maxWidth="lg">
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-3">
          <a
            href="https://discord.gg"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-3 p-3.5 rounded-xl bg-indigo-950/40 border border-indigo-800/50 hover:bg-indigo-900/50 transition-colors text-left"
          >
            <div className="p-2 rounded-lg bg-indigo-600/20 text-indigo-400">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-semibold text-white">Join Support Discord</h4>
              <p className="text-[11px] text-slate-400">24/7 Community assistance</p>
            </div>
          </a>

          <div className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-left">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
              <LifeBuoy className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-semibold text-white">Average Response</h4>
              <p className="text-[11px] text-emerald-400">&lt; 15 minutes</p>
            </div>
          </div>
        </div>

        {submitted ? (
          <div className="py-8 text-center space-y-2">
            <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto" />
            <h3 className="text-base font-semibold text-white">Ticket Submitted Successfully</h3>
            <p className="text-xs text-slate-400">Ticket #VY-8923 logged for your account.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Issue Subject</label>
              <input
                type="text"
                required
                placeholder="e.g. Roblox Group Rank Sync Delay or Custom Bot Setup"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Message Details</label>
              <textarea
                required
                rows={4}
                placeholder="Describe your community setup or question..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs flex items-center justify-center gap-2 transition-colors shadow-lg shadow-indigo-600/20"
            >
              <Send className="w-4 h-4" /> Send Ticket to Veyra Support
            </button>
          </form>
        )}
      </div>
    </Modal>
  );
};
