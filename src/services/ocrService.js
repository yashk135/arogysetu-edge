/**
 * Offline OCR Engine & Lab Report / Prescription Explainer
 * Integrates Tesseract.js for reading medical documents offline.
 */

import { createWorker } from 'tesseract.js';

let workerInstance = null;

export async function getOCRWorker() {
  if (!workerInstance) {
    workerInstance = await createWorker('eng');
  }
  return workerInstance;
}

/**
 * Process image file / canvas with OCR and extract medical metrics
 */
export async function parseMedicalDocument(imageSource) {
  try {
    const worker = await getOCRWorker();
    const ret = await worker.recognize(imageSource);
    const rawText = ret.data.text || '';

    // Regex extraction for common blood test parameters
    const extracted = {
      hemoglobin: extractNumber(rawText, ['hemoglobin', 'hb', 'hgb']),
      wbc: extractNumber(rawText, ['wbc', 'white blood', 'leukocyte', 'tlc']),
      platelets: extractNumber(rawText, ['platelet', 'plt']),
      bilirubin: extractNumber(rawText, ['bilirubin', 'total bilirubin']),
    };

    // Generate plain Hindi/English explanations
    const findings = [];
    let isHighRisk = false;

    if (extracted.hemoglobin !== null) {
      if (extracted.hemoglobin < 7) {
        findings.push(`🔴 Hemoglobin (${extracted.hemoglobin} g/dL): Severe Anemia! (नॉर्मल 12-16 होना चाहिए)`);
        isHighRisk = true;
      } else if (extracted.hemoglobin < 11) {
        findings.push(`🟡 Hemoglobin (${extracted.hemoglobin} g/dL): Moderate Anemia.`);
      } else {
        findings.push(`🟢 Hemoglobin (${extracted.hemoglobin} g/dL): Normal.`);
      }
    }

    if (extracted.bilirubin !== null) {
      if (extracted.bilirubin > 2.0) {
        findings.push(`🔴 Bilirubin (${extracted.bilirubin} mg/dL): Jaundice Alert! (पीलिया की संभावना)`);
        isHighRisk = true;
      } else {
        findings.push(`🟢 Bilirubin (${extracted.bilirubin} mg/dL): Normal.`);
      }
    }

    if (extracted.platelets !== null && extracted.platelets < 100000) {
      findings.push(`🔴 Platelets (${extracted.platelets}): Low Platelets! Dengue/Infection concern.`);
      isHighRisk = true;
    }

    return {
      rawText,
      extracted,
      findings,
      isHighRisk,
      summaryHindi: findings.length > 0
        ? findings.join('\n')
        : '📄 Report read successfully. No critical abnormal blood parameters flagged.',
    };
  } catch (err) {
    console.error('OCR Processing error:', err);
    return {
      rawText: '',
      extracted: {},
      findings: ['Could not read image clearly. Please ensure report is well-lit.'],
      isHighRisk: false,
      summaryHindi: 'रजिस्टर/रिपोर्ट की फोटो साफ़ नहीं आई। कृपया दोबारा फ़ोटो लें।',
    };
  }
}

// Regex Helper to find numbers following keywords
function extractNumber(text, keywords) {
  const lines = text.split('\n');
  for (let line of lines) {
    const lowerLine = line.toLowerCase();
    const hasMatch = keywords.some((kw) => lowerLine.includes(kw));
    if (hasMatch) {
      // Find float or integer number in this line
      const match = line.match(/\b\d+(\.\d+)?\b/);
      if (match) {
        return parseFloat(match[0]);
      }
    }
  }
  return null;
}
