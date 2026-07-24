import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Search, BookOpen, Bot, Shield, Layers, Code, ExternalLink } from 'lucide-react';

interface DocsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DocsModal: React.FC<DocsModalProps> = ({ isOpen, onClose }) => {
  const [activeDoc, setActiveDoc] = useState('getting-started');
  const [searchQuery, setSearchQuery] = useState('');

  const docArticles = [
    {
      id: 'getting-started',
      title: 'Quick Start Guide',
      category: 'Basics',
      icon: BookOpen,
      content: `Welcome to Veyra! This guide will walk you through setting up your Roblox group and Discord server in under 5 minutes.

1. Connect your Roblox Group: Go to Dashboard > Roblox Integration and authorize your group using Roblox Open Cloud API credentials or cookie verification.
2. Link your Discord Server: Add the Veyra Discord Bot to your Discord server and set up staff command permissions.
3. Configure Rank Sync: Map your Roblox Group Ranks (e.g. Rank 255 -> Executive) directly to Discord Roles so role assignment happens in real-time.`,
    },
    {
      id: 'discord-bot',
      title: 'Discord Bot & Commands',
      category: 'Discord',
      icon: Bot,
      content: `The Veyra Discord bot powers real-time shift hosting, staff activity logging, and warnings directly inside your Discord channels.

Key Commands:
• /shift start [type] - Launches a shift and creates an active shift tracker card in your web dashboard.
• /quota check - Allows staff to view their remaining shifts and training requirement progress.
• /warn [user] [reason] - Log an official staff disciplinary warning synced to the Veyra Moderation portal.`,
    },
    {
      id: 'rank-sync',
      title: 'Roblox Rank Synchronization',
      category: 'Roblox',
      icon: Shield,
      content: `Automate Discord roles based on Roblox group ranks with instant webhooks.

• Auto-Promotion: When a user is promoted on Roblox, Veyra updates their Discord role automatically.
• Rank Locks: Protect high-ranking roles against unauthorized manually assigned Discord roles.
• Member Verification: New members verify via Bloxlink or Veyra web verification.`,
    },
    {
      id: 'open-cloud',
      title: 'Roblox Open Cloud Setup',
      category: 'Developer API',
      icon: Code,
      content: `Veyra utilizes secure Roblox Open Cloud API keys with minimum scope permissions:

• Universe Places API - To fetch active player counts and server instances.
• Group Membership API - To execute rank changes and promote staff directly from the web dashboard.
• Audit Logs API - To archive group activity for compliance logs.`,
    },
  ];

  const filteredDocs = docArticles.filter(
    (doc) =>
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedArticle = docArticles.find((d) => d.id === activeDoc) || docArticles[0];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Veyra Documentation" subtitle="Guides, API references, and bot setup instructions" maxWidth="4xl">
      <div className="flex flex-col md:flex-row gap-6 min-h-[420px]">
        {/* Sidebar */}
        <div className="w-full md:w-64 shrink-0 flex flex-col gap-4 border-b md:border-b-0 md:border-r border-slate-800 pr-0 md:pr-4 pb-4 md:pb-0">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search docs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="flex flex-col gap-1 overflow-y-auto">
            {filteredDocs.map((doc) => {
              const Icon = doc.icon;
              return (
                <button
                  key={doc.id}
                  onClick={() => setActiveDoc(doc.id)}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-left transition-colors ${
                    activeDoc === doc.id
                      ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0 text-slate-400" />
                  <span className="truncate">{doc.title}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content View */}
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                {selectedArticle.category}
              </span>
            </div>
            <h2 className="text-xl font-semibold text-white mb-4">{selectedArticle.title}</h2>
            <div className="text-xs text-slate-300 leading-relaxed space-y-3 whitespace-pre-line bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
              {selectedArticle.content}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span>Need help with custom bot hosting?</span>
            <button
              onClick={onClose}
              className="inline-flex items-center gap-1 text-indigo-400 hover:text-indigo-300 font-medium"
            >
              Open Full Docs Site <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
