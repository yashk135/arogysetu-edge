import React from 'react';
import { Camera, Mic, FileText, Users, Smartphone, Activity } from 'lucide-react';

export default function Dashboard({ setActiveTab }) {
  return (
    <div className="space-y-6 pb-24 max-w-5xl mx-auto">
      {/* Hero Banner — Carbon Black Enterprise SaaS Style */}
      <div className="relative overflow-hidden rounded-2xl bg-[#111111] border border-[#242424] p-6 sm:p-8">
        <div className="relative z-10 space-y-4 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1A1A1A] border border-[#333333] text-zinc-300 text-xs font-medium">
            <Activity className="w-3.5 h-3.5 text-emerald-400" />
            <span>Healthcare Navigation for Tier-2, Tier-3 & Rural Communities</span>
          </div>

          <h1 className="font-heading font-extrabold text-2xl sm:text-4xl text-white tracking-tight leading-tight">
            AI Healthcare Triage & <span className="text-emerald-400">Patient Navigation</span>
          </h1>

          <p className="text-zinc-400 text-sm leading-relaxed">
            Connecting frontline health workers and individuals with instant clinical triage, visual screening for Anemia & Jaundice, native voice intake, and diagnostic report reading.
          </p>

          {/* Clean Stat Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="bg-[#181818] border border-[#2A2A2A] rounded-xl p-3 text-center">
              <span className="block font-heading font-bold text-xl text-white">1M+</span>
              <span className="text-[11px] text-zinc-400 font-medium">Frontline Health Workers</span>
            </div>
            <div className="bg-[#181818] border border-[#2A2A2A] rounded-xl p-3 text-center">
              <span className="block font-heading font-bold text-xl text-emerald-400">800M</span>
              <span className="text-[11px] text-zinc-400 font-medium">Rural Population Covered</span>
            </div>
            <div className="bg-[#181818] border border-[#2A2A2A] rounded-xl p-3 text-center">
              <span className="block font-heading font-bold text-xl text-white">20+</span>
              <span className="text-[11px] text-zinc-400 font-medium">Conditions Triaged</span>
            </div>
            <div className="bg-[#181818] border border-[#2A2A2A] rounded-xl p-3 text-center">
              <span className="block font-heading font-bold text-xl text-emerald-400">100%</span>
              <span className="text-[11px] text-zinc-400 font-medium">Offline Operational</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Module Navigation Grid */}
      <div>
        <h2 className="font-heading font-bold text-base text-zinc-200 mb-3">
          Clinical Triage & Screening Modules
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Module 1: Camera Scan */}
          <button
            onClick={() => setActiveTab('camera')}
            className="carbon-card p-5 text-left flex items-start gap-4 group"
          >
            <div className="w-11 h-11 rounded-xl bg-[#1A1A1A] border border-[#2A2A2A] flex items-center justify-center text-emerald-400 shrink-0 group-hover:border-emerald-500/50 transition-colors">
              <Camera className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <h3 className="font-heading font-bold text-base text-white group-hover:text-emerald-400 transition-colors">
                  Visual Diagnostic Scan
                </h3>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Non-invasive color analysis of fingernail bed for <strong className="text-zinc-200">Anemia</strong> and eye sclera for <strong className="text-zinc-200">Jaundice</strong>.
              </p>
            </div>
          </button>

          {/* Module 2: Voice Intake */}
          <button
            onClick={() => setActiveTab('voice')}
            className="carbon-card p-5 text-left flex items-start gap-4 group"
          >
            <div className="w-11 h-11 rounded-xl bg-[#1A1A1A] border border-[#2A2A2A] flex items-center justify-center text-emerald-400 shrink-0 group-hover:border-emerald-500/50 transition-colors">
              <Mic className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <h3 className="font-heading font-bold text-base text-white group-hover:text-emerald-400 transition-colors">
                  Voice Symptom Intake
                </h3>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Speak symptoms naturally in Hindi or Marathi. Natural language parser identifies acute health risk flags.
              </p>
            </div>
          </button>

          {/* Module 3: Report Reader */}
          <button
            onClick={() => setActiveTab('ocr')}
            className="carbon-card p-5 text-left flex items-start gap-4 group"
          >
            <div className="w-11 h-11 rounded-xl bg-[#1A1A1A] border border-[#2A2A2A] flex items-center justify-center text-emerald-400 shrink-0 group-hover:border-emerald-500/50 transition-colors">
              <FileText className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <h3 className="font-heading font-bold text-base text-white group-hover:text-emerald-400 transition-colors">
                  Lab Report & Prescription Reader
                </h3>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Scan blood CBC reports or handwritten prescriptions to extract key values and plain language summaries.
              </p>
            </div>
          </button>

          {/* Module 4: Patient Passports */}
          <button
            onClick={() => setActiveTab('patients')}
            className="carbon-card p-5 text-left flex items-start gap-4 group"
          >
            <div className="w-11 h-11 rounded-xl bg-[#1A1A1A] border border-[#2A2A2A] flex items-center justify-center text-emerald-400 shrink-0 group-hover:border-emerald-500/50 transition-colors">
              <Users className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <h3 className="font-heading font-bold text-base text-white group-hover:text-emerald-400 transition-colors">
                  Patient Health Passports
                </h3>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Local patient profile history, risk logs, and shareable QR code health cards for hospital referral.
              </p>
            </div>
          </button>

        </div>
      </div>

      {/* WhatsApp Integration Banner */}
      <div className="rounded-xl bg-[#111111] border border-[#262626] p-4 sm:p-5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-[#1A1A1A] border border-[#333333] flex items-center justify-center text-emerald-400 shrink-0">
            <Smartphone className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-heading font-bold text-sm text-white">
              WhatsApp Direct Triage Assistant
            </h4>
            <p className="text-xs text-zinc-400">
              Patients and health workers can send a photo or voice note on WhatsApp for automated triage recommendations without installing any application.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}
