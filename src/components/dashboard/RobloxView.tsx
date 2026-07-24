import React, { useState } from 'react';
import { 
  Gamepad2, 
  RefreshCw, 
  ShieldCheck, 
  Sliders, 
  CheckCircle, 
  ExternalLink, 
  Key, 
  Layers 
} from 'lucide-react';
import { RankSyncRule, Community } from '../../types';
import { Badge } from '../common/Badge';

interface RobloxViewProps {
  community: Community;
  rankSyncRules: RankSyncRule[];
  onToggleAutoSync: (id: string) => void;
  onToast: (title: string, message?: string) => void;
}

export const RobloxView: React.FC<RobloxViewProps> = ({
  community,
  rankSyncRules,
  onToggleAutoSync,
  onToast,
}) => {
  const [syncing, setSyncing] = useState(false);

  const handleSyncNow = () => {
    setSyncing(true);
    setTimeout(() => {
      setSyncing(false);
      onToast('Group Sync Complete', `Synchronized ${community.robloxGroupName} member roles.`);
    }, 1200);
  };

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Roblox Group & Rank Integration</h1>
          <p className="text-xs text-slate-400 mt-1">Manage Open Cloud API tokens, map Roblox group ranks to Discord roles, and force synchronization.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleSyncNow}
            disabled={syncing}
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs shadow-lg shadow-indigo-600/20 transition-all flex items-center gap-2 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`} />
            {syncing ? 'Syncing Group...' : 'Sync Group Now'}
          </button>
        </div>
      </div>

      {/* Connected Group Card */}
      <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-rose-600 to-indigo-600 p-0.5 shadow-xl flex items-center justify-center">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <Gamepad2 className="w-7 h-7 text-white" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-white">{community.robloxGroupName}</h2>
              <Badge variant="emerald">Connected & Verified</Badge>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Group ID: <span className="font-mono text-indigo-300">{community.robloxGroupId}</span> • Members: <span className="font-semibold text-white">{community.memberCount.toLocaleString()}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onToast('Open Cloud Settings', 'Managing Roblox Open Cloud API scopes.')}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs border border-slate-700 transition-colors flex items-center gap-1.5"
          >
            <Key className="w-3.5 h-3.5" /> API Keys
          </button>
          <a
            href={`https://www.roblox.com/groups/${community.robloxGroupId}`}
            target="_blank"
            rel="noreferrer"
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs border border-slate-700 transition-colors flex items-center gap-1.5"
          >
            Roblox Group <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Rank Sync Table */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-sm font-semibold text-white">Roblox Rank Sync Rules</h3>
            <p className="text-xs text-slate-400">Map group rank numbers directly to Discord server roles.</p>
          </div>
          <button
            onClick={() => onToast('Sync Rule Added', 'New rank sync mapping created.')}
            className="px-3 py-1.5 rounded-lg bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 font-medium text-xs hover:bg-indigo-600/30 transition-colors"
          >
            + Add Sync Rule
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-[11px] font-semibold text-slate-400 uppercase tracking-wider bg-slate-950/60">
                <th className="py-3 px-4">Roblox Rank ID & Name</th>
                <th className="py-3 px-4">Mapped Discord Role</th>
                <th className="py-3 px-4">Synced Users</th>
                <th className="py-3 px-4">Auto-Sync</th>
                <th className="py-3 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-xs">
              {rankSyncRules.map((rule) => (
                <tr key={rule.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-white">
                    Rank {rule.robloxRankId} - {rule.robloxRankName}
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 font-medium text-slate-200">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: rule.discordColor }} />
                      {rule.discordRoleName}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 font-mono text-slate-300">{rule.syncedUsersCount} Members</td>

                  <td className="py-3.5 px-4">
                    <button
                      onClick={() => onToggleAutoSync(rule.id)}
                      className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        rule.autoSync ? 'bg-indigo-600' : 'bg-slate-800'
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                          rule.autoSync ? 'translate-x-4' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <Badge variant={rule.autoSync ? 'emerald' : 'slate'}>
                      {rule.autoSync ? 'Active Sync' : 'Manual'}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Account Verification Section */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
        <h3 className="text-sm font-semibold text-white">Roblox Member Account Verification</h3>
        <p className="text-xs text-slate-400">Members verify via Bloxlink or Veyra Web Oath to unlock Discord rank permissions.</p>
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
          <div>
            <span className="font-bold text-white block">Verification Method: Bloxlink API v4 & Veyra Verification</span>
            <span className="text-slate-500">1,202 / 1,284 community members verified.</span>
          </div>
          <button
            onClick={() => onToast('Verification Code', 'Custom /verify command code regenerated.')}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium"
          >
            Manage Verification Bot
          </button>
        </div>
      </div>
    </div>
  );
};
