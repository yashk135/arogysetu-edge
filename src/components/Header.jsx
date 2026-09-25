import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff, ShieldCheck, Activity } from 'lucide-react';

export default function Header() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-[#080808]/95 backdrop-blur-md border-b border-[#222222] px-4 py-3">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#161616] border border-[#2E2E2E] flex items-center justify-center text-emerald-400">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-heading font-extrabold text-lg tracking-tight text-white">
                ArogyaSetu <span className="text-emerald-400">Edge</span>
              </span>
            </div>
            <p className="text-[11px] text-zinc-400 hidden sm:block">
              Healthcare Navigation & Triage Platform
            </p>
          </div>
        </div>

        {/* Status Indicators */}
        <div className="flex items-center gap-3">
          {/* Network Status Pill */}
          <div
            className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border ${
              isOnline
                ? 'bg-[#121814] border-emerald-900/60 text-emerald-400'
                : 'bg-[#1F1712] border-amber-900/60 text-amber-400'
            }`}
          >
            {isOnline ? (
              <>
                <Wifi className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Online Sync Enabled</span>
                <span className="sm:hidden">Online</span>
              </>
            ) : (
              <>
                <WifiOff className="w-3.5 h-3.5" />
                <span>Offline Enabled</span>
              </>
            )}
          </div>

          {/* ABDM Readiness Badge */}
          <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#121212] border border-[#2A2A2A] text-zinc-300 text-xs font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>ABDM Standard</span>
          </div>
        </div>

      </div>
    </header>
  );
}
