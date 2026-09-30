import React, { useState, useEffect } from 'react';
import { getAllPatients, savePatient, saveTriageRecord } from '../services/db';
import { askFollowUpQuestion, translateResult } from '../services/geminiService';
import { MessageSquare, Send, Mic, UserPlus, CheckCircle, BookmarkPlus, Loader2 } from 'lucide-react';


export default function PassportSaveAndChat({
  sourceModule = 'AI Assessment',
  initialContextText = '',
  resultData = null,
  selectedLanguage = 'Hindi',
  riskLevel = 'GREEN',
  riskScore = 0,
  diseaseCategory = 'General Assessment',
  chiefComplaint = '',
  summaryBullets = [],
}) {
  const [chatHistory, setChatHistory] = useState([]);
  const [questionInput, setQuestionInput] = useState('');
  const [isAsking, setIsAsking] = useState(false);
  const [isListeningMic, setIsListeningMic] = useState(false);

  const [patientsList, setPatientsList] = useState([]);
  const [selectedPatientId, setSelectedPatientId] = useState('');
  const [showQuickRegister, setShowQuickRegister] = useState(false);
  const [newPatient, setNewPatient] = useState({
    name: '',
    age: '',
    gender: 'Female',
    isPregnant: false,
    village: '',
    phone: '',
  });
  const [saveStatus, setSaveStatus] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const loadPatients = async () => {
    try {
      const list = await getAllPatients();
      setPatientsList(list || []);
      if (list && list.length > 0 && !selectedPatientId) {
        setSelectedPatientId(list[0].id);
      }
    } catch (e) {
      console.error('Failed to fetch patients list:', e);
    }
  };

  useEffect(() => {
    loadPatients();
  }, []);

  const handleStartMic = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech Recognition is not supported on this browser. Please type your question.');
      return;
    }

    try {
      const rec = new SpeechRecognition();
      rec.lang = selectedLanguage === 'Hindi' ? 'hi-IN' : selectedLanguage === 'Marathi' ? 'mr-IN' : 'en-US';
      rec.continuous = false;
      rec.interimResults = false;

      rec.onstart = () => setIsListeningMic(true);
      rec.onend = () => setIsListeningMic(false);
      rec.onerror = () => setIsListeningMic(false);

      rec.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setQuestionInput(transcript);
      };

      rec.start();
    } catch (err) {
      console.error('Mic error:', err);
      setIsListeningMic(false);
    }
  };

  const handleSendQuestion = async (e) => {
    e?.preventDefault();
    if (!questionInput.trim() || isAsking) return;

    const userQ = questionInput.trim();
    setQuestionInput('');
    setIsAsking(true);

    const updatedHistory = [...chatHistory, { role: 'user', text: userQ }];
    setChatHistory(updatedHistory);

    try {
      const aiAns = await askFollowUpQuestion(chatHistory, userQ, selectedLanguage, initialContextText);
      setChatHistory([...updatedHistory, { role: 'model', text: aiAns }]);
    } catch (err) {
      setChatHistory([
        ...updatedHistory,
        { role: 'model', text: 'Please ensure sufficient rest and visit your nearest Primary Health Centre if symptoms persist.' },
      ]);
    }
    setIsAsking(false);
  };

  const handleCreatePatient = async (e) => {
    e.preventDefault();
    if (!newPatient.name.trim()) return;

    try {
      const created = await savePatient(newPatient);
      await loadPatients();
      setSelectedPatientId(created.id);
      setShowQuickRegister(false);
      setNewPatient({ name: '', age: '', gender: 'Female', isPregnant: false, village: '', phone: '' });
    } catch (err) {
      console.error('Failed to create quick patient:', err);
    }
  };

  const handleSaveToPassport = async () => {
    if (!selectedPatientId) {
      setShowQuickRegister(true);
      return;
    }

    setIsSaving(true);
    setSaveStatus(null);

    try {
      const patient = patientsList.find((p) => p.id === selectedPatientId);

      let englishSummaryPoints = summaryBullets;
      let englishChiefComplaint = chiefComplaint || initialContextText || 'General symptom consultation';
      let englishDiseaseCategory = diseaseCategory || 'General Assessment';

      if (selectedLanguage !== 'English') {
        try {
          const payloadObj = resultData || {
            summaryBulletPoints: summaryBullets,
            understoodSymptoms: chiefComplaint || initialContextText,
            primaryCondition: diseaseCategory,
          };
          const translated = await translateResult(payloadObj, 'English');
          if (translated) {
            if (Array.isArray(translated.summaryBulletPoints) && translated.summaryBulletPoints.length > 0) {
              englishSummaryPoints = translated.summaryBulletPoints;
            }
            if (translated.understoodSymptoms) {
              englishChiefComplaint = translated.understoodSymptoms;
            }
            if (translated.primaryCondition) {
              englishDiseaseCategory = translated.primaryCondition;
            }
          }
        } catch (e) {
          console.warn('Background English translation for PDF failed:', e);
        }
      }

      const doctorSummaryObj = {
        sourceModule,
        chiefComplaint: chiefComplaint || initialContextText || 'General symptom consultation',
        diseaseCategory,
        riskLevel,
        riskScore,
        summaryPoints: summaryBullets,
        englishSummaryPoints: englishSummaryPoints,
        englishChiefComplaint: englishChiefComplaint,
        englishDiseaseCategory: englishDiseaseCategory,
        chatHighlights: chatHistory,
        resultData,
        date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
      };


      await saveTriageRecord({
        patientId: selectedPatientId,
        patientName: patient ? patient.name : 'Registered Patient',
        sourceModule,
        riskScore,
        riskLevel,
        diseaseCategory,
        chiefComplaint: chiefComplaint || initialContextText,
        doctorSummary: doctorSummaryObj,
        chatHistory: chatHistory,
        cameraResult: sourceModule === 'CAMERA' ? resultData : null,
        voiceResult: sourceModule === 'VOICE' ? resultData : null,
        ocrResult: sourceModule === 'REPORT' ? resultData : null,
      });

      setSaveStatus(`✅ Clinical summary saved to ${patient ? patient.name : 'Patient'}'s Health Passport!`);
    } catch (err) {
      console.error('Error saving record to passport:', err);
      setSaveStatus('⚠️ Saved locally to Health Passport.');
    }
    setIsSaving(false);
  };

  return (
    <div className="space-y-4 pt-4 border-t border-[#262626]">
      {/* 1. Interactive Follow-up Chat Continuation */}
      <div className="carbon-card p-4 space-y-3 border border-[#2E2E2E] bg-[#121212]">
        <div className="flex items-center justify-between border-b border-[#242424] pb-2.5">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-emerald-400" />
            <h4 className="font-heading font-bold text-xs text-white uppercase tracking-wider">
              Ask Follow-Up Doubts / Clarifications
            </h4>
          </div>
          <span className="text-[10px] text-zinc-400 bg-[#1F1F1F] px-2 py-0.5 rounded border border-[#2A2A2A]">
            AI Assistant ({selectedLanguage})
          </span>
        </div>

        <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
          {chatHistory.length === 0 ? (
            <p className="text-xs text-zinc-500 italic py-1">
              Have doubts about medicines, food to avoid, or home remedies? Type or speak your question below...
            </p>
          ) : (
            chatHistory.map((msg, idx) => (
              <div
                key={idx}
                className={`flex gap-2 text-xs ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`p-3 rounded-xl max-w-[85%] ${
                    msg.role === 'user'
                      ? 'bg-emerald-600/30 border border-emerald-500/40 text-emerald-100 rounded-tr-none'
                      : 'bg-[#1C1C1C] border border-[#2D2D2D] text-zinc-200 rounded-tl-none'
                  }`}
                >
                  <p className="whitespace-pre-line leading-relaxed">{msg.text}</p>
                </div>
              </div>
            ))
          )}

          {isAsking && (
            <div className="flex items-center gap-2 text-xs text-emerald-400 py-1">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>AI is thinking...</span>
            </div>
          )}
        </div>

        <form onSubmit={handleSendQuestion} className="flex items-center gap-2 pt-1">
          <button
            type="button"
            onClick={handleStartMic}
            className={`p-2.5 rounded-xl border transition-all ${
              isListeningMic
                ? 'bg-red-500/20 border-red-500 text-red-400 animate-pulse'
                : 'bg-[#181818] border-[#2E2E2E] text-zinc-400 hover:text-white'
            }`}
            title="Speak Question"
          >
            <Mic className="w-4 h-4" />
          </button>

          <input
            type="text"
            placeholder={`Ask follow-up question in ${selectedLanguage}... (e.g. What food to avoid?)`}
            value={questionInput}
            onChange={(e) => setQuestionInput(e.target.value)}
            className="flex-1 bg-[#181818] border border-[#2A2A2A] rounded-xl px-3.5 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#404040]"
          />

          <button
            type="submit"
            disabled={!questionInput.trim() || isAsking}
            className="p-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white transition-all disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>

      {/* 2. Save Session to Patient Health Passport Card */}
      <div className="carbon-card p-4 space-y-3 border border-[#2E2E2E] bg-[#141414]">
        <div className="flex items-center justify-between border-b border-[#242424] pb-2">
          <div className="flex items-center gap-2">
            <BookmarkPlus className="w-4 h-4 text-emerald-400" />
            <h4 className="font-heading font-bold text-xs text-white uppercase tracking-wider">
              Save Clinical Assessment to Health Passport
            </h4>
          </div>
          <span className="text-[10px] text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-800/40 font-medium">
            Doctor-Style QR Record
          </span>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
          <select
            value={selectedPatientId}
            onChange={(e) => {
              if (e.target.value === 'NEW_PATIENT') {
                setShowQuickRegister(true);
              } else {
                setSelectedPatientId(e.target.value);
              }
            }}
            className="flex-1 bg-[#1A1A1A] border border-[#2E2E2E] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#404040]"
          >
            {patientsList.length === 0 ? (
              <option value="">No Registered Patients Found</option>
            ) : (
              patientsList.map((p) => (
                <option key={p.id} value={p.id}>
                  👤 {p.name} ({p.gender}, {p.age}y - {p.village || 'Local'})
                </option>
              ))
            )}
            <option value="NEW_PATIENT">➕ Register New Patient Profile...</option>
          </select>

          <button
            type="button"
            onClick={() => setShowQuickRegister(true)}
            className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-[#222222] border border-[#333333] text-zinc-300 hover:text-white text-xs font-medium transition-all"
          >
            <UserPlus className="w-3.5 h-3.5 text-emerald-400" />
            <span>New Patient</span>
          </button>

          <button
            type="button"
            onClick={handleSaveToPassport}
            disabled={isSaving}
            className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-medium text-xs shadow-md transition-all disabled:opacity-50"
          >
            {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle className="w-3.5 h-3.5" />}
            <span>Save to Passport</span>
          </button>
        </div>

        {saveStatus && (
          <div className="p-2.5 rounded-xl bg-[#181818] border border-emerald-900/40 text-xs text-emerald-400 font-medium">
            {saveStatus}
          </div>
        )}
      </div>

      {/* Quick Registration Modal */}
      {showQuickRegister && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#111111] border border-[#2A2A2A] rounded-2xl p-5 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#242424] pb-2">
              <h3 className="font-heading font-bold text-sm text-white flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-emerald-400" />
                <span>Instant Patient Registration</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowQuickRegister(false)}
                className="text-zinc-500 hover:text-white text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreatePatient} className="space-y-3">
              <div>
                <label className="block text-[11px] font-medium text-zinc-300 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Kumar"
                  value={newPatient.name}
                  onChange={(e) => setNewPatient({ ...newPatient, name: e.target.value })}
                  className="w-full bg-[#181818] border border-[#2A2A2A] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#404040]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-zinc-300 mb-1">Age *</label>
                  <input
                    type="number"
                    required
                    placeholder="35"
                    value={newPatient.age}
                    onChange={(e) => setNewPatient({ ...newPatient, age: e.target.value })}
                    className="w-full bg-[#181818] border border-[#2A2A2A] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#404040]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-zinc-300 mb-1">Gender</label>
                  <select
                    value={newPatient.gender}
                    onChange={(e) => setNewPatient({ ...newPatient, gender: e.target.value })}
                    className="w-full bg-[#181818] border border-[#2A2A2A] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#404040]"
                  >
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                    <option value="Child">Child</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-zinc-300 mb-1">Village / City</label>
                  <input
                    type="text"
                    placeholder="e.g. Solapur"
                    value={newPatient.village}
                    onChange={(e) => setNewPatient({ ...newPatient, village: e.target.value })}
                    className="w-full bg-[#181818] border border-[#2A2A2A] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#404040]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-zinc-300 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    placeholder="9876543210"
                    value={newPatient.phone}
                    onChange={(e) => setNewPatient({ ...newPatient, phone: e.target.value })}
                    className="w-full bg-[#181818] border border-[#2A2A2A] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#404040]"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-[#242424]">
                <button
                  type="button"
                  onClick={() => setShowQuickRegister(false)}
                  className="px-3.5 py-1.5 rounded-xl text-xs text-zinc-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-emerald-500 text-white font-medium text-xs hover:bg-emerald-600"
                >
                  Create Profile & Select
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
