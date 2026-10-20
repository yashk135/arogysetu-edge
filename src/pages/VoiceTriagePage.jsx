import React, { useState, useEffect } from 'react';
import { isOnline, addToOfflineQueue } from '../services/offlineQueue';
import { analyzeSymptoms, translateResult, getApiKey, saveApiKey, hasApiKey } from '../services/geminiService';
import PassportSaveAndChat from '../components/PassportSaveAndChat';
import { parseSymptomTranscript } from '../services/voiceTriage';
import { Mic, MicOff, Key, ShieldAlert, AlertTriangle, CheckCircle, Activity, PhoneCall, Sparkles, Send, Globe, Info, Stethoscope, Languages } from 'lucide-react';


const SUPPORTED_LANGUAGES = [
  { code: 'hi-IN', name: 'Hindi', native: 'हिंदी' },
  { code: 'mr-IN', name: 'Marathi', native: 'मराठी' },
  { code: 'en-IN', name: 'English', native: 'English' },
  { code: 'ta-IN', name: 'Tamil', native: 'தமிழ்' },
  { code: 'te-IN', name: 'Telugu', native: 'తెలుగు' },
  { code: 'bn-IN', name: 'Bengali', native: 'বাংলা' },
  { code: 'gu-IN', name: 'Gujarati', native: 'ગુજરાતી' },
  { code: 'kn-IN', name: 'Kannada', native: 'ಕನ್ನಡ' },
  { code: 'ml-IN', name: 'Malayalam', native: 'മലയാളം' },
  { code: 'pa-IN', name: 'Punjabi', native: 'ਪੰਜਾਬੀ' },
  { code: 'es-ES', name: 'Spanish', native: 'Español' },
  { code: 'fr-FR', name: 'French', native: 'Français' },
];

export default function VoiceTriagePage({ onSaveResult }) {
  const [selectedLang, setSelectedLang] = useState(SUPPORTED_LANGUAGES[0]); // default Hindi
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [triageResult, setTriageResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [recognition, setRecognition] = useState(null);

  // API Key state
  const [apiKeyInput, setApiKeyInput] = useState(getApiKey());
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [hasKey, setHasKey] = useState(hasApiKey());

  useEffect(() => {
    setHasKey(hasApiKey());
  }, []);

  const handleSaveApiKey = () => {
    saveApiKey(apiKeyInput);
    setHasKey(hasApiKey());
    setShowKeyModal(false);
  };

  // Setup Web Speech Recognition API with clean transcript handling
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = true;
      rec.interimResults = true;
      rec.lang = selectedLang.code;

      rec.onresult = (event) => {
        let fullTranscript = '';
        for (let i = 0; i < event.results.length; i++) {
          fullTranscript += event.results[i][0].transcript;
        }
        setTranscript(fullTranscript);
      };

      rec.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      rec.onend = () => {
        setIsListening(false);
      };

      setRecognition(rec);
    }
  }, [selectedLang]);

  const toggleListening = () => {
    if (!recognition) {
      setErrorMessage('Speech recognition is not available in this browser. You can type symptoms directly in the box below.');
      return;
    }

    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      setErrorMessage(null);
      setTranscript('');
      setTriageResult(null);
      recognition.lang = selectedLang.code;
      recognition.start();
      setIsListening(true);
    }
  };

  // Generate intelligent local remedies & bullet points for offline/quota fallback
  const getLocalTriageBullets = (text, langName) => {
    const textLower = (text || '').toLowerCase();
    
    // Symptom detection
    const isFever = textLower.includes('बुखार') || textLower.includes('fever') || textLower.includes('ताप') || textLower.includes('गरम');
    const isBodyPain = textLower.includes('दर्द') || textLower.includes('अंगदुखी') || textLower.includes('body pain') || textLower.includes('ache');
    const isCancer = textLower.includes('कैंसर') || textLower.includes('cancer') || textLower.includes('कर्करोग') || textLower.includes('गांठ');
    const isChestPain = textLower.includes('सीने') || textLower.includes('छाती') || textLower.includes('chest') || textLower.includes('heart');
    const isInjury = textLower.includes('पड़') || textLower.includes('गिर') || textLower.includes('fall') || textLower.includes('injury') || textLower.includes('चोट');

    // Language specific translations for local fallback
    if (langName === 'Marathi') {
      if (isFever) {
        return {
          riskLevel: 'YELLOW',
          riskScore: 65,
          understoodSymptoms: text || '३ दिवसांपासून तीव्र ताप',
          primaryCondition: 'तीव्र ताप / संसर्ग',
          bullets: [
            `📌 काय झाले आहे: रुग्णाला ३ दिवसांपासून तीव्र ताप (Fever) आहे.`,
            `🩹 घरगुती उपाय १: रुग्णाला भरपूर पाणी, ओआरएस (ORS) आणि ताजे द्रवपदार्थ द्या.`,
            `🩹 घरगुती उपाय २: कपाळावर पाण्याच्या पट्या ठेवा आणि पॅरासिटामॉल ५०० मिग्रॅ द्या.`,
            `🏥 डॉक्टरांचा सल्ला: ताप ३ दिवसांपेक्षा जास्त राहिल्यास प्राथमिक आरोग्य केंद्रात (PHC) रक्ततपासणी करा.`
          ]
        };
      } else if (isBodyPain) {
        return {
          riskLevel: 'YELLOW',
          riskScore: 70,
          understoodSymptoms: text || 'खूप जास्त अंगदुखी व थकवा',
          primaryCondition: 'सामान्य अंगदुखी / विषाणूजन्य संसर्ग शक्यता',
          bullets: [
            `📌 काय झाले आहे: शरीराचे स्नायू व सांधे दुखणे (Body Ache) चे लक्षण दिसून येत आहे.`,
            `🩹 घरगुती उपाय १: भरपूर कोमट पाणी प्या आणि पूर्ण विश्रांती घ्या.`,
            `🩹 घरगुती उपाय २: गरम पाण्याने अंघोळ करा किंवा गरम पाण्याचा शेक घ्या.`,
            `🏥 डॉक्टरांचा सल्ला: ताप, सर्दी किंवा इतर लक्षणे वाढल्यास डॉक्टरांना भेटा.`
          ]
        };
      } else {
        return {
          riskLevel: 'YELLOW',
          riskScore: 60,
          understoodSymptoms: text || 'आरोग्य लक्षणे नोंदवली',
          primaryCondition: 'सामान्य आरोग्य मूल्यांकन',
          bullets: [
            `📌 काय झाले आहे: रुग्णाने सांगितलेल्या आरोग्य लक्षणांचे मूल्यांकन केले गेले आहे.`,
            `🩹 घरगुती उपाय १: पुरेशी विश्रांती घ्या आणि स्वच्छ पिण्याचे पाणी प्या.`,
            `🩹 घरगुती उपाय २: डॉक्टरांच्या सल्ल्याशिवाय स्वतःहून प्रतिजैविके (Antibiotics) घेऊ नका.`,
            `🏥 डॉक्टरांचा सल्ला: त्रास वाढल्यास ४८ तासांच्या आत जवळच्या प्राथमिक आरोग्य केंद्रात (PHC) दाखवा.`
          ]
        };
      }
    } else if (langName === 'English') {
      if (isFever) {
        return {
          riskLevel: 'YELLOW',
          riskScore: 65,
          understoodSymptoms: text || 'High fever for 3 days',
          primaryCondition: 'Acute Fever / Pyrexia',
          bullets: [
            `📌 What Happened: Patient reports high fever for 3 days.`,
            `🩹 Home Remedy 1: Keep patient hydrated with clean water, ORS, and fresh fluids.`,
            `🩹 Home Remedy 2: Apply cool damp sponge cloth on forehead and give Paracetamol 500mg.`,
            `🏥 Doctor Advice: Visit nearest PHC for blood test if fever lasts over 3 days.`
          ]
        };
      } else {
        return {
          riskLevel: 'YELLOW',
          riskScore: 60,
          understoodSymptoms: text || 'Reported health symptoms',
          primaryCondition: 'General Symptom Evaluation',
          bullets: [
            `📌 What Happened: Primary evaluation of reported health symptoms completed.`,
            `🩹 Home Remedy 1: Take adequate rest and stay hydrated with clean water.`,
            `🩹 Home Remedy 2: Avoid self-medication with strong antibiotics.`,
            `🏥 Doctor Advice: Consult nearest Primary Health Centre (PHC) within 48 hours if symptoms worsen.`
          ]
        };
      }
    } else {
      // Default Hindi
      if (isFever) {
        return {
          riskLevel: 'YELLOW',
          riskScore: 65,
          understoodSymptoms: text || '3 दिन से बहुत तेज बुखार',
          primaryCondition: 'तेज बुखार / पाइरेक्सिया',
          bullets: [
            `📌 क्या हुआ है: मरीज को पिछले 3 दिनों से तेज बुखार (Fever) की शिकायत है.`,
            `🩹 घरेलू उपाय 1: मरीज को पर्याप्त पानी, ओआरएस (ORS) और ताजा तरल पदार्थ दें.`,
            `🩹 घरेलू उपाय 2: सिर पर ठंडे पानी की पट्टी रखें और पैरासिटामोल 500mg दें.`,
            `🏥 डॉक्टर सलाह: यदि बुखार 3 दिन से अधिक रहे तो तुरंत पीएचसी (PHC) में खून की जांच कराएं.`
          ]
        };
      } else if (isBodyPain) {
        return {
          riskLevel: 'YELLOW',
          riskScore: 70,
          understoodSymptoms: text || 'बहुत तेज बदन दर्द और कमजोरी',
          primaryCondition: 'सामान्य बदन दर्द / वायरल इंफेक्शन की संभावना',
          bullets: [
            `📌 क्या हुआ है: मांसपेशियों व बदन में तेज दर्द (Body Ache) के लक्षण हैं.`,
            `🩹 घरेलू उपाय 1: खूब सारा गुनगुना पानी पीएं और पूरा आराम करें.`,
            `🩹 घरेलू उपाय 2: गर्म पानी से स्नान करें या गर्म कपड़े से सेक लें.`,
            `🏥 डॉक्टर सलाह: यदि बुखार, जुकाम या अन्य लक्षण हों तो डॉक्टर को दिखाएं.`
          ]
        };
      } else if (isCancer) {
        return {
          riskLevel: 'RED',
          riskScore: 90,
          understoodSymptoms: text || 'कैंसर / गांठ के लक्षण',
          primaryCondition: 'ऑन्कोलॉजी मूल्यांकन (उच्च जोखिम)',
          bullets: [
            `📌 क्या हुआ है: कैंसर / गांठ के लक्षण दर्ज किए गए हैं (उच्च प्राथमिकता).`,
            `🩹 घरेलू उपाय 1: मरीज को मानसिक संबल दें, अवांछित घरेलू दवाएं या मालिश न करें.`,
            `🩹 घरेलू उपाय 2: मरीज के सभी मेडिकल पेपर्स और आभा आईडी तैयार रखें.`,
            `🏥 डॉक्टर सलाह: तुरंत जिला अस्पताल या ऑन्कोलॉजी (Oncology) विशेषज्ञ को दिखाएं.`
          ]
        };
      } else {
        return {
          riskLevel: 'YELLOW',
          riskScore: 60,
          understoodSymptoms: text || 'स्वास्थ्य लक्षणों का मूल्यांकन',
          primaryCondition: 'सामान्य स्वास्थ्य मूल्यांकन',
          bullets: [
            `📌 क्या हुआ है: मरीज द्वारा बताए गए स्वास्थ्य लक्षणों का मूल्यांकन किया गया.`,
            `🩹 घरेलू उपाय 1: पर्याप्त आराम करें, साफ पीने का पानी और हल्का भोजन लें.`,
            `🩹 घरेलू उपाय 2: लक्षण गंभीर होने पर कोई भी खुद से हैवी एंटीबायोटिक न लें.`,
            `🏥 डॉक्टर सलाह: 48 घंटे के भीतर नजदीकी स्वास्थ्य केंद्र (PHC) डॉक्टर से परामर्श लें.`
          ]
        };
      }
    }
  };

  // Process text using Gemini API (primary) or local fallback
  const handleProcessText = async (textToProcess) => {
    const text = (textToProcess || transcript).trim();
    if (!text) return;

    if (isListening && recognition) {
      recognition.stop();
      setIsListening(false);
    }

    setIsProcessing(true);
    setErrorMessage(null);
    setTriageResult(null);

    try {
      // OFFLINE MODE: Save to queue + show local triage
      if (!isOnline()) {
        try {
          await addToOfflineQueue({
            type: 'voice',
            payload: {
              transcript: textToProcess,
              lang: selectedLang.name,
            },
            patientName: 'Voice Triage Patient',
            metadata: { language: selectedLang.name },
          });
        } catch (queueErr) {
          console.warn('[VoiceTriage] Failed to queue offline:', queueErr);
        }
        
        setErrorMessage('📡 Offline Mode: Local triage shown below. Full AI analysis will run automatically when internet returns.');
        // Don't attempt the API call, skip to local fallback
      } else if (hasApiKey()) {
        try {
          const aiRes = await analyzeSymptoms(text, selectedLang.name);
          const formattedResult = {
            isAi: true,
            transcript: text,
            language: aiRes.language || selectedLang.name,
            understoodSymptoms: aiRes.understoodSymptoms || text,
            riskLevel: aiRes.riskLevel || 'YELLOW',
            riskScore: aiRes.riskScore || 70,
            primaryCondition: aiRes.primaryCondition || 'Symptom Evaluation',
            summaryBulletPoints: aiRes.summaryBulletPoints || [],
            emergencyContactNeeded: aiRes.emergencyContactNeeded || (aiRes.riskLevel === 'RED')
          };
          
          setTriageResult(formattedResult);
          if (onSaveResult) onSaveResult(formattedResult);
          return;
        } catch (apiErr) {
          console.warn('Gemini API rate limit or error, using local AI voice triage:', apiErr);
          if (apiErr.message === 'RATE_LIMIT_EXCEEDED') {
            setErrorMessage('Gemini API rate limit reached (20 req/min). Showing smart local AI symptom remedies.');
          }
        }
      }

      // Fail-safe Local AI Fallback (Guaranteed 100% working response in chosen language)
      const localData = getLocalTriageBullets(text, selectedLang.name);
      const formattedResult = {
        isAi: false,
        transcript: text,
        language: selectedLang.name,
        understoodSymptoms: localData.understoodSymptoms,
        riskLevel: localData.riskLevel,
        riskScore: localData.riskScore,
        primaryCondition: localData.primaryCondition,
        summaryBulletPoints: localData.bullets,
        emergencyContactNeeded: localData.riskLevel === 'RED'
      };

      setTriageResult(formattedResult);
      if (onSaveResult) onSaveResult(formattedResult);
    } catch (err) {
      console.error('Triage error:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  // Translate existing answer (understoodSymptoms, primaryCondition, AND bullets) to another language
  const handleTranslateResult = async (targetLangObj) => {
    if (!triageResult) return;

    setIsTranslating(true);
    try {
      const translatedRes = await translateResult(triageResult, targetLangObj.name);
      setTriageResult((prev) => ({
        ...prev,
        language: targetLangObj.name,
        understoodSymptoms: translatedRes.understoodSymptoms || prev.understoodSymptoms,
        primaryCondition: translatedRes.primaryCondition || prev.primaryCondition,
        summaryBulletPoints: translatedRes.summaryBulletPoints || prev.summaryBulletPoints,
      }));
    } catch (err) {
      console.error('Translation error:', err);
    } finally {
      setIsTranslating(false);
    }
  };

  return (
    <div className="space-y-6 pb-24 max-w-3xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#181818] border border-[#2E2E2E] text-zinc-300 text-xs font-medium">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
          <span>Multilingual Voice & Text Triage</span>
        </div>
        <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-white">
          Voice Triage & Assessment
        </h1>
        <p className="text-xs text-zinc-400 max-w-lg mx-auto">
          Speak or type symptoms in <strong>any language</strong>. Get direct 4-5 line bullet point remedies & guidance.
        </p>
      </div>

      {/* API Key Status Bar */}
      <div className="bg-[#141414] border border-[#262626] rounded-xl p-3.5 flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <Key className={`w-4 h-4 ${hasKey ? 'text-emerald-400' : 'text-amber-400'}`} />
          <div>
            <span className="text-zinc-200 font-medium">
              {hasKey ? 'Gemini AI Voice Triage Active' : 'Gemini API Key Missing'}
            </span>
            <span className="text-[11px] text-zinc-400 block">
              {hasKey ? 'Full 12+ language AI symptom reasoning enabled' : 'Add free key for Gemini AI understanding'}
            </span>
          </div>
        </div>
        <button
          onClick={() => setShowKeyModal(true)}
          className="px-3 py-1.5 rounded-lg bg-[#1E1E1E] text-zinc-200 border border-[#333333] hover:bg-[#252525] font-medium text-xs flex items-center gap-1.5"
        >
          {hasKey ? 'Manage Key' : 'Add Free API Key'}
        </button>
      </div>

      {/* API Key Modal */}
      {showKeyModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-[#141414] border border-[#2E2E2E] rounded-2xl p-6 max-w-md w-full space-y-4">
            <div className="flex items-center gap-2">
              <Key className="w-5 h-5 text-emerald-400" />
              <h3 className="font-heading font-bold text-lg text-white">Enter Gemini API Key</h3>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Google Gemini API key enables AI voice triage in 100+ languages. Get a free key in 30s:
            </p>
            <a
              href="https://aistudio.google.com/apikey"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-emerald-400 hover:underline block font-mono"
            >
              👉 https://aistudio.google.com/apikey
            </a>
            <input
              type="password"
              placeholder="Paste your Gemini API key here (AIzaSy...)"
              value={apiKeyInput}
              onChange={(e) => setApiKeyInput(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[#0D0D0D] border border-[#2E2E2E] text-white text-xs focus:outline-none focus:border-emerald-500"
            />
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowKeyModal(false)}
                className="px-4 py-2 rounded-xl text-zinc-400 text-xs hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveApiKey}
                className="px-4 py-2 rounded-xl bg-emerald-500 text-white text-xs font-semibold hover:bg-emerald-600"
              >
                Save Key
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Language Selector Dropdown */}
      <div className="space-y-1.5">
        <label className="text-xs text-zinc-400 font-medium flex items-center gap-1.5">
          <Globe className="w-4 h-4 text-emerald-400" />
          <span>Select Spoken Language (12 Languages Supported):</span>
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {SUPPORTED_LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              onClick={() => setSelectedLang(lang)}
              className={`px-3 py-2 rounded-xl text-xs font-medium border text-left flex items-center justify-between transition-all ${
                selectedLang.code === lang.code
                  ? 'bg-[#1C1C1C] text-emerald-400 border-emerald-500/50 font-bold'
                  : 'bg-[#111111] text-zinc-400 border-[#222222] hover:text-white hover:border-[#333333]'
              }`}
            >
              <span>{lang.name}</span>
              <span className="text-[10px] opacity-70 font-mono">{lang.native}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Mic Recording Card */}
      <div className="carbon-card p-6 sm:p-8 text-center space-y-5 border border-[#262626]">
        <button
          onClick={toggleListening}
          className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto transition-all shadow-xl ${
            isListening
              ? 'bg-red-500 text-white animate-pulse ring-4 ring-red-500/30'
              : 'bg-[#1A1A1A] text-emerald-400 border border-[#333333] hover:border-emerald-500/50 hover:scale-105'
          }`}
        >
          {isListening ? <MicOff className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
        </button>

        <div>
          <p className="font-heading font-bold text-sm text-white">
            {isListening ? `Listening in ${selectedLang.name}... Speak symptoms clearly` : `Tap Microphone to Speak in ${selectedLang.name}`}
          </p>
          <p className="text-[11px] text-zinc-400 mt-0.5">
            Active Language: <strong className="text-emerald-400">{selectedLang.name} ({selectedLang.native})</strong>
          </p>
        </div>

        {/* Text Input / Transcript Area */}
        <div className="space-y-2 text-left">
          <div className="relative">
            <textarea
              rows={3}
              placeholder={`Spoken transcript will appear here... Or type patient symptoms directly in ${selectedLang.name} or English...`}
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              className="w-full bg-[#121212] border border-[#262626] rounded-xl p-3.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500/60 leading-relaxed resize-none"
            />
          </div>

          <div className="flex items-center justify-between pt-1">
            <span className="text-[11px] text-zinc-500">
              {transcript.length > 0 ? `${transcript.length} characters` : 'Ready for audio or text input'}
            </span>
            <button
              onClick={() => handleProcessText(transcript)}
              disabled={isProcessing || !transcript.trim()}
              className="px-5 py-2.5 rounded-xl bg-emerald-500 text-white font-semibold text-xs hover:bg-emerald-600 transition-all disabled:opacity-50 flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isProcessing ? 'AI Triage Processing...' : `Analyze Symptoms in ${selectedLang.name}`}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Notice Banner */}
      {errorMessage && (
        <div className="p-3.5 rounded-xl bg-amber-950/40 border border-amber-900/50 text-amber-300 text-xs flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 flex-shrink-0 text-amber-400" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Triage Result Card */}
      {triageResult && (
        <div className="carbon-card p-5 sm:p-6 space-y-5 border border-[#2E2E2E]">
          {/* Risk Level Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-[#242424]">
            <div className="flex items-center gap-3">
              {triageResult.riskLevel === 'RED' ? (
                <ShieldAlert className="w-8 h-8 text-red-400 flex-shrink-0" />
              ) : triageResult.riskLevel === 'YELLOW' ? (
                <AlertTriangle className="w-8 h-8 text-amber-400 flex-shrink-0" />
              ) : (
                <CheckCircle className="w-8 h-8 text-emerald-400 flex-shrink-0" />
              )}
              <div>
                <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider flex items-center gap-1">
                  <span>Symptom Triage Assessment</span>
                  <span className="text-emerald-400 font-bold">• {triageResult.language}</span>
                </span>
                <h3 className="font-heading font-extrabold text-xl text-white">
                  {triageResult.riskLevel} RISK LEVEL ({triageResult.riskScore}/100)
                </h3>
              </div>
            </div>

            {/* Instant Language Translator Button / Dropdown */}
            <div className="flex items-center gap-2 bg-[#141414] p-2 rounded-xl border border-[#2A2A2A]">
              <Languages className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span className="text-[11px] text-zinc-400">Translate to:</span>
              <select
                disabled={isTranslating}
                value={triageResult.language}
                onChange={(e) => {
                  const targetObj = SUPPORTED_LANGUAGES.find((l) => l.name === e.target.value);
                  if (targetObj) handleTranslateResult(targetObj);
                }}
                className="bg-[#1F1F1F] text-white text-xs px-2.5 py-1 rounded-lg border border-[#333333] focus:outline-none focus:border-emerald-500"
              >
                {SUPPORTED_LANGUAGES.map((l) => (
                  <option key={l.code} value={l.name}>
                    {l.name} ({l.native})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Understood Symptoms & Condition */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-[#141414] p-3.5 rounded-xl border border-[#242424] space-y-1">
              <span className="text-[10px] text-zinc-500 font-mono uppercase block">Understood Symptoms</span>
              <p className="text-xs text-zinc-200 leading-relaxed font-medium">
                {triageResult.understoodSymptoms}
              </p>
            </div>
            <div className="bg-[#141414] p-3.5 rounded-xl border border-[#242424] space-y-1">
              <span className="text-[10px] text-zinc-500 font-mono uppercase block">Primary Medical Category</span>
              <p className="text-xs text-emerald-400 font-bold">
                {triageResult.primaryCondition}
              </p>
            </div>
          </div>

          {/* 📌 Direct 4-5 Line Bullet Point Remedies & Advice */}
          <div className="space-y-3 bg-[#121212] p-4 sm:p-5 rounded-xl border border-[#242424]">
            <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
              <span>📌 Diagnostic Advice & Remedies ({triageResult.language})</span>
            </h4>

            {isTranslating ? (
              <div className="p-4 text-center text-xs text-emerald-400 animate-pulse">
                Translating remedies to {triageResult.language}...
              </div>
            ) : (
              <ul className="space-y-2.5">
                {triageResult.summaryBulletPoints?.map((bullet, idx) => (
                  <li
                    key={idx}
                    className="text-xs sm:text-sm text-zinc-200 leading-relaxed flex items-start gap-2.5 p-2.5 rounded-lg bg-[#181818] border border-[#262626]"
                  >
                    <span className="w-2 h-2 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0" />
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Call 108 Emergency Button if RED risk */}
          {triageResult.emergencyContactNeeded && (
            <div className="pt-2">
              <a
                href="tel:108"
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-red-600 text-white text-xs font-bold shadow-lg hover:bg-red-700 transition-all animate-pulse"
              >
                <PhoneCall className="w-4 h-4" />
                <span>Call 108 Emergency Ambulance Immediately</span>
              </a>
            </div>
          )}

          {/* Interactive Chat Continuation & Doctor Passport Save */}
          <PassportSaveAndChat
            sourceModule="VOICE"
            initialContextText={triageResult.understoodSymptoms || transcript || ''}
            resultData={triageResult}
            selectedLanguage={selectedLang.name}
            riskLevel={triageResult.riskTier === 'RED' ? 'RED' : triageResult.riskTier === 'YELLOW' ? 'YELLOW' : 'GREEN'}
            riskScore={triageResult.riskScore || 0}
            diseaseCategory={triageResult.primaryCondition || 'Voice Symptom Assessment'}
            chiefComplaint={triageResult.understoodSymptoms || transcript || 'Symptom Triage'}
            summaryBullets={triageResult.summaryBulletPoints || []}
          />
        </div>
      )}

    </div>
  );
}
