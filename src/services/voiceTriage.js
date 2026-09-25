/**
 * Voice Triage Service — Multilingual Speech Recognition & Risk Scorer
 * Languages: Hindi (hi-IN), Marathi (mr-IN)
 */

// Dictionary of symptoms, keywords (Hindi/Marathi/Hinglish), weights & red flag indicators
const SYMPTOM_DICTIONARY = [
  // 🔴 Emergency Red Flag Rules (Auto RED)
  { id: 'chest_pain', category: 'CARDIAC', keywords: ['seene mein dard', 'chhati dard', 'छातीत दुखणे', 'chest pain', 'left arm pain'], weight: 50, isRedFlag: true },
  { id: 'snake_bite', category: 'TRAUMA', keywords: ['saap ne kaata', 'saap', 'साप चावला', 'snakebite', 'nag'], weight: 60, isRedFlag: true },
  { id: 'unconscious', category: 'NEURO', keywords: ['behoosh', 'behoshi', 'बेहोष', 'chakkar aake gir gaya', 'seizure'], weight: 50, isRedFlag: true },
  { id: 'severe_bleeding', category: 'MATERNAL', keywords: ['khoon behta', 'khoon nikal raha', 'रक्तस्राव', 'bleeding', 'heavy bleeding'], weight: 50, isRedFlag: true },

  // 🟡 High / Moderate Severity Symptoms
  { id: 'fever_high', category: 'INFECTION', keywords: ['bukhaar', 'bukhar', 'ताप', 'fever', 'garam sharir'], weight: 25 },
  { id: 'chills', category: 'MALARIA', keywords: ['thand lagna', 'thandi', 'थंडी वाजून ताप', 'chills', 'kampkampani'], weight: 15 },
  { id: 'cough_long', category: 'TB', keywords: ['khansi', 'khasi', 'खोकला', 'cough', 'balgam', 'khoon khansi'], weight: 30 },
  { id: 'breathlessness', category: 'RESPIRATORY', keywords: ['saas phulna', 'saans ki takleef', 'दम लागणे', 'breathless', 'saas lene me dikkat'], weight: 35 },
  { id: 'yellow_eyes', category: 'JAUNDICE', keywords: ['peeli ankh', 'peelapan', 'पिवळे डोळे', 'jaundice', 'peelia'], weight: 30 },
  { id: 'fatigue_weakness', category: 'ANEMIA', keywords: ['kamzori', 'kamjori', 'थकवा', 'fatigue', 'weakness', 'chakkar'], weight: 20 },
  { id: 'vomiting', category: 'GI', keywords: ['ulti', 'vomit', 'उलट्या', 'vomiting', 'mitli'], weight: 15 },
  { id: 'loose_motion', category: 'DIARRHEA', keywords: ['dast', 'patli latrine', 'हगवण', 'diarrhea', 'dehydration'], weight: 20 },
  { id: 'pregnancy_pain', category: 'MATERNAL', keywords: ['pet mein dard', 'garbh', 'गरोदर', 'pregnancy pain', 'delivery time'], weight: 30 },
];

/**
 * Parse spoken transcript text and extract matched symptoms + risk score
 */
export function parseSymptomTranscript(transcriptText) {
  const text = transcriptText.toLowerCase();
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

  if (hasEmergencyRedFlag || totalScore >= 66) {
    riskLevel = 'RED';
    adviceHindi = '🔴 आपातकालीन स्थिति (HIGH EMERGENCY): मरीज को तुरंत जिला अस्पताल ले जाएं। 108 एम्बुलेंस बुलाएं।';
    adviceMarathi = '🔴 अत्यंत गंभीर परिस्थिती! रुग्णाला त्वरित जिल्हा रुग्णालयात न्या. 108 रुग्णवाहिका बोलवा.';
    actionSteps = [
      'Call 108 Emergency Ambulance immediately.',
      'Do not delay referral to District Hospital.',
      'Keep patient calm and hydrated.',
    ];
  } else if (totalScore >= 31) {
    riskLevel = 'YELLOW';
    adviceHindi = '🟡 मध्यम जोखिम (PHC VISIT REQUIRED): 48 घंटे के भीतर प्राथमिक स्वास्थ्य केंद्र (PHC) डॉक्टर को दिखाएं।';
    adviceMarathi = '🟡 मध्यम धोका! 48 तासांच्या आत जवळील प्राथमिक आरोग्य केंद्रात (PHC) दाखवा.';
    actionSteps = [
      'Visit nearest PHC within 48 hours.',
      'Take prescribed ORS / Paracetamol if fever is present.',
      'Monitor for emergency red flags.',
    ];
  } else {
    riskLevel = 'GREEN';
    adviceHindi = '🟢 सामान्य स्थिति (HOME CARE): घर पर देखभाल करें। पर्याप्त पानी, पोषण और आराम दें।';
    adviceMarathi = '🟢 सामान्य स्थिती. घरीच काळजी घ्या. पुरेसे पाणी आणि पोषक आहार द्या.';
    actionSteps = [
      'Provide nutritious meal & clean drinking water.',
      'Follow-up visit by ASHA worker in 5-7 days.',
    ];
  }

  return {
    transcript: transcriptText,
    matchedSymptoms,
    riskScore: Math.min(100, totalScore),
    riskLevel,
    hasEmergencyRedFlag,
    adviceHindi,
    adviceMarathi,
    actionSteps,
  };
}
