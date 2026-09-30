import React, { useState, useRef, useEffect } from 'react';
import { analyzeMedicalReport, translateResult, getApiKey, saveApiKey, hasApiKey } from '../services/geminiService';
import PassportSaveAndChat from '../components/PassportSaveAndChat';
import { parseMedicalDocument } from '../services/ocrService';
import { Camera, Upload, FileText, Key, ShieldAlert, AlertTriangle, CheckCircle, RefreshCw, Sparkles, Globe, Languages, FileSearch, Activity, Mic, MicOff, Stethoscope } from 'lucide-react';


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

export default function ReportOCRPage({ onSaveResult }) {
  const [selectedFile, setSelectedFile] = useState(null); // base64 image data or file object
  const [fileType, setFileType] = useState('IMAGE'); // 'IMAGE' or 'PDF'
  const [fileName, setFileName] = useState('');
  const [userNotes, setUserNotes] = useState('');
  const [selectedLang, setSelectedLang] = useState(SUPPORTED_LANGUAGES[0]); // default Hindi
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [reportResult, setReportResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  // Voice recording for notes
  const [isMicListening, setIsMicListening] = useState(false);
  const [speechRec, setSpeechRec] = useState(null);

  // API Key management state
  const [apiKeyInput, setApiKeyInput] = useState(getApiKey());
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [hasKey, setHasKey] = useState(hasApiKey());

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const pdfInputRef = useRef(null);
  const streamRef = useRef(null);

  useEffect(() => {
    setHasKey(hasApiKey());
  }, []);

  const handleSaveApiKey = () => {
    saveApiKey(apiKeyInput);
    setHasKey(hasApiKey());
    setShowKeyModal(false);
  };

  // Setup Web Speech Recognition for Notes Input
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
        setUserNotes(fullTranscript);
      };

      rec.onerror = (event) => {
        console.error('Notes speech recognition error:', event.error);
        setIsMicListening(false);
      };

      rec.onend = () => {
        setIsMicListening(false);
      };

      setSpeechRec(rec);
    }
  }, [selectedLang]);

  const toggleMicForNotes = () => {
    if (!speechRec) {
      alert('Speech recognition is not available in this browser. You can type notes directly.');
      return;
    }

    if (isMicListening) {
      speechRec.stop();
      setIsMicListening(false);
    } else {
      setUserNotes('');
      speechRec.lang = selectedLang.code;
      speechRec.start();
      setIsMicListening(true);
    }
  };

  // Start live camera stream for paper report photo
  const startCamera = async () => {
    setErrorMessage(null);
    try {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      });
      streamRef.current = stream;
      setIsCameraActive(true);

      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch((e) => console.log('Play error:', e));
        }
      }, 100);
    } catch (err) {
      console.error('Camera access error:', err);
      setErrorMessage('Could not access device camera. Please upload a report image or PDF file instead.');
      setIsCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  };

  useEffect(() => {
    return () => stopCamera();
  }, []);

  // Capture report photo from camera
  const handleCapturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;

    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.85);

    setSelectedFile(dataUrl);
    setFileType('IMAGE');
    setFileName('Camera_Snap_Report.jpg');
    stopCamera();
  };

  // Handle report image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMessage('Please select a valid image file (JPG, PNG, WEBP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setSelectedFile(event.target.result);
      setFileType('IMAGE');
      setFileName(file.name);
      setErrorMessage(null);
      stopCamera();
    };
    reader.readAsDataURL(file);
  };

  // Handle PDF document upload
  const handlePdfUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      setErrorMessage('Please select a valid PDF document file (.pdf).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setSelectedFile(event.target.result);
      setFileType('PDF');
      setFileName(file.name);
      setErrorMessage(null);
      stopCamera();
    };
    reader.readAsDataURL(file);
  };

  // Analyze Medical Document with Gemini AI (or local OCR fallback)
  const handleAnalyzeReport = async () => {
    if (!selectedFile) {
      setErrorMessage('Please snap a photo or upload a lab report file (Image / PDF) first.');
      return;
    }

    if (isMicListening && speechRec) {
      speechRec.stop();
      setIsMicListening(false);
    }

    setIsProcessing(true);
    setErrorMessage(null);
    setReportResult(null);

    try {
      if (hasApiKey()) {
        try {
          const aiResponse = await analyzeMedicalReport(
            selectedFile,
            fileType === 'IMAGE',
            userNotes,
            selectedLang.name
          );

          const formattedResult = {
            isAi: true,
            language: aiResponse.language || selectedLang.name,
            reportType: aiResponse.reportType || 'Medical Diagnostic Report',
            overallStatus: aiResponse.overallStatus || 'ATTENTION_REQUIRED',
            abnormalParameters: aiResponse.abnormalParameters || [],
            summaryBulletPoints: aiResponse.summaryBulletPoints || [],
            timestamp: new Date().toLocaleTimeString(),
          };

          setReportResult(formattedResult);
          if (onSaveResult) onSaveResult(formattedResult);
          return;
        } catch (apiErr) {
          console.warn('Gemini API error/quota limit, falling back to local OCR analysis:', apiErr);
          if (apiErr.message === 'RATE_LIMIT_EXCEEDED') {
            setErrorMessage('Gemini API free tier rate limit reached. Showing smart local OCR report analysis.');
          }
        }
      }

      // Offline OCR Fallback
      const ocrRes = await parseMedicalDocument(selectedFile, selectedLang.name);
      const formattedResult = {
        isAi: false,
        language: selectedLang.name,
        reportType: ocrRes.reportType,
        overallStatus: ocrRes.overallStatus,
        abnormalParameters: ocrRes.abnormalParameters,
        summaryBulletPoints: ocrRes.summaryBulletPoints,
        timestamp: new Date().toLocaleTimeString(),
      };

      setReportResult(formattedResult);
      if (onSaveResult) onSaveResult(formattedResult);
    } catch (err) {
      console.error('Report analysis error:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  // Translate existing report answer to another language
  const handleTranslateResult = async (targetLangObj) => {
    if (!reportResult?.summaryBulletPoints || reportResult.summaryBulletPoints.length === 0) return;

    setIsTranslating(true);
    try {
      const translatedRes = await translateResult(reportResult, targetLangObj.name);
      setReportResult((prev) => ({
        ...prev,
        language: targetLangObj.name,
        reportType: translatedRes.primaryCondition || prev.reportType,
        summaryBulletPoints: translatedRes.summaryBulletPoints || prev.summaryBulletPoints,
      }));
    } catch (err) {
      console.error('Translation error:', err);
    } finally {
      setIsTranslating(false);
    }
  };

  const clearSelection = () => {
    setSelectedFile(null);
    setReportResult(null);
    setErrorMessage(null);
    setFileName('');
  };

  return (
    <div className="space-y-6 pb-24 max-w-3xl mx-auto">
      {/* Hidden canvas for snapshot rendering */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#181818] border border-[#2E2E2E] text-zinc-300 text-xs font-medium">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
          <span>AI Lab Report & Prescription Interpreter</span>
        </div>
        <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-white">
          Medical Report Scanner
        </h1>
        <p className="text-xs text-zinc-400 max-w-lg mx-auto">
          Snap a photo or upload blood reports (CBC, LFT, Lipid, Diabetes), radiology, or prescriptions. Get simple 4-5 line bullet point explanations in your language.
        </p>
      </div>

      {/* API Key Status Bar */}
      <div className="bg-[#141414] border border-[#262626] rounded-xl p-3.5 flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <Key className={`w-4 h-4 ${hasKey ? 'text-emerald-400' : 'text-amber-400'}`} />
          <div>
            <span className="text-zinc-200 font-medium">
              {hasKey ? 'Gemini AI Document Scanner Active' : 'Gemini API Key Missing'}
            </span>
            <span className="text-[11px] text-zinc-400 block">
              {hasKey ? 'Full AI lab report parameter reasoning enabled' : 'Add free key to enable AI report interpreter'}
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
              Google Gemini API key enables AI medical document analysis. Get a free key in 30 seconds:
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

      {/* Select Response & Voice Language */}
      <div className="space-y-1.5">
        <label className="text-xs text-zinc-400 font-medium flex items-center gap-1.5">
          <Globe className="w-4 h-4 text-emerald-400" />
          <span>Select Preferred Language (AI Explanation & Mic Input):</span>
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

      {/* Main Document Viewport & Upload Controls */}
      <div className="carbon-card p-4 sm:p-5 space-y-4 border border-[#262626]">
        <div className="relative rounded-2xl overflow-hidden bg-black border border-[#262626] aspect-video flex items-center justify-center shadow-xl">
          {selectedFile ? (
            fileType === 'IMAGE' ? (
              <div className="relative w-full h-full flex items-center justify-center bg-zinc-950">
                <img
                  src={selectedFile}
                  alt="Medical Report"
                  className="max-h-full max-w-full object-contain"
                />
                <button
                  onClick={clearSelection}
                  className="absolute top-3 right-3 p-2 rounded-full bg-black/70 text-zinc-300 hover:text-white border border-[#333333]"
                  title="Remove document"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="p-8 text-center space-y-3 bg-zinc-950 w-full h-full flex flex-col items-center justify-center">
                <FileSearch className="w-12 h-12 text-emerald-400 mx-auto animate-bounce" />
                <p className="text-xs text-zinc-200 font-bold">{fileName}</p>
                <span className="text-[11px] text-zinc-400">PDF Document Ready for AI Scan</span>
                <button
                  onClick={clearSelection}
                  className="px-3 py-1 rounded-lg bg-[#1F1F1F] text-zinc-400 border border-[#333333] text-xs hover:text-white"
                >
                  Change PDF
                </button>
              </div>
            )
          ) : isCameraActive ? (
            <div className="relative w-full h-full">
              <video
                ref={videoRef}
                playsInline
                autoPlay
                muted
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center">
                <div className="w-64 h-40 sm:w-80 sm:h-52 rounded-2xl border-2 border-dashed border-emerald-400/70 flex items-center justify-center">
                  <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
                </div>
                <p className="mt-4 text-xs text-zinc-200 bg-[#0D0D0D]/90 px-4 py-1.5 rounded-full border border-[#2E2E2E]">
                  Position paper report or prescription page inside rectangle
                </p>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center space-y-3">
              <FileSearch className="w-12 h-12 text-zinc-600 mx-auto" />
              <p className="text-xs text-zinc-400">
                No medical document selected. Snap paper report with camera or upload image / PDF file.
              </p>
            </div>
          )}
        </div>

        {/* Input Notes & Action Buttons */}
        <div className="space-y-3">
          {/* Notes Input + Voice Microphone Button */}
          <div className="flex items-center gap-2 bg-[#121212] border border-[#242424] rounded-xl px-3 py-2">
            <FileText className="w-4 h-4 text-zinc-400 flex-shrink-0" />
            <input
              type="text"
              placeholder={`Add patient notes or questions in ${selectedLang.name} (e.g. Total Bilirubin 3.4, high fever)...`}
              value={userNotes}
              onChange={(e) => setUserNotes(e.target.value)}
              className="w-full bg-transparent text-xs text-white placeholder-zinc-500 focus:outline-none"
            />
            <button
              onClick={toggleMicForNotes}
              type="button"
              className={`p-2 rounded-lg transition-all flex items-center gap-1 text-xs font-semibold ${
                isMicListening
                  ? 'bg-red-500 text-white animate-pulse'
                  : 'bg-[#1E1E1E] text-emerald-400 border border-[#333333] hover:bg-[#282828]'
              }`}
              title={`Speak notes in ${selectedLang.name}`}
            >
              {isMicListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>
          </div>

          {/* Action Buttons Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {!selectedFile && !isCameraActive && (
              <>
                <button
                  onClick={startCamera}
                  className="flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-500 text-white font-semibold text-xs shadow-md hover:bg-emerald-600 transition-all"
                >
                  <Camera className="w-4 h-4" />
                  <span>Camera Snap</span>
                </button>

                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center justify-center gap-2 py-3 rounded-xl bg-[#1A1A1A] text-zinc-200 border border-[#333333] font-semibold text-xs hover:bg-[#222222] transition-all"
                >
                  <Upload className="w-4 h-4 text-emerald-400" />
                  <span>Upload Image</span>
                </button>

                <button
                  onClick={() => pdfInputRef.current?.click()}
                  className="flex items-center justify-center gap-2 py-3 rounded-xl bg-[#1A1A1A] text-zinc-200 border border-[#333333] font-semibold text-xs hover:bg-[#222222] transition-all"
                >
                  <FileText className="w-4 h-4 text-emerald-400" />
                  <span>Upload PDF File</span>
                </button>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />

                <input
                  ref={pdfInputRef}
                  type="file"
                  accept="application/pdf"
                  onChange={handlePdfUpload}
                  className="hidden"
                />
              </>
            )}

            {isCameraActive && !selectedFile && (
              <>
                <button
                  onClick={handleCapturePhoto}
                  className="flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-500 text-white font-semibold text-xs shadow-md hover:bg-emerald-600 transition-all sm:col-span-2"
                >
                  <Camera className="w-4 h-4" />
                  <span>Snap Report Photo</span>
                </button>
                <button
                  onClick={stopCamera}
                  className="flex items-center justify-center gap-2 py-3 rounded-xl bg-[#1A1A1A] text-zinc-400 border border-[#2E2E2E] font-medium text-xs hover:text-white"
                >
                  Cancel
                </button>
              </>
            )}

            {selectedFile && (
              <>
                <button
                  onClick={handleAnalyzeReport}
                  disabled={isProcessing}
                  className="flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-500 text-white font-semibold text-xs shadow-md hover:bg-emerald-600 transition-all sm:col-span-2 disabled:opacity-50"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{isProcessing ? 'AI Scanning Medical Report...' : `Interpret Report in ${selectedLang.name}`}</span>
                </button>
                <button
                  onClick={clearSelection}
                  disabled={isProcessing}
                  className="flex items-center justify-center gap-2 py-3 rounded-xl bg-[#1A1A1A] text-zinc-300 border border-[#333333] font-medium text-xs hover:bg-[#222222]"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Change File</span>
                </button>
              </>
            )}
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

      {/* Plain Language Medical Report Explanation Card */}
      {reportResult && (
        <div className="carbon-card p-5 sm:p-6 space-y-5 border border-[#2E2E2E]">
          {/* Status Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-[#242424]">
            <div className="flex items-center gap-3">
              {reportResult.overallStatus === 'HIGH_RISK' ? (
                <ShieldAlert className="w-8 h-8 text-red-400 flex-shrink-0" />
              ) : reportResult.overallStatus === 'ATTENTION_REQUIRED' ? (
                <AlertTriangle className="w-8 h-8 text-amber-400 flex-shrink-0" />
              ) : (
                <CheckCircle className="w-8 h-8 text-emerald-400 flex-shrink-0" />
              )}
              <div>
                <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider flex items-center gap-1">
                  <span>Medical Report AI Explanation</span>
                  <span className="text-emerald-400 font-bold">• {reportResult.language}</span>
                </span>
                <h3 className="font-heading font-extrabold text-xl text-white">
                  {reportResult.reportType}
                </h3>
              </div>
            </div>

            {/* Instant Language Translator Button / Dropdown */}
            <div className="flex items-center gap-2 bg-[#141414] p-2 rounded-xl border border-[#2A2A2A]">
              <Languages className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span className="text-[11px] text-zinc-400">Translate to:</span>
              <select
                disabled={isTranslating}
                value={reportResult.language}
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

          {/* Abnormal / Attention Parameters List */}
          {reportResult.abnormalParameters?.length > 0 && (
            <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-900/40 text-amber-200 text-xs space-y-2">
              <span className="font-bold text-amber-400 uppercase tracking-wider text-[10px] block flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4" />
                <span>Flagged Out-of-Range Parameters (High/Low Values):</span>
              </span>
              <ul className="space-y-1 text-xs">
                {reportResult.abnormalParameters.map((param, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-amber-400 font-bold">•</span>
                    <span>{param}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* 📌 Direct 4-5 Line Plain Language Explanation & Remedies */}
          <div className="space-y-3 bg-[#121212] p-4 sm:p-5 rounded-xl border border-[#242424]">
            <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
              <span>📌 Plain-Language Report Breakdown ({reportResult.language})</span>
            </h4>

            {isTranslating ? (
              <div className="p-4 text-center text-xs text-emerald-400 animate-pulse">
                Translating report advice to {reportResult.language}...
              </div>
            ) : (
              <ul className="space-y-2.5">
                {reportResult.summaryBulletPoints?.map((bullet, idx) => (
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

          {/* Interactive Chat Continuation & Doctor Passport Save */}
          <PassportSaveAndChat
            sourceModule="REPORT"
            initialContextText={reportResult.summaryBulletPoints?.join('\n') || ''}
            resultData={reportResult}
            selectedLanguage={selectedLang.name}
            riskLevel={reportResult.overallStatus === 'HIGH_RISK' ? 'RED' : reportResult.overallStatus === 'ATTENTION_REQUIRED' ? 'YELLOW' : 'GREEN'}
            riskScore={reportResult.overallStatus === 'HIGH_RISK' ? 85 : reportResult.overallStatus === 'ATTENTION_REQUIRED' ? 50 : 15}
            diseaseCategory={reportResult.reportType || 'Medical Report OCR'}
            chiefComplaint={userNotes || reportResult.reportType || 'Lab Report Interpretation'}
            summaryBullets={reportResult.summaryBulletPoints || []}
          />
        </div>
      )}

    </div>
  );
}
