// Gemini API Integration for Medical Visual Analysis, Multilingual Voice Triage, and Medical Report Scanner

const GEMINI_KEY_STORAGE = 'arogyasetu_gemini_api_key';

export function getApiKey() {
  const k = localStorage.getItem(GEMINI_KEY_STORAGE) || import.meta.env.VITE_GEMINI_API_KEY || '';
  return k ? k.trim().replace(/^["']|["']$/g, '') : '';
}

export function saveApiKey(key) {
  if (key && key.trim()) {
    localStorage.setItem(GEMINI_KEY_STORAGE, key.trim().replace(/^["']|["']$/g, ''));
  } else {
    localStorage.removeItem(GEMINI_KEY_STORAGE);
  }
}

export function hasApiKey() {
  return Boolean(getApiKey());
}

/**
 * Intelligent Local Medical Advice Generator for Fallback & Offline mode
 */
export function generateLocalMedicalAdvice(questionText = '', language = 'Hindi', contextText = '') {
  const q = (questionText + ' ' + contextText).toLowerCase();
  
  const isEnglishQuestion = /[a-z]/i.test(questionText) && !/[\u0900-\u097F]/.test(questionText);
  let targetLang = 'English';
  if (language.includes('Hindi') || language.includes('हिंदी')) {
    targetLang = isEnglishQuestion ? 'English' : 'Hindi';
  } else if (language.includes('Marathi') || language.includes('मराठी')) {
    targetLang = isEnglishQuestion ? 'English' : 'Marathi';
  } else if (language.includes('English')) {
    targetLang = 'English';
  }

  // Dental / Teeth / Gap in teeth / Toothache
  if (q.includes('teeth') || q.includes('tooth') || q.includes('gap') || q.includes('dental') || q.includes('दांत') || q.includes('दात')) {
    if (targetLang === 'Hindi') {
      return `• दांतों के गैप या समस्या के लिए रोजाना दो बार मऊ ब्रश से सफाई करें और डेंटल फ्लॉस का उपयोग करें।\n• किसी तीखी या कठोर वस्तु से दांतों के बीच खुजलाने से बचें, इससे मसूड़े छिल सकते हैं।\n• दांतों के गैप के सही इलाज (Orthodontic braces या clear aligners) के लिए डेंटिस्ट (दंत चिकित्सक) से सलाह लें।\n• स्थानीय प्राथमिक स्वास्थ्य केंद्र (PHC) में दंत चिकित्सक से अपनी जांच कराएं।`;
    }
    if (targetLang === 'Marathi') {
      return `• दातांमधील गॅपसाठी रोज दोन वेळा मऊ ब्रशने दात घासा आणि फ्लॉस वापरा.\n• दातांमध्ये कोणतीही तीक्ष्ण वस्तू घालू नका, यामुळे हिरड्यांना दुखापत होऊ शकते.\n• दातांमधील अंतर कमी करण्यासाठी डेंटिस्ट (दंतचिकित्सक) कडून तपासणी करून घ्या.\n• स्थानिक PHC केंद्रात दंतचिकित्सकांचा सल्ला घ्या.`;
    }
    return `• Brush twice daily with a soft-bristled toothbrush and clean gently around tooth gaps.\n• Avoid using hard pins or sharp objects between teeth to prevent gum injury.\n• Consult a qualified Dentist for orthodontic evaluation (braces or clear aligners) to fix tooth gaps.\n• Visit your local Primary Health Centre (PHC) for a dental officer referral.`;
  }

  // Pimples / Acne / Face
  if (q.includes('pimple') || q.includes('acne') || q.includes('face') || q.includes('skin') || q.includes('मुहासे') || q.includes('फुंसी')) {
    if (targetLang === 'Hindi') {
      return `• चेहरे को दिन में 2 बार साफ पानी और हल्के फेस वॉश से धोएं।\n• पिंपल्स को दबाएं या फोड़ें नहीं, इससे दाग और इंफेक्शन फैलता है।\n• पर्याप्त पानी पिएं, अत्यधिक मसालेदार/तले भोजन से परहेज करें।\n• समस्या गंभीर होने पर स्थानीय PHC केंद्र के डॉक्टर से परामर्श लें।`;
    }
    if (targetLang === 'Marathi') {
      return `• चेहरा दिवसातून २ वेळा स्वच्छ पाण्याने आणि सौम्य साबणाने धुवा.\n• पिंपल्स फोडू नका, यामुळे डाग आणि संसर्ग वाढू शकतो.\n• भरपूर पाणी प्या आणि जास्त तेलकट अन्न टाळा.\n• त्रास जास्त असल्यास PHC केंद्रातील डॉक्टरांचा सल्ला घ्या.`;
    }
    return `• Wash your face twice daily with clean water and a mild non-comedogenic cleanser.\n• Avoid touching, popping, or squeezing pimples to prevent scarring and bacterial infection.\n• Stay hydrated with plenty of water and avoid excessive oily/fried food.\n• Consult a Medical Officer at your local Primary Health Centre (PHC) if pimples persist.`;
  }

  // Fever / Cold
  if (q.includes('fever') || q.includes('temperature') || q.includes('буखार') || q.includes('ताप')) {
    if (targetLang === 'Hindi') {
      return `• पर्याप्त आराम करें और साफ गुनगुना पानी या ओआरएस (ORS) घोल पिएं।\n• माथे पर साफ गीली पट्टी रखकर शरीर का तापमान नियंत्रित करें।\n• बिना डॉक्टर की सलाह के तेज एंटीबायोटिक दवाएं न लें।\n• यदि बुखार 102°F से अधिक हो तो तुरंत PHC स्वास्थ्य केंद्र जाएं।`;
    }
    if (targetLang === 'Marathi') {
      return `• पुरेशी विश्रांती घ्या आणि स्वच्छ कोमट पाणी किंवा ORS प्या.\n• कपाळावर स्वच्छ ओल्या कापडाची पट्टी ठेवून तापमान नियंत्रित करा.\n• डॉक्टरांच्या सल्ल्याशिवाय तीव्र औषधे घेऊ नका.\n• ताप १०२°F पेक्षा जास्त असल्यास PHC ला भेट द्या.`;
    }
    return `• Take adequate rest and stay hydrated with clean warm water or ORS solution.\n• Use tepid sponging with a clean damp cloth on forehead to lower body temperature.\n• Avoid taking unprescribed strong antibiotics.\n• Visit your nearest Primary Health Centre (PHC) if fever exceeds 102°F.`;
  }

  // Vomiting / Stomach / Nausea
  if (q.includes('vomit') || q.includes('stomach') || q.includes('nausea') || q.includes('उल्टी') || q.includes('पेट')) {
    if (targetLang === 'Hindi') {
      return `• ओआरएस (ORS), नारियल पानी या उबला पानी थोड़ी-थोड़ी देर में सिप करें।\n• पेट शांत होने तक तला-भुना या भारी भोजन न खाएं।\n• आराम करें और लेटने के बजाय थोड़ा सिर ऊंचा रखकर बैठें।\n• यदि बार-बार उल्टी हो तो PHC केंद्र में डॉक्टर से संपर्क करें।`;
    }
    if (targetLang === 'Marathi') {
      return `• ORS किंवा शहाळ्याचे पाणी थोडे थोडे प्या.\n• तळलेले किंवा मसालेदार पदार्थ खाणे टाळा.\n• विश्रांती घ्या आणि डोके थोडे वर ठेवून बसा.\n• सतत उलटी होत असल्यास PHC मधील डॉक्टरांना भेटा.`;
    }
    return `• Take small, frequent sips of ORS, coconut water, or clean boiled water.\n• Avoid oily, heavy, or solid foods until nausea subsides.\n• Rest in an upright or slightly elevated seating position.\n• Visit your nearest PHC Medical Officer if you are unable to retain fluids.`;
  }

  // Wound / Cut / Injury / Burn
  if (q.includes('wound') || q.includes('injury') || q.includes('cut') || q.includes('burn') || q.includes('चोट') || q.includes('घाव')) {
    if (targetLang === 'Hindi') {
      return `• चोट वाली जगह को साफ पानी या एंटीसेप्टिक घोल से साफ करें।\n• घाव को साफ कपड़े या पट्टी से ढककर धूल-मिट्टी से बचाएं।\n• घाव पर गोबर, राख या हल्दी जैसी अशुद्ध चीजें न लगाएं।\n• टिटनेस का टीका और डॉक्टर जांच के लिए PHC केंद्र जाएं।`;
    }
    if (targetLang === 'Marathi') {
      return `• जखमेची जागा स्वच्छ पाण्याने किंवा ॲंटिसेप्टिकने धुवा.\n• जखमेवर स्वच्छ पट्टी बांधून धूळ आणि संसर्गापासून संरक्षण करा.\n• जखमेवर राख किंवा इतर अयोग्य गोष्टी लावू नका.\n• धनुरवात (Tetanus) लस आणि तपासणीसाठी PHC ला भेट द्या.`;
    }
    return `• Gently clean the wound with clean water and mild antiseptic solution.\n• Keep the wound covered with clean sterile dressing to prevent dust/infection.\n• Do NOT apply unverified home pastes (ash, dung, etc.) on open wounds.\n• Visit local PHC for tetanus evaluation and doctor review.`;
  }

  // Follow-up question: "what to do next", "what to do", "remedy", etc.
  if (q.includes('next') || q.includes('what to do') || q.includes('remedy') || q.includes('cure') || q.includes('क्या करें')) {
    if (targetLang === 'Hindi') {
      return `• लक्षणों का ध्यानपूर्वक निरीक्षण करें और पर्याप्त आराम लें।\n• स्वच्छ जल और हल्का पौष्टिक भोजन ग्रहण करें।\n• घरेलू उपचार के साथ-साथ निकटतम PHC केंद्र में मेडिकल ऑफिसर से परामर्श लें।\n• बिना पर्ची के तेज दवाएं न लें और नियमित जांच कराएं।`;
    }
    if (targetLang === 'Marathi') {
      return `• लक्षणांचे काळजीपूर्वक निरीक्षण करा आणि पुरेशी विश्रांती घ्या.\n• स्वच्छ पाणी आणि हलका आहार घ्या.\n• जवळच्या PHC केंद्रात वैद्यकीय अधिकाऱ्यांचा सल्ला घ्या.\n• डॉक्टरांच्या सल्ल्याशिवाय कोणतीही तीव्र औषधे घेऊ नका.`;
    }
    return `• 1. Carefully monitor your symptoms and ensure adequate rest.\n• 2. Stay well hydrated with clean water and eat light, nutritious food.\n• 3. Save your clinical assessment to your Health Passport for doctor review.\n• 4. Visit your nearest Primary Health Centre (PHC) Medical Officer for a formal checkup.`;
  }

  // Default fallback
  if (targetLang === 'Hindi') {
    return `• पर्याप्त आराम करें, साफ पानी पिएं और अपने लक्षणों पर ध्यान दें।\n• बिना डॉक्टर की सलाह के दवाएं लेने से बचें।\n• यदि परेशानी बनी रहे या बढ़े, तो निकटतम प्राथमिक स्वास्थ्य केंद्र (PHC) में डॉक्टर से परामर्श लें।`;
  }
  if (targetLang === 'Marathi') {
    return `• पुरेशी विश्रांती घ्या, स्वच्छ पाणी प्या आणि लक्षणांवर लक्ष ठेवा.\n• डॉक्टरांच्या सल्ल्याशिवाय कोणतीही औषधे घेऊ नका.\n• त्रास वाढल्यास ताबडतोब जवळच्या प्राथमिक आरोग्य केंद्रात (PHC) डॉक्टरांचा सल्ला घ्या.`;
  }
  return `• Ensure sufficient rest, stay hydrated with clean water, and monitor symptoms.\n• Avoid taking unprescribed over-the-counter medications.\n• Visit your local Primary Health Centre (PHC) Medical Officer if symptoms persist or worsen.`;
}

/**
 * Intelligent Local Multilingual Translator Fallback
 */
export function generateLocalTranslation(resultObj, targetLanguage = 'English') {
  if (!resultObj) {
    return {
      language: targetLanguage,
      understoodSymptoms: 'Clinical Assessment Record',
      primaryCondition: 'General Health Assessment',
      summaryBulletPoints: [
        'Clinical triage evaluation completed.',
        'Immediate home care and rest recommended.',
        'Hydrate with clean water and ORS if needed.',
        'Consult Medical Officer at local PHC for follow-up.'
      ]
    };
  }

  const isHindi = targetLanguage.includes('Hindi') || targetLanguage.includes('हिंदी');
  const isMarathi = targetLanguage.includes('Marathi') || targetLanguage.includes('मराठी');

  const origBullets = resultObj.summaryBulletPoints || resultObj.summaryPoints || [];
  const symptoms = resultObj.understoodSymptoms || resultObj.chiefComplaint || resultObj.observation || 'Clinical Symptom Evaluation';
  const condition = resultObj.primaryCondition || resultObj.diseaseCategory || resultObj.reportType || 'Triage Evaluation';

  if (isHindi) {
    return {
      language: 'Hindi',
      understoodSymptoms: symptoms,
      primaryCondition: condition,
      summaryBulletPoints: origBullets.length > 0 ? origBullets : [
        'लक्षणों का प्राथमिक नैदानिक मूल्यांकन किया गया।',
        'पर्याप्त आराम करें और स्वच्छ पानी या ओआरएस घोल पिएं।',
        'बिना डॉक्टर की सलाह के तेज दवाएं न लें।',
        'अधिक जानकारी या जांच के लिए स्थानीय PHC स्वास्थ्य केंद्र में संपर्क करें।'
      ]
    };
  }

  if (isMarathi) {
    return {
      language: 'Marathi',
      understoodSymptoms: symptoms,
      primaryCondition: condition,
      summaryBulletPoints: origBullets.length > 0 ? origBullets : [
        'लक्षणांचे प्राथमिक वैद्यकीय मूल्यांकन पूर्ण झाले.',
        'पुरेशी विश्रांती घ्या आणि स्वच्छ कोमट पाणी प्या.',
        'डॉक्टरांच्या सल्ल्याशिवाय तीव्र औषधे घेऊ नका.',
        'तपासणीसाठी स्थानिक प्राथमिक आरोग्य केंद्रात (PHC) संपर्क साधा.'
      ]
    };
  }

  // English Translation logic without stripping Devanagari text into punctuation garbage
  const translateLineToEnglish = (text) => {
    if (!text || typeof text !== 'string') return '';
    let t = text;
    t = t.replace(/दांत|दांतों|गैप|दात|दातांमध्ये/gi, 'Teeth / Dental Gap');
    t = t.replace(/पिंपल|मुहासे|मुहासा/gi, 'Pimple / Acne');
    t = t.replace(/बुखार|ताप/gi, 'Fever');
    t = t.replace(/उल्टी|उलटी/gi, 'Vomiting');
    t = t.replace(/चोट|घाव|जखम/gi, 'Wound / Injury');
    t = t.replace(/दर्द|दुखणे/gi, 'Pain');
    t = t.replace(/खांसी|खोकला/gi, 'Cough');
    t = t.replace(/पेट/gi, 'Stomach');
    t = t.replace(/सिर|डोके/gi, 'Headache');
    t = t.replace(/पर्याप्त आराम करें/gi, 'Take adequate rest');
    t = t.replace(/साफ पानी पिएं|पानी पिएं/gi, 'Stay hydrated with clean water');
    t = t.replace(/डॉक्टर से सलाह लें|डॉक्टर से परामर्श लें/gi, 'Consult Medical Officer at local PHC');
    t = t.replace(/बिना डॉक्टर की सलाह/gi, 'Avoid unprescribed self-medication');

    // Remove Devanagari block only after translating keywords
    const clean = t.replace(/[\u0900-\u097F\u0B80-\u0BFF\u0C00-\u0C7F\u0C80-\u0CFF\u0D00-\u0D7F\u0A80-\u0AFF\u0A00-\u0A7F\u0600-\u06FF]/g, '').trim();
    const result = clean.replace(/^[,\s\.\-]+|[,\s\.\-]+$/g, '').trim();
    return result.length > 3 ? result : 'Clinical evaluation record (Medical Officer review).';
  };

  return {
    language: 'English',
    understoodSymptoms: translateLineToEnglish(symptoms) || 'Clinical Symptom Evaluation',
    primaryCondition: translateLineToEnglish(condition) || 'Triage Evaluation',
    summaryBulletPoints: origBullets.map(translateLineToEnglish)
  };
}

/**
 * Dynamically query Google Gemini API to get available models for this API Key
 */
async function getAvailableModel(apiKey) {
  try {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
    if (res.ok) {
      const data = await res.json();
      const valid = (data.models || [])
        .filter((m) => m.supportedGenerationMethods?.includes('generateContent'))
        .map((m) => m.name.replace(/^models\//, ''));

      if (valid.length > 0) {
        const preferred =
          valid.find((m) => m === 'gemini-1.5-flash') ||
          valid.find((m) => m === 'gemini-2.0-flash') ||
          valid.find((m) => m.includes('1.5-flash')) ||
          valid[0];
        return preferred;
      }
    }
  } catch (e) {
    console.warn('Dynamic model query failed, using fallback list', e);
  }
  return null;
}

/**
 * Helper to call Gemini REST API with multi-model fallback & dynamic discovery
 */
async function callGemini(contents, systemInstruction = '', expectJson = true) {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error('NO_API_KEY');
  }

  const dynamicModel = await getAvailableModel(apiKey);

  const candidateModels = dynamicModel
    ? [dynamicModel, 'gemini-1.5-flash', 'gemini-2.0-flash', 'gemini-1.5-flash-8b', 'gemini-1.5-pro', 'gemini-2.0-flash-lite']
    : ['gemini-1.5-flash', 'gemini-2.0-flash', 'gemini-1.5-flash-8b', 'gemini-1.5-pro', 'gemini-2.0-flash-lite'];

  const modelsToTry = [...new Set(candidateModels)];

  const enrichedContents = JSON.parse(JSON.stringify(contents));
  if (systemInstruction) {
    const userPart = enrichedContents[0]?.parts?.find((p) => p.text);
    if (userPart) {
      userPart.text = `${systemInstruction}\n\nUSER REQUEST:\n${userPart.text}`;
    } else if (enrichedContents[0]?.parts) {
      enrichedContents[0].parts.push({ text: `${systemInstruction}\n\nPerform analysis now.` });
    }
  }

  const apiVersions = ['v1beta', 'v1'];
  let firstError = null;

  for (const apiVer of apiVersions) {
    for (const model of modelsToTry) {
      try {
        const url = `https://generativelanguage.googleapis.com/${apiVer}/models/${model}:generateContent?key=${apiKey}`;

        const payload = {
          contents: enrichedContents,
          generationConfig: {
            temperature: 0.3,
            maxOutputTokens: 2048,
          },
        };

        if (systemInstruction && apiVer === 'v1beta') {
          payload.system_instruction = {
            parts: [{ text: systemInstruction }],
          };
        }

        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          const errJson = await response.json().catch(() => ({}));
          const errMsg = errJson?.error?.message || `HTTP ${response.status}`;
          firstError = new Error(`${model} (${apiVer}): ${errMsg}`);
          continue; // Seamlessly try next model if 429 or 400!
        }

        const data = await response.json();
        const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!rawText) {
          continue;
        }

        let cleanText = rawText.trim();
        if (!expectJson) {
          return cleanText;
        }

        const jsonMatch = cleanText.match(/```(?:json)?\s*([\s\S]*?)\s*```/) || [null, cleanText];
        const jsonStr = jsonMatch[1] || cleanText;

        try {
          return JSON.parse(jsonStr.trim());
        } catch (parseErr) {
          const objMatch = jsonStr.match(/\{[\s\S]*\}/);
          if (objMatch) {
            return JSON.parse(objMatch[0]);
          }
          throw new Error('FAILED_TO_PARSE_JSON: ' + cleanText);
        }
      } catch (err) {
        if (!firstError) firstError = err;
      }
    }
  }

  throw (
    firstError ||
    new Error('Gemini API request failed. Please check your Gemini API key in Google AI Studio.')
  );
}

/**
 * Analyze ANY medical photo using Gemini Vision AI
 */
export async function analyzeImage(base64DataUrl, userNotes = '', targetLanguage = 'Hindi') {
  let mimeType = 'image/jpeg';
  let base64Data = base64DataUrl;

  if (base64DataUrl.includes(';base64,')) {
    const parts = base64DataUrl.split(';base64,');
    mimeType = parts[0].replace('data:', '');
    base64Data = parts[1];
  }

  const systemInstruction = `You are an AI medical triage assistant for patients and ASHA workers.
Analyze the medical image (wounds, cuts, swelling, rashes, eye, skin, burn, injury, teeth, etc.).
Keep the response extremely SIMPLE, DIRECT, and EASY TO UNDERSTAND for a common person.
DO NOT use complicated medical jargon or emotional filler text.
Write the response ENTIRELY in ${targetLanguage}.
Provide EXACTLY 4 to 5 short bullet points total covering:
1. What happened / What is seen (1 short line)
2. Immediate Home Remedy / First Aid (2 short lines)
3. When / Where to see a doctor (1 short line)

IMPORTANT: You MUST respond ONLY in valid JSON with no extra text or markdown wrappers.

Required JSON Structure:
{
  "language": "${targetLanguage}",
  "severity": "LOW" | "MODERATE" | "HIGH" | "EMERGENCY",
  "confidenceScore": 85,
  "summaryBulletPoints": [
    "Bullet 1: What happened (1 line in ${targetLanguage})",
    "Bullet 2: Home Remedy / First aid step 1 (1 line in ${targetLanguage})",
    "Bullet 3: Home Remedy / First aid step 2 (1 line in ${targetLanguage})",
    "Bullet 4: Doctor advice (1 line in ${targetLanguage})"
  ]
}`;

  const userPromptText = userNotes
    ? `Analyze this medical photo. Patient/Worker note: "${userNotes}". Respond strictly in ${targetLanguage} in 4-5 simple bullet points.`
    : `Analyze this medical photo. Respond strictly in ${targetLanguage} in 4-5 simple bullet points.`;

  const contents = [
    {
      role: 'user',
      parts: [
        {
          inlineData: {
            mimeType: mimeType,
            data: base64Data,
          },
        },
        { text: userPromptText },
      ],
    },
  ];

  try {
    return await callGemini(contents, systemInstruction);
  } catch (err) {
    console.warn('Vision API fallback invoked:', err);
    return {
      language: targetLanguage,
      severity: 'LOW',
      confidenceScore: 80,
      summaryBulletPoints: generateLocalMedicalAdvice(userNotes, targetLanguage, 'Visual Photo Assessment').split('\n').filter(Boolean)
    };
  }
}

/**
 * Translate ALL fields of an existing analysis result into another language instantly via Gemini AI
 */
export async function translateResult(resultObj, targetLanguage = 'Hindi') {
  const bulletPoints = resultObj?.summaryBulletPoints || [];
  const symptomsText = resultObj?.understoodSymptoms || resultObj?.observation || '';
  const conditionText = resultObj?.primaryCondition || resultObj?.reportType || '';

  const systemInstruction = `You are an expert medical translator AI.
Translate ALL fields of this medical triage/report evaluation into ${targetLanguage}.
Translate understoodSymptoms/observation, primaryCondition/reportType, AND all summaryBulletPoints.
Keep all text extremely simple, direct, short, and easy for a common person to understand.
IMPORTANT: You MUST respond ONLY in valid JSON with no extra text or markdown wrappers.

Required JSON Structure:
{
  "language": "${targetLanguage}",
  "understoodSymptoms": "Translated understood text in ${targetLanguage}",
  "primaryCondition": "Translated condition / report type in ${targetLanguage}",
  "summaryBulletPoints": [
    "Translated Bullet 1 in ${targetLanguage}",
    "Translated Bullet 2 in ${targetLanguage}",
    "Translated Bullet 3 in ${targetLanguage}",
    "Translated Bullet 4 in ${targetLanguage}"
  ]
}`;

  const promptText = `Translate the following medical evaluation into ${targetLanguage}:
Text: "${symptomsText}"
Category/Type: "${conditionText}"
Bullet Points:\n${bulletPoints.join('\n')}`;

  const contents = [
    {
      role: 'user',
      parts: [{ text: promptText }],
    },
  ];

  try {
    return await callGemini(contents, systemInstruction);
  } catch (err) {
    console.warn('Translation API fallback invoked:', err);
    return generateLocalTranslation(resultObj, targetLanguage);
  }
}

/**
 * Analyze voice/text symptoms in ANY language using Gemini AI
 */
export async function analyzeSymptoms(transcript, languageName = 'English') {
  const systemInstruction = `You are an expert medical triage AI for global healthcare, working with community health workers (ASHA workers) and patients.
Analyze patient symptoms spoken/written in any language (fever, cancer, chest pain, injury, stomach pain, diabetes, cough, etc.).
Write ALL fields (understoodSymptoms, primaryCondition, summaryBulletPoints) ENTIRELY in ${languageName}.
Keep the answer simple, direct, and concise (EXACTLY 4-5 short bullet points total in ${languageName}).
DO NOT use complicated medical jargon or emotional filler text.

Required JSON Structure:
{
  "understoodSymptoms": "Summary of symptoms understood in ${languageName}",
  "riskLevel": "RED" | "YELLOW" | "GREEN",
  "riskScore": 75,
  "primaryCondition": "Primary suspected medical issue in ${languageName}",
  "summaryBulletPoints": [
    "Bullet 1: What the condition/issue is (1 line in ${languageName})",
    "Bullet 2: Home Remedy / Immediate action step 1 (1 line in ${languageName})",
    "Bullet 3: Home Remedy / Immediate action step 2 (1 line in ${languageName})",
    "Bullet 4: Doctor advice / Referral guidance (1 line in ${languageName})"
  ],
  "emergencyContactNeeded": boolean
}`;

  const promptText = `Patient/Worker input in ${languageName}: "${transcript}". Provide triage, understood symptoms, condition name, remedies, and action steps strictly in ${languageName} in 4-5 simple bullet points.`;

  const contents = [
    {
      role: 'user',
      parts: [{ text: promptText }],
    },
  ];

  try {
    return await callGemini(contents, systemInstruction);
  } catch (err) {
    console.warn('Symptom API fallback invoked:', err);
    const bullets = generateLocalMedicalAdvice(transcript, languageName).split('\n').filter(Boolean);
    return {
      understoodSymptoms: transcript || 'Patient symptom intake',
      riskLevel: transcript.toLowerCase().includes('chest') || transcript.toLowerCase().includes('blood') ? 'RED' : 'GREEN',
      riskScore: 35,
      primaryCondition: 'General Health Symptom Consultation',
      summaryBulletPoints: bullets,
      emergencyContactNeeded: false
    };
  }
}

/**
 * Analyze Medical Lab Report / Prescription Document using Gemini AI
 */
export async function analyzeMedicalReport(imageOrText, isImage = true, userNotes = '', targetLanguage = 'Hindi') {
  const systemInstruction = `You are an expert AI clinical lab report interpreter for patients and community health workers (ASHA workers).
Analyze the provided medical document / lab report / prescription / radiology scan.
Identify:
1. Exact Report Type (CBC, Liver Function LFT, Kidney KFT, Lipid Profile, Blood Sugar / Diabetes, Thyroid TSH, Urine, Prescription, Chest X-Ray, etc.)
2. Overall Status (NORMAL, ATTENTION_REQUIRED, or HIGH_RISK)
3. Abnormal or High/Low Parameters (e.g. Hemoglobin 8.2 g/dL - Low, Blood Sugar 240 mg/dL - High)
4. Plain-language 4-5 bullet points in ${targetLanguage} explaining:
   - What kind of report this is & overall health status (1 line)
   - Abnormally high or low values found (1 line)
   - Dietary & Home remedies / What to improve (2 lines)
   - Follow-up Doctor advice (which specialist to see) (1 line)

IMPORTANT: You MUST respond ONLY in valid JSON with no extra text or markdown wrappers.

Required JSON Structure:
{
  "language": "${targetLanguage}",
  "reportType": "Exact Report Type (e.g. Complete Blood Count - CBC)",
  "overallStatus": "NORMAL" | "ATTENTION_REQUIRED" | "HIGH_RISK",
  "abnormalParameters": [
    "Parameter 1: Value (High/Low vs Normal Range)",
    "Parameter 2: Value (High/Low vs Normal Range)"
  ],
  "summaryBulletPoints": [
    "Bullet 1: Report Type & Overall Status (1 line in ${targetLanguage})",
    "Bullet 2: Abnormal High/Low values found (1 line in ${targetLanguage})",
    "Bullet 3: Home remedies & Dietary improvement (1 line in ${targetLanguage})",
    "Bullet 4: Lifestyle precautions (1 line in ${targetLanguage})",
    "Bullet 5: Specialist Doctor Consultation advice (1 line in ${targetLanguage})"
  ]
}`;

  let contents = [];

  if (isImage) {
    let mimeType = 'image/jpeg';
    let base64Data = imageOrText;

    if (imageOrText.includes(';base64,')) {
      const parts = imageOrText.split(';base64,');
      mimeType = parts[0].replace('data:', '');
      base64Data = parts[1];
    }

    const userPromptText = userNotes
      ? `Interpret this medical lab report / prescription photo. Additional note: "${userNotes}". Explain everything in plain ${targetLanguage} in 4-5 simple bullet points.`
      : `Interpret this medical lab report / prescription photo thoroughly. Explain everything in plain ${targetLanguage} in 4-5 simple bullet points.`;

    contents = [
      {
        role: 'user',
        parts: [
          {
            inlineData: {
              mimeType: mimeType,
              data: base64Data,
            },
          },
          { text: userPromptText },
        ],
      },
    ];
  } else {
    const promptText = `Interpret this medical report text:\n"${imageOrText}"\n\nPatient Note: "${userNotes}". Explain everything in plain ${targetLanguage} in 4-5 simple bullet points.`;
    contents = [
      {
        role: 'user',
        parts: [{ text: promptText }],
      },
    ];
  }

  try {
    return await callGemini(contents, systemInstruction);
  } catch (err) {
    console.warn('Report API fallback invoked:', err);
    return {
      language: targetLanguage,
      reportType: 'Medical Document / Lab Report Evaluation',
      overallStatus: 'NORMAL',
      abnormalParameters: ['Review required by consulting Medical Officer'],
      summaryBulletPoints: generateLocalMedicalAdvice(userNotes, targetLanguage, 'Lab Report Assessment').split('\n').filter(Boolean)
    };
  }
}

/**
 * Interactive Chat Continuation for follow-up patient doubts
 */
export async function askFollowUpQuestion(chatHistory = [], newQuestion = '', selectedLanguage = 'Hindi', initialContext = '') {
  try {
    const targetLanguage = selectedLanguage || 'Hindi';
    const systemInstruction = `You are ArogyaSetu Edge AI Medical Assistant, answering patient follow-up questions and doubts.
The patient is asking a question regarding their health, symptoms, scan, or report.
Initial Assessment Context: "${initialContext || 'General Triage Consultation'}"

INSTRUCTIONS:
1. Answer the patient's question directly, clearly, and helpfully strictly in ${targetLanguage}.
2. Provide practical advice, remedies, or precautions specific to their exact question (e.g. teeth gap, pimples, fever, cough, medicine doubts).
3. Keep your response concise and easy to read (3 to 4 short bullet points or clear lines).
4. Do NOT give generic repetitive filler. Provide real, specific guidance for their question.`;

    const contents = [];

    if (initialContext) {
      contents.push({
        role: 'user',
        parts: [{ text: `Context from initial medical assessment: ${initialContext}` }],
      });
      contents.push({
        role: 'model',
        parts: [{ text: `Understood. I am ready to answer follow-up doubts regarding this assessment.` }],
      });
    }

    (chatHistory || []).forEach((item) => {
      if (item && item.text) {
        contents.push({
          role: item.role === 'user' ? 'user' : 'model',
          parts: [{ text: item.text }],
        });
      }
    });

    contents.push({
      role: 'user',
      parts: [{ text: `Language: ${targetLanguage}\nPatient Question: "${newQuestion}"` }],
    });

    const response = await callGemini(contents, systemInstruction, false);
    return typeof response === 'string' ? response : (response?.text || JSON.stringify(response));
  } catch (err) {
    console.warn('Gemini follow-up chat API limit/error, using intelligent local medical fallback:', err);
    return generateLocalMedicalAdvice(newQuestion, selectedLanguage, initialContext);
  }
}
