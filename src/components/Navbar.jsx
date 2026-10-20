import React from 'react';
import { LayoutDashboard, Camera, Mic, FileText, Users, PhoneCall } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab }) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'camera', label: 'Scan', icon: Camera },
    { id: 'voice', label: 'Voice', icon: Mic },
    { id: 'ocr', label: 'Reports', icon: FileText },
    { id: 'patients', label: 'Patients', icon: Users },
    { id: 'emergency', label: '108 SOS', icon: PhoneCall, isEmergency: true },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[#0D0D0D]/95 backdrop-blur-md border-t border-[#222222] px-2 py-2 sm:py-2.5">
      <div className="max-w-3xl mx-auto flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          const isEmergency = item.isEmergency;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center gap-1 px-2.5 sm:px-3.5 py-1.5 rounded-xl transition-all duration-150 ${
                isActive
                  ? isEmergency
                    ? 'text-red-400 bg-red-950/60 border border-red-700/60 shadow-lg shadow-red-950/40'
                    : 'text-emerald-400 bg-[#1A1A1A] border border-[#333333]'
                  : isEmergency
                    ? 'text-red-400/90 hover:text-red-300 hover:bg-red-950/30'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-[#141414]'
              }`}
            >
              <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${isEmergency && !isActive ? 'text-red-500 animate-pulse' : ''}`} />
              <span className={`text-[11px] font-medium tracking-tight ${isEmergency ? 'font-bold' : ''}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
