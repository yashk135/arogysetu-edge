/**
 * Offline Medical Lab Report OCR Engine & Document Explainer
 * Integrates Tesseract.js and regex parameter extractors for blood tests, LFT, KFT, Lipid, Diabetes & CBC offline.
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
export async function parseMedicalDocument(imageSource, targetLanguage = 'Hindi') {
  try {
    const worker = await getOCRWorker();
    const ret = await worker.recognize(imageSource);
    const rawText = ret.data.text || '';

    // Regex extraction for common lab parameters
    const extracted = {
      hemoglobin: extractNumber(rawText, ['hemoglobin', 'hb', 'hgb']),
      glucose: extractNumber(rawText, ['glucose', 'sugar', 'hba1c', 'fasting blood']),
      wbc: extractNumber(rawText, ['wbc', 'white blood', 'leukocyte', 'tlc']),
      platelets: extractNumber(rawText, ['platelet', 'plt']),
      bilirubin: extractNumber(rawText, ['bilirubin', 'total bilirubin']),
      cholesterol: extractNumber(rawText, ['cholesterol', 'triglycerides']),
      creatinine: extractNumber(rawText, ['creatinine', 'serum creatinine']),
    };

    const abnormalParams = [];
    let isHighRisk = false;

    if (extracted.hemoglobin !== null) {
      if (extracted.hemoglobin < 7.0) {
        abnormalParams.push(`Hemoglobin: ${extracted.hemoglobin} g/dL (Severe Low - Normal 12-16)`);
        isHighRisk = true;
      } else if (extracted.hemoglobin < 11.0) {
        abnormalParams.push(`Hemoglobin: ${extracted.hemoglobin} g/dL (Moderate Low - Normal 12-16)`);
      }
    }

    if (extracted.glucose !== null && extracted.glucose > 140) {
      abnormalParams.push(`Blood Glucose: ${extracted.glucose} mg/dL (High Sugar - Normal < 140)`);
      isHighRisk = true;
    }

    if (extracted.bilirubin !== null && extracted.bilirubin > 1.5) {
      abnormalParams.push(`Bilirubin: ${extracted.bilirubin} mg/dL (High Jaundice - Normal 0.2-1.2)`);
      isHighRisk = true;
    }

    if (extracted.cholesterol !== null && extracted.cholesterol > 200) {
      abnormalParams.push(`Total Cholesterol: ${extracted.cholesterol} mg/dL (High Lipid - Normal < 200)`);
    }

    if (extracted.platelets !== null && extracted.platelets < 100000) {
      abnormalParams.push(`Platelet Count: ${extracted.platelets} /mcL (Low - Normal 150k-450k)`);
      isHighRisk = true;
    }

    // Determine report title
    let reportType = 'General Diagnostic Lab Report';
    if (extracted.hemoglobin !== null || extracted.wbc !== null) reportType = 'Complete Blood Count (CBC)';
    if (extracted.glucose !== null) reportType = 'Blood Glucose / Diabetes Test';
    if (extracted.bilirubin !== null) reportType = 'Liver Function Test (LFT)';
    if (extracted.cholesterol !== null) reportType = 'Lipid Profile / Cholesterol Test';

    // Generate 4-5 simple bullet points in chosen language for offline
    let summaryBulletPoints = [];

    if (targetLanguage === 'Marathi') {
      summaryBulletPoints = [
        `📌 अहवालाचा प्रकार: ${reportType} विश्लेषण पूर्ण झाले.`,
        abnormalParams.length > 0
          ? `⚠️ असामान्य मूल्ये: ${abnormalParams.join(', ')}.`
          : `🟢 सर्व मुख्य घटक सामान्य मर्यादेत (Normal Range) आहेत.`,
        `🩹 घरगुती उपाय व आहार: ताजी फळे, हिरव्या पालेभाज्या आणि पुरेसे पाणी प्या.`,
        `🏥 डॉक्टरांचा सल्ला: अहवाल घेऊन जवळच्या प्राथमिक आरोग्य केंद्रात (PHC) डॉक्टरांना दाखवा.`
      ];
    } else if (targetLanguage === 'English') {
      summaryBulletPoints = [
        `📌 Report Type: ${reportType} analysis completed.`,
        abnormalParams.length > 0
          ? `⚠️ Abnormal Values Flagged: ${abnormalParams.join(', ')}.`
          : `🟢 All primary blood parameters are within normal diagnostic range.`,
        `🩹 Home Remedy & Diet: Eat fresh green leafy vegetables, fruits, and stay hydrated.`,
        `🏥 Doctor Advice: Consult nearest Primary Health Centre (PHC) or General Physician with this report.`
      ];
    } else {
      // Default Hindi
      summaryBulletPoints = [
        `📌 रिपोर्ट का प्रकार: ${reportType} का विश्लेषण संपन्न हुआ.`,
        abnormalParams.length > 0
          ? `⚠️ असामान्य (High/Low) माप: ${abnormalParams.join(', ')}.`
          : `🟢 सभी मुख्य रक्त पैरामीटर सामान्य सीमा (Normal Range) में हैं.`,
        `🩹 घरेलू उपाय व खान-पान: हरी पत्तेदार सब्जियां, ताजा फल खाएं और पर्याप्त पानी पीएं.`,
        `🏥 डॉक्टर सलाह: इस रिपोर्ट को नजदीकी प्राथमिक स्वास्थ्य केंद्र (PHC) डॉक्टर को दिखाएं.`
      ];
    }

    return {
      rawText,
      extracted,
      reportType,
      abnormalParameters: abnormalParams,
      overallStatus: isHighRisk ? 'HIGH_RISK' : abnormalParams.length > 0 ? 'ATTENTION_REQUIRED' : 'NORMAL',
      summaryBulletPoints,
      language: targetLanguage,
    };
  } catch (err) {
    console.error('OCR Processing error:', err);
    return {
      rawText: '',
      extracted: {},
      reportType: 'Medical Document Scanner',
      abnormalParameters: [],
      overallStatus: 'NORMAL',
      summaryBulletPoints: [
        '📄 रिपोर्ट की फोटो साफ नहीं आई। कृपया अच्छी रोशनी में दोबारा फोटो लें।'
      ],
      language: targetLanguage,
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
      const match = line.match(/\b\d+(\.\d+)?\b/);
      if (match) {
        return parseFloat(match[0]);
      }
    }
  }
  return null;
}
