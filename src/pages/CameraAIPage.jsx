import React, { useState, useRef, useEffect } from 'react';
import { analyzeAnemia, analyzeJaundice } from '../services/cameraAI';
import { Camera, ShieldAlert, AlertTriangle, CheckCircle, Eye, Hand, Activity } from 'lucide-react';

export default function CameraAIPage({ onSaveResult }) {
  const [scanType, setScanType] = useState('ANEMIA'); // 'ANEMIA' or 'JAUNDICE'
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [cameraError, setCameraError] = useState(null);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // Start live camera stream
  const startCamera = async () => {
    setCameraError(null);
    setScanResult(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setIsCameraActive(true);
      }
    } catch (err) {
      console.error('Camera access error:', err);
      setCameraError('Camera access unavailable. You can use the test modes below to evaluate the diagnosis engine.');
    }
  };

  // Stop camera stream
  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  };

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, [scanType]);

  // Capture frame and run AI inference
  const handleCapture = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    setIsProcessing(true);
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;

    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    let result;
    if (scanType === 'ANEMIA') {
      result = await analyzeAnemia(canvas);
    } else {
      result = await analyzeJaundice(canvas);
    }

    setScanResult(result);
    setIsProcessing(false);
    stopCamera();

    if (onSaveResult) {
      onSaveResult(result);
    }
  };

  // Simulation test mode for quick verification
  const handleSimulateTest = async (mockSeverity) => {
    setIsProcessing(true);
    setTimeout(() => {
      let result;
      if (scanType === 'ANEMIA') {
        result = {
          type: 'ANEMIA',
          confidence: mockSeverity === 'SEVERE' ? 88 : mockSeverity === 'MODERATE' ? 65 : 12,
          severity: mockSeverity,
          message: mockSeverity === 'SEVERE'
            ? '🔴 Significant nail bed pallor detected (Severe Anemia risk < 7 g/dL). Referral to District Hospital advised.'
            : mockSeverity === 'MODERATE'
            ? '🟡 Moderate pallor detected. Blood hemoglobin check at nearest Primary Health Centre advised.'
            : '🟢 Nail bed pigmentation normal. Hemoglobin levels appear healthy.',
          riskScore: mockSeverity === 'SEVERE' ? 85 : mockSeverity === 'MODERATE' ? 55 : 10,
          rgbMetrics: { avgR: 140, avgG: 110, avgB: 105, redRatio: '0.65' },
        };
      } else {
        result = {
          type: 'JAUNDICE',
          confidence: mockSeverity === 'HIGH' ? 85 : 10,
          severity: mockSeverity === 'HIGH' ? 'HIGH' : 'NORMAL',
          message: mockSeverity === 'HIGH'
            ? '🟡 Scleral yellowing detected. Elevated bilirubin indicator. Liver function test recommended.'
            : '🟢 Eye sclera pigmentation normal.',
          riskScore: mockSeverity === 'HIGH' ? 80 : 5,
          rgbMetrics: { avgR: 160, avgG: 150, avgB: 90, yellowIndex: '1.65' },
        };
      }
      setScanResult(result);
      setIsProcessing(false);
      stopCamera();
    }, 600);
  };

  return (
    <div className="space-y-6 pb-24 max-w-3xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#181818] border border-[#2E2E2E] text-zinc-300 text-xs font-medium">
          <Activity className="w-3.5 h-3.5 text-emerald-400" />
          <span>Visual Diagnostic Screening</span>
        </div>
        <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-white">
          Visual Screening
        </h1>
        <p className="text-xs text-zinc-400">
          Position fingernail bed or eye sclera inside the frame for non-invasive color analysis.
        </p>
      </div>

      {/* Mode Selector */}
      <div className="grid grid-cols-2 gap-2 p-1.5 bg-[#111111] rounded-xl border border-[#242424]">
        <button
          onClick={() => {
            setScanType('ANEMIA');
            setScanResult(null);
          }}
          className={`flex items-center justify-center gap-2 py-2.5 rounded-lg font-medium text-xs transition-all ${
            scanType === 'ANEMIA'
              ? 'bg-[#1A1A1A] text-emerald-400 border border-[#333333]'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          <Hand className="w-4 h-4" />
          <span>Anemia (Nail Bed)</span>
        </button>

        <button
          onClick={() => {
            setScanType('JAUNDICE');
            setScanResult(null);
          }}
          className={`flex items-center justify-center gap-2 py-2.5 rounded-lg font-medium text-xs transition-all ${
            scanType === 'JAUNDICE'
              ? 'bg-[#1A1A1A] text-emerald-400 border border-[#333333]'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          <Eye className="w-4 h-4" />
          <span>Jaundice (Eye Sclera)</span>
        </button>
      </div>

      {/* Viewport */}
      <div className="relative rounded-2xl overflow-hidden bg-black border border-[#262626] aspect-video flex items-center justify-center shadow-xl">
        <canvas ref={canvasRef} className="hidden" />

        {isCameraActive ? (
          <>
            <video
              ref={videoRef}
              playsInline
              muted
              className="w-full h-full object-cover"
            />
            {/* Guide Circle Overlay */}
            <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center">
              <div className="w-48 h-48 sm:w-60 sm:h-60 rounded-full border-2 border-dashed border-zinc-400/60 flex items-center justify-center">
                <div className="w-3 h-3 rounded-full bg-emerald-400/80" />
              </div>
              <p className="mt-4 text-xs text-zinc-200 bg-[#0D0D0D]/90 px-4 py-1.5 rounded-full border border-[#2E2E2E]">
                {scanType === 'ANEMIA'
                  ? 'Center fingernail inside the alignment circle'
                  : 'Center eye sclera (white area) inside the alignment circle'}
              </p>
            </div>
          </>
        ) : (
          <div className="p-8 text-center space-y-3">
            <Camera className="w-10 h-10 text-zinc-500 mx-auto" />
            <p className="text-xs text-zinc-400">
              {cameraError || 'Camera view stopped.'}
            </p>
            <button
              onClick={startCamera}
              className="px-4 py-2 rounded-xl bg-[#1A1A1A] text-zinc-200 border border-[#333333] text-xs font-semibold hover:bg-[#222222]"
            >
              Start Camera
            </button>
          </div>
        )}
      </div>

      {/* Control Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
        {isCameraActive && (
          <button
            onClick={handleCapture}
            disabled={isProcessing}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-emerald-500 text-white font-medium text-xs shadow-md hover:bg-emerald-600 transition-all disabled:opacity-50"
          >
            {isProcessing ? 'Processing Analysis...' : 'Capture & Analyze'}
          </button>
        )}

        <div className="flex items-center gap-2 text-xs text-zinc-400 ml-auto">
          <span className="text-[11px] text-zinc-500">Test Scenarios:</span>
          <button
            onClick={() => handleSimulateTest(scanType === 'ANEMIA' ? 'SEVERE' : 'HIGH')}
            className="px-2.5 py-1 rounded-lg bg-[#1F1414] border border-red-900/40 text-red-400 text-[11px] hover:bg-[#2A1A1A]"
          >
            High Risk
          </button>
          <button
            onClick={() => handleSimulateTest('MODERATE')}
            className="px-2.5 py-1 rounded-lg bg-[#1F1C12] border border-amber-900/40 text-amber-400 text-[11px] hover:bg-[#2A2416]"
          >
            Moderate
          </button>
          <button
            onClick={() => handleSimulateTest('NORMAL')}
            className="px-2.5 py-1 rounded-lg bg-[#121F17] border border-emerald-900/40 text-emerald-400 text-[11px] hover:bg-[#182A1F]"
          >
            Normal
          </button>
        </div>
      </div>

      {/* Diagnostic Result */}
      {scanResult && (
        <div className="carbon-card p-5 space-y-4 border border-[#2E2E2E]">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              {scanResult.severity === 'SEVERE' || scanResult.severity === 'HIGH' ? (
                <ShieldAlert className="w-7 h-7 text-red-400" />
              ) : scanResult.severity === 'MODERATE' ? (
                <AlertTriangle className="w-7 h-7 text-amber-400" />
              ) : (
                <CheckCircle className="w-7 h-7 text-emerald-400" />
              )}
              <div>
                <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
                  Diagnostic Result • {scanResult.type}
                </span>
                <h3 className="font-heading font-bold text-lg text-white">
                  {scanResult.severity} RISK ({scanResult.confidence}% Confidence)
                </h3>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[11px] text-zinc-400">Triage Points</span>
              <span className="font-heading font-bold text-base text-white block">+{scanResult.riskScore}</span>
            </div>
          </div>

          <p className="text-xs text-zinc-300 leading-relaxed bg-[#181818] p-3 rounded-xl border border-[#262626]">
            {scanResult.message}
          </p>

          {scanResult.rgbMetrics && (
            <div className="grid grid-cols-4 gap-2 pt-1 border-t border-[#222222] text-center text-xs">
              <div className="bg-[#161616] p-2 rounded-lg border border-[#262626]">
                <span className="text-[10px] text-zinc-500 block">Red Channel</span>
                <span className="font-semibold text-zinc-200">{scanResult.rgbMetrics.avgR}</span>
              </div>
              <div className="bg-[#161616] p-2 rounded-lg border border-[#262626]">
                <span className="text-[10px] text-zinc-500 block">Green Channel</span>
                <span className="font-semibold text-zinc-200">{scanResult.rgbMetrics.avgG}</span>
              </div>
              <div className="bg-[#161616] p-2 rounded-lg border border-[#262626]">
                <span className="text-[10px] text-zinc-500 block">Blue Channel</span>
                <span className="font-semibold text-zinc-200">{scanResult.rgbMetrics.avgB}</span>
              </div>
              <div className="bg-[#161616] p-2 rounded-lg border border-[#262626]">
                <span className="text-[10px] text-zinc-500 block">Index Ratio</span>
                <span className="font-semibold text-emerald-400">
                  {scanResult.rgbMetrics.redRatio || scanResult.rgbMetrics.yellowIndex}
                </span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
