/**
 * Voice Triage Service — Offline Fallback Multilingual Symptom Parser & Risk Scorer
 * Expanded dictionary covering Oncology, Cardiology, Neurology, Pediatrics, Trauma, Endocrine, Respiratory & General medicine.
 */

// Dictionary of symptoms, keywords (Multi-lingual: English, Hindi, Marathi, Hinglish, Tamil, etc.), weights & red flag indicators
const SYMPTOM_DICTIONARY = [
  // 🔴 Emergency Red Flag Rules (Auto RED / High Score)
  { id: 'cancer', category: 'ONCOLOGY', keywords: ['cancer', 'tumor', 'tumour', 'कैंसर', 'कर्करोग', 'rasauli', 'knot', 'lump in breast', 'chemotherapy', 'malignant'], weight: 70, isRedFlag: true },
  { id: 'chest_pain', category: 'CARDIAC', keywords: ['seene mein dard', 'chhati dard', 'छातीत दुखणे', 'chest pain', 'left arm pain', 'heart attack', 'dil ka daura', 'हृदयविकार'], weight: 65, isRedFlag: true },
  { id: 'stroke_paralysis', category: 'NEURO', keywords: ['stroke', 'paralysis', 'lakwa', 'लक्वा', 'पक्षाघात', 'face drooping', 'arm weakness', 'slurred speech'], weight: 70, isRedFlag: true },
  { id: 'snake_bite', category: 'TRAUMA', keywords: ['saap ne kaata', 'saap', 'साप चावला', 'snakebite', 'nag', 'snake bite'], weight: 70, isRedFlag: true },
  { id: 'unconscious', category: 'NEURO', keywords: ['behoosh', 'behoshi', 'बेहोष', 'chakkar aake gir gaya', 'seizure', 'fits', 'mirgi', 'मिरगी'], weight: 60, isRedFlag: true },
  { id: 'severe_bleeding', category: 'TRAUMA', keywords: ['khoon behta', 'khoon nikal raha', 'रक्तस्राव', 'bleeding', 'heavy bleeding', 'khoon bahna'], weight: 60, isRedFlag: true },
  { id: 'fracture_fall', category: 'TRAUMA', keywords: ['fall', 'fall down', 'gir gaya', 'गिर गया', 'पडला', 'fracture', 'haddi tutna', 'हाड मोडले', 'broken bone', 'swollen leg after fall', 'child fell'], weight: 55, isRedFlag: true },

  // 🟡 High / Moderate Severity Symptoms
  { id: 'diabetes', category: 'ENDOCRINE', keywords: ['diabetes', 'sugar', 'मधुमेह', 'शूगर', 'sugar high', 'excessive thirst', 'frequent urination'], weight: 35 },
  { id: 'hypertension', category: 'CARDIOVASCULAR', keywords: ['high bp', 'blood pressure', 'उच्च रक्तदाब', 'bp high', 'headache bp'], weight: 30 },
  { id: 'fever_high', category: 'INFECTION', keywords: ['bukhaar', 'bukhar', 'ताप', 'fever', 'garam sharir', 'high fever', 'तेज बुखार'], weight: 25 },
  { id: 'chills', category: 'MALARIA', keywords: ['thand lagna', 'thandi', 'थंडी वाजून ताप', 'chills', 'kampkampani'], weight: 20 },
  { id: 'cough_long', category: 'TB', keywords: ['khansi', 'khasi', 'खोकला', 'cough', 'balgam', 'khoon khansi', 'chronic cough'], weight: 30 },
  { id: 'breathlessness', category: 'RESPIRATORY', keywords: ['saas phulna', 'saans ki takleef', 'दम लागणे', 'breathless', 'saas lene me dikkat', 'asthma', 'दमा'], weight: 40 },
  { id: 'yellow_eyes', category: 'JAUNDICE', keywords: ['peeli ankh', 'peelapan', 'पिवळे डोळे', 'jaundice', 'peelia', 'कावीळ'], weight: 35 },
  { id: 'fatigue_weakness', category: 'ANEMIA', keywords: ['kamzori', 'kamjori', 'थकवा', 'fatigue', 'weakness', 'chakkar', 'अशक्तपणा'], weight: 20 },
  { id: 'vomiting', category: 'GI', keywords: ['ulti', 'vomit', 'उलट्या', 'vomiting', 'mitli'], weight: 20 },
  { id: 'loose_motion', category: 'DIARRHEA', keywords: ['dast', 'patli latrine', 'हगवण', 'diarrhea', 'dehydration', 'जुलाब'], weight: 25 },
  { id: 'pregnancy_pain', category: 'MATERNAL', keywords: ['pet mein dard', 'garbh', 'गरोदर', 'pregnancy pain', 'delivery time', 'गर्भवती'], weight: 40 },
  { id: 'wound_cut', category: 'TRAUMA', keywords: ['wound', 'cut', 'chot', 'चोट', 'जखम', 'laceration', 'bleeding wound', 'rashes', 'skin infection'], weight: 30 }
];

/**
 * Parse spoken transcript text and extract matched symptoms + risk score
 */
export function parseSymptomTranscript(transcriptText) {
  const text = (transcriptText || '').toLowerCase();
  const matchedSymptoms = [];
  let totalScore = 0;
  let hasEmergencyRedFlag = false;

  SYMPTOM_DICTIONARY.forEach((item) => {
    const isMatched = item.keywords.some((kw) => text.includes(kw.toLowerCase()));
    if (isMatched) {
      matchedSymptoms.push(item);
      totalScore += item.weight;
      if (item.isRedFlag) {
        hasEmergencyRedFlag = true;
      }
    }
  });

  // Calculate final risk level
  let riskLevel = 'GREEN';
  let adviceHindi = '';
  let adviceMarathi = '';
  let actionSteps = [];

  if (hasEmergencyRedFlag || totalScore >= 55) {
    riskLevel = 'RED';
    adviceHindi = '🔴 आपातकालीन स्थिति (HIGH EMERGENCY): मरीज को तुरंत जिला अस्पताल ले जाएं। 108 एम्बुलेंस बुलाएं।';
    adviceMarathi = '🔴 अत्यंत गंभीर परिस्थिती! रुग्णाला त्वरित जिल्हा रुग्णालयात न्या. 108 रुग्णवाहिका बोलवा.';
    actionSteps = [
      'Call 108 Emergency Ambulance immediately.',
      'Do not delay referral to District Hospital / Specialist.',
      'Keep patient stable and calm during transit.',
    ];
  } else if (totalScore >= 30) {
    riskLevel = 'YELLOW';
    adviceHindi = '🟡 मध्यम जोखिम (PHC VISIT REQUIRED): 48 घंटे के भीतर प्राथमिक स्वास्थ्य केंद्र (PHC) डॉक्टर को दिखाएं।';
    adviceMarathi = '🟡 मध्यम धोका! 48 तासांच्या आत जवळील प्राथमिक आरोग्य केंद्रात (PHC) दाखवा.';
    actionSteps = [
      'Visit nearest PHC within 48 hours for clinical evaluation.',
      'Take prescribed first-aid / supportive care.',
      'Monitor closely for worsening symptoms.',
    ];
  } else {
    riskLevel = 'GREEN';
    adviceHindi = '🟢 सामान्य स्थिति (HOME CARE): घर पर देखभाल करें। पर्याप्त पानी, पोषण और आराम दें।';
    adviceMarathi = '🟢 सामान्य स्थिती. घरीच काळजी घ्या. पुरेसे पाणी आणि पोषक आहार द्या.';
    actionSteps = [
      'Provide supportive home care, adequate fluids, and nutrition.',
      'Follow-up visit by ASHA worker in 3-5 days.',
    ];
  }

  return {
    transcript: transcriptText,
    matchedSymptoms,
    riskScore: Math.min(100, Math.max(matchedSymptoms.length > 0 ? 25 : 10, totalScore)),
    riskLevel,
    hasEmergencyRedFlag,
    adviceHindi,
    adviceMarathi,
    actionSteps,
  };
}
