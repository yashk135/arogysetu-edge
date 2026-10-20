/**
 * ArogyaSetu Edge — Offline Emergency First Aid Protocols Database
 * Pre-loaded WHO-aligned offline emergency guides with multi-language support (English, Hindi, Marathi).
 * Works 100% offline for frontline health workers, ASHA workers, and rural clinics.
 */

export const EMERGENCY_PROTOCOLS = [
  {
    id: 'snake_bite',
    icon: '🐍',
    titleEn: 'Snake Bite',
    titleHi: 'सर्पदंश (सांप का काटना)',
    titleMr: 'सर्पदंश (सापाने चावणे)',
    riskLevel: 'RED',
    stepsEn: [
      'Keep the patient calm and completely still. Any physical movement accelerates venom absorption into the bloodstream.',
      'Immediately remove rings, watches, bangles, or tight clothing from the bitten limb before swelling starts.',
      'Immobilize the bitten limb using a rigid splint or sling, keeping it at or slightly below the level of the heart.',
      'Gently wash the bite area with clean water or mild saline; do not scrub or press the wound.',
      'Keep the patient warm, reassure them continuously, and arrange immediate urgent transfer to a facility with Anti-Snake Venom (ASV).',
      'Note the snake’s color, pattern, and head shape from a safe distance, but never waste time trying to catch or kill it.'
    ],
    stepsHi: [
      'मरीज को शांत रखें और बिल्कुल स्थिर लेटाएं; किसी भी प्रकार की शारीरिक हलचल से जहर शरीर में तेजी से फैलता है।',
      'सूजन आने से पहले डंक वाले अंग से अंगूठी, चूड़ी, घड़ी या तंग कपड़े तुरंत उतार दें।',
      'काटे गए अंग को लकड़ी की खपच्ची (splint) या कपड़े से स्थिर करें और दिल के स्तर से थोड़ा नीचे रखें।',
      'घाव को साफ पानी या हल्के सलाइन से धीरे से धोएं; घाव को जोर से रगड़ें या दबाएं नहीं।',
      'मरीज को ढांढस बंधाएं और तुरंत नजदीकी अस्पताल ले जाएं जहां एंटी-स्नेक वेनम (ASV) उपलब्ध हो।',
      'सुरक्षित दूरी से सांप का रंग और आकार याद रखने की कोशिश करें, लेकिन उसे पकड़ने या मारने में समय नष्ट न करें।'
    ],
    stepsMr: [
      'रुग्णाला शांत ठेवा आणि अजिबात हालचाल करू देऊ नका; हालचालीमुळे विष शरीरात वेगाने पसरते.',
      'सूज येण्यापूर्वी चावलेल्या भागावरील अंगठी, घड्याळ, बांगड्या किंवा घट्ट कपडे त्वरित काढून टाका.',
      'चावलेला अवयव लाकडी पट्टीने (splint) स्थिर करा आणि तो हृदयाच्या पातळीच्या खाली ठेवा.',
      'जखम स्वच्छ पाण्याने हळूवारपणे धुवा; जखम जोरात घासू किंवा दाबू नका.',
      'रुग्णाला धीर द्या आणि तात्काळ सर्पदंश प्रतिबंधक लस (अँटी-व्हेनम ASV) उपलब्ध असलेल्या रुग्णालयात हलवा.',
      'सुरक्षित अंतरावरून सापाचा रंग किंवा आकार लक्षात ठेवा, पण सापाला पकडण्याचा किंवा मारण्याचा प्रयत्न करू नका.'
    ],
    doNotEn: [
      'Do NOT cut, slash, or make incisions across the bite marks.',
      'Do NOT attempt to suck venom out with your mouth or any suction device.',
      'Do NOT apply a tight arterial tourniquet or tight rope, which causes gangrene and limb loss.',
      'Do NOT apply ice packs, herbal paste, cow dung, chemicals, or electrical shock to the wound.'
    ],
    doNotHi: [
      'घाव पर चीरा (कट) न लगाएं और ब्लेड से त्वचा को न काटें।',
      'मुंह या किसी सक्शन उपकरण से जहर चूसने की कोशिश बिल्कुल न करें।',
      'अंग पर बहुत कसकर पट्टी या रस्सी (टूर्निकेट) न बांधें; इससे रक्त संचार रुककर अंग सड़ सकता है।',
      'घाव पर बर्फ, जड़ी-बूटी, गोबर, तेल या कोई रासायनिक पदार्थ न लगाएं।'
    ],
    doNotMr: [
      'जखमेवर ब्लेडने कापू नका किंवा चिरफाड करू नका.',
      'तोंडाने किंवा कोणत्याही सक्शन उपकरणाने विष शोषून घेण्याचा प्रयत्न करू नका.',
      'अंग अतिशय घट्ट दोरीने किंवा पट्टीने बांधू नका (टूर्निके लावू नका); यामुळे गँगरीन होऊ शकते.',
      'जखमेवर बर्फ, झाडपाल्याचे औषध, शेण किंवा कोणतेही रसायन लावू नका.'
    ],
    callEmergency: true,
    smsTemplate: 'EMERGENCY: Snake bite patient at {location}. Age: {age}. Time of bite: {time}. Immediate medical attention and ASV required. Send ambulance.'
  },
  {
    id: 'chest_pain',
    icon: '🫀',
    titleEn: 'Chest Pain / Heart Attack',
    titleHi: 'सीने में दर्द / दिल का दौरा',
    titleMr: 'छातीत दुखणे / हृदयविकाराचा झटका',
    riskLevel: 'RED',
    stepsEn: [
      'Have the patient immediately stop all physical activity and sit in a comfortable, supported position (half-sitting with knees bent).',
      'Loosen tight clothing around the neck, chest, and waist to ease breathing effort.',
      'Call 108 emergency ambulance services immediately and report suspected acute heart attack.',
      'If the patient is conscious and has no known allergy to aspirin or active bleeding, give one 300mg Aspirin tablet to chew slowly.',
      'Stay with the patient, reassure them calmly to reduce cardiac stress, and continuously monitor breathing and pulse.',
      'If the patient becomes unresponsive and stops breathing normally, begin CPR immediately (100–120 chest compressions per minute).'
    ],
    stepsHi: [
      'मरीज को तुरंत सारा काम रोककर पीठ के सहारे आरामदेह मुद्रा में बिठाएं (आधा लेटाएं और घुटने हल्के मोड़ें)।',
      'गर्दन, छाती और कमर के आसपास के तंग कपड़ों को तुरंत ढीला करें ताकि सांस लेना आसान हो सके।',
      'बिना किसी देरी के तुरंत 108 आपातकालीन नंबर पर कॉल करके कार्डियक एम्बुलेंस बुलाएं।',
      'यदि मरीज होश में है और उसे एस्पिरिन से एलर्जी या ब्लीडिंग नहीं है, तो एक 300mg एस्पिरिन की गोली चबाने को दें।',
      'मरीज के पास शांत रहें, उन्हें ढांढस बंधाएं और उनकी सांस व नाड़ी की गति पर लगातार नजर रखें।',
      'यदि मरीज बेहोश हो जाए और सांस रुक जाए, तो तुरंत छाती के बीच में सीपीआर (CPR - 100-120 बार प्रति मिनट) शुरू करें।'
    ],
    stepsMr: [
      'रुग्णाला कोणतीही हालचाल थांबवून पाठीला आधार देऊन आरामदायी स्थितीत बसवा (अर्धे झोपवून गुडघे थोडे वाकवा).',
      'श्वास घेणे सोपे व्हावे म्हणून गळा, छाती आणि पोटाभोवतीचे घट्ट कपडे सैल करा.',
      'ताबडतोब १०८ आपत्कालीन सेवेला फोन करा आणि हृदयविकाराचा झटका आल्याची माहिती द्या.',
      'रुग्ण शुद्धीत असल्यास आणि ऍस्पिरिनची ऍलर्जी नसल्यास, ३०० मिग्रॅ अस्पिरीनची गोळी हळूहळू चावून खायला द्या.',
      'रुग्णाजवळ राहून त्याला मानसिक आधार द्या आणि श्वासोच्छ्वास व नाडीच्या ठोक्यांवर सतत लक्ष ठेवा.',
      'रुग्ण बेशुद्ध पडल्यास व श्वास बंद झाल्यास तात्काळ सीपीआर (CPR - दर मिनिटाला १००-१२० वेळा छाती दाबणे) सुरू करा.'
    ],
    doNotEn: [
      'Do NOT allow the patient to walk, drive, climb stairs, or exert themselves physically.',
      'Do NOT dismiss symptoms as ordinary indigestion, acidity, or gas; do not waste time.',
      'Do NOT give heavy food, hot tea, coffee, or alcohol to drink.',
      'Do NOT leave the patient unattended or wait for symptoms to disappear on their own.'
    ],
    doNotHi: [
      'मरीज को बिल्कुल भी चलने-फिरने, सीढ़ियां चढ़ने या कोई मेहनत का काम न करने दें।',
      'लक्षणों को साधारण गैस या एसिडिटी समझकर नजरअंदाज न करें और समय व्यर्थ न गंवाएं।',
      'मरीज को भारी भोजन, गर्म चाय, कॉफी या शराब बिल्कुल न दें।',
      'मरीज को अकेला न छोड़ें और अस्पताल ले जाने में तनिक भी देर न करें।'
    ],
    doNotMr: [
      'रुग्णाला चालणे, पायऱ्या चढणे किंवा कसलेही श्रम करू देऊ नका.',
      'हा त्रास साधी ॲसिडिटी किंवा गॅस आहे असे समजून दुर्लक्ष करू नका.',
      'रुग्णाला जड जेवण, चहा, कॉफी किंवा मद्य अजिबात देऊ नका.',
      'रुग्णाला कधीही एकटे सोडू नका आणि तात्काळ १०८ ला फोन करण्यास विलंब करू नका.'
    ],
    callEmergency: true,
    smsTemplate: 'EMERGENCY: Suspected heart attack / severe chest pain at {location}. Age: {age}. Onset: {time}. Critical care ambulance needed immediately.'
  },
  {
    id: 'severe_bleeding',
    icon: '🩸',
    titleEn: 'Severe Bleeding',
    titleHi: 'गंभीर रक्तस्राव',
    titleMr: 'तीव्र रक्तस्राव',
    riskLevel: 'RED',
    stepsEn: [
      'Apply firm, continuous direct pressure directly over the bleeding wound using a sterile dressing, clean cloth, or clean hands.',
      'Maintain direct manual pressure for at least 10 to 15 uninterrupted minutes without lifting the pad to inspect the wound.',
      'If bleeding is from an extremity and no bone fracture is suspected, elevate the injured limb above the level of the heart.',
      'Lay the patient flat on their back and cover them with a clean blanket or clothing to prevent hypothermia and shock.',
      'If blood soaks through the dressing, do NOT remove the first pad; place additional sterile pads on top and press even harder.',
      'Secure the dressing firmly with a roller bandage and immediately transport to the nearest surgical or trauma center.'
    ],
    stepsHi: [
      'साफ स्टेराइल पट्टी या कपड़े से खून बहने वाले घाव पर सीधे दोनों हाथों से मजबूत और लगातार दबाव बनाएं।',
      'कम से कम 10 से 15 मिनट तक लगातार दबाव बनाए रखें; बार-बार पट्टी उठाकर घाव को न देखें।',
      'यदि हाथ या पैर से खून बह रहा हो और कोई हड्डी न टूटी हो, तो घायल अंग को दिल की ऊंचाई से ऊपर उठाएं।',
      'मरीज को जमीन पर सीधा लेटाएं और शॉक (रक्तचाप में गिरावट) से बचाने के लिए कंबल या चादर से गर्म रखें।',
      'यदि खून पट्टी से बाहर रिसने लगे, तो पहली पट्टी बिल्कुल न हटाएं; उसके ऊपर और साफ पट्टियां रखकर और तेजी से दबाएं।',
      'दबाव वाली पट्टी को कसकर बांधें और मरीज को तुरंत 108 एम्बुलेंस से नजदीकी ट्रॉमा सेंटर ले जाएं।'
    ],
    stepsMr: [
      'रक्त वाहणाऱ्या जखमेवर स्वच्छ निर्जंतुक पट्टी किंवा कपड्याने थेट आणि जोरदार सतत दाब द्या.',
      'हा दाब सलग १० ते १५ मिनिटे टिकवून ठेवा; जखम पाहण्यासाठी पट्टी पुन्हा पुन्हा उचलू नका.',
      'फ्रॅक्चर नसल्यास, हात किंवा पायातील जखम हृदयाच्या पातळीपेक्षा वर उंचावून ठेवा.',
      'रुग्णाला जमिनीवर सपाट झोपवा आणि शॉक बसू नये म्हणून चादर किंवा घोंगडी घालून उबदार ठेवा.',
      'रक्त पहिल्या पट्टीमधून पाझरू लागल्यास ती काढू नका; त्यावर आणखी स्वच्छ पट्ट्या ठेवून जास्त जोराने दाबा.',
      'पट्टी व्यवस्थित गुंडाळून बांधा आणि तात्काळ १०८ रुग्णवाहिकेने जवळच्या शस्त्रक्रिया/ट्रॉमा केंद्रात हलवा.'
    ],
    doNotEn: [
      'Do NOT remove blood-soaked dressings; taking them off tears away clotting factors and aggravates hemorrhaging.',
      'Do NOT remove deeply embedded objects (like glass shards, knives, or spikes); pack dressings around them to stabilize.',
      'Do NOT apply dirt, cow dung, ash, or turmeric to the wound; this causes fatal systemic infections and tetanus.',
      'Do NOT apply an improvised tourniquet unless trained and direct pressure has failed to stop catastrophic extremity hemorrhage.'
    ],
    doNotHi: [
      'खून से भीगी हुई पहली पट्टी कभी न हटाएं; ऐसा करने से जमा हुआ रक्त का थक्का टूट जाता है।',
      'घाव में गहराई से धंसी हुई वस्तु (जैसे कांच, चाकू या सरिया) को बाहर निकालने की कोशिश न करें; उसके चारों तरफ सहारा देकर पट्टी बांधें।',
      'घाव पर गंदा कपड़ा, मिट्टी, गोबर या हल्दी जैसी चीजें न लगाएं; इससे सेप्सिस और टिटनेस का जानलेवा खतरा होता है।',
      'बिना प्रशिक्षण के बहुत टाइट टूर्निकेट न बांधें, इससे पूरे अंग को काटना पड़ सकता है।'
    ],
    doNotMr: [
      'रक्ताने भिजलेली पहिली पट्टी कधीही काढू नका; तसे केल्याने रक्ताची गुठळी निघून रक्तस्राव वाढतो.',
      'जखमेत रुतलेली वस्तू (काच, सुरा किंवा लोखंड) स्वतः काढू नका; तिच्या सभोवती आधार देऊन पट्टी बांधा.',
      'जखमेवर माती, हळद, शेण किंवा घाणेरडे कापड लावू नका; यामुळे धनुर्वात आणि संसर्गाचा धोका वाढतो.',
      'योग्य प्रशिक्षणाशिवाय अतिघट्ट टूर्निके बांधू नका; यामुळे कायमचे अवयव निकामी होऊ शकतात.'
    ],
    callEmergency: true,
    smsTemplate: 'EMERGENCY: Severe uncontrolled bleeding at {location}. Age: {age}. Injury time: {time}. Urgent surgical care required. Send ambulance.'
  },
  {
    id: 'burns',
    icon: '🔥',
    titleEn: 'Burns',
    titleHi: 'जलना (अग्नि या रासायनिक जलन)',
    titleMr: 'भाजणे / होरपळणे',
    riskLevel: 'ORANGE',
    stepsEn: [
      'Immediately cool the burn wound under clean, cool running water (not ice-cold) for at least 15 to 20 minutes to halt the thermal injury.',
      'Promptly remove tight clothing, watches, belts, rings, and jewelry near the burned area before inflammatory swelling develops.',
      'Cover the burn loosely with a clean, sterile, non-adherent dressing or clean transparent plastic cling film.',
      'Keep the patient warm by covering unaffected areas of the body with a dry, clean blanket to prevent hypothermia.',
      'If the patient is conscious and has no airway burns or vomiting, offer small, frequent sips of clean water or Oral Rehydration Salts (ORS).',
      'Call 108 or transfer to a specialized burn unit if burns cover >10% of the body, or involve the face, hands, feet, groin, or major joints.'
    ],
    stepsHi: [
      'जले हुए हिस्से पर तुरंत 15 से 20 मिनट तक हल्के बहते हुए ठंडे (सामान्य) पानी की धार डालें ताकि जलन रुक सके।',
      'सूजन आने से पहले जले हुए अंग से अंगूठी, चूड़ी, घड़ी, बेल्ट और ढीले कपड़े तुरंत सावधानी से उतार दें।',
      'जले हुए स्थान को साफ, सूखे, रोगाणुरहित कपड़े या प्लास्टिक की पारदर्शी फिल्म से ढीला ढकें।',
      'मरीज को हाइपोथर्मिया (शरीर का तापमान गिरना) से बचाने के लिए शरीर के बिना जले हिस्से को साफ कंबल से ढकें।',
      'यदि मरीज होश में है, तो उसे थोड़ी-थोड़ी देर में घूंट-घूंट करके साफ पानी या ओआरएस (ORS) का घोल पिलाएं।',
      'चेहरे, हाथों, पैरों, जोड़ों या शरीर के 10% से अधिक हिस्से के जलने पर तुरंत 108 पर कॉल कर बर्न यूनिट ले जाएं।'
    ],
    stepsMr: [
      'भाजलेल्या भागावर त्वरित १५ ते २० मिनिटे नळाचे सामान्य थंड वाहते पाणी ओता जेणेकरून ऊतकांची जळजळ थांबेल.',
      'सूज येण्यापूर्वी भाजलेल्या भागाजवळील घड्याळ, अंगठ्या, पट्टा आणि सैल कपडे त्वरित काढून टाका.',
      'भाजलेला भाग स्वच्छ, निर्जंतुक कपड्याने किंवा पातळ पारदर्शक प्लास्टिक फिल्मने सैलसर झाकून घ्या.',
      'रुग्णाला थंडी वाजून तापमान कमी होऊ नये म्हणून शरीराच्या न भाजलेल्या भागावर कोरडी चादर किंवा घोंगडी घाला.',
      'रुग्ण शुद्धीत असल्यास त्याला थोडे थोडे स्वच्छ पाणी किंवा ओआरएस (ORS) चे द्रावण प्यायला द्या.',
      'चेहरा, हात, पाय, सांधे भाजले असल्यास किंवा शरीराचा मोठा भाग भाजला असल्यास १०८ रुग्णवाहिकेने बर्न सेंटरमध्ये हलवा.'
    ],
    doNotEn: [
      'Do NOT apply ice, ice water, or frozen items to the burn; freezing temperatures cause severe secondary tissue necrosis.',
      'Do NOT pop, burst, or prick burn blisters; intact blister skin protects against severe infection.',
      'Do NOT apply butter, toothpaste, cooking oil, grease, cow dung, turmeric, or ink on the burn wound.',
      'Do NOT peel away or forcibly rip off clothing that has adhered or melted onto the burned skin.'
    ],
    doNotHi: [
      'जले हुए स्थान पर कभी भी बर्फ या बर्फ का पानी न लगाएं; इससे त्वचा की कोशिकाएं हमेशा के लिए मृत हो जाती हैं।',
      'जले पर उभरे फफोलों (छालों) को कभी न फोड़ें; यह त्वचा को संक्रमण से बचाने का प्राकृतिक कवच है।',
      'जले पर टूथपेस्ट, घी, तेल, मक्खन, गोबर, हल्दी या स्याही बिल्कुल न लगाएं।',
      'त्वचा से चिपके हुए कपड़ों को जबरदस्ती खींचकर निकालने की कोशिश न करें; केवल आसपास का कपड़ा काटें।'
    ],
    doNotMr: [
      'भाजलेल्या त्वचेवर बर्फ किंवा अतिथंड पाणी लावू नका; यामुळे ऊतींचे गंभीर नुकसान होते.',
      'भाजल्यामुळे आलेले पाण्याचे फोड (blisters) कधीही फोडू नका; ते नैसर्गिक संरक्षक कवच असते.',
      'भाजलेल्या जागी टूथपेस्ट, तेल, तूप, हळद, शेण किंवा शाई अजिबात लावू नका.',
      'भाजलेल्या त्वचेला चिटकलेले कपडे ओढून काढण्याचा प्रयत्न करू नका.'
    ],
    callEmergency: true,
    smsTemplate: 'EMERGENCY: Severe burn injury at {location}. Age: {age}. Burn incident time: {time}. Specialized burn care required.'
  },
  {
    id: 'drowning',
    icon: '🌊',
    titleEn: 'Drowning',
    titleHi: 'डूबना (जल भराव)',
    titleMr: 'पाण्यात बुडणे',
    riskLevel: 'RED',
    stepsEn: [
      'Safely extract the victim from the water without endangering yourself. Use flotation aids, ropes, or poles whenever possible.',
      'Once on dry ground, immediately lay the victim flat on their back and check for breathing and responsiveness (look, listen, feel for 10 seconds).',
      'If the patient is not breathing normally, immediately deliver 5 initial rescue breaths (mouth-to-mouth), making sure the chest rises.',
      'Continue with cycles of 30 chest compressions followed by 2 rescue breaths (CPR) at a rate of 100–120 compressions per minute.',
      'Remove wet, cold clothing and wrap the patient in dry, warm blankets to treat severe hypothermia.',
      'Once regular breathing resumes, place the patient into the recovery position (on their side) and transport urgently via 108 ambulance.'
    ],
    stepsHi: [
      'पीड़ित को सुरक्षित रूप से पानी से बाहर निकालें; जब तक प्रशिक्षित न हों, खुद गहरे पानी में कूदने के बजाय रस्सी, लाठी या लाइफबॉय का उपयोग करें।',
      'सूखी जमीन पर लाकर मरीज को पीठ के बल लिटाएं और तुरंत 10 सेकंड में सांस व चेतना की जांच करें।',
      'यदि सांस नहीं चल रही है, तो सिर को पीछे झुकाकर तुरंत 5 बार मुंह से सांस (Rescue Breaths) दें और छाती का उठना देखें।',
      'इसके तुरंत बाद 30 छाती के दबाव और 2 सांसों का चक्र (सीपीआर - CPR) 100-120 दबाव प्रति मिनट की गति से शुरू करें।',
      'मरीज के गीले कपड़े तुरंत उतारें और हाइपोथर्मिया से बचाने के लिए सूखे व गर्म कंबलों में लपेटें।',
      'सांस लौटने पर मरीज को करवट की मुद्रा (Recovery Position) में लिटाएं और 108 एम्बुलेंस से तुरंत अस्पताल ले जाएं।'
    ],
    stepsMr: [
      'स्वतःचा जीव धोक्यात न घालता बुडणाऱ्या व्यक्तीला पाण्याबाहेर काढा; दोरी, काठी किंवा तरंगणाऱ्या वस्तूंचा वापर करा.',
      'कोरड्या सपाट जमिनीवर आणून रुग्णाला पाठीवर झोपवा आणि १० सेकंदांत श्वास व शुद्ध तपासा.',
      'श्वास बंद असल्यास मान थोडी मागे करून ५ वेळा तोंडातून कृत्रिम श्वास (Rescue Breaths) द्या.',
      'त्यानंतर लगेच ३० छातीचे दाब आणि २ कृत्रिम श्वास असे सीपीआर चक्र (CPR) दर मिनिटाला १००-१२० दाबांच्या गतीने सुरू ठेवा.',
      'ओले कपडे काढून रुग्णाला कोरड्या चादरीने किंवा गरम घोंगडीने झाका जेणेकरून थंडी वाजून धोका वाढणार नाही.',
      'श्वास सुरू झाल्यावर रुग्णाला कुशीवर (रिकव्हरी पोझिशन) वळवा आणि तात्काळ १०८ रुग्णवाहिकेने रुग्णालयात हलवा.'
    ],
    doNotEn: [
      'Do NOT attempt abdominal thrusts (Heimlich maneuver) to remove water from lungs; it causes regurgitation and fatal aspiration.',
      'Do NOT delay initiating CPR to try to drain or pump water out of the stomach.',
      'Do NOT jump into hazardous, fast-moving, or deep water unless you are an authorized trained lifesaver.',
      'Do NOT allow a rescued person to go home without hospital observation; delayed pulmonary edema (secondary drowning) can occur hours later.'
    ],
    doNotHi: [
      'फेफड़ों से पानी निकालने के लिए पेट को दबाने (Heimlich) की कोशिश न करें; इससे उल्टी होकर फेफड़े पूरी तरह चोक हो सकते हैं।',
      'पेट से पानी निकालने के चक्कर में सीपीआर (CPR) शुरू करने में एक सेकंड की भी देरी न करें।',
      'यदि आप कुशल तैराक नहीं हैं, तो उफनते पानी में कूदकर अपनी जान जोखिम में न डालें।',
      'मरीज को होश आने पर भी घर न जाने दें; कुछ घंटों बाद फेफड़ों में पानी भरने से सेकेंडरी ड्राउनिंग का जानलेवा खतरा रहता है।'
    ],
    doNotMr: [
      'फुप्फुसातील पाणी काढण्यासाठी पोटावर दाब देऊ नका; यामुळे उलट्या होऊन श्वासनलिका बंद पडू शकते.',
      'पोटातील पाणी काढण्याच्या नादात सीपीआर (CPR) सुरू करण्यास अजिबात विलंब करू नका.',
      'पोहता येत नसताना किंवा पाण्याचा अंदाज नसताना पाण्यात उडी मारण्याचे धाडस करू नका.',
      'रुग्ण शुद्धीवर आला तरी डॉक्टरी तपासणीशिवाय त्याला घरी पाठवू नका (काही तासांनी सेकंडरी ड्राउनिंगचा धोका संभवतो).'
    ],
    callEmergency: true,
    smsTemplate: 'EMERGENCY: Near-drowning incident at {location}. Age: {age}. Time of rescue: {time}. Urgent resuscitation & oxygen support needed.'
  },
  {
    id: 'pregnancy_complications',
    icon: '🤰',
    titleEn: 'Pregnancy Complications',
    titleHi: 'गर्भावस्था जटिलताएं (प्रसव आपातकाल)',
    titleMr: 'गरोदरपणातील गुंतागुंत / धोक्याची चिन्हे',
    riskLevel: 'RED',
    stepsEn: [
      'Immediately position the pregnant woman on her left side (left lateral tilt) to relieve pressure on the inferior vena cava and maximize oxygen flow to the placenta.',
      'Recognize key danger signs: heavy vaginal bleeding, severe throbbing headache, blurred or flashing vision, sudden face/hand swelling, or severe abdominal pain.',
      'If the patient has seizures/eclampsia, cushion the head with soft padding, gently clear mouth secretions, and do not place objects in the mouth.',
      'Keep the mother calm, comfortable, and warm; provide continuous gentle emotional support to minimize cardiovascular stress.',
      'Collect all maternal health records (MCH / ANC card, ultrasound reports, recent lab tests) for urgent clinical review.',
      'Call 108 emergency ambulance immediately and arrange urgent transfer to a Comprehensive Emergency Obstetric Care (CEmONC / FRU) facility.'
    ],
    stepsHi: [
      'गर्भवती महिला को तुरंत बाईं करवट (left side) पर लिटाएं ताकि गर्भनाल और शिशु तक रक्त व ऑक्सीजन का प्रवाह भरपूर बना रहे।',
      'खतरे के गंभीर लक्षणों को पहचानें: तेज रक्तस्राव, असह्य सिरदर्द, आंखों के आगे अंधेरा या चमक, चेहरे व हाथों पर अचानक सूजन या पेट में तेज दर्द।',
      'यदि महिला को दौरा (एक्लॅम्पसिया) पड़ रहा हो, तो सिर के नीचे तकिया रखें, मुंह की लार पोछें और दांतों के बीच कुछ न फंसाएं।',
      'महिला को मानसिक ढांढस बंधाएं, शांत रखें और शरीर को हल्का ढककर गर्म रखें ताकि घबराहट न हो।',
      'प्रसव पूर्व जांच कार्ड (ANC / माता-शिशु सुरक्षा कार्ड) और पिछली सभी सोनोग्राफी/दवाओं की पर्चियां तुरंत साथ रख लें।',
      'तुरंत 108 आपातकालीन सेवा पर कॉल करें और महिला को 24x7 स्त्री रोग विशेषज्ञ व ऑपरेशन थियेटर (FRU/CEmONC) वाले अस्पताल ले जाएं।'
    ],
    stepsMr: [
      'गरोदर मातेला तात्काळ डाव्या कुशीवर झोपवा जेणेकरून मुख्य रक्तवाहिनीवरील दाब कमी होऊन बाळाला पुरेसा रक्तपुरवठा होईल.',
      'धोक्याची चिन्हे ओळखा: योनीमार्गातून अतिरक्तस्राव, तीव्र डोकेदुखी, डोळ्यांसमोर अंधारी, चेहरा/हातांवर अचानक सूज किंवा पोटात तीव्र कळ.',
      'झटके (फिट्स/एक्लॅम्पसिया) आल्यास डोक्याखाली मऊ घडी ठेवा, तोंडातील लाळ पुसा आणि दातांमध्ये कसलीही वस्तू घालू नका.',
      'मातेला मानसिक आधार देऊन शांत ठेवा आणि थंडी वाजणार नाही याची काळजी घ्या.',
      'माता-बाल संरक्षण कार्ड (ANC कार्ड), सोनोग्राफी व जुन्या तपासण्यांच्या फाइल्स तात्काळ सोबत घ्या.',
      'ताबडतोब १०८ रुग्णवाहिकेशी संपर्क साधा आणि सिझेरियन व रक्तपेढीची सोय असलेल्या उपजिल्हा/जिल्हा रुग्णालयात हलवा.'
    ],
    doNotEn: [
      'Do NOT allow the pregnant woman to lie flat on her back (supine position causes dangerous drop in maternal blood pressure and fetal distress).',
      'Do NOT administer any oral drugs, labor-hastening injections, herbal teas, or home concoctions without a doctor\'s prescription.',
      'Do NOT insert fingers, tampons, or cloth pads inside the vagina during bleeding episodes.',
      'Do NOT delay transport or attempt risky home delivery when any maternal danger signs are present.'
    ],
    doNotHi: [
      'गर्भवती महिला को पीठ के बल सपाट (सीधा) बिल्कुल न लिटाएं; इससे मुख्य नस दबने से बीपी गिरता है और शिशु का दम घुटता है।',
      'डॉक्टर की सलाह के बिना प्रसव पीड़ा तेज करने वाले इंजेक्शन, काढ़ा, जड़ी-बूटी या कोई दर्द की दवा न दें।',
      'रक्तस्राव रोकने के लिए योनि के भीतर कपड़ा, रुई या उंगली डालने की गलती न करें।',
      'धोके के लक्षण दिखने पर घर पर या अप्रशिक्षित दाई से प्रसव कराने का जोखिम बिल्कुल न लें।'
    ],
    doNotMr: [
      'गरोदर स्त्रीला पाठीवर उताणे झोपवू नका; यामुळे रक्तदाब खालावून बाळाच्या जीवाला धोका निर्माण होतो.',
      'डॉक्टरांच्या सल्ल्याशिवाय कळा वाढवणारे कोणतेही इंजेक्शन, गावठी काढे किंवा औषधे देऊ नका.',
      'रक्तस्राव होत असताना योनीमार्गात कापड, बोट किंवा कापूस आत घालू नका.',
      'धोक्याची चिन्हे असताना घरगुती किंवा अप्रशिक्षित व्यक्तीकडून बाळंतपण करण्याचा धोका पत्करू नका.'
    ],
    callEmergency: true,
    smsTemplate: 'EMERGENCY: High-risk pregnancy complication at {location}. Age: {age}. Gestational month/time: {time}. Urgent obstetric transfer required.'
  },
  {
    id: 'fever_seizures',
    icon: '🌡️',
    titleEn: 'High Fever / Seizures',
    titleHi: 'तेज बुखार / दौरा (दौरे का झटका)',
    titleMr: 'तीव्र ताप / फेफरे (झटके)',
    riskLevel: 'ORANGE',
    stepsEn: [
      'Protect the patient from physical injury: gently guide them to the floor and move away sharp, hard, or hot objects.',
      'Place a soft folded towel or cushion under the patient’s head and loosen constrictive clothing around the neck.',
      'Carefully track the time: note the exact onset time and duration of the seizure (a seizure lasting >5 minutes is a life-threatening emergency: status epilepticus).',
      'As soon as active jerking stops, place the patient into the recovery position (on their left side with head tilted gently back to maintain an open airway).',
      'For persistent high fever (>102°F / 38.9°C), sponge the forehead, neck, armpits, and groin gently with lukewarm/tap water (tepid sponging).',
      'Ensure continuous observation until the patient is fully conscious and transport to a clinic or hospital for immediate medical evaluation.'
    ],
    stepsHi: [
      'मरीज को चोट से बचाएं: उन्हें आराम से जमीन पर लिटाएं और आसपास की नुकीली, सख्त या गर्म चीजें हटा दें।',
      'सिर के नीचे मुलायम तकिया या मुड़ा हुआ तौलिया रखें और गर्दन व छाती के तंग कपड़ों को ढीला करें।',
      'दौरे की समय-अवधि नोट करें; यदि दौरा 5 मिनट से अधिक चले तो यह अत्यंत गंभीर स्थिति (Status Epilepticus) है।',
      'जैसे ही दौरे के झटके रुकें, मरीज को करवट की मुद्रा (Recovery Position) में लिटाएं ताकि लार या उल्टी श्वासनली में न जाए।',
      'तेज बुखार (102°F से अधिक) होने पर सामान्य नल के पानी (गुनगुने पानी) से माथे, बगलों और जांघों पर पट्टी करें (टेपिड स्पंजिंग)।',
      'मरीज के पूरी तरह होश में आने तक पास रहें और तुरंत नजदीकी प्राथमिक स्वास्थ्य केंद्र या अस्पताल ले जाएं।'
    ],
    stepsMr: [
      'रुग्णाला दुखापतीपासून वाचवा: जमिनीवर सपाट झोपवा आणि आजूबाजूच्या टोकदार, कठीण वस्तू त्वरित बाजूला करा.',
      'डोक्याखाली मऊ कापड किंवा टॉवेलची घडी ठेवा आणि मानेभोवतीचे घट्ट कपडे सैल करा.',
      'झटक्याची वेळ अचूक मोजा; ५ मिनिटांपेक्षा जास्त वेळ झटका राहिल्यास ही अतितातडीची वैद्यकीय आणीबाणी आहे.',
      'झटका थांबताच रुग्णाला डाव्या कुशीवर वळवून (रिकव्हरी पोझिशन) झोपवा जेणेकरून श्वासनलिका खुली राहील.',
      'अतिशय ताप असल्यास (१०२°F पेक्षा जास्त) सामान्य नळाच्या पाण्याने कपाळ, काखा आणि मांड्यांवर पट्ट्या ठेवा (टेपिड स्पंजिंग).',
      'रुग्ण पूर्ण शुद्धीवर येईपर्यंत सतत लक्ष ठेवा आणि वैद्यकीय तपासणीसाठी ताबडतोब रुग्णालयात न्या.'
    ],
    doNotEn: [
      'Do NOT place any object (spoon, cloth, fingers, or water) inside the patient’s mouth during a convulsion; this can fracture teeth or block the airway.',
      'Do NOT forcibly hold down or physically restrain the shaking limbs during a seizure.',
      'Do NOT indulge in harmful superstitions like making the patient smell shoes, socks, onions, or burning chillies.',
      'Do NOT use ice-cold water, ice packs, or rubbing alcohol for sponging, which causes severe shivering, vasoconstriction, and rebound temperature spike.'
    ],
    doNotHi: [
      'दौरे के समय मरीज के मुंह में चम्मच, उंगली, पानी या कपड़ा जबरन न डालें; इससे दांत टूट सकते हैं या सांस रुक सकती है।',
      'दौरे के दौरान मरीज के हाथ-पैर जबरदस्ती दबाकर या बांधकर रोकने की कोशिश न करें।',
      'मरीज को जूता, मोजा या प्याज सुंघाने जैसे अंधविश्वासों में पड़कर कीमती समय नष्ट न करें।',
      'बुखार उतारने के लिए बर्फ का पानी या एल्कोहल कभी न लगाएं; इससे कंपकंपी होकर बुखार और ज्यादा बढ़ जाता है।'
    ],
    doNotMr: [
      'झटका येत असताना तोंडात चमचा, कापड, बोट किंवा पाणी घालू नका; यामुळे दात तुटणे किंवा श्वास गुदमरण्याचा धोका असतो.',
      'झटक्यादरम्यान रुग्णाचे थरथरणारे हात-पाय बळजबरीने दाबून धरू नका.',
      'कांदा, चप्पल, चामडी किंवा मोजे हुंगवण्यासारख्या अंधश्रद्धांवर विश्वास ठेवू नका.',
      'ताप कमी करण्यासाठी बर्फ किंवा अतिथंड पाण्याचा वापर करू नका; यामुळे थरकाप उडून ताप अधिक वाढू शकतो.'
    ],
    callEmergency: true,
    smsTemplate: 'EMERGENCY: High fever with seizures/fits at {location}. Age: {age}. Duration: {time}. Medical intervention needed.'
  },
  {
    id: 'fracture',
    icon: '🦴',
    titleEn: 'Fracture / Bone Injury',
    titleHi: 'हड्डी टूटना / अस्थिभंग',
    titleMr: 'हाड मोडणे / अस्थिभंग',
    riskLevel: 'YELLOW',
    stepsEn: [
      'Keep the patient still and support the injured bone in the exact position in which it was found.',
      'Immobilize the fracture using a rigid improvised splint (wood plank, cardboard, rolled newspaper) padded with soft cloth.',
      'Ensure the splint extends across and immobilizes both the joint above and the joint below the suspected fractured bone.',
      'For closed injuries with swelling, apply an ice pack wrapped in a clean towel for 15-20 minutes at a time to reduce swelling and pain.',
      'Check blood circulation beyond the splint every 15 minutes (ensure fingers/toes are warm, pink, and not numb or tingling).',
      'If bone penetrates the skin (open fracture), cover with a clean sterile dressing without pushing the bone, and transfer immediately to an orthopedic facility.'
    ],
    stepsHi: [
      'घायल अंग को जिस स्थिति में पाया गया है, उसी स्थिति में बिल्कुल स्थिर रखें; अंग को सीधा करने की कोशिश न करें।',
      'हड्डी को सहारा देने के लिए मुलायम कपड़े से लिपटी लकड़ी की पट्टी, मुड़ा हुआ अखबार या कार्डबोर्ड (splint) बांधें।',
      'खपच्ची (splint) को टूटी हड्डी के ऊपर और नीचे वाले दोनों जोड़ों तक फैलाकर पट्टी से सुरक्षित करें।',
      'दर्द और सूजन घटाने के लिए तौलिये में बर्फ लपेटकर 15-20 मिनट सिकाई करें (सीधे त्वचा पर बर्फ न लगाएं)।',
      'पट्टी बांधने के बाद हर 15 मिनट में अंगुलियों में रक्त संचार जांचें (देखें कि उंगलियां नीली या सुन्न तो नहीं हो रहीं)।',
      'यदि हड्डी त्वचा से बाहर निकली हो (ओपन फ्रैक्चर), तो साफ स्टेराइल कपड़े से ढकें और तुरंत हड्डी रोग विशेषज्ञ के पास ले जाएं।'
    ],
    stepsMr: [
      'दुखापत झालेला अवयव ज्या स्थितीत आहे त्याच स्थितीत स्थिर ठेवा; त्याला सरळ किंवा वाकवण्याचा प्रयत्न करू नका.',
      'अवयवाला आधार देण्यासाठी कापड गुंडाळलेली लाकडी पट्टी, जाड पुठ्ठा किंवा वर्तमानपत्राची जाड गुंडाळी (स्प्लिंट) वापरा.',
      'ही आधार पट्टी मोडलेल्या हाडाच्या वरच्या आणि खालच्या दोन्ही सांध्यांपर्यंत पुरेशी लांब असल्याची खात्री करा.',
      'सूज आणि वेदना कमी करण्यासाठी टॉवेलमध्ये बर्फ गुंडाळून १५-२० मिनिटे शेका (थेट त्वचेवर बर्फ लावू नका).',
      'पट्टी बांधल्यानंतर बोटांमधील रक्तप्रवाह नियमित तपासा (बोटे गुलाबी आणि उबदार असावीत, बधिर होऊ नयेत).',
      'हाड त्वचेबाहेर आले असल्यास त्यावर स्वच्छ निर्जंतुक पट्टी ठेवा आणि तात्काळ एक्स-रे व अस्थिव्यंगोपचारासाठी रुग्णालयात हलवा.'
    ],
    doNotEn: [
      'Do NOT attempt to push back protruding bone ends or try to forcefully straighten a deformed limb.',
      'Do NOT massage, rub, or allow traditional bone-setters to violently manipulate the injured limb.',
      'Do NOT tie splint bandages so tightly that blood circulation is impeded or fingers/toes turn pale/blue.',
      'Do NOT move the patient if spinal, neck, or pelvic fractures are suspected unless there is immediate mortal danger.'
    ],
    doNotHi: [
      'बाहर निकली हुई हड्डी को अंदर धकेलने या टेढ़े अंग को बलपूर्वक सीधा करने का प्रयास न करें।',
      'चोटिल हिस्से की मालिश न करें और न ही किसी अप्रशिक्षित हड्डी बिठाने वाले (पहलवान) से खिंचवाएं।',
      'पट्टी को इतना ज्यादा कसकर न बांधें कि आगे खून का दौरा रुक जाए और उंगलियां नीली पड़ जाएं।',
      'यदि रीढ़, गर्दन या कूल्हे की हड्डी टूटने का संदेह हो, तो मरीज को बिल्कुल न हिलाएं।'
    ],
    doNotMr: [
      'त्वचेबाहेर आलेले हाड आत ढकलण्याचा किंवा वाकलेला पाय/हात जबरदस्तीने सरळ करण्याचा प्रयत्न करू नका.',
      'दुखापतीवर कोणतीही मालिश करू नका किंवा गावठी हाडवैद्याकडून हाड ओढवून घेऊ नका.',
      'पट्टी इतकी घट्ट बांधू नका की पुढचा रक्तपुरवठा खंडित होईल आणि बोटे काळी/निळी पडतील.',
      'मणक्याला किंवा मानेला फ्रॅक्चर असण्याचा संशय असल्यास रुग्णाची हालचाल अजिबात करू नका.'
    ],
    callEmergency: true,
    smsTemplate: 'ALERT: Suspected bone fracture/injury at {location}. Age: {age}. Injury time: {time}. Splinting & orthopedic care required.'
  },
  {
    id: 'poisoning',
    icon: '☠️',
    titleEn: 'Poisoning',
    titleHi: 'विषाक्तता / जहर का सेवन',
    titleMr: 'विषबाधा',
    riskLevel: 'RED',
    stepsEn: [
      'Ensure personal safety first, then immediately check the victim\'s airway, breathing, and state of consciousness.',
      'Identify and safely preserve the poison source: retain chemical bottles, pesticide sachets, medication blisters, or plant parts for the doctor.',
      'If poison came in contact with the skin or eyes, continuously flush thoroughly with clean running water for at least 15 to 20 minutes.',
      'If the patient is unconscious but breathing normally, place them immediately into the recovery position (on their left side).',
      'Gently wipe away any residual poison, powder, or secretions from around the mouth with a clean damp cloth.',
      'Call 108 emergency services immediately and transport the patient to a hospital with toxicology/antidote facilities alongside the poison container.'
    ],
    stepsHi: [
      'पहले स्वयं की सुरक्षा सुनिश्चित करें, फिर तुरंत मरीज के वायुमार्ग, सांस और चेतना के स्तर की जांच करें।',
      'जहर के स्रोत की पहचान करें और कीटनाशक की शीशी, रासायनिक पैकेट, दवा की खाली पत्ती या पौधे को डॉक्टर को दिखाने हेतु सुरक्षित रखें।',
      'यदि जहर त्वचा या आंखों में गया हो, तो तुरंत 15 से 20 मिनट तक लगातार साफ पानी की धार से धोएं।',
      'यदि मरीज बेहोश है लेकिन सांस चल रही है, तो उसे तुरंत करवट की मुद्रा (Recovery Position) में लिटाएं ताकि श्वासनली खुली रहे।',
      'मरीज के मुंह के आसपास लगे जहर, झाग या उल्टी को गीले कपड़े से सावधानीपूर्वक साफ करें।',
      'तुरंत 108 पर कॉल करें और जहर के पैकेट/बोतल के साथ मरीज को नजदीकी अस्पताल ले जाएं ताकि सही एंटीडोट दिया जा सके।'
    ],
    stepsMr: [
      'प्रथम स्वतःची सुरक्षा सांभाळा, नंतर रुग्णाचा श्वासोच्छ्वास, नाडी आणि शुद्ध त्वरित तपासा.',
      'विषबाधेचे कारण ओळखा आणि औषधाची बाटली, कीटकनाशकाचा डबा किंवा गोळ्यांचे पाकीट डॉक्टरांसाठी सुरक्षित ठेवा.',
      'विष डोळ्यात किंवा त्वचेवर उडाले असल्यास त्वरित १५ ते २० मिनिटे नळाच्या पाण्याने सतत धुवा.',
      'रुग्ण बेशुद्ध असल्यास परंतु श्वास चालू असल्यास त्याला डाव्या कुशीवर (रिकव्हरी पोझिशन) झोपवा.',
      'रुग्णाच्या ओठांभोवती आलेला फेस, लाळ किंवा विषारी अवशेष ओल्या कापडाने काळजीपूर्वक पुसून काढा.',
      'ताबडतोब १०८ रुग्णवाहिका बोलवा आणि विषाच्या बाटलीसह रुग्णाला अँटीडोट उपलब्ध असलेल्या रुग्णालयात दाखल करा.'
    ],
    doNotEn: [
      'Do NOT induce vomiting (corrosive poisons like acids, alkalis, and kerosene cause devastating chemical burns and lung aspiration when brought back up).',
      'Do NOT administer home remedies like raw eggs, salt water, cow dung concoctions, milk, or charcoal without medical orders.',
      'Do NOT attempt to neutralize acids with alkaline liquids or vice versa (generates violent exothermic heat reactions in the stomach).',
      'Do NOT administer any oral fluids or medicines to a drowsy, confused, or unconscious patient.'
    ],
    doNotHi: [
      'मरीज को उल्टी (वमन) कराने की कोशिश कभी न करें; तेजाब या कीटनाशक दोबारा नली और फेफड़ों को जला देते हैं।',
      'मरीज को नमक का पानी, कच्चा अंडा, दूध या गोबर का घोल पिलाने जैसी जानलेवा गलती न करें।',
      'तेजाब को काटने के लिए साबुन का पानी या सोडा न दें; इससे पेट के अंदर भयंकर रासायनिक जलन पैदा होती है।',
      'बेहोश या ऊंघते हुए मरीज के मुंह में कोई भी तरल पदार्थ या दवा न डालें।'
    ],
    doNotMr: [
      'रुग्णाला बळजबरीने उलटी करवण्याचा प्रयत्न करू नका; ॲसिड किंवा कीटकनाशकांमुळे अन्ननलिका व फुप्फुसे जळून गंभीर धोका होतो.',
      'रुग्णाला मिठाचे पाणी, कच्चे अंडे, दूध किंवा शेण पाजण्याचा प्रयत्न करू नका.',
      'ॲसिडवर अल्कली किंवा सोडा देऊन रासायनिक अभिक्रिया करण्याचा प्रयत्न करू नका.',
      'बेशुद्ध किंवा गुंगी असलेल्या रुग्णाच्या तोंडात कोणतेही पाणी किंवा औषध घालू नका.'
    ],
    callEmergency: true,
    smsTemplate: 'EMERGENCY: Acute poisoning case at {location}. Age: {age}. Suspected toxin/time: {time}. Immediate toxicology antidote required.'
  },
  {
    id: 'choking',
    icon: '🗣️',
    titleEn: 'Choking',
    titleHi: 'गला घुटना / चोकिंग (श्वास अवरोध)',
    titleMr: 'घसा अडकणे / श्वास कोंडणे (चोकिंग)',
    riskLevel: 'RED',
    stepsEn: [
      'Assess the obstruction: if the patient can speak, cough forcefully, or breathe, encourage them to keep coughing to clear the airway.',
      'If the patient cannot speak, cry, or breathe (complete obstruction): stand slightly behind to the side and support their chest while leaning them forward.',
      'Deliver up to 5 sharp back blows between the shoulder blades using the heel of your hand.',
      'If back blows fail to clear the object, stand behind them, wrap your arms around their waist, place a fist just above the navel, and deliver up to 5 quick inward and upward abdominal thrusts (Heimlich maneuver).',
      'Continue alternating cycles of 5 back blows and 5 abdominal thrusts until the airway is cleared or the patient becomes unconscious.',
      'If the patient becomes unconscious, lower them gently to the floor, call 108 immediately, and start CPR (chest compressions), checking the mouth for visible objects before rescue breaths.'
    ],
    stepsHi: [
      'रुकावट की जांच करें: यदि मरीज बोल पा रहा है या खांस रहा है, तो उसे जोर से खांसते रहने के लिए कहें ताकि वस्तु बाहर निकल सके।',
      'यदि मरीज बोल, खांस या सांस नहीं ले पा रहा है, तो उसके पीछे खड़े हों और छाती को सहारा देते हुए आगे की ओर झुकाएं।',
      'अपनी हथेली के निचले हिस्से से मरीज की दोनों पीठ की हड्डियों के बीच 5 बार जोरदार थपकी (Back Blows) मारें।',
      'यदि वस्तु न निकले, तो मरीज की नाभि के ठीक ऊपर मुट्ठी रखकर दोनों हाथों से अंदर और ऊपर की ओर 5 बार झटका दें (हीमलिक तकनीक - Abdominal Thrusts)।',
      'जब तक फंसी वस्तु बाहर न निकल जाए, तब तक 5 बार पीठ पर थपकी और 5 बार पेट के झटके बारी-बारी से देते रहें।',
      'यदि मरीज बेहोश हो जाए, तो तुरंत जमीन पर लिटाएं, 108 पर कॉल करें और छाती दबाकर सीपीआर (CPR) शुरू करें।'
    ],
    stepsMr: [
      'रुकावट तपासा: जर रुग्ण खोकू शकत असेल किंवा बोलू शकत असेल, तर त्याला जोरात खोकण्यास प्रोत्साहित करा.',
      'जर रुग्णाला अजिबात बोलता किंवा श्वास घेता येत नसेल, तर त्याच्या मागे उभे राहून छातीला आधार द्या आणि थोडे पुढे वाकवा.',
      'तळहाताच्या मागच्या भागाने रुग्णाच्या पाठीवर दोन खांद्यांच्या हाडांमध्ये ५ वेळा जोरदार थापा (Back Blows) मारा.',
      'वस्तू न निघाल्यास, पोटावर नाभीच्या किंचित वर मूठ ठेवून दोन्ही हातांनी आत व वरच्या दिशेने ५ वेळा हिसके द्या (हीमलिक पद्धत).',
      'अडकलेली वस्तू बाहेर पडेपर्यंत किंवा रुग्ण शुद्ध गमावेपर्यंत ५ पाठीवर थापा आणि ५ पोटावर हिसके आलटून-पालटून द्या.',
      'रुग्ण बेशुद्ध पडल्यास त्याला जमिनीवर सपाट झोपवा, लगेच १०८ ला कॉल करा आणि सीपीआर (CPR) सुरू करा.'
    ],
    doNotEn: [
      'Do NOT perform blind finger sweeps in the mouth; you may push the foreign body deeper into the larynx and cause total airway occlusion.',
      'Do NOT give water, drinks, or bread to swallow during an active choking episode.',
      'Do NOT slap the patient on the back while they are standing upright and coughing productively.',
      'Do NOT perform abdominal thrusts on infants under 1 year of age (use 5 gentle back slaps and 5 chest thrusts instead).'
    ],
    doNotHi: [
      'मुंह में अंधी उंगली डालकर वस्तु निकालने की कोशिश न करें; इससे फंसी वस्तु और गहराई में जाकर सांस रोक सकती है।',
      'गला घुटने के दौरान मरीज को पानी या कोई तरल पदार्थ पीने को न दें।',
      'यदि मरीज खुद जोर से खांस रहा हो, तो उसे सीधा खड़ा रखकर पीठ पर अनावश्यक थप्पड़ न मारें।',
      '1 वर्ष से छोटे शिशु पर पेट के झटके (हीमलिक तकनीक) न अपनाएं (केवल पीठ की थपकी और छाती के हल्के दबाव का प्रयोग करें)।'
    ],
    doNotMr: [
      'तोंडात आंधळेपणाने बोटे घालून वस्तू काढण्याचा प्रयत्न करू नका; यामुळे वस्तू आणखी आत सरकू शकते.',
      'श्वास अडकलेला असताना रुग्णाला पाणी किंवा द्रवपदार्थ पाजू नका.',
      'रुग्ण स्वतःहून खोकत असताना त्याच्या पाठीवर उगीचच जोराने थापा मारू नका.',
      '१ वर्षाखालील लहान बाळावर पोटावर हिसके देण्याची पद्धत (हीमलिक) वापरू नका (फक्त पाठीवर हलक्या थापा व छातीवर दाब द्या).'
    ],
    callEmergency: true,
    smsTemplate: 'EMERGENCY: Severe airway choking at {location}. Age: {age}. Time of onset: {time}. Urgent airway resuscitation needed.'
  }
];

/**
 * Returns a protocol by its unique identifier
 * @param {string} id
 * @returns {object|null}
 */
export function getProtocolById(id) {
  if (!id) return null;
  return EMERGENCY_PROTOCOLS.find((p) => p.id === id) || null;
}

/**
 * Returns protocols filtered by risk level ('RED', 'YELLOW', 'ORANGE')
 * @param {string} riskLevel
 * @returns {Array}
 */
export function getProtocolsByRisk(riskLevel) {
  if (!riskLevel) return EMERGENCY_PROTOCOLS;
  const target = String(riskLevel).trim().toUpperCase();
  return EMERGENCY_PROTOCOLS.filter((p) => (p.riskLevel || '').toUpperCase() === target);
}

/**
 * Searches protocols across titles in English, Hindi, and Marathi
 * @param {string} query
 * @returns {Array}
 */
export function searchProtocols(query) {
  if (!query || typeof query !== 'string' || !query.trim()) {
    return EMERGENCY_PROTOCOLS;
  }
  const term = query.trim().toLowerCase();
  return EMERGENCY_PROTOCOLS.filter((protocol) => {
    return (
      (protocol.titleEn && protocol.titleEn.toLowerCase().includes(term)) ||
      (protocol.titleHi && protocol.titleHi.toLowerCase().includes(term)) ||
      (protocol.titleMr && protocol.titleMr.toLowerCase().includes(term)) ||
      (protocol.id && protocol.id.toLowerCase().includes(term))
    );
  });
}

/**
 * Returns the first aid steps array for a given language ('en', 'hi', 'mr')
 * @param {object} protocol
 * @param {string} language
 * @returns {string[]}
 */
export function getProtocolSteps(protocol, language = 'en') {
  if (!protocol) return [];
  const lang = (language || 'en').toLowerCase();
  if (lang === 'hi' && Array.isArray(protocol.stepsHi) && protocol.stepsHi.length > 0) {
    return protocol.stepsHi;
  }
  if (lang === 'mr' && Array.isArray(protocol.stepsMr) && protocol.stepsMr.length > 0) {
    return protocol.stepsMr;
  }
  return protocol.stepsEn || [];
}

/**
 * Returns the "do nots" array for a given language ('en', 'hi', 'mr')
 * @param {object} protocol
 * @param {string} language
 * @returns {string[]}
 */
export function getProtocolDoNots(protocol, language = 'en') {
  if (!protocol) return [];
  const lang = (language || 'en').toLowerCase();
  if (lang === 'hi' && Array.isArray(protocol.doNotHi) && protocol.doNotHi.length > 0) {
    return protocol.doNotHi;
  }
  if (lang === 'mr' && Array.isArray(protocol.doNotMr) && protocol.doNotMr.length > 0) {
    return protocol.doNotMr;
  }
  return protocol.doNotEn || [];
}

/**
 * Fills in the protocol's SMS dispatch template with patient data
 * @param {object} protocol
 * @param {object} patientData
 * @returns {string}
 */
export function formatSmsBody(protocol, patientData = {}) {
  if (!protocol || !protocol.smsTemplate) return '';
  const data = {
    location: patientData.location || patientData.village || patientData.address || 'Unknown Location',
    age: patientData.age !== undefined && patientData.age !== null ? String(patientData.age) : 'Unknown',
    time: patientData.time || patientData.timeOfIncident || 'Immediate',
    ...patientData
  };
  return protocol.smsTemplate.replace(/\{(\w+)\}/g, (match, key) => {
    return data[key] !== undefined && data[key] !== null ? String(data[key]) : match;
  });
}

/**
 * Returns the protocol title for a given language ('en', 'hi', 'mr')
 * @param {object} protocol
 * @param {string} language
 * @returns {string}
 */
export function getProtocolTitle(protocol, language = 'en') {
  if (!protocol) return '';
  const lang = (language || 'en').toLowerCase();
  if (lang === 'hi' && protocol.titleHi) return protocol.titleHi;
  if (lang === 'mr' && protocol.titleMr) return protocol.titleMr;
  return protocol.titleEn || '';
}

export default EMERGENCY_PROTOCOLS;
