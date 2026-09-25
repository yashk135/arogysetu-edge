import React, { useState, useEffect } from 'react';
import { parseSymptomTranscript } from '../services/voiceTriage';
import { Mic, MicOff, ShieldAlert, AlertTriangle, CheckCircle, Activity, PhoneCall } from 'lucide-react';

export default function VoiceTriagePage({ onSaveResult }) {
  const [lang, setLang] = useState('hi-IN'); // 'hi-IN' or 'mr-IN'
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [triageResult, setTriageResult] = useState(null);
  const [recognition, setRecognition] = useState(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = true;
      rec.interimResults = true;
      rec.lang = lang;

      rec.onresult = (event) => {
        let currentTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript;
        }
        setTranscript(currentTranscript);
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
  }, [lang]);

  const toggleListening = () => {
    if (!recognition) {
      alert('Speech recognition API is not supported in this browser mode. Please use Google Chrome or select sample phrases below.');
      return;
    }

    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      setTranscript('');
      setTriageResult(null);
      recognition.lang = lang;
      recognition.start();
      setIsListening(true);
    }
  };

  const handleProcessText = (textToProcess) => {
    const text = textToProcess || transcript;
    if (!text.trim()) return;

    const result = parseSymptomTranscript(text);
    setTriageResult(result);

    if (onSaveResult) {
      onSaveResult(result);
    }
  };

  const samplePhrases = [
    { label: '🔴 High Emergency', text: 'मरीज को सांप ने काटा है और बहुत खून बह रहा है', lang: 'hi-IN' },
    { label: '🟡 Moderate Risk', text: 'Mujhe teen din se tez bukhaar hai aur khansi hai', lang: 'hi-IN' },
    { label: '🟢 Normal Rest', text: 'mala thoda thakwa ahe (मला थोडा थकवा आहे)', lang: 'mr-IN' },
  ];

  return (
    <div className="space-y-6 pb-24 max-w-3xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#181818] border border-[#2E2E2E] text-zinc-300 text-xs font-medium">
          <Activity className="w-3.5 h-3.5 text-emerald-400" />
          <span>Voice Symptom Intake</span>
        </div>
        <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-white">
          Voice Triage & Assessment
        </h1>
        <p className="text-xs text-zinc-400">
          Speak symptoms in Hindi or Marathi. Natural language engine evaluates risk indicators.
        </p>
      </div>

      {/* Language Selector */}
      <div className="flex items-center justify-center gap-2">
        <button
          onClick={() => setLang('hi-IN')}
          className={`px-4 py-1.5 rounded-xl text-xs font-medium border transition-all ${
            lang === 'hi-IN'
              ? 'bg-[#1A1A1A] text-emerald-400 border-[#333333]'
              : 'bg-[#111111] text-zinc-400 border-[#222222] hover:text-white'
          }`}
        >
          हिंदी (Hindi)
        </button>
        <button
          onClick={() => setLang('mr-IN')}
          className={`px-4 py-1.5 rounded-xl text-xs font-medium border transition-all ${
            lang === 'mr-IN'
              ? 'bg-[#1A1A1A] text-emerald-400 border-[#333333]'
              : 'bg-[#111111] text-zinc-400 border-[#222222] hover:text-white'
          }`}
        >
          मराठी (Marathi)
        </button>
      </div>

      {/* Mic Recording Card */}
      <div className="carbon-card p-8 text-center space-y-5">
        <button
          onClick={toggleListening}
          className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto transition-all ${
            isListening
              ? 'bg-red-500 text-white animate-pulse'
              : 'bg-[#1A1A1A] text-emerald-400 border border-[#333333] hover:border-emerald-500/50'
          }`}
        >
          {isListening ? <MicOff className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
        </button>

        <div>
          <p className="font-heading font-bold text-sm text-white">
            {isListening ? 'Listening... Speak symptoms clearly' : 'Tap Microphone to Begin Intake'}
          </p>
          <p className="text-[11px] text-zinc-400 mt-0.5">
            Language: <strong className="text-zinc-200">{lang === 'hi-IN' ? 'Hindi' : 'Marathi'}</strong>
          </p>
        </div>

        {/* Live Transcript Display */}
        <div className="bg-[#161616] border border-[#262626] rounded-xl p-3.5 text-left min-h-[70px]">
          <span className="text-[10px] font-medium text-zinc-500 block mb-1">
            Speech Transcript:
          </span>
          <p className="text-xs text-zinc-200 italic">
            {transcript || 'Spoken text will appear here...'}
          </p>
        </div>

        {transcript && (
          <button
            onClick={() => handleProcessText(transcript)}
            className="px-5 py-2 rounded-xl bg-emerald-500 text-white font-medium text-xs hover:bg-emerald-600 transition-all"
          >
            Process Transcript
          </button>
        )}
      </div>

      {/* Test Sample Phrases */}
      <div className="space-y-2">
        <span className="text-xs text-zinc-400 font-medium block text-center">
          Or select sample intake statements:
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {samplePhrases.map((sample, idx) => (
            <button
              key={idx}
              onClick={() => {
                setTranscript(sample.text);
                handleProcessText(sample.text);
              }}
              className="p-3 rounded-xl bg-[#111111] border border-[#242424] hover:border-[#333333] text-left space-y-1 transition-all group"
            >
              <span className="text-xs font-semibold text-zinc-200 group-hover:text-emerald-400 block">
                {sample.label}
              </span>
              <p className="text-[11px] text-zinc-400 italic truncate">"{sample.text}"</p>
            </button>
          ))}
        </div>
      </div>

      {/* Result Card */}
      {triageResult && (
        <div className="carbon-card p-5 space-y-4 border border-[#2E2E2E]">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              {triageResult.riskLevel === 'RED' ? (
                <ShieldAlert className="w-7 h-7 text-red-400" />
              ) : triageResult.riskLevel === 'YELLOW' ? (
                <AlertTriangle className="w-7 h-7 text-amber-400" />
              ) : (
                <CheckCircle className="w-7 h-7 text-emerald-400" />
              )}
              <div>
                <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
                  Assessment Level
                </span>
                <h3 className="font-heading font-bold text-lg text-white">
                  {triageResult.riskLevel} RISK ({triageResult.riskScore} / 100)
                </h3>
              </div>
            </div>

            {triageResult.riskLevel === 'RED' && (
              <a
                href="tel:108"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-600 text-white text-xs font-bold shadow-md hover:bg-red-700"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>Call 108</span>
              </a>
            )}
          </div>

          <div className="bg-[#181818] p-3.5 rounded-xl border border-[#262626] space-y-2">
            <p className="text-xs font-medium text-zinc-200">
              {lang === 'hi-IN' ? triageResult.adviceHindi : triageResult.adviceMarathi}
            </p>

            {triageResult.matchedSymptoms.length > 0 && (
              <div className="pt-2 border-t border-[#2A2A2A] flex flex-wrap gap-1.5">
                <span className="text-[10px] text-zinc-400 block w-full">Flagged Symptoms:</span>
                {triageResult.matchedSymptoms.map((s, idx) => (
                  <span
                    key={idx}
                    className={`text-[10px] font-medium px-2 py-0.5 rounded-md border ${
                      s.isRedFlag
                        ? 'bg-[#1F1414] text-red-400 border-red-900/40'
                        : 'bg-[#1F1C12] text-amber-400 border-amber-900/40'
                    }`}
                  >
                    {s.id} (+{s.weight} pts)
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-1">
            <span className="text-[11px] font-semibold text-zinc-400 block">
              Recommended Protocol:
            </span>
            <ul className="space-y-1">
              {triageResult.actionSteps.map((step, idx) => (
                <li key={idx} className="text-xs text-zinc-300 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                  {step}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
