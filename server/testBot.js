// server/testBot.js
// Test script for ArogyaSetu Edge WhatsApp Bot Logic

import { processWhatsAppTextQuery, generateLocalMedicalAdvice } from './geminiBotService.js';

async function runTests() {
  console.log('======================================================');
  console.log('🧪 Testing ArogyaSetu Edge WhatsApp Bot Logic');
  console.log('======================================================\n');

  console.log('Test 1: Dental Query (Hindi)...');
  const res1 = await processWhatsAppTextQuery('मुझे दांत में बहुत दर्द है और दांत के बीच गैप है, क्या करूं?', 'Hindi');
  console.log('Result 1:\n' + res1 + '\n');

  console.log('Test 2: Emergency Keyword Query...');
  const res2 = await processWhatsAppTextQuery('emergency chest pain', 'English');
  console.log('Result 2:\n' + res2 + '\n');

  console.log('Test 3: Pimples Query (Marathi)...');
  const res3 = await processWhatsAppTextQuery('चेहऱ्यावर खूप पिंपल्स आले आहेत, काय करावे?', 'Marathi');
  console.log('Result 3:\n' + res3 + '\n');

  console.log('Test 4: Local Offline Fallback Engine...');
  const res4 = generateLocalMedicalAdvice('fever temperature', 'English');
  console.log('Result 4:\n' + res4 + '\n');

  console.log('✅ All tests completed with 0 errors!');
}

runTests();
