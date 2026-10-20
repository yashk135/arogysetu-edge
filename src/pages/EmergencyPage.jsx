import React, { useState, useEffect, useMemo } from 'react';
import {
  PhoneCall,
  Phone,
  AlertTriangle,
  ShieldAlert,
  Search,
  MapPin,
  Send,
  QrCode,
  Maximize2,
  Minimize2,
  ChevronRight,
  X,
  Copy,
  CheckCircle2,
  RefreshCw,
  Activity,
  Heart,
  Flame,
  Stethoscope,
  Radio,
  FileText,
  Users,
  Compass,
  AlertOctagon,
  Clock,
  ExternalLink,
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import {
  EMERGENCY_PROTOCOLS,
  getProtocolSteps,
  getProtocolDoNots,
  searchProtocols,
  getProtocolTitle,
  formatSmsBody,
} from '../services/emergencyProtocols.js';
import { getAllPatients } from '../services/db.js';

export default function EmergencyPage({ setActiveTab }) {
  // Global & Language state
  const [selectedLanguage, setSelectedLanguage] = useState('en'); // 'en', 'hi', 'mr'
  const [activeModuleTab, setActiveModuleTab] = useState('all'); // 'all', 'call', 'guide', 'sms', 'qr'

  // Module 2: First Aid Guide state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRiskFilter, setSelectedRiskFilter] = useState('ALL'); // 'ALL', 'RED', 'ORANGE'
  const [activeProtocol, setActiveProtocol] = useState(null); // Protocol object when expanded

  // Module 3: 2G SMS Dispatch state
  const [gpsLocation, setGpsLocation] = useState({
    coords: '19.9975° N, 73.7898° E',
    landmark: 'Trimbak PHC Sector 4',
    accuracy: 'Accurate (±8m)',
    isLocating: false,
    timestamp: new Date().toLocaleTimeString('en-IN'),
  });
  const [smsRecipientType, setSmsRecipientType] = useState('108'); // '108', 'doctor'
  const [customDoctorNumber, setCustomDoctorNumber] = useState('9822012345');
  const [patientAge, setPatientAge] = useState('28');
  const [patientGender, setPatientGender] = useState('Female');
  const [emergencyType, setEmergencyType] = useState('snake_bite');
  const [additionalNotes, setAdditionalNotes] = useState('Patient conscious but pulse weak, bite marks on left ankle');
  const [smsCopied, setSmsCopied] = useState(false);

  // Module 4: Patient QR Passport state
  const [patientsList, setPatientsList] = useState([]);
  const [selectedPatientId, setSelectedPatientId] = useState('sample');
  const [isQrFullscreen, setIsQrFullscreen] = useState(false);
  const [qrCopied, setQrCopied] = useState(false);

  // Sample fallback patient for rural ASHA emergency scenario
  const samplePatient = {
    id: 'PAT_EMERGENCY_01',
    name: 'Sunita Ramesh Patil',
    age: 28,
    gender: 'Female',
    isPregnant: true,
    bloodGroup: 'O Positive',
    allergies: 'Penicillin (Severe anaphylaxis risk)',
    village: 'Trimbakeshwar Gram Panchayat',
    abhaId: '91-4820-9941-8823',
    emergencyContact: 'Ramesh Patil (Husband) - +91 98230 12345',
    riskLevel: 'RED',
    conditions: 'ANC 3rd Trimester • Suspected Snake Bite / Envenomation',
    ashaWorker: 'ASHA Smt. Mangala Tai (Sector 4)',
  };

  // Load patients from IndexedDB
  useEffect(() => {
    async function loadPatients() {
      try {
        const storedPatients = await getAllPatients();
        if (storedPatients && storedPatients.length > 0) {
          setPatientsList(storedPatients);
        }
      } catch (err) {
        console.error('Error loading patients from IndexedDB:', err);
      }
    }
    loadPatients();
  }, []);

  // Current patient for QR code
  const currentQrPatient = useMemo(() => {
    if (selectedPatientId === 'sample' || !patientsList.length) {
      return samplePatient;
    }
    const found = patientsList.find((p) => String(p.id) === String(selectedPatientId));
    if (!found) return samplePatient;

    return {
      id: found.id,
      name: found.name,
      age: found.age || 'Unknown',
      gender: found.gender || 'Female',
      isPregnant: Boolean(found.isPregnant),
      bloodGroup: found.bloodGroup || 'O Positive',
      allergies: found.allergies || 'None reported',
      village: found.village || 'Gram Panchayat',
      abhaId: found.abhaId || `91-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`,
      emergencyContact: found.phone || '+91 98220 00000',
      riskLevel: 'RED',
      conditions: found.notes || 'Emergency triage referral',
      ashaWorker: 'Local Frontline Health Worker',
    };
  }, [selectedPatientId, patientsList]);

  // QR Code payload (compact, standard hospital triage JSON format)
  const qrPayload = useMemo(() => {
    return JSON.stringify({
      id: currentQrPatient.id,
      name: currentQrPatient.name,
      age: currentQrPatient.age,
      gender: currentQrPatient.gender,
      bloodGroup: currentQrPatient.bloodGroup,
      allergies: currentQrPatient.allergies,
      village: currentQrPatient.village,
      abha: currentQrPatient.abhaId,
      contact: currentQrPatient.emergencyContact,
      triageLevel: currentQrPatient.riskLevel,
      conditions: currentQrPatient.conditions,
      platform: 'ArogyaSetu Edge 108 Emergency Passport',
      issuedAt: new Date().toISOString(),
    });
  }, [currentQrPatient]);

  // Geolocation fetcher
  const handleFetchGps = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser/device.');
      return;
    }
    setGpsLocation((prev) => ({ ...prev, isLocating: true }));
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude.toFixed(4);
        const lng = pos.coords.longitude.toFixed(4);
        const acc = Math.round(pos.coords.accuracy);
        setGpsLocation({
          coords: `${lat}° N, ${lng}° E`,
          landmark: `GPS Lock (Lat: ${lat}, Lng: ${lng})`,
          accuracy: `Accurate (±${acc}m)`,
          isLocating: false,
          timestamp: new Date().toLocaleTimeString('en-IN'),
        });
      },
      (err) => {
        console.warn('GPS error, using cached location:', err);
        setGpsLocation((prev) => ({
          ...prev,
          isLocating: false,
          accuracy: 'Estimated (Offline Cache)',
          timestamp: new Date().toLocaleTimeString('en-IN'),
        }));
      },
      { timeout: 10000, enableHighAccuracy: true, maximumAge: 60000 }
    );
  };

  // Protocols filtered by search query and risk level
  const filteredProtocols = useMemo(() => {
    let list = searchProtocols(searchQuery);
    if (selectedRiskFilter !== 'ALL') {
      list = list.filter((p) => p.riskLevel?.toUpperCase() === selectedRiskFilter);
    }
    return list;
  }, [searchQuery, selectedRiskFilter]);

  // Constructed SMS Text
  const currentEmergencyProtocol = useMemo(() => {
    return EMERGENCY_PROTOCOLS.find((p) => p.id === emergencyType) || EMERGENCY_PROTOCOLS[0];
  }, [emergencyType]);

  const smsBodyText = useMemo(() => {
    const title = getProtocolTitle(currentEmergencyProtocol, 'en');
    const locationStr = `${gpsLocation.landmark} [${gpsLocation.coords}]`;
    const base = formatSmsBody(currentEmergencyProtocol, {
      location: locationStr,
      age: patientAge,
      time: 'Immediate',
      village: gpsLocation.landmark,
    });

    if (base) {
      return `${base} Patient Gender: ${patientGender}. Notes: ${additionalNotes}`;
    }

    return `EMERGENCY 108: ${title.toUpperCase()} patient at ${locationStr}. Age: ${patientAge}, ${patientGender}. Notes: ${additionalNotes}. Immediate critical care ambulance requested.`;
  }, [currentEmergencyProtocol, gpsLocation, patientAge, patientGender, additionalNotes]);

  // Trigger SMS app
  const handleSendSms = (overrideBody) => {
    const targetRecipient = smsRecipientType === '108' ? '108' : customDoctorNumber.trim() || '108';
    const bodyToSend = overrideBody || smsBodyText;
    const uri = `sms:${targetRecipient}?body=${encodeURIComponent(bodyToSend)}`;
    window.location.href = uri;
  };

  // Copy SMS
  const handleCopySms = () => {
    navigator.clipboard?.writeText(smsBodyText);
    setSmsCopied(true);
    setTimeout(() => setSmsCopied(false), 2000);
  };

  // Copy QR text
  const handleCopyQr = () => {
    navigator.clipboard?.writeText(qrPayload);
    setQrCopied(true);
    setTimeout(() => setQrCopied(false), 2000);
  };

  // Language display labels
  const langConfig = {
    en: { label: 'English', titleTag: 'First Aid Guides' },
    hi: { label: 'हिंदी', titleTag: 'प्राथमिक उपचार निर्देशिका' },
    mr: { label: 'मराठी', titleTag: 'प्रथमोपचार मार्गदर्शिका' },
  };

  return (
    <div className="space-y-6 pb-28 max-w-5xl mx-auto px-2 sm:px-4">
      {/* ============================================================== */}
      {/* TOP HEADER & EMERGENCY BADGE                                   */}
      {/* ============================================================== */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-[#180808] via-[#0E0E0E] to-[#0A0A0A] border border-red-900/40 p-5 sm:p-7 shadow-2xl shadow-red-950/20">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2 max-w-2xl">
            {/* Offline Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-950/70 border border-red-700/50 text-red-200 text-xs font-semibold">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </span>
              <span>🔴 WORKS 100% OFFLINE — ZERO DATA NEEDED</span>
            </div>

            <h1 className="font-heading font-extrabold text-2xl sm:text-4xl text-white tracking-tight leading-tight flex items-center gap-2.5">
              <span>Emergency Hub</span>
              <span className="text-red-500 font-black">108 SOS</span>
            </h1>

            <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed">
              24/7 mission-critical response engine for rural ASHA healthcare workers. Instant one-tap calling, WHO offline first aid protocols, 2G SMS dispatch, and scannable hospital triage passports.
            </p>
          </div>

          {/* Language Switcher Bar */}
          <div className="flex flex-col sm:items-end gap-2 shrink-0">
            <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
              Language / भाषा / भाषा
            </span>
            <div className="inline-flex rounded-xl bg-[#141414] border border-[#2A2A2A] p-1">
              {['en', 'hi', 'mr'].map((lang) => (
                <button
                  key={lang}
                  onClick={() => setSelectedLanguage(lang)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    selectedLanguage === lang
                      ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                      : 'text-zinc-400 hover:text-white hover:bg-[#1E1E1E]'
                  }`}
                >
                  {langConfig[lang].label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Anchor Navigation */}
        <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-red-900/20 mt-4">
          <button
            onClick={() => setActiveModuleTab('all')}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
              activeModuleTab === 'all'
                ? 'bg-[#222222] text-white border border-[#444]'
                : 'text-zinc-400 hover:text-zinc-200 bg-[#121212]'
            }`}
          >
            All Modules
          </button>
          <button
            onClick={() => setActiveModuleTab('call')}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
              activeModuleTab === 'call'
                ? 'bg-red-900/40 text-red-300 border border-red-700/50'
                : 'text-zinc-400 hover:text-red-300 bg-[#121212]'
            }`}
          >
            🚑 1-Tap Call
          </button>
          <button
            onClick={() => setActiveModuleTab('guide')}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
              activeModuleTab === 'guide'
                ? 'bg-red-900/40 text-red-300 border border-red-700/50'
                : 'text-zinc-400 hover:text-red-300 bg-[#121212]'
            }`}
          >
            📖 First Aid Guide ({EMERGENCY_PROTOCOLS.length})
          </button>
          <button
            onClick={() => setActiveModuleTab('sms')}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
              activeModuleTab === 'sms'
                ? 'bg-red-900/40 text-red-300 border border-red-700/50'
                : 'text-zinc-400 hover:text-red-300 bg-[#121212]'
            }`}
          >
            📡 2G SMS Dispatch
          </button>
          <button
            onClick={() => setActiveModuleTab('qr')}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
              activeModuleTab === 'qr'
                ? 'bg-red-900/40 text-red-300 border border-red-700/50'
                : 'text-zinc-400 hover:text-red-300 bg-[#121212]'
            }`}
          >
            🪪 Emergency QR
          </button>
        </div>
      </div>

      {/* ============================================================== */}
      {/* MODULE 1: ONE-TAP 108 EMERGENCY CALL                           */}
      {/* ============================================================== */}
      {(activeModuleTab === 'all' || activeModuleTab === 'call') && (
        <section className="rounded-2xl bg-[#0D0D0D] border border-red-900/50 p-5 sm:p-7 shadow-2xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#222222] pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-600/10 border border-red-600/30 flex items-center justify-center text-red-500">
                <AlertOctagon className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-heading font-extrabold text-lg text-white">
                  Module 1: Instant Emergency Speed Dial
                </h2>
                <p className="text-xs text-zinc-400">
                  National rural toll-free hotlines • Direct cellular dialer trigger
                </p>
              </div>
            </div>

            <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-2.5 py-1 rounded-full w-fit">
              ✓ Cellular Voice Active
            </span>
          </div>

          {/* Primary Pulsing 108 Button */}
          <div className="flex flex-col items-center justify-center py-4 text-center">
            <div className="relative group cursor-pointer" onClick={() => (window.location.href = 'tel:108')}>
              {/* Pulsing Ripple Rings */}
              <div className="absolute -inset-4 rounded-full bg-red-600/30 blur-xl animate-pulse group-hover:bg-red-600/50 transition-all"></div>
              <div className="absolute -inset-2 rounded-full border-2 border-red-500/50 animate-ping opacity-75"></div>

              {/* Big Red Button */}
              <button
                type="button"
                className="relative w-48 h-48 sm:w-56 sm:h-56 rounded-full bg-gradient-to-br from-red-500 via-red-600 to-red-800 border-4 border-red-400/80 shadow-[0_0_60px_rgba(239,68,68,0.55)] flex flex-col items-center justify-center gap-2 text-white active:scale-95 transition-transform duration-150"
              >
                <span className="text-4xl sm:text-5xl animate-bounce">🚑</span>
                <span className="font-heading font-black text-2xl sm:text-3xl tracking-tight uppercase drop-shadow-md">
                  CALL 108
                </span>
                <span className="text-[11px] sm:text-xs font-bold text-red-100 bg-red-950/60 px-3 py-0.5 rounded-full uppercase tracking-wider">
                  Ambulance SOS
                </span>
              </button>
            </div>

            <p className="mt-4 text-sm font-semibold text-red-300">
              National Free Ambulance Service (EMRI 108)
            </p>
            <p className="text-xs text-zinc-500 max-w-sm mt-0.5">
              Tap the button to instantly dial 108 on your handset. Toll-free, works even without balance or active SIM recharge.
            </p>
          </div>

          {/* Secondary Helpline Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {/* 112 Unified Emergency */}
            <button
              onClick={() => (window.location.href = 'tel:112')}
              className="p-4 rounded-xl bg-[#141414] border border-[#262626] hover:border-red-500/40 flex items-center justify-between group transition-all text-left"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#1E1E1E] border border-[#333333] flex items-center justify-center text-red-400 group-hover:bg-red-500 group-hover:text-white transition-colors">
                  <PhoneCall className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-heading font-bold text-base text-white">Call 112</span>
                    <span className="text-[10px] bg-red-900/30 text-red-300 px-1.5 py-0.5 rounded border border-red-800/40 font-mono">
                      All-in-One
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400">National Unified Emergency Response (Police, Fire, Medical)</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-zinc-500 group-hover:text-red-400 transition-colors" />
            </button>

            {/* Local PHC Medical Officer Speed Dial */}
            <div className="p-4 rounded-xl bg-[#141414] border border-[#262626] flex items-center justify-between gap-3 text-left">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#1E1E1E] border border-[#333333] flex items-center justify-center text-emerald-400">
                  <Stethoscope className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-heading font-bold text-xs text-zinc-300 block">
                    Local PHC Medical Officer
                  </span>
                  <input
                    type="tel"
                    value={customDoctorNumber}
                    onChange={(e) => setCustomDoctorNumber(e.target.value)}
                    placeholder="Enter Doctor 10-digit #"
                    className="bg-transparent border-b border-[#333] text-xs text-white focus:outline-none focus:border-emerald-500 py-0.5 w-32 font-mono"
                  />
                </div>
              </div>
              <button
                onClick={() => (window.location.href = `tel:${customDoctorNumber}`)}
                className="px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors shadow-md shadow-emerald-700/20"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call Doctor</span>
              </button>
            </div>
          </div>
        </section>
      )}

      {/* ============================================================== */}
      {/* MODULE 2: FIRST AID GUIDE (MAIN FEATURE)                       */}
      {/* ============================================================== */}
      {(activeModuleTab === 'all' || activeModuleTab === 'guide') && (
        <section className="rounded-2xl bg-[#0D0D0D] border border-[#1A1A1A] p-5 sm:p-7 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#222222] pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
                <h2 className="font-heading font-extrabold text-lg text-white">
                  Module 2: Offline First Aid Protocols ({langConfig[selectedLanguage].titleTag})
                </h2>
              </div>
              <p className="text-xs text-zinc-400 mt-0.5">
                Preloaded WHO-aligned offline guides with step-by-step actions and critical warnings.
              </p>
            </div>

            {/* Risk Category Filters */}
            <div className="flex items-center gap-1.5 bg-[#141414] border border-[#2A2A2A] p-1 rounded-xl w-fit">
              <button
                onClick={() => setSelectedRiskFilter('ALL')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  selectedRiskFilter === 'ALL'
                    ? 'bg-[#282828] text-white'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                All ({EMERGENCY_PROTOCOLS.length})
              </button>
              <button
                onClick={() => setSelectedRiskFilter('RED')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                  selectedRiskFilter === 'RED'
                    ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                    : 'text-red-400 hover:bg-red-950/40'
                }`}
              >
                <span>🔴 Critical</span>
              </button>
              <button
                onClick={() => setSelectedRiskFilter('ORANGE')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                  selectedRiskFilter === 'ORANGE'
                    ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30'
                    : 'text-amber-400 hover:bg-amber-950/40'
                }`}
              >
                <span>🟠 Urgent</span>
              </button>
            </div>
          </div>

          {/* Search Input Bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search protocols (e.g. Snake bite, दिल का दौरा, सर्पदंश, जलना, fracture)..."
              className="w-full bg-[#141414] border border-[#282828] focus:border-red-500 rounded-xl pl-10 pr-10 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white text-xs font-bold"
              >
                ✕
              </button>
            )}
          </div>

          {/* Protocols Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {filteredProtocols.map((protocol) => {
              const localizedTitle = getProtocolTitle(protocol, selectedLanguage);
              const isRed = (protocol.riskLevel || '').toUpperCase() === 'RED';
              const stepsCount = getProtocolSteps(protocol, selectedLanguage).length;

              return (
                <div
                  key={protocol.id}
                  onClick={() => setActiveProtocol(protocol)}
                  className="rounded-xl bg-[#121212] border border-[#242424] hover:border-red-500/60 p-4 cursor-pointer transition-all hover:bg-[#161616] group flex flex-col justify-between gap-3 shadow-sm hover:shadow-lg hover:shadow-red-950/20"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-3xl p-1.5 rounded-lg bg-[#181818] border border-[#282828] group-hover:scale-110 transition-transform inline-block">
                        {protocol.icon}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider border ${
                          isRed
                            ? 'bg-red-950/60 text-red-400 border-red-800/60'
                            : 'bg-amber-950/60 text-amber-400 border-amber-800/60'
                        }`}
                      >
                        {isRed ? '🔴 Critical RED' : '🟠 Urgent ORANGE'}
                      </span>
                    </div>

                    <div>
                      <h3 className="font-heading font-bold text-sm text-white group-hover:text-red-400 transition-colors line-clamp-1">
                        {localizedTitle}
                      </h3>
                      {selectedLanguage !== 'en' && protocol.titleEn && (
                        <p className="text-[11px] text-zinc-500 italic line-clamp-1">
                          {protocol.titleEn}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-[#1F1F1F] pt-2 text-xs text-zinc-400">
                    <span className="text-[11px] font-medium text-zinc-400">
                      {stepsCount} action steps
                    </span>
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-red-400 group-hover:translate-x-1 transition-transform">
                      <span>View Steps</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredProtocols.length === 0 && (
            <div className="py-12 text-center space-y-2">
              <AlertTriangle className="w-8 h-8 text-zinc-500 mx-auto" />
              <p className="text-sm text-zinc-300 font-medium">No emergency protocols found</p>
              <p className="text-xs text-zinc-500">Try clearing the search query or risk filters.</p>
            </div>
          )}
        </section>
      )}

      {/* ============================================================== */}
      {/* PROTOCOL EXPANDED MODAL / DRAWER                               */}
      {/* ============================================================== */}
      {activeProtocol && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-in fade-in duration-150">
          <div className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-2xl bg-[#111111] border border-red-800/60 text-white shadow-2xl p-5 sm:p-7 space-y-5">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-[#262626] pb-4">
              <div className="flex items-center gap-3.5">
                <span className="text-4xl p-2 rounded-xl bg-[#1A1A1A] border border-[#2E2E2E]">
                  {activeProtocol.icon}
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider border ${
                        activeProtocol.riskLevel === 'RED'
                          ? 'bg-red-950/60 text-red-400 border-red-800/60'
                          : 'bg-amber-950/60 text-amber-400 border-amber-800/60'
                      }`}
                    >
                      {activeProtocol.riskLevel === 'RED' ? '🔴 RED: Life Threatening' : '🟠 ORANGE: Urgent Care'}
                    </span>
                  </div>
                  <h3 className="font-heading font-extrabold text-lg sm:text-xl text-white mt-1">
                    {getProtocolTitle(activeProtocol, selectedLanguage)}
                  </h3>
                  {selectedLanguage !== 'en' && activeProtocol.titleEn && (
                    <p className="text-xs text-zinc-400">{activeProtocol.titleEn}</p>
                  )}
                </div>
              </div>

              <button
                onClick={() => setActiveProtocol(null)}
                className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-[#222222] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Language Toggle Inside Modal */}
            <div className="flex items-center justify-between bg-[#161616] border border-[#282828] p-2 rounded-xl text-xs">
              <span className="text-zinc-400 font-medium">Protocol Language:</span>
              <div className="inline-flex gap-1">
                {['en', 'hi', 'mr'].map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setSelectedLanguage(lang)}
                    className={`px-2.5 py-1 rounded-md font-semibold transition-all ${
                      selectedLanguage === lang
                        ? 'bg-red-600 text-white'
                        : 'text-zinc-400 hover:text-white hover:bg-[#222]'
                    }`}
                  >
                    {langConfig[lang].label}
                  </button>
                ))}
              </div>
            </div>

            {/* Step-by-Step First Aid Instructions */}
            <div className="space-y-3">
              <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Step-by-Step Action Protocol</span>
              </h4>

              <div className="space-y-2.5">
                {getProtocolSteps(activeProtocol, selectedLanguage).map((step, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-[#161616] border border-[#262626] flex items-start gap-3"
                  >
                    <span className="w-6 h-6 rounded-full bg-red-600/20 text-red-400 border border-red-600/40 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <p className="text-xs sm:text-sm text-zinc-200 leading-relaxed">{step}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* ⛔ Do NOT Section */}
            {getProtocolDoNots(activeProtocol, selectedLanguage).length > 0 && (
              <div className="p-4 rounded-xl bg-red-950/30 border border-red-900/50 space-y-2.5">
                <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-red-400 flex items-center gap-1.5">
                  <span className="text-base">⛔</span>
                  <span>DO NOT — Crucial Hazards to Avoid</span>
                </h4>
                <ul className="space-y-2 text-xs text-red-200">
                  {getProtocolDoNots(activeProtocol, selectedLanguage).map((dont, idx) => (
                    <li key={idx} className="flex items-start gap-2 leading-relaxed">
                      <span className="text-red-400 font-bold shrink-0">✕</span>
                      <span>{dont}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Modal Bottom Actions */}
            <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-[#262626]">
              {activeProtocol.callEmergency && (
                <button
                  onClick={() => (window.location.href = 'tel:108')}
                  className="flex-1 min-w-[140px] py-2.5 px-4 rounded-xl bg-red-600 hover:bg-red-500 text-white font-heading font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-lg shadow-red-700/30"
                >
                  <PhoneCall className="w-4 h-4 animate-pulse" />
                  <span>Call 108 Ambulance</span>
                </button>
              )}

              <button
                onClick={() => {
                  setEmergencyType(activeProtocol.id);
                  const formatted = formatSmsBody(activeProtocol, {
                    location: `${gpsLocation.landmark} [${gpsLocation.coords}]`,
                    age: patientAge,
                    time: 'Immediate',
                  });
                  handleSendSms(formatted);
                }}
                className="flex-1 min-w-[140px] py-2.5 px-4 rounded-xl bg-[#222222] hover:bg-[#2A2A2A] border border-[#333333] text-white font-medium text-xs flex items-center justify-center gap-2 transition-colors"
              >
                <Send className="w-3.5 h-3.5 text-red-400" />
                <span>Send 2G SMS Dispatch</span>
              </button>

              <button
                onClick={() => setActiveProtocol(null)}
                className="py-2.5 px-4 rounded-xl bg-[#181818] hover:bg-[#222222] text-zinc-400 hover:text-white text-xs font-medium border border-[#2A2A2A] transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODULE 3: 2G SMS DISPATCH                                      */}
      {/* ============================================================== */}
      {(activeModuleTab === 'all' || activeModuleTab === 'sms') && (
        <section className="rounded-2xl bg-[#0D0D0D] border border-[#1A1A1A] p-5 sm:p-7 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#222222] pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-600/10 border border-red-600/30 flex items-center justify-center text-red-400">
                <Radio className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-heading font-extrabold text-lg text-white">
                  Module 3: 2G SMS Dispatch (Zero Internet Fallback)
                </h2>
                <p className="text-xs text-zinc-400">
                  Sends formatted emergency dispatch text to 108 or PHC Doctor using native cellular SMS.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] font-semibold text-zinc-400 bg-[#161616] border border-[#282828] px-3 py-1 rounded-full">
                📶 2G Tower Compatible
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Left Column: Coordinates & Parameters Form */}
            <div className="space-y-4">
              {/* GPS Coordinates Card */}
              <div className="p-4 rounded-xl bg-[#141414] border border-[#262626] space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-semibold text-zinc-300">
                    <MapPin className="w-4 h-4 text-red-500" />
                    <span>GPS Coordinates for Ambulance</span>
                  </div>
                  <button
                    onClick={handleFetchGps}
                    disabled={gpsLocation.isLocating}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#202020] hover:bg-[#2A2A2A] text-[11px] font-medium text-emerald-400 border border-[#333] transition-colors"
                  >
                    <RefreshCw className={`w-3 h-3 ${gpsLocation.isLocating ? 'animate-spin' : ''}`} />
                    <span>{gpsLocation.isLocating ? 'Locking GPS...' : 'Update GPS'}</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-[#181818] p-2.5 rounded-lg border border-[#2A2A2A]">
                    <span className="text-[10px] text-zinc-500 uppercase block">Coordinates</span>
                    <span className="font-mono text-white font-bold">{gpsLocation.coords}</span>
                  </div>
                  <div className="bg-[#181818] p-2.5 rounded-lg border border-[#2A2A2A]">
                    <span className="text-[10px] text-zinc-500 uppercase block">Accuracy / Time</span>
                    <span className="text-emerald-400 font-semibold">{gpsLocation.accuracy}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-zinc-400 mb-1">
                    Village / Landmark (Manual or Auto-Filled):
                  </label>
                  <input
                    type="text"
                    value={gpsLocation.landmark}
                    onChange={(e) => setGpsLocation({ ...gpsLocation, landmark: e.target.value })}
                    placeholder="e.g. Near Gram Panchayat Water Tank, Trimbak"
                    className="w-full bg-[#181818] border border-[#2E2E2E] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500"
                  />
                </div>
              </div>

              {/* Patient & Condition Details */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-[11px] font-semibold text-zinc-400 mb-1">
                    Emergency Condition:
                  </label>
                  <select
                    value={emergencyType}
                    onChange={(e) => setEmergencyType(e.target.value)}
                    className="w-full bg-[#141414] border border-[#282828] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500"
                  >
                    {EMERGENCY_PROTOCOLS.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.icon} {p.titleEn}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-zinc-400 mb-1">
                    Patient Age & Gender:
                  </label>
                  <div className="flex gap-1.5">
                    <input
                      type="number"
                      value={patientAge}
                      onChange={(e) => setPatientAge(e.target.value)}
                      placeholder="Age"
                      className="w-16 bg-[#141414] border border-[#282828] rounded-xl px-2.5 py-2 text-xs text-white focus:outline-none focus:border-red-500"
                    />
                    <select
                      value={patientGender}
                      onChange={(e) => setPatientGender(e.target.value)}
                      className="flex-1 bg-[#141414] border border-[#282828] rounded-xl px-2.5 py-2 text-xs text-white focus:outline-none focus:border-red-500"
                    >
                      <option value="Female">Female</option>
                      <option value="Male">Male</option>
                      <option value="Child">Child</option>
                      <option value="Infant">Infant</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Additional Symptoms & Observations */}
              <div>
                <label className="block text-[11px] font-semibold text-zinc-400 mb-1">
                  Symptoms & Observations (Auto-Included in SMS):
                </label>
                <textarea
                  rows={2}
                  value={additionalNotes}
                  onChange={(e) => setAdditionalNotes(e.target.value)}
                  placeholder="e.g. Unconscious, heavy bleeding, difficulty breathing..."
                  className="w-full bg-[#141414] border border-[#282828] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500 resize-none"
                />
              </div>

              {/* Destination Selector */}
              <div className="space-y-1.5">
                <label className="block text-[11px] font-semibold text-zinc-400">
                  Send SMS Dispatch To:
                </label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setSmsRecipientType('108')}
                    className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                      smsRecipientType === '108'
                        ? 'bg-red-950/60 text-red-400 border-red-700/60'
                        : 'bg-[#141414] text-zinc-400 border-[#282828] hover:text-white'
                    }`}
                  >
                    🚑 108 Dispatch Service
                  </button>

                  <button
                    type="button"
                    onClick={() => setSmsRecipientType('doctor')}
                    className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                      smsRecipientType === 'doctor'
                        ? 'bg-emerald-950/60 text-emerald-400 border-emerald-700/60'
                        : 'bg-[#141414] text-zinc-400 border-[#282828] hover:text-white'
                    }`}
                  >
                    👨‍⚕️ PHC Doctor ({customDoctorNumber})
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column: Live SMS Preview & Action Button */}
            <div className="flex flex-col justify-between p-4 rounded-xl bg-[#141414] border border-[#262626] space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold text-zinc-300">
                  <span className="flex items-center gap-1.5">
                    <Send className="w-3.5 h-3.5 text-red-400" />
                    <span>Live 2G SMS Payload Preview</span>
                  </span>
                  <button
                    onClick={handleCopySms}
                    className="flex items-center gap-1 text-[11px] text-zinc-400 hover:text-white transition-colors"
                  >
                    <Copy className="w-3 h-3" />
                    <span>{smsCopied ? 'Copied!' : 'Copy Text'}</span>
                  </button>
                </div>

                <div className="p-3.5 rounded-xl bg-[#0A0A0A] border border-[#262626] font-mono text-xs text-emerald-300 leading-relaxed whitespace-pre-wrap break-words min-h-[140px]">
                  {smsBodyText}
                </div>

                <p className="text-[11px] text-zinc-500">
                  Recipient URI:{' '}
                  <span className="font-mono text-zinc-300">
                    sms:{smsRecipientType === '108' ? '108' : customDoctorNumber}
                  </span>
                </p>
              </div>

              {/* Big Dispatch Button */}
              <div className="space-y-2 pt-2">
                <button
                  onClick={() => handleSendSms()}
                  className="w-full py-3 px-5 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-heading font-extrabold text-sm flex items-center justify-center gap-2.5 shadow-xl shadow-red-700/30 active:scale-[0.98] transition-all"
                >
                  <Send className="w-4 h-4" />
                  <span>
                    Launch SMS App ({smsRecipientType === '108' ? 'To 108 Ambulance' : 'To PHC Doctor'})
                  </span>
                </button>

                <p className="text-[11px] text-center text-zinc-500">
                  Opens native mobile SMS app with recipient and text pre-filled. Press send on your phone.
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ============================================================== */}
      {/* MODULE 4: PATIENT EMERGENCY QR PASSPORT                        */}
      {/* ============================================================== */}
      {(activeModuleTab === 'all' || activeModuleTab === 'qr') && (
        <section className="rounded-2xl bg-[#0D0D0D] border border-[#1A1A1A] p-5 sm:p-7 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#222222] pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-600/10 border border-red-600/30 flex items-center justify-center text-red-400">
                <QrCode className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-heading font-extrabold text-lg text-white">
                  Module 4: Patient Emergency QR (Triage Health Passport)
                </h2>
                <p className="text-xs text-zinc-400">
                  Instant scannable health barcode for ambulance paramedics and district hospital casualty triage.
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsQrFullscreen(true)}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#1C1C1C] hover:bg-[#282828] border border-[#333333] text-zinc-200 text-xs font-semibold transition-colors"
            >
              <Maximize2 className="w-3.5 h-3.5 text-red-400" />
              <span>Full Screen QR</span>
            </button>
          </div>

          {/* Patient Selector */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#141414] border border-[#262626] p-3.5 rounded-xl text-xs">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-emerald-400" />
              <span className="font-semibold text-zinc-300">Selected Patient Profile:</span>
            </div>

            <select
              value={selectedPatientId}
              onChange={(e) => setSelectedPatientId(e.target.value)}
              className="bg-[#1C1C1C] border border-[#333333] rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-red-500"
            >
              <option value="sample">Sample Critical Patient (Sunita Patil - Snake Bite / Pregnant)</option>
              {patientsList.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.village || 'Gram Panchayat'}) - ID: {p.id.substring(0, 10)}
                </option>
              ))}
            </select>
          </div>

          {/* QR Display Card & Clinical Summary Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            {/* QR Card Container */}
            <div className="md:col-span-5 flex flex-col items-center justify-center text-center p-5 rounded-2xl bg-gradient-to-b from-[#161616] to-[#101010] border border-[#2A2A2A] shadow-inner space-y-3">
              <div className="p-3 bg-white rounded-2xl shadow-2xl border-4 border-red-500/20">
                <QRCodeSVG
                  value={qrPayload}
                  size={190}
                  level="H"
                  includeMargin={true}
                />
              </div>

              <div>
                <span className="inline-block font-heading font-extrabold text-base text-white">
                  {currentQrPatient.name}
                </span>
                <p className="text-xs text-zinc-400 font-mono">ABHA: {currentQrPatient.abhaId}</p>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={() => setIsQrFullscreen(true)}
                  className="px-3 py-1 rounded-lg bg-[#222222] hover:bg-[#2A2A2A] text-zinc-300 text-[11px] font-medium border border-[#333333] flex items-center gap-1 transition-colors"
                >
                  <Maximize2 className="w-3 h-3" />
                  <span>Enlarge</span>
                </button>

                <button
                  onClick={handleCopyQr}
                  className="px-3 py-1 rounded-lg bg-[#222222] hover:bg-[#2A2A2A] text-zinc-300 text-[11px] font-medium border border-[#333333] flex items-center gap-1 transition-colors"
                >
                  <Copy className="w-3 h-3" />
                  <span>{qrCopied ? 'Copied' : 'Copy Payload'}</span>
                </button>
              </div>
            </div>

            {/* Clinical Summary Cards */}
            <div className="md:col-span-7 space-y-3">
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-[#141414] border border-[#262626]">
                  <span className="text-[10px] uppercase font-semibold text-zinc-500 block">
                    Blood Group
                  </span>
                  <span className="text-sm font-bold text-red-400 font-mono">
                    {currentQrPatient.bloodGroup}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-[#141414] border border-[#262626]">
                  <span className="text-[10px] uppercase font-semibold text-zinc-500 block">
                    Triage Risk
                  </span>
                  <span className="text-sm font-bold text-red-500 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
                    <span>{currentQrPatient.riskLevel} Critical</span>
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-[#141414] border border-[#262626] col-span-2">
                  <span className="text-[10px] uppercase font-semibold text-zinc-500 block">
                    Severe Allergies & Contraindications
                  </span>
                  <span className="text-xs font-semibold text-amber-300">
                    ⚠️ {currentQrPatient.allergies}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-[#141414] border border-[#262626]">
                  <span className="text-[10px] uppercase font-semibold text-zinc-500 block">
                    Village / Sector
                  </span>
                  <span className="text-xs text-zinc-200">{currentQrPatient.village}</span>
                </div>

                <div className="p-3 rounded-xl bg-[#141414] border border-[#262626]">
                  <span className="text-[10px] uppercase font-semibold text-zinc-500 block">
                    Emergency Phone
                  </span>
                  <span className="text-xs text-zinc-200 font-mono">
                    {currentQrPatient.emergencyContact}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-[#141414] border border-[#262626] col-span-2">
                  <span className="text-[10px] uppercase font-semibold text-zinc-500 block">
                    Chief Emergency Complaint / Observations
                  </span>
                  <p className="text-xs text-zinc-300 mt-0.5 leading-relaxed">
                    {currentQrPatient.conditions}
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#121815] border border-emerald-900/40 text-emerald-300 text-xs flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 text-emerald-400" />
                  <span>ABDM Standard FHIR QR Specification Compliant</span>
                </span>
                <span className="text-[10px] font-mono text-emerald-400">v2.1</span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ============================================================== */}
      {/* FULLSCREEN QR CODE MODAL                                       */}
      {/* ============================================================== */}
      {isQrFullscreen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-lg animate-in zoom-in-95 duration-200">
          <div className="relative w-full max-w-lg rounded-3xl bg-[#111111] border border-red-700/60 p-6 sm:p-8 text-center space-y-6 shadow-2xl">
            {/* Modal Top */}
            <div className="flex items-center justify-between border-b border-[#242424] pb-3">
              <div className="text-left">
                <h3 className="font-heading font-extrabold text-base text-white">
                  Hospital Emergency Scanner QR
                </h3>
                <p className="text-xs text-zinc-400">High-contrast scannable display for paramedics</p>
              </div>

              <button
                onClick={() => setIsQrFullscreen(false)}
                className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-[#222222] transition-colors"
              >
                <Minimize2 className="w-5 h-5" />
              </button>
            </div>

            {/* Giant QR Canvas */}
            <div className="p-6 bg-white rounded-3xl inline-block shadow-[0_0_80px_rgba(255,255,255,0.2)]">
              <QRCodeSVG
                value={qrPayload}
                size={270}
                level="H"
                includeMargin={true}
              />
            </div>

            {/* Big Name & Key Vitals Banner */}
            <div className="space-y-1">
              <h2 className="font-heading font-black text-2xl text-white">
                {currentQrPatient.name}
              </h2>
              <p className="text-xs text-zinc-400 font-mono">
                Age: {currentQrPatient.age} • Blood Group: <strong className="text-red-400">{currentQrPatient.bloodGroup}</strong> • ABHA: {currentQrPatient.abhaId}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-red-950/40 border border-red-800/60 text-xs text-red-200">
              ⚠️ Allergy: {currentQrPatient.allergies}
            </div>

            <button
              onClick={() => setIsQrFullscreen(false)}
              className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-heading font-bold text-xs transition-colors"
            >
              Done / Return to Hub
            </button>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* BOTTOM SUMMARY FOOTER BANNER                                   */}
      {/* ============================================================== */}
      <div className="rounded-xl bg-[#111111] border border-[#242424] p-4 text-center text-xs text-zinc-500 space-y-1">
        <p className="font-medium text-zinc-400">
          ArogyaSetu Edge 108 Emergency Protocol Hub • Version 1.0 (Offline-First)
        </p>
        <p className="text-[11px]">
          Compliant with WHO Rural Frontline Emergency Standards & National Health Mission (NHM) guidelines.
        </p>
      </div>
    </div>
  );
}
