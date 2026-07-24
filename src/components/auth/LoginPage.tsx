import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Shield, ArrowLeft, Lock } from 'lucide-react';

interface LoginPageProps {
  onLoginSuccess: (provider: 'roblox' | 'discord') => void;
  onNavigateHome: () => void;
}

// IMPORTANT:
// Replace this with your actual Render backend URL.
// Example:
// https://veyra-api.onrender.com
const API_URL = 'https://veyra-1l4l.onrender.com';

const LoginPage: React.FC<LoginPageProps> = ({
  onLoginSuccess,
  onNavigateHome,
}) => {
  const [loadingProvider, setLoadingProvider] = useState<
    'roblox' | 'discord' | null
  >(null);

const API_URL = 'https://veyra-1l4l.onrender.com';

const handleAuth = (provider: 'roblox' | 'discord') => {
  setLoadingProvider(provider);

  window.location.href = `${API_URL}/auth/${provider}`;
};

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col justify-between p-4 sm:p-6 relative overflow-hidden">

      {/* Background Ambient Lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Bar */}
      <div className="max-w-7xl mx-auto w-full flex items-center justify-between z-10">

        <button
          onClick={onNavigateHome}
          className="inline-flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-white transition-colors bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-800"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Veyra Home
        </button>

        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center font-black text-white text-sm">
            V
          </div>

          <span className="font-bold text-white text-base">
            Veyra
          </span>
        </div>
      </div>

      {/* Main Login Card */}
      <div className="max-w-md w-full mx-auto my-auto z-10 py-8">

        <motion.div
          initial={{
            opacity: 0,
            scale: 0.95,
            y: 10,
          }}
          animate={{
            opacity: 1,
            scale: 1,
            y: 0,
          }}
          transition={{
            duration: 0.25,
          }}
          className="bg-slate-900/90 border border-slate-800 rounded-2xl p-8 shadow-2xl backdrop-blur-xl space-y-6"
        >

          {/* Header */}
          <div className="text-center space-y-2">

            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto mb-3">
              <Shield className="w-6 h-6" />
            </div>

            <h1 className="text-2xl font-bold text-white tracking-tight">
              Welcome back.
            </h1>

            <p className="text-xs text-slate-400">
              Sign in to manage your Roblox community.
            </p>

          </div>

          {/* Login Buttons */}
          <div className="space-y-3 pt-2">

            {/* Roblox Login */}
            <button
              type="button"
              onClick={() => handleAuth('roblox')}
              disabled={loadingProvider !== null}
              className="w-full py-3.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700/80 border border-slate-700 text-white font-medium text-sm flex items-center justify-center gap-3 transition-all hover:border-slate-600 disabled:opacity-50 disabled:cursor-not-allowed group"
            >

              {loadingProvider === 'roblox' ? (
                <div className="w-5 h-5 border-2 border-slate-400 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <div className="w-5 h-5 bg-rose-500 text-white font-black text-[10px] rounded flex items-center justify-center rotate-12 group-hover:rotate-0 transition-transform">
                    R
                  </div>

                  <span>
                    Continue with Roblox
                  </span>
                </>
              )}

            </button>

            {/* Discord Login */}
            <button
              type="button"
              onClick={() => handleAuth('discord')}
              disabled={loadingProvider !== null}
              className="w-full py-3.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm flex items-center justify-center gap-3 transition-all shadow-lg shadow-indigo-600/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >

              {loadingProvider === 'discord' ? (
                <div className="w-5 h-5 border-2 border-indigo-200 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <svg
                    className="w-5 h-5 fill-current"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z" />
                  </svg>

                  <span>
                    Continue with Discord
                  </span>
                </>
              )}

            </button>

          </div>

          {/* Security Notice */}
          <div className="pt-2 text-center border-t border-slate-800">

            <p className="text-[11px] text-slate-400 leading-relaxed flex items-center justify-center gap-1.5">

              <Lock className="w-3.5 h-3.5 text-slate-500 shrink-0" />

              <span>
                You can connect both your Roblox and Discord accounts after signing in.
              </span>

            </p>

          </div>

        </motion.div>

      </div>

      {/* Footer */}
      <div className="text-center text-[11px] text-slate-500 z-10">
        Veyra Security Standard • OAuth 2.0 Encrypted Sessions
      </div>

    </div>
  );
};

export { LoginPage };
export default LoginPage;