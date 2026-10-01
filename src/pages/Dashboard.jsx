import React, { useState } from 'react';
import { Camera, Mic, FileText, Users, Smartphone, Activity, ExternalLink, X, MessageSquare, QrCode } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

export default function Dashboard({ setActiveTab }) {
  const [showWhatsAppModal, setShowWhatsAppModal] = useState(false);
  const [sandboxCode, setSandboxCode] = useState(() => {
    return localStorage.getItem('arogyasetu_twilio_sandbox_code') || 'join <your-sandbox-keyword>';
  });

  const handleSandboxCodeChange = (e) => {
    const val = e.target.value;
    setSandboxCode(val);
    localStorage.setItem('arogyasetu_twilio_sandbox_code', val);
  };

  // Twilio WhatsApp sandbox link
  const whatsappNumber = '14155238886'; // Twilio Sandbox default
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(sandboxCode)}`;

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

      {/* WhatsApp Integration Banner — Clickable with Modal Popup */}
      <div 
        onClick={() => setShowWhatsAppModal(true)}
        className="rounded-xl bg-[#111111] border border-[#262626] hover:border-emerald-500/50 p-4 sm:p-5 flex items-center justify-between gap-4 cursor-pointer group transition-all"
      >
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-[#1A1A1A] border border-[#333333] flex items-center justify-center text-emerald-400 shrink-0 group-hover:bg-emerald-500/10 transition-colors">
            <Smartphone className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-heading font-bold text-sm text-white group-hover:text-emerald-400 transition-colors">
                WhatsApp Direct Triage Assistant
              </h4>
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                💬 Open Chat
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-0.5">
              Patients and health workers can send a photo or voice note on WhatsApp for automated triage recommendations without installing any application.
            </p>
          </div>
        </div>
        <ExternalLink className="w-4 h-4 text-zinc-500 group-hover:text-emerald-400 shrink-0 transition-colors" />
      </div>

      {/* WhatsApp Modal */}
      {showWhatsAppModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md rounded-2xl bg-[#141414] border border-[#2A2A2A] p-6 text-white shadow-2xl space-y-5">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-[#262626] pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-base text-white">WhatsApp Triage Assistant</h3>
                  <p className="text-[11px] text-zinc-400">Omnichannel AI Assistance for Frontline Care</p>
                </div>
              </div>
              <button 
                onClick={() => setShowWhatsAppModal(false)}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-[#222222] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Sandbox Keyword Input */}
            <div className="space-y-1.5 bg-[#181818] border border-[#262626] p-3 rounded-xl">
              <label className="block text-[11px] font-semibold text-zinc-400">
                Your Twilio Sandbox Join Keyword:
              </label>
              <input
                type="text"
                value={sandboxCode}
                onChange={handleSandboxCodeChange}
                placeholder="join your-sandbox-name (e.g. join happy-lion)"
                className="w-full bg-[#111111] border border-[#333333] rounded-lg px-3 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500"
              />
              <p className="text-[10px] text-zinc-500">
                Find your unique join keyword in Twilio Console ➔ Messaging ➔ Try it out ➔ Send WhatsApp.
              </p>
            </div>

            {/* QR Code Section */}
            <div className="flex flex-col items-center justify-center bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-4 text-center space-y-2">
              <div className="p-2.5 bg-white rounded-xl shadow-inner">
                <QRCodeSVG value={whatsappUrl} size={130} />
              </div>
              <p className="text-[11px] text-zinc-400">
                Scan with mobile camera to launch WhatsApp with pre-filled join keyword!
              </p>
            </div>

            {/* Feature Bullet Points */}
            <div className="space-y-2 text-xs text-zinc-300">
              <div className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">📸</span>
                <span><strong>Photo Diagnosis</strong>: Send a photo of skin rash or wound for visual triage.</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">🎤</span>
                <span><strong>Voice Triage</strong>: Record voice messages in Hindi or Marathi.</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">📄</span>
                <span><strong>Lab Report OCR</strong>: Send lab report photos for simple explanations.</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-heading font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-lg shadow-emerald-500/20"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Launch WhatsApp Chat</span>
              </a>
              <button
                onClick={() => setShowWhatsAppModal(false)}
                className="py-2.5 px-4 rounded-xl bg-[#222222] hover:bg-[#2A2A2A] text-zinc-300 font-medium text-xs border border-[#333333] transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
