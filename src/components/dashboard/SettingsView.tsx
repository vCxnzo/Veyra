import React, { useState } from 'react';
import { 
  Settings, 
  Building2, 
  Gamepad2, 
  Bot, 
  Users, 
  Activity, 
  CheckSquare, 
  Layers, 
  Lock, 
  ShieldAlert, 
  FileText, 
  Ticket, 
  CreditCard, 
  Save, 
  Key, 
  Check 
} from 'lucide-react';
import { Community } from '../../types';
import { Badge } from '../common/Badge';

interface SettingsViewProps {
  community: Community;
  onToast: (title: string, message?: string) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ community, onToast }) => {
  const [activeCategory, setActiveCategory] = useState<
    | 'general'
    | 'community'
    | 'roblox'
    | 'discord'
    | 'staff'
    | 'activity'
    | 'quotas'
    | 'departments'
    | 'permissions'
    | 'moderation'
    | 'applications'
    | 'tickets'
    | 'billing'
  >('general');

  // Form states
  const [communityName, setCommunityName] = useState(community.name);
  const [robloxGroupId, setRobloxGroupId] = useState(community.robloxGroupId);
  const [discordWebhookUrl, setDiscordWebhookUrl] = useState('https://discord.com/api/webhooks/129038201/xz_key');
  const [autoPromote, setAutoPromote] = useState(true);
  const [quotaLockout, setQuotaLockout] = useState(true);

  const categories = [
    { id: 'general', label: 'General', icon: Settings },
    { id: 'community', label: 'Community', icon: Building2 },
    { id: 'roblox', label: 'Roblox Integration', icon: Gamepad2 },
    { id: 'discord', label: 'Discord Server', icon: Bot },
    { id: 'staff', label: 'Staff Configuration', icon: Users },
    { id: 'activity', label: 'Activity Tracking', icon: Activity },
    { id: 'quotas', label: 'Quotas', icon: CheckSquare },
    { id: 'departments', label: 'Departments', icon: Layers },
    { id: 'permissions', label: 'Permissions & Roles', icon: Lock },
    { id: 'moderation', label: 'Moderation Rules', icon: ShieldAlert },
    { id: 'applications', label: 'Applications', icon: FileText },
    { id: 'tickets', label: 'Tickets System', icon: Ticket },
    { id: 'billing', label: 'Billing & Subscriptions', icon: CreditCard },
  ];

  const handleSave = () => {
    onToast('Settings Saved', 'Community configuration updated successfully.');
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Community Settings</h1>
          <p className="text-xs text-slate-400 mt-1">Configure group integrations, webhooks, quotas, and subscription plan.</p>
        </div>
        <button
          onClick={handleSave}
          className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs shadow-lg shadow-indigo-600/20 transition-all flex items-center gap-2"
        >
          <Save className="w-4 h-4" /> Save Settings
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* Secondary Category Navigation */}
        <div className="lg:col-span-1 p-2 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id as any)}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white font-semibold shadow-md shadow-indigo-600/20'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span className="truncate">{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content Pane */}
        <div className="lg:col-span-3 p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-6">
          {/* GENERAL */}
          {activeCategory === 'general' && (
            <div className="space-y-4 text-xs">
              <h3 className="text-sm font-bold text-white">General Settings</h3>
              <div>
                <label className="block text-slate-300 mb-1">Platform Display Name</label>
                <input
                  type="text"
                  value={communityName}
                  onChange={(e) => setCommunityName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-slate-300 mb-1">Timezone Preference</label>
                <select className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-indigo-500">
                  <option value="EST">Eastern Standard Time (EST / UTC-5)</option>
                  <option value="PST">Pacific Standard Time (PST / UTC-8)</option>
                  <option value="GMT">Greenwich Mean Time (GMT / UTC+0)</option>
                </select>
              </div>
            </div>
          )}

          {/* DISCORD */}
          {activeCategory === 'discord' && (
            <div className="space-y-4 text-xs">
              <h3 className="text-sm font-bold text-white">Discord Bot & Webhooks</h3>
              <div>
                <label className="block text-slate-300 mb-1">Discord Audit Log Webhook URL</label>
                <input
                  type="text"
                  value={discordWebhookUrl}
                  onChange={(e) => setDiscordWebhookUrl(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-indigo-500 font-mono"
                />
              </div>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="font-bold text-white block">Veyra Bot Connection</span>
                  <span className="text-slate-500">Server ID: {community.discordServerId}</span>
                </div>
                <Badge variant="emerald">Online & Authorized</Badge>
              </div>
            </div>
          )}

          {/* BILLING */}
          {activeCategory === 'billing' && (
            <div className="space-y-6 text-xs">
              <div>
                <h3 className="text-sm font-bold text-white">Current Subscription Plan</h3>
                <p className="text-slate-400">Manage payment methods, billing history, and tier upgrades.</p>
              </div>

              <div className="p-5 rounded-xl bg-gradient-to-r from-indigo-950 to-slate-950 border border-indigo-500/40 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-white">{community.plan} PLAN</span>
                    <Badge variant="purple">Active Tier</Badge>
                  </div>
                  <p className="text-slate-400 mt-1">$9.99 / month • Renews on August 23, 2026</p>
                </div>
                <button
                  onClick={() => onToast('Stripe Portal', 'Opening Stripe subscription billing management...')}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition-colors"
                >
                  Manage Subscription
                </button>
              </div>
            </div>
          )}

          {/* OTHER CATEGORIES FALLBACK UI */}
          {activeCategory !== 'general' && activeCategory !== 'discord' && activeCategory !== 'billing' && (
            <div className="space-y-4 text-xs">
              <h3 className="text-sm font-bold text-white capitalize">{activeCategory} Configuration</h3>
              <p className="text-slate-400">Configure parameters for {activeCategory} operations in {community.name}.</p>
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-slate-300 font-medium">Automatic Execution</span>
                  <input type="checkbox" defaultChecked className="accent-indigo-600 w-4 h-4 cursor-pointer" />
                </div>
                <div className="flex items-center justify-between border-t border-slate-800 pt-3">
                  <span className="text-slate-300 font-medium">Strict Compliance Mode</span>
                  <input type="checkbox" defaultChecked className="accent-indigo-600 w-4 h-4 cursor-pointer" />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
