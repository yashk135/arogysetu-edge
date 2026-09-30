import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff, ShieldCheck, Activity, Key, CheckCircle } from 'lucide-react';
import { getApiKey, saveApiKey, hasApiKey } from '../services/geminiService';

export default function Header() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState(getApiKey());
  const [keySavedMessage, setKeySavedMessage] = useState('');

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

  const handleSaveKey = (e) => {
    e?.preventDefault();
    saveApiKey(apiKeyInput);
    setKeySavedMessage('✅ API Key updated successfully!');
    setTimeout(() => {
      setKeySavedMessage('');
      setShowKeyModal(false);
    }, 1200);
  };

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
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Gemini API Key Button */}
          <button
            onClick={() => setShowKeyModal(true)}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border transition-all ${
              hasApiKey()
                ? 'bg-[#121915] border-emerald-800/60 text-emerald-300 hover:border-emerald-500'
                : 'bg-[#1F1414] border-red-900/60 text-red-300 hover:border-red-500 animate-pulse'
            }`}
            title="Configure Gemini API Key"
          >
            <Key className="w-3.5 h-3.5" />
            <span>{hasApiKey() ? 'API Key Active' : 'Set API Key'}</span>
          </button>

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
                <span className="hidden sm:inline">Online Sync</span>
                <span className="sm:hidden">Online</span>
              </>
            ) : (
              <>
                <WifiOff className="w-3.5 h-3.5" />
                <span>Offline</span>
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

      {/* API Key Modal */}
      {showKeyModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#111111] border border-[#2E2E2E] rounded-2xl p-5 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#242424] pb-3">
              <div className="flex items-center gap-2">
                <Key className="w-4 h-4 text-emerald-400" />
                <h3 className="font-heading font-bold text-sm text-white">Google Gemini API Key Config</h3>
              </div>
              <button
                onClick={() => setShowKeyModal(false)}
                className="text-zinc-400 hover:text-white font-bold text-sm"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-zinc-400 leading-relaxed">
              Pasting your free Google Gemini API Key enables live Vision AI image diagnostic, voice triage, medical report OCR, and multi-lingual translation.
            </p>

            <form onSubmit={handleSaveKey} className="space-y-3">
              <div>
                <label className="block text-[11px] font-medium text-zinc-300 mb-1">
                  Gemini API Key (AI Studio)
                </label>
                <input
                  type="password"
                  required
                  placeholder="AIzaSy..."
                  value={apiKeyInput}
                  onChange={(e) => setApiKeyInput(e.target.value)}
                  className="w-full bg-[#181818] border border-[#2E2E2E] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              {keySavedMessage && (
                <div className="p-2.5 rounded-xl bg-emerald-950/60 border border-emerald-800/60 text-xs text-emerald-300 font-medium flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  <span>{keySavedMessage}</span>
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#242424]">
                <button
                  type="button"
                  onClick={() => setShowKeyModal(false)}
                  className="px-3.5 py-1.5 rounded-xl text-xs text-zinc-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-medium text-xs shadow-md transition-all"
                >
                  Save API Key
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </header>
  );
}
