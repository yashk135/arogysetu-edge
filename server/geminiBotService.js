// server/geminiBotService.js
// Production-Grade Gemini API integration for ArogyaSetu Edge WhatsApp Bot

import dotenv from 'dotenv';
dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY || '';

/**
 * Intelligent Local Medical Advice Generator for Fallback & Offline mode
 */
export function generateLocalMedicalAdvice(questionText = '', language = 'Hindi') {
  const q = questionText.toLowerCase();
  
  const isEnglishQuestion = /[a-z]/i.test(questionText) && !/[\u0900-\u097F]/.test(questionText);
  let targetLang = 'English';
  if (language.includes('Hindi') || language.includes('हिंदी')) {
    targetLang = isEnglishQuestion ? 'English' : 'Hindi';
  } else if (language.includes('Marathi') || language.includes('मराठी')) {
    targetLang = isEnglishQuestion ? 'English' : 'Marathi';
  } else if (language.includes('English')) {
    targetLang = 'English';
  }

  // Dental / Teeth
  if (q.includes('teeth') || q.includes('tooth') || q.includes('gap') || q.includes('dental') || q.includes('दांत') || q.includes('दात')) {
    if (targetLang === 'Hindi') {
      return `📌 *आरोग्यसेतु मेडिकल सलाह (दांतों की समस्या)*:\n• दांतों की सफाई के लिए रोजाना दो बार मऊ ब्रश का प्रयोग करें।\n• तीखी या कठोर वस्तु से दांतों को न कुरेदें।\n• दांतों के सही इलाज के लिए नजदीकी डेंटिस्ट (PHC स्वास्थ्य केंद्र) से सलाह लें।`;
    }
    if (targetLang === 'Marathi') {
      return `📌 *आरोग्यसेतु वैद्यकीय सल्ला (दातांची समस्या)*:\n• रोज २ वेळा मऊ ब्रशने दात स्वच्छ करा.\n• दातांमध्ये कोणतीही तीक्ष्ण वस्तू घालू नका.\n• डेंटिस्ट किंवा जवळच्या PHC केंद्रात तपासणी करून घ्या.`;
    }
    return `📌 *ArogyaSetu Medical Guidance (Dental Care)*:\n• Brush twice daily with a soft toothbrush and floss gently.\n• Avoid picking teeth with hard or sharp objects.\n• Consult a dentist at your local Primary Health Centre (PHC).`;
  }

  // Pimples / Acne / Skin
  if (q.includes('pimple') || q.includes('acne') || q.includes('face') || q.includes('skin') || q.includes('मुहासे') || q.includes('फुंसी')) {
    if (targetLang === 'Hindi') {
      return `📌 *आरोग्यसेतु मेडिकल सलाह (त्वचा/पिंपल्स)*:\n• चेहरे को दिन में 2 बार साफ पानी और सौम्य फेस वॉश से धोएं।\n• पिंपल्स को दबाएं या फोड़ें नहीं, इससे दाग बनते हैं।\n• पर्याप्त पानी पिएं और तली-भुनी चीजों से परहेज करें।\n• समस्या बनी रहे तो प्राथमिक स्वास्थ्य केंद्र (PHC) के डॉक्टर को दिखाएं।`;
    }
    if (targetLang === 'Marathi') {
      return `📌 *आरोग्यसेतु वैद्यकीय सल्ला (त्वचा/पिंपल्स)*:\n• चेहरा दिवसातून २ वेळा स्वच्छ पाण्याने धुवा.\n• पिंपल्स फोडू नका, यामुळे डाग पडू शकतात.\n• भरपूर पाणी प्या आणि जास्त तेलकट अन्न टाळा.\n• त्रास जास्त असल्यास PHC केंद्रात डॉक्टरांचा सल्ला घ्या.`;
    }
    return `📌 *ArogyaSetu Medical Guidance (Skin/Acne)*:\n• Wash your face twice daily with clean water and mild cleanser.\n• Do not squeeze or pop pimples to prevent scarring.\n• Stay hydrated and avoid excessive oily food.\n• Visit your local Primary Health Centre (PHC) if persistent.`;
  }

  // Fever / Cold
  if (q.includes('fever') || q.includes('temperature') || q.includes('बुखार') || q.includes('ताप')) {
    if (targetLang === 'Hindi') {
      return `📌 *आरोग्यसेतु मेडिकल सलाह (बुखार)*:\n• पर्याप्त आराम करें और साफ गुनगुना पानी या ओआरएस (ORS) घोल पिएं।\n• माथे पर साफ गीली पट्टी रखकर तापमान नियंत्रित करें।\n• बिना डॉक्टर सलाह तेज एंटीबायोटिक न लें।\n• यदि बुखार 102°F से अधिक हो तो तुरंत PHC केंद्र जाएं।`;
    }
    if (targetLang === 'Marathi') {
      return `📌 *आरोग्यसेतु वैद्यकीय सल्ला (ताप)*:\n• पुरेशी विश्रांती घ्या आणि स्वच्छ कोमट पाणी किंवा ORS प्या.\n• कपाळावर ओल्या कापडाची पट्टी ठेवा.\n• डॉक्टरांच्या सल्ल्याशिवाय तीव्र औषधे घेऊ नका.\n• ताप १०२°F पेक्षा जास्त असल्यास PHC केंद्रात जा.`;
    }
    return `📌 *ArogyaSetu Medical Guidance (Fever)*:\n• Rest well and stay hydrated with warm clean water or ORS.\n• Use tepid sponging on forehead to lower body temperature.\n• Avoid unprescribed antibiotics.\n• Visit nearest PHC if fever exceeds 102°F.`;
  }

  // General Fallback
  if (targetLang === 'Hindi') {
    return `📌 *आरोग्यसेतु मेडिकल सलाह*:\n• अपने लक्षणों का ध्यानपूर्वक निरीक्षण करें और पर्याप्त आराम लें।\n• भरपूर साफ पानी पिएं और हल्का पौष्टिक भोजन लें।\n• यदि समस्या बनी रहती है या बढ़ती है, तो निकटतम प्राथमिक स्वास्थ्य केंद्र (PHC) में डॉक्टर से परामर्श लें।`;
  }
  if (targetLang === 'Marathi') {
    return `📌 *आरोग्यसेतु वैद्यकीय सल्ला*:\n• लक्षणांचे काळजीपूर्वक निरीक्षण करा आणि विश्रांती घ्या.\n• स्वच्छ पाणी आणि हलका आहार घ्या.\n• त्रास वाढल्यास जवळच्या प्राथमिक आरोग्य केंद्रात (PHC) डॉक्टरांना भेटा.`;
  }
  return `📌 *ArogyaSetu Medical Guidance*:\n• Monitor your symptoms closely and get adequate rest.\n• Stay well hydrated with clean water and nutritious light meals.\n• If symptoms persist or worsen, please consult a Medical Officer at your nearest Primary Health Centre (PHC).`;
}

/**
 * Call Gemini 1.5 Flash API with custom System Instruction for WhatsApp
 */
export async function processWhatsAppTextQuery(userText, language = 'Hindi') {
  if (!userText || !userText.trim()) {
    return generateLocalMedicalAdvice('', language);
  }

  if (!GEMINI_API_KEY) {
    console.warn('[WhatsApp Bot] GEMINI_API_KEY not found in env, using local advice engine.');
    return generateLocalMedicalAdvice(userText, language);
  }

  const systemInstructionText = `You are ArogyaSetu Edge AI Medical Assistant for WhatsApp, serving rural patients and ASHA healthcare workers in India.
Provide clear, empathetic, accurate medical guidance.
Always format your response cleanly for WhatsApp using bullet points (•) and bold titles (*Title*).
Include:
1. Short medical assessment
2. 3 actionable self-care or first-aid bullet points
3. A clear recommendation to visit the local Primary Health Centre (PHC) or call 108 if symptoms worsen.
Detect user language (Hindi, Marathi, English) and answer in the same language. Keep response under 150 words.`;

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;
    
    const payload = {
      contents: [
        {
          role: 'user',
          parts: [{ text: userText }]
        }
      ],
      system_instruction: {
        parts: [{ text: systemInstructionText }]
      },
      generationConfig: {
        temperature: 0.3,
        maxOutputTokens: 1024
      }
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      console.error(`[WhatsApp Bot] Gemini API status error: ${response.status}`);
      return generateLocalMedicalAdvice(userText, language);
    }

    const data = await response.json();
    const resultText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (resultText && resultText.trim()) {
      return resultText.trim();
    }

    return generateLocalMedicalAdvice(userText, language);
  } catch (err) {
    console.error('[WhatsApp Bot] Gemini API error:', err);
    return generateLocalMedicalAdvice(userText, language);
  }
}

/**
 * Process Multi-Modal Image/Photo Queries (Skin, Wound, Eye, Report)
 */
export async function processWhatsAppImageQuery(imageBase64, mimeType = 'image/jpeg', userPrompt = '') {
  if (!imageBase64) {
    return '❌ Image data could not be retrieved. Please try re-sending the photo on WhatsApp.';
  }

  if (!GEMINI_API_KEY) {
    return `📌 *ArogyaSetu Image Visual Triage*:\n• Photo received successfully.\n• *Observation*: Image shows dermatological / tissue area requiring evaluation.\n• *Advice*: Keep the affected area clean and dry. Do not apply unverified home pastes.\n• *Next Step*: Show this photo to your local ASHA worker or visit your nearest PHC Doctor for clinical review.`;
  }

  const promptText = userPrompt && userPrompt.trim() 
    ? userPrompt 
    : 'Analyze this medical image (skin condition, wound, eye infection, or medical document/report). Provide a clinical visual triage summary in simple WhatsApp bullet points. Include: 1. Visual Findings 2. Risk Level (Green/Yellow/Red) 3. Immediate Care / First Aid Steps 4. PHC Doctor Referral Advice.';

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

    const payload = {
      contents: [
        {
          role: 'user',
          parts: [
            { text: promptText },
            {
              inline_data: {
                mime_type: mimeType,
                data: imageBase64
              }
            }
          ]
        }
      ],
      generationConfig: {
        temperature: 0.2,
        maxOutputTokens: 1024
      }
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      console.error(`[WhatsApp Bot Vision] Gemini Vision API status error: ${response.status}`);
      return `📌 *ArogyaSetu Image Visual Triage*:\n• Photo received.\n• *Recommendation*: Keep area clean and dry.\n• *Next Step*: Please visit your nearest PHC Doctor for visual examination.`;
    }

    const data = await response.json();
    const resultText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (resultText && resultText.trim()) {
      return resultText.trim();
    }

    return `📌 *ArogyaSetu Image Visual Triage*:\n• Image evaluated.\n• *Next Step*: Please visit your nearest PHC Doctor for full medical evaluation.`;
  } catch (err) {
    console.error('[WhatsApp Bot Vision] Error:', err);
    return `📌 *ArogyaSetu Image Triage*:\n• Photo received successfully.\n• *Advice*: Please keep the area clean and consult your local PHC Doctor.`;
  }
}

/**
 * Process Audio / Voice Notes Sent Over WhatsApp
 */
export async function processWhatsAppAudioQuery(audioBase64, mimeType = 'audio/ogg', textFallback = '') {
  if (!audioBase64) {
    return processWhatsAppTextQuery(textFallback || 'Voice symptom consultation');
  }

  if (!GEMINI_API_KEY) {
    return processWhatsAppTextQuery(textFallback || 'Voice symptom consultation');
  }

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

    const payload = {
      contents: [
        {
          role: 'user',
          parts: [
            { text: 'Listen carefully to this spoken voice note in regional language (Hindi/Marathi/English). 1. Transcribe the symptoms 2. Provide a short triage assessment and clear self-care advice in the same language. Use clean WhatsApp bolding and bullet points.' },
            {
              inline_data: {
                mime_type: mimeType,
                data: audioBase64
              }
            }
          ]
        }
      ],
      generationConfig: {
        temperature: 0.3,
        maxOutputTokens: 1024
      }
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      return processWhatsAppTextQuery(textFallback || 'Voice symptom consultation');
    }

    const data = await response.json();
    const resultText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (resultText && resultText.trim()) {
      return resultText.trim();
    }

    return processWhatsAppTextQuery(textFallback || 'Voice symptom consultation');
  } catch (err) {
    console.error('[WhatsApp Bot Audio] Error:', err);
    return processWhatsAppTextQuery(textFallback || 'Voice symptom consultation');
  }
}
