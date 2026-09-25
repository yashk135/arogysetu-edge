import React from 'react';
import { LayoutDashboard, Camera, Mic, FileText, Users } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab }) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'camera', label: 'Camera Scan', icon: Camera },
    { id: 'voice', label: 'Voice Intake', icon: Mic },
    { id: 'ocr', label: 'Reports', icon: FileText },
    { id: 'patients', label: 'Patients', icon: Users },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[#0D0D0D]/95 backdrop-blur-md border-t border-[#222222] px-3 py-2 sm:py-2.5">
      <div className="max-w-3xl mx-auto flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center gap-1 px-4 py-1.5 rounded-xl transition-all duration-150 ${
                isActive
                  ? 'text-emerald-400 bg-[#1A1A1A] border border-[#333333]'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-[#141414]'
              }`}
            >
              <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="text-[11px] font-medium tracking-tight">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
