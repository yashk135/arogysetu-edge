import React, { useState, useEffect } from 'react';
import { savePatient, getAllPatients, deletePatient, getPatientTriageHistory } from '../services/db';
import { generateHealthPassportPDF } from '../services/pdfExporter';
import { Users, UserPlus, Search, QrCode, MapPin, Phone, Calendar, Download, ShieldAlert, CheckCircle, AlertTriangle, RefreshCw, Activity, ArrowUpRight } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

export default function PatientsPage({ onSelectPatient }) {
  const [patients, setPatients] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedPatientForDetail, setSelectedPatientForDetail] = useState(null);
  const [patientHistory, setPatientHistory] = useState([]);
  const [selectedPatientForQR, setSelectedPatientForQR] = useState(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: 'Female',
    isPregnant: false,
    village: '',
    phone: '',
    notes: '',
  });

  const loadPatients = async () => {
    try {
      const data = await getAllPatients();
      setPatients(data);
    } catch (err) {
      console.error('Error loading patients from IndexedDB:', err);
    }
  };

  useEffect(() => {
    loadPatients();
  }, []);

  const [patientQRHistory, setPatientQRHistory] = useState([]);

  const openPatientQRModal = async (patient) => {
    setSelectedPatientForQR(patient);
    try {
      const history = await getPatientTriageHistory(patient.id);
      setPatientQRHistory(history);
    } catch (err) {
      setPatientQRHistory([]);
    }
  };

  const openPatientDetail = async (patient) => {
    setSelectedPatientForDetail(patient);
    try {
      const history = await getPatientTriageHistory(patient.id);
      setPatientHistory(history);
    } catch (err) {
      console.error('Error loading patient triage history:', err);
      setPatientHistory([]);
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    try {
      await savePatient(formData);
      setFormData({
        name: '',
        age: '',
        gender: 'Female',
        isPregnant: false,
        village: '',
        phone: '',
        notes: '',
      });
      setShowAddModal(false);
      loadPatients();
    } catch (err) {
      console.error('Error saving patient:', err);
    }
  };

  const handleExportPDF = (patient) => {
    generateHealthPassportPDF(patient, patientHistory);
  };

  const handleSyncABDM = async () => {
    setIsSyncing(true);
    setSyncStatus(null);
    try {
      // Simulate sync POST to FastAPI backend endpoint
      const response = await fetch('http://localhost:8000/api/sync/records', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ashaWorkerId: 'ASHA_NASHIK_04',
          records: patientHistory.map((r) => ({
            id: r.id,
            patientId: r.patientId,
            patientName: r.patientName,
            riskScore: r.riskScore,
            riskLevel: r.riskLevel,
            timestamp: r.timestamp,
          })),
        }),
      });

      if (response.ok) {
        setSyncStatus('✅ Successfully synced records to ABDM server!');
      } else {
        setSyncStatus('ℹ️ Local records queued. Will sync automatically when connection restores.');
      }
    } catch (err) {
      setSyncStatus('ℹ️ Offline Mode: Patient records stored locally in IndexedDB. Sync will auto-trigger when backend connects.');
    }
    setIsSyncing(false);
  };

  const filteredPatients = patients.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.village.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-24 max-w-5xl mx-auto">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-extrabold text-2xl text-white flex items-center gap-2">
            <Users className="w-6 h-6 text-emerald-400" />
            <span>Patient Registry & Health Passports</span>
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            {patients.length} Patient Profile{patients.length !== 1 ? 's' : ''} Enrolled in Local Database
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-medium text-xs shadow-md transition-all"
        >
          <UserPlus className="w-4 h-4" />
          <span>Register Patient</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search by patient name or village..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-[#111111] border border-[#242424] rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#404040]"
        />
      </div>

      {/* Patient List Grid */}
      {filteredPatients.length === 0 ? (
        <div className="carbon-card p-10 text-center space-y-3 border border-[#242424]">
          <div className="w-12 h-12 rounded-xl bg-[#1A1A1A] border border-[#2E2E2E] flex items-center justify-center text-zinc-400 mx-auto">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-heading font-bold text-sm text-white">No Patient Records Found</h3>
            <p className="text-xs text-zinc-400 max-w-sm mx-auto mt-1">
              {searchQuery
                ? 'No patient matches your search query.'
                : 'Click "Register Patient" to create a new patient profile.'}
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {filteredPatients.map((p) => (
            <div
              key={p.id}
              onClick={() => openPatientDetail(p)}
              className="carbon-card p-4 cursor-pointer group space-y-2.5"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-heading font-bold text-sm text-white group-hover:text-emerald-400 transition-colors">
                      {p.name}
                    </h3>
                    {p.isPregnant && (
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-[#1F1C12] text-amber-400 border border-amber-900/40">
                        Pregnant
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    {p.gender}, {p.age} yrs
                  </p>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      openPatientQRModal(p);
                    }}
                    className="p-2 rounded-lg bg-[#1A1A1A] hover:bg-[#222222] text-zinc-400 hover:text-white border border-[#2E2E2E] transition-colors"
                    title="View Health Passport QR Code"
                  >

                    <QrCode className="w-4 h-4" />
                  </button>
                  <div className="p-2 text-zinc-500 group-hover:text-emerald-400 transition-colors">
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs text-zinc-400 pt-2 border-t border-[#222222]">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-zinc-500" />
                  {p.village || 'N/A'}
                </span>
                {p.phone && (
                  <span className="flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-zinc-500" />
                    {p.phone}
                  </span>
                )}
                <span className="flex items-center gap-1 ml-auto text-[11px] text-zinc-500">
                  <Calendar className="w-3.5 h-3.5" />
                  {new Date(p.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Patient Detail & Passport Drawer */}
      {selectedPatientForDetail && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#111111] border border-[#2A2A2A] rounded-2xl p-6 max-w-xl w-full max-h-[90vh] overflow-y-auto space-y-5 shadow-2xl">
            {/* Header */}
            <div className="flex items-start justify-between border-b border-[#242424] pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-heading font-extrabold text-xl text-white">
                    {selectedPatientForDetail.name}
                  </h3>
                  {selectedPatientForDetail.isPregnant && (
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-[#1F1C12] text-amber-400 border border-amber-900/40">
                      Pregnant
                    </span>
                  )}
                </div>
                <p className="text-xs text-zinc-400 mt-0.5">
                  ID: {selectedPatientForDetail.id} • {selectedPatientForDetail.gender}, {selectedPatientForDetail.age} yrs • Village: {selectedPatientForDetail.village}
                </p>
              </div>

              <button
                onClick={() => setSelectedPatientForDetail(null)}
                className="text-zinc-500 hover:text-white font-bold text-lg"
              >
                ✕
              </button>
            </div>

            {/* Quick Action Toolbar */}
            <div className="flex items-center justify-between gap-3 bg-[#181818] p-3 rounded-xl border border-[#262626]">
              <button
                onClick={() => handleExportPDF(selectedPatientForDetail)}
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-emerald-500 text-white font-medium text-xs hover:bg-emerald-600 transition-all"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Health Passport PDF</span>
              </button>

              <button
                onClick={handleSyncABDM}
                disabled={isSyncing}
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-[#222222] border border-[#333333] text-zinc-200 font-medium text-xs hover:bg-[#2A2A2A] transition-all disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                <span>Sync to ABDM Server</span>
              </button>
            </div>

            {syncStatus && (
              <div className="p-3 rounded-xl bg-[#161616] border border-[#262626] text-xs text-zinc-300">
                {syncStatus}
              </div>
            )}

            {/* Triage History Timeline */}
            <div className="space-y-3">
              <h4 className="font-heading font-bold text-sm text-white flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-400" />
                <span>Clinical Triage Assessment History</span>
              </h4>

              {patientHistory.length === 0 ? (
                <div className="p-4 bg-[#161616] rounded-xl border border-[#242424] text-center text-xs text-zinc-400">
                  No previous triage sessions recorded for this patient yet. Use Camera Scan or Voice Intake to record an assessment.
                </div>
              ) : (
                <div className="space-y-3">
                  {patientHistory.map((rec) => (
                    <div
                      key={rec.id}
                      className="p-4 rounded-xl bg-[#161616] border border-[#262626] space-y-2.5"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span className="text-zinc-400 font-medium">
                            {rec.sourceModule === 'CAMERA' ? '📸 Camera Scan' : rec.sourceModule === 'VOICE' ? '🎤 Voice Intake' : '📄 Report OCR'}
                          </span>
                          <span className="text-zinc-500 text-[10px]">
                            • {new Date(rec.timestamp).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </span>
                        </div>

                        <span
                          className={`font-bold px-2 py-0.5 rounded text-[10px] ${
                            rec.riskLevel === 'RED'
                              ? 'bg-[#1F1414] text-red-400 border border-red-900/40'
                              : rec.riskLevel === 'YELLOW'
                              ? 'bg-[#1F1C12] text-amber-400 border border-amber-900/40'
                              : 'bg-[#121F17] text-emerald-400 border border-emerald-900/40'
                          }`}
                        >
                          {rec.riskLevel} RISK ({rec.riskScore}/100)
                        </span>
                      </div>

                      {/* Condition & Chief Complaint */}
                      <div className="bg-[#1C1C1C] p-2.5 rounded-lg border border-[#2A2A2A]">
                        <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider block">
                          Diagnosis Category: {rec.diseaseCategory || rec.doctorSummary?.diseaseCategory || 'Clinical Consultation'}
                        </span>
                        <p className="text-xs text-zinc-300 mt-0.5">
                          <strong>Chief Complaint / Notes:</strong> {rec.chiefComplaint || rec.doctorSummary?.chiefComplaint || 'General checkup'}
                        </p>
                      </div>

                      {/* Doctor Summary Bullets */}
                      {(rec.doctorSummary?.summaryPoints || rec.cameraResult?.summaryBulletPoints || rec.ocrResult?.summaryBulletPoints || rec.voiceResult?.summaryBulletPoints) && (
                        <div className="space-y-1 text-xs text-zinc-300">
                          <strong className="text-zinc-400 text-[11px] block">Doctor Clinical Summary:</strong>
                          <ul className="space-y-1 pl-1">
                            {(rec.doctorSummary?.summaryPoints || rec.cameraResult?.summaryBulletPoints || rec.ocrResult?.summaryBulletPoints || rec.voiceResult?.summaryBulletPoints || []).map((pt, i) => (
                              <li key={i} className="flex items-start gap-1.5 text-zinc-300">
                                <span className="text-emerald-400 font-bold">•</span>
                                <span>{pt}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Q&A Doubt Highlights */}
                      {rec.chatHistory && rec.chatHistory.length > 0 && (
                        <div className="pt-2 border-t border-[#222222] text-[11px] text-zinc-400 space-y-1">
                          <strong className="text-emerald-400 font-medium block">Patient Doubts & Clarifications:</strong>
                          {rec.chatHistory.map((q, qi) => (
                            <div key={qi} className="bg-[#121212] p-2 rounded border border-[#242424]">
                              <p className={q.role === 'user' ? 'text-emerald-300 font-medium' : 'text-zinc-300 mt-1'}>
                                {q.role === 'user' ? `Q: ${q.text}` : `A: ${q.text}`}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

              )}
            </div>
          </div>
        </div>
      )}

      {/* Registration Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#111111] border border-[#2A2A2A] rounded-2xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#242424] pb-3">
              <h3 className="font-heading font-bold text-base text-white">
                Register New Patient
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-zinc-500 hover:text-white text-base font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sunita Devi"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-[#181818] border border-[#2A2A2A] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#404040]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">Age *</label>
                  <input
                    type="number"
                    required
                    placeholder="26"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                    className="w-full bg-[#181818] border border-[#2A2A2A] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#404040]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">Gender</label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    className="w-full bg-[#181818] border border-[#2A2A2A] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#404040]"
                  >
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                    <option value="Child">Child</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-2.5 bg-[#181818] p-3 rounded-xl border border-[#262626]">
                <input
                  type="checkbox"
                  id="isPregnant"
                  checked={formData.isPregnant}
                  onChange={(e) => setFormData({ ...formData, isPregnant: e.target.checked })}
                  className="w-4 h-4 rounded border-[#333333] text-emerald-500 focus:ring-0"
                />
                <label htmlFor="isPregnant" className="text-xs text-zinc-300 cursor-pointer">
                  Patient is currently pregnant
                </label>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">Village / District</label>
                  <input
                    type="text"
                    placeholder="e.g. Nashik Rural"
                    value={formData.village}
                    onChange={(e) => setFormData({ ...formData, village: e.target.value })}
                    className="w-full bg-[#181818] border border-[#2A2A2A] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#404040]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">Contact Phone</label>
                  <input
                    type="tel"
                    placeholder="9876543210"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-[#181818] border border-[#2A2A2A] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#404040]"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3 border-t border-[#242424]">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-xs text-zinc-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-500 text-white font-medium text-xs hover:bg-emerald-600"
                >
                  Save Patient Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Health Passport QR Modal */}
      {selectedPatientForQR && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#111111] border border-[#2A2A2A] rounded-2xl p-6 max-w-sm w-full space-y-4 text-center">
            <div className="flex items-center justify-between border-b border-[#242424] pb-2">
              <h3 className="font-heading font-bold text-xs text-zinc-400 uppercase tracking-wider">
                Health Passport QR Card
              </h3>
              <button
                onClick={() => setSelectedPatientForQR(null)}
                className="text-zinc-500 hover:text-white text-base font-bold"
              >
                ✕
              </button>
            </div>

            <div className="bg-white p-4 rounded-xl inline-block shadow-md">
              <QRCodeSVG
                value={JSON.stringify({
                  id: selectedPatientForQR.id,
                  name: selectedPatientForQR.name,
                  age: selectedPatientForQR.age,
                  gender: selectedPatientForQR.gender,
                  village: selectedPatientForQR.village,
                  isPregnant: selectedPatientForQR.isPregnant,
                  clinicalCaseHistory: patientQRHistory.map((h) => ({
                    date: new Date(h.timestamp).toLocaleDateString('en-IN'),
                    module: h.sourceModule,
                    category: h.diseaseCategory || h.doctorSummary?.diseaseCategory || 'Consultation',
                    complaint: h.chiefComplaint || 'General checkup',
                    riskLevel: h.riskLevel,
                    score: h.riskScore,
                    summary: h.doctorSummary?.summaryPoints || h.cameraResult?.summaryBulletPoints || h.ocrResult?.summaryBulletPoints || [],
                  })),
                  platform: 'ArogyaSetu Edge AI',
                })}
                size={170}
              />

            </div>

            <div>
              <h4 className="font-heading font-bold text-base text-white">{selectedPatientForQR.name}</h4>
              <p className="text-xs text-zinc-500">ID: {selectedPatientForQR.id}</p>
              <p className="text-xs text-emerald-400 font-medium mt-1">
                Scan at Primary Health Centre for instant clinical history
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
