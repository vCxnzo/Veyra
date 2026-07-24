import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Users, 
  BarChart3, 
  Bot, 
  ShieldCheck, 
  FileText, 
  Clock, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles, 
  Menu, 
  X, 
  Zap, 
  Layers, 
  Check, 
  Activity,
  UserCheck,
  TrendingUp,
  Sliders,
  ChevronRight
} from 'lucide-react';
import { DocsModal } from './DocsModal';
import { SupportModal } from './SupportModal';

interface LandingPageProps {
  onNavigateLogin: () => void;
  onNavigateDashboard: () => void;
  onToast: (title: string, message?: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onNavigateLogin,
  onNavigateDashboard,
  onToast,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [docsOpen, setDocsOpen] = useState(false);
  const [supportOpen, setSupportOpen] = useState(false);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500 selection:text-white relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-b from-indigo-600/15 via-purple-600/10 to-transparent blur-3xl pointer-events-none rounded-full" />

      {/* Navigation Bar */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-slate-950/80 border-b border-slate-800/80 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-500 p-0.5 shadow-lg shadow-indigo-500/20 flex items-center justify-center">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <span className="text-xl font-black bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">V</span>
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight text-white flex items-center gap-1.5">
                Veyra <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">SaaS</span>
              </span>
              <span className="text-[10px] text-slate-400 -mt-1 font-mono">Roblox OS</span>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            <button onClick={() => scrollToSection('features')} className="hover:text-white transition-colors">Features</button>
            <button onClick={() => scrollToSection('how-it-works')} className="hover:text-white transition-colors">How It Works</button>
            <button onClick={() => scrollToSection('preview')} className="hover:text-white transition-colors">Dashboard</button>
            <button onClick={() => scrollToSection('pricing')} className="hover:text-white transition-colors">Pricing</button>
            <button onClick={() => setDocsOpen(true)} className="hover:text-white transition-colors">Documentation</button>
            <button onClick={() => setSupportOpen(true)} className="hover:text-white transition-colors">Support</button>
          </nav>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={onNavigateLogin}
              className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors"
            >
              Login
            </button>
            <button
              onClick={onNavigateDashboard}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-medium text-sm transition-all shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 flex items-center gap-2"
            >
              Get Started <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-b border-slate-800 bg-slate-950 px-4 py-6 space-y-4"
          >
            <button onClick={() => scrollToSection('features')} className="block w-full text-left text-sm text-slate-300 py-1">Features</button>
            <button onClick={() => scrollToSection('how-it-works')} className="block w-full text-left text-sm text-slate-300 py-1">How It Works</button>
            <button onClick={() => scrollToSection('preview')} className="block w-full text-left text-sm text-slate-300 py-1">Dashboard</button>
            <button onClick={() => scrollToSection('pricing')} className="block w-full text-left text-sm text-slate-300 py-1">Pricing</button>
            <button onClick={() => { setMobileMenuOpen(false); setDocsOpen(true); }} className="block w-full text-left text-sm text-slate-300 py-1">Documentation</button>
            <button onClick={() => { setMobileMenuOpen(false); setSupportOpen(true); }} className="block w-full text-left text-sm text-slate-300 py-1">Support</button>
            <div className="pt-4 border-t border-slate-800 flex flex-col gap-2">
              <button onClick={onNavigateLogin} className="w-full py-2.5 rounded-xl border border-slate-800 text-sm font-medium text-slate-200">
                Login
              </button>
              <button onClick={onNavigateDashboard} className="w-full py-2.5 rounded-xl bg-indigo-600 text-sm font-medium text-white">
                Get Started
              </button>
            </div>
          </motion.div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold tracking-wide"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Built for Roblox Groups & Discord Communities</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-[1.15]"
          >
            Your Roblox community.{' '}
            <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400 bg-clip-text text-transparent">
              Managed in one place.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto"
          >
            Connect your Roblox group and Discord server, manage your staff, track activity, run shifts, and keep your community organized from one powerful platform.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
          >
            <button
              onClick={onNavigateDashboard}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-base transition-all shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-2 group"
            >
              Get Started <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => scrollToSection('features')}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 font-semibold text-base transition-colors"
            >
              Explore Features
            </button>
          </motion.div>
        </div>

        {/* Hero Product Screenshot Preview */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mt-16 md:mt-24 relative rounded-2xl border border-slate-800/80 bg-slate-900/80 p-2 sm:p-4 shadow-2xl backdrop-blur-xl overflow-hidden group"
        >
          <div className="absolute top-0 left-0 right-0 h-11 bg-slate-950/90 border-b border-slate-800 flex items-center justify-between px-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-rose-500/80" />
              <div className="w-3 h-3 rounded-full bg-amber-500/80" />
              <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
              <span className="ml-2 text-xs text-slate-500 font-mono">app.veyra.io/dashboard/hazel-cafe</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> Live Group Sync
            </div>
          </div>

          {/* Mock Dashboard Hero UI preview */}
          <div className="pt-12 p-4 sm:p-6 grid grid-cols-1 md:grid-cols-4 gap-4 bg-slate-950/60 rounded-xl">
            {/* Metric Preview 1 */}
            <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                <span>Total Members</span>
                <Users className="w-4 h-4 text-indigo-400" />
              </div>
              <p className="text-2xl font-bold text-white">1,284</p>
              <span className="text-[11px] text-emerald-400 font-medium">+14% this week</span>
            </div>

            {/* Metric Preview 2 */}
            <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                <span>Active Staff</span>
                <UserCheck className="w-4 h-4 text-purple-400" />
              </div>
              <p className="text-2xl font-bold text-white">82</p>
              <span className="text-[11px] text-slate-400">5 departments active</span>
            </div>

            {/* Metric Preview 3 */}
            <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                <span>Applications</span>
                <FileText className="w-4 h-4 text-amber-400" />
              </div>
              <p className="text-2xl font-bold text-white">24</p>
              <span className="text-[11px] text-amber-400 font-medium">12 pending review</span>
            </div>

            {/* Metric Preview 4 */}
            <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                <span>Staff Activity</span>
                <Activity className="w-4 h-4 text-emerald-400" />
              </div>
              <p className="text-2xl font-bold text-white">86%</p>
              <span className="text-[11px] text-emerald-400 font-medium">+8% quota met</span>
            </div>

            {/* Active Shift Card Preview */}
            <div className="md:col-span-2 p-5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase text-indigo-400 tracking-wider flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" /> Active Shift - Main Cafe
                </span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
                  In Progress
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-semibold text-white">Hosted by @MatthewRBX</h4>
                  <p className="text-xs text-slate-400">Duration: 45 minutes • 14 Staff On Floor</p>
                </div>
                <button
                  onClick={onNavigateDashboard}
                  className="px-3 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 text-xs font-medium transition-colors"
                >
                  Join Shift
                </button>
              </div>
            </div>

            {/* Activity Stream Preview */}
            <div className="md:col-span-2 p-5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
              <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Live Activity Audit</h4>
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between text-slate-300 py-1 border-b border-slate-800/60">
                  <span className="truncate">⭐ Alex was promoted to Supervisor</span>
                  <span className="text-[10px] text-slate-500 shrink-0">10m ago</span>
                </div>
                <div className="flex items-center justify-between text-slate-300 py-1 border-b border-slate-800/60">
                  <span className="truncate">☕ Matthew completed a 45-min shift</span>
                  <span className="text-[10px] text-slate-500 shrink-0">25m ago</span>
                </div>
                <div className="flex items-center justify-between text-slate-300 py-1">
                  <span className="truncate">📝 Sarah submitted a staff application</span>
                  <span className="text-[10px] text-slate-500 shrink-0">1h ago</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 md:py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-800/60">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-indigo-400">Enterprise Capabilities</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">Everything your community staff needs</h2>
          <p className="text-slate-400 text-sm sm:text-base">Designed specifically for Roblox groups, Discord bots, HR management, and shift operations.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Feature 1 */}
          <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-slate-700 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Staff Management</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Manage your entire staff team with profiles, ranks, departments, activity history, promotions, and staff records.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-slate-700 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <BarChart3 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Activity Tracking</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Track staff activity, shifts, sessions, quotas, and performance automatically with real-time reporting.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-slate-700 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <Bot className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Roblox Integration</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Connect your Roblox group, verify accounts, synchronize ranks, and manage group data seamlessly via Open Cloud.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-slate-700 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Discord Integration</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Connect your Discord server and manage your community directly from Discord commands or the web dashboard.
            </p>
          </div>

          {/* Feature 5 */}
          <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-slate-700 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">HR Management</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Handle applications, staff reports, disciplinary records, LOAs, and HR cases in one organized system.
            </p>
          </div>

          {/* Feature 6 */}
          <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-slate-700 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <Sliders className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Moderation</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Powerful moderation tools with warnings, bans, cases, appeals, and detailed moderation logs.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 md:py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-slate-900/40 rounded-3xl border border-slate-800 my-10">
        <div className="text-center max-w-xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-indigo-400">3 Simple Steps</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">How Veyra Works</h2>
          <p className="text-slate-400 text-sm">Launch full group automation in less than 5 minutes.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Step 1 */}
          <div className="flex flex-col items-center text-center p-6 bg-slate-950 rounded-2xl border border-slate-800">
            <div className="w-12 h-12 rounded-full bg-indigo-600 text-white font-bold text-lg flex items-center justify-center mb-4 shadow-lg shadow-indigo-600/30">
              1
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Connect Roblox Group</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Enter your Group ID and Open Cloud API credentials to establish instant group data synchronization.
            </p>
          </div>

          {/* Step 2 */}
          <div className="flex flex-col items-center text-center p-6 bg-slate-950 rounded-2xl border border-slate-800">
            <div className="w-12 h-12 rounded-full bg-purple-600 text-white font-bold text-lg flex items-center justify-center mb-4 shadow-lg shadow-purple-600/30">
              2
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Connect Discord Server</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Authorize the Veyra Discord bot and map group ranks to Discord roles for automatic rank synchronization.
            </p>
          </div>

          {/* Step 3 */}
          <div className="flex flex-col items-center text-center p-6 bg-slate-950 rounded-2xl border border-slate-800">
            <div className="w-12 h-12 rounded-full bg-emerald-600 text-white font-bold text-lg flex items-center justify-center mb-4 shadow-lg shadow-emerald-600/30">
              3
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Manage Your Community</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Host shifts, review HR applications, enforce weekly quotas, and monitor detailed staff analytics.
            </p>
          </div>
        </div>
      </section>

      {/* Detailed Interactive Preview Section */}
      <section id="preview" className="py-20 md:py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="space-y-6 md:w-1/2">
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-400">Live Management Suite</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight">
              Designed for modern Roblox executives and staff teams
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Whether you run a cafe with 1,000 members or a law enforcement roleplay group with 10,000 players, Veyra gives your HR and operations teams full control.
            </p>

            <ul className="space-y-3 text-sm text-slate-300">
              <li className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>Automated weekly staff quota calculations and compliance alerts.</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>Instant Roblox group rank sync with Discord role mappings.</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>Full disciplinary audit logs, warnings, and ban appeals portal.</span>
              </li>
            </ul>

            <button
              onClick={onNavigateDashboard}
              className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition-colors flex items-center gap-2"
            >
              Open Live Dashboard Preview <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="md:w-1/2 w-full p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h4 className="text-sm font-semibold text-white">Hazel Cafe - Staff Compliance Rate</h4>
              <span className="text-xs text-indigo-400 font-mono">Week of July 2026</span>
            </div>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300 font-medium">Shift Supervisors (18 staff)</span>
                  <span className="text-emerald-400 font-bold">100% Completed</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: '100%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300 font-medium">HR Managers (12 staff)</span>
                  <span className="text-emerald-400 font-bold">95% Completed</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: '95%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300 font-medium">Senior Staff (35 staff)</span>
                  <span className="text-amber-400 font-bold">76% Completed</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full" style={{ width: '76%' }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 md:py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-800/60">
        <div className="text-center max-w-xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-indigo-400">Flexible Pricing</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">Simple, transparent plans</h2>
          <p className="text-slate-400 text-sm">Choose the tier that fits your Roblox group size and staff team scale.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {/* FREE PLAN */}
          <div className="p-8 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between hover:border-slate-700 transition-colors">
            <div>
              <div className="mb-4">
                <h3 className="text-xl font-bold text-white">FREE</h3>
                <p className="text-xs text-slate-400 mt-1">For small Roblox groups starting out</p>
              </div>
              <div className="mb-6">
                <span className="text-4xl font-extrabold text-white">$0</span>
                <span className="text-slate-400 text-xs">/month</span>
              </div>
              <ul className="space-y-3 text-xs text-slate-300 mb-8">
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Basic moderation</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Roblox account verification</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Basic Discord integration</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Basic staff management</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Basic logging</span>
                </li>
              </ul>
            </div>
            <button
              onClick={onNavigateDashboard}
              className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition-colors"
            >
              Get Started Free
            </button>
          </div>

          {/* PREMIUM PLAN (HIGHLIGHTED) */}
          <div className="p-8 rounded-2xl bg-gradient-to-b from-indigo-950/80 to-slate-900 border-2 border-indigo-500 flex flex-col justify-between shadow-2xl shadow-indigo-500/20 relative scale-105 z-10">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-indigo-500 text-white font-bold text-[10px] uppercase tracking-wider shadow-md">
              RECOMMENDED PLAN
            </div>
            <div>
              <div className="mb-4">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  PREMIUM <Sparkles className="w-4 h-4 text-amber-400" />
                </h3>
                <p className="text-xs text-indigo-300 mt-1">For active Roblox communities & staff teams</p>
              </div>
              <div className="mb-6">
                <span className="text-4xl font-extrabold text-white">$9.99</span>
                <span className="text-slate-400 text-xs">/month</span>
              </div>
              <ul className="space-y-3 text-xs text-slate-200 mb-8">
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Advanced staff management</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Activity tracking</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Shift tracking</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Quotas</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Applications</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Staff analytics</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Advanced Roblox integration</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Advanced moderation</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Historical data</span>
                </li>
              </ul>
            </div>
            <button
              onClick={onNavigateDashboard}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-xs shadow-lg shadow-indigo-600/30 transition-all"
            >
              Start Premium Trial
            </button>
          </div>

          {/* BUSINESS PLAN */}
          <div className="p-8 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between hover:border-slate-700 transition-colors">
            <div>
              <div className="mb-4">
                <h3 className="text-xl font-bold text-white">BUSINESS</h3>
                <p className="text-xs text-slate-400 mt-1">For large networks & group franchises</p>
              </div>
              <div className="mb-6">
                <span className="text-4xl font-extrabold text-white">$24.99</span>
                <span className="text-slate-400 text-xs">/month</span>
              </div>
              <ul className="space-y-3 text-xs text-slate-300 mb-8">
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Everything in Premium</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Multiple Roblox groups</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Multiple Discord servers</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Advanced analytics</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Custom branding</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Advanced automation</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Priority support</span>
                </li>
              </ul>
            </div>
            <button
              onClick={onNavigateDashboard}
              className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition-colors"
            >
              Contact Sales / Go Business
            </button>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 md:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="rounded-3xl bg-gradient-to-r from-indigo-900/60 via-purple-900/40 to-slate-900 border border-indigo-500/30 p-10 md:p-16 text-center space-y-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white">
            Ready to take control of your community?
          </h2>
          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto">
            Join hundreds of Roblox group owners and Discord staff teams using Veyra to automate operations today.
          </p>
          <div className="pt-2">
            <button
              onClick={onNavigateDashboard}
              className="px-8 py-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-base shadow-xl shadow-indigo-600/30 transition-all inline-flex items-center gap-2"
            >
              Get Started <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-xs text-slate-500 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-300 text-sm">Veyra</span>
          <span>© 2026 Veyra Platform Inc. All rights reserved.</span>
        </div>
        <div className="flex items-center gap-6 text-slate-400">
          <button onClick={() => setDocsOpen(true)} className="hover:text-white transition-colors">Documentation</button>
          <button onClick={() => setSupportOpen(true)} className="hover:text-white transition-colors">Support</button>
          <button onClick={onNavigateLogin} className="hover:text-white transition-colors">Login</button>
          <button onClick={onNavigateDashboard} className="hover:text-white transition-colors">Dashboard</button>
        </div>
      </footer>

      {/* Modals */}
      <DocsModal isOpen={docsOpen} onClose={() => setDocsOpen(false)} />
      <SupportModal isOpen={supportOpen} onClose={() => setSupportOpen(false)} onToast={onToast} />
    </div>
  );
};
