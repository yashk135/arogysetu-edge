import React, { useState } from 'react';
import { parseMedicalDocument } from '../services/ocrService';
import { Upload, CheckCircle, ShieldAlert, FileSearch, Activity } from 'lucide-react';

export default function ReportOCRPage({ onSaveResult }) {
  const [selectedImage, setSelectedImage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [ocrResult, setOcrResult] = useState(null);

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const imageUrl = URL.createObjectURL(file);
    setSelectedImage(imageUrl);
    runOCR(file);
  };

  const runOCR = async (fileOrUrl) => {
    setIsProcessing(true);
    setOcrResult(null);

    const result = await parseMedicalDocument(fileOrUrl);
    setOcrResult(result);
    setIsProcessing(false);

    if (onSaveResult) {
      onSaveResult(result);
    }
  };

  const handleSampleReport = (type) => {
    setIsProcessing(true);
    setSelectedImage('SAMPLE');
    setTimeout(() => {
      let result;
      if (type === 'ANEMIA_REPORT') {
        result = {
          rawText: 'PATIENT CBC REPORT\nHemoglobin: 6.8 g/dL (Normal: 12.0 - 15.5)\nWBC: 7,500 /mcL\nPlatelets: 240,000 /mcL',
          extracted: { hemoglobin: 6.8, wbc: 7500, platelets: 240000, bilirubin: null },
          findings: [
            '🔴 Hemoglobin (6.8 g/dL): SEVERE ANEMIA ALERT (Normal 12.0 - 15.5 g/dL)',
            '🟢 WBC & Platelet counts within normal bounds.',
          ],
          isHighRisk: true,
          summaryHindi: '🔴 Hemoglobin (6.8 g/dL): Severe Anemia indicator. Referral to District Hospital advised for clinical evaluation.',
        };
      } else if (type === 'JAUNDICE_REPORT') {
        result = {
          rawText: 'LIVER FUNCTION TEST (LFT)\nTotal Bilirubin: 3.4 mg/dL (Normal: 0.2 - 1.2)\nDirect Bilirubin: 1.8 mg/dL\nSGPT: 120 U/L',
          extracted: { hemoglobin: null, wbc: null, platelets: null, bilirubin: 3.4 },
          findings: [
            '🔴 Total Bilirubin (3.4 mg/dL): HIGH JAUNDICE INDICATOR (Normal 0.2 - 1.2 mg/dL)',
            '🟡 Liver enzymes elevated.',
          ],
          isHighRisk: true,
          summaryHindi: '🔴 Total Bilirubin 3.4 mg/dL (Jaundice indicator). Consult nearest Primary Health Centre for diagnostic evaluation.',
        };
      } else {
        result = {
          rawText: 'CBC REPORT\nHemoglobin: 13.2 g/dL\nWBC: 6,800 /mcL\nPlatelets: 210,000 /mcL',
          extracted: { hemoglobin: 13.2, wbc: 6800, platelets: 210000, bilirubin: null },
          findings: ['🟢 All CBC parameters within normal range.'],
          isHighRisk: false,
          summaryHindi: '🟢 All primary blood parameters are within normal diagnostic range.',
        };
      }

      setOcrResult(result);
      setIsProcessing(false);
    }, 600);
  };

  return (
    <div className="space-y-6 pb-24 max-w-3xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#181818] border border-[#2E2E2E] text-zinc-300 text-xs font-medium">
          <Activity className="w-3.5 h-3.5 text-emerald-400" />
          <span>Diagnostic Report Reader</span>
        </div>
        <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-white">
          Lab Report & Prescription Scanner
        </h1>
        <p className="text-xs text-zinc-400">
          Scan blood CBC reports or medical prescriptions to extract values and generate plain language summaries.
        </p>
      </div>

      {/* Upload Box */}
      <div className="carbon-card p-8 text-center space-y-4 border border-[#2A2A2A]">
        <div className="w-14 h-14 rounded-xl bg-[#1A1A1A] border border-[#333333] flex items-center justify-center text-emerald-400 mx-auto">
          <FileSearch className="w-7 h-7" />
        </div>

        <div>
          <h3 className="font-heading font-bold text-base text-white">
            Upload Diagnostic Report Image
          </h3>
          <p className="text-xs text-zinc-400 mt-1">
            Supports CBC blood test sheets, LFT reports, and handwritten prescriptions.
          </p>
        </div>

        <label className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 text-white font-medium text-xs shadow-md cursor-pointer hover:bg-emerald-600 transition-all">
          <Upload className="w-4 h-4" />
          <span>Select Image File</span>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
        </label>
      </div>

      {/* Sample Test Documents */}
      <div className="space-y-2">
        <span className="text-xs text-zinc-400 font-medium block text-center">
          Or test reader with sample report formats:
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <button
            onClick={() => handleSampleReport('ANEMIA_REPORT')}
            className="p-3 rounded-xl bg-[#111111] border border-[#242424] hover:border-[#333333] text-left space-y-1 transition-all group"
          >
            <span className="text-xs font-semibold text-zinc-200 group-hover:text-emerald-400 block">
              Severe Anemia CBC Report
            </span>
            <span className="text-[10px] text-zinc-500 block">Hb: 6.8 g/dL</span>
          </button>

          <button
            onClick={() => handleSampleReport('JAUNDICE_REPORT')}
            className="p-3 rounded-xl bg-[#111111] border border-[#242424] hover:border-[#333333] text-left space-y-1 transition-all group"
          >
            <span className="text-xs font-semibold text-zinc-200 group-hover:text-emerald-400 block">
              Jaundice LFT Report
            </span>
            <span className="text-[10px] text-zinc-500 block">Bilirubin: 3.4 mg/dL</span>
          </button>

          <button
            onClick={() => handleSampleReport('NORMAL_REPORT')}
            className="p-3 rounded-xl bg-[#111111] border border-[#242424] hover:border-[#333333] text-left space-y-1 transition-all group"
          >
            <span className="text-xs font-semibold text-zinc-200 group-hover:text-emerald-400 block">
              Normal Blood Report
            </span>
            <span className="text-[10px] text-zinc-500 block">Hb: 13.2 g/dL</span>
          </button>
        </div>
      </div>

      {/* Processing Indicator */}
      {isProcessing && (
        <div className="carbon-card p-6 text-center space-y-3">
          <div className="w-6 h-6 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-zinc-300 font-medium">Extracting medical parameters...</p>
        </div>
      )}

      {/* Result Card */}
      {ocrResult && !isProcessing && (
        <div className="carbon-card p-5 space-y-4 border border-[#2E2E2E]">
          <div className="flex items-center gap-3 border-b border-[#242424] pb-3">
            {ocrResult.isHighRisk ? (
              <ShieldAlert className="w-6 h-6 text-red-400 shrink-0" />
            ) : (
              <CheckCircle className="w-6 h-6 text-emerald-400 shrink-0" />
            )}
            <div>
              <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
                Document Summary
              </span>
              <h3 className="font-heading font-bold text-base text-white">
                {ocrResult.isHighRisk ? 'Abnormal Diagnostic Indicators Flagged' : 'Report Parameters Normal'}
              </h3>
            </div>
          </div>

          <div className="bg-[#181818] p-3.5 rounded-xl border border-[#262626] space-y-1.5">
            <span className="text-[11px] font-medium text-zinc-400 block">
              Plain Language Explanation:
            </span>
            <p className="text-xs text-zinc-200 leading-relaxed font-medium">
              {ocrResult.summaryHindi}
            </p>
          </div>

          <div className="space-y-1">
            <span className="text-[11px] font-semibold text-zinc-400 block">
              Extracted Parameters:
            </span>
            <ul className="space-y-1">
              {ocrResult.findings.map((f, idx) => (
                <li key={idx} className="text-xs text-zinc-300 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
