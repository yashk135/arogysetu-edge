// server/whatsappBot.js
// Production-Ready Twilio WhatsApp Webhook Express Server for ArogyaSetu Edge

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import twilio from 'twilio';
import { 
  processWhatsAppTextQuery, 
  processWhatsAppImageQuery, 
  processWhatsAppAudioQuery 
} from './geminiBotService.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || process.env.BOT_PORT || 5000;

// Enable CORS and body parsers for Twilio urlencoded payloads
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const { MessagingResponse } = twilio.twiml;

/**
 * Health check & Browser info endpoints
 */
const getHtmlStatusPage = () => `
<!DOCTYPE html>
<html>
<head>
  <title>ArogyaSetu Edge — WhatsApp Webhook Service</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0f172a; color: #f8fafc; padding: 40px; line-height: 1.6; }
    .card { max-width: 600px; margin: 0 auto; background: #1e293b; border: 1px solid #334155; border-radius: 16px; padding: 32px; box-shadow: 0 10px 25px rgba(0,0,0,0.3); }
    .badge { background: #10b981; color: #042f2e; font-weight: 700; padding: 4px 12px; border-radius: 99px; font-size: 13px; display: inline-block; margin-bottom: 16px; }
    h1 { font-size: 24px; color: #38bdf8; margin-bottom: 8px; }
    p { color: #94a3b8; font-size: 14px; }
    .endpoint { background: #0f172a; padding: 12px; border-radius: 8px; font-family: monospace; color: #34d399; margin: 16px 0; font-size: 13px; word-break: break-all; }
  </style>
</head>
<body>
  <div class="card">
    <span class="badge">🟢 ACTIVE & ONLINE</span>
    <h1>ArogyaSetu Edge WhatsApp Bot</h1>
    <p>The Twilio WhatsApp Webhook service is running smoothly on Port 5000.</p>
    <div class="endpoint">POST /whatsapp/webhook</div>
    <p style="font-size: 13px;">To connect with Twilio Sandbox or live number, set your webhook URL in Twilio Console to your public ngrok/server URL.</p>
  </div>
</body>
</html>
`;

app.get('/health', (req, res) => {
  res.json({
    status: 'online',
    service: 'ArogyaSetu Edge WhatsApp AI Bot',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

app.get('/', (req, res) => {
  res.send(getHtmlStatusPage());
});

app.get('/whatsapp/webhook', (req, res) => {
  res.send(getHtmlStatusPage());
});

/**
 * Helper: Fetch media from URL and convert to Base64 string
 */
async function fetchMediaAsBase64(mediaUrl) {
  try {
    const authHeader = (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN)
      ? 'Basic ' + Buffer.from(`${process.env.TWILIO_ACCOUNT_SID}:${process.env.TWILIO_AUTH_TOKEN}`).toString('base64')
      : null;

    const headers = {};
    if (authHeader) {
      headers['Authorization'] = authHeader;
    }

    const response = await fetch(mediaUrl, { headers });
    if (!response.ok) {
      console.warn(`[WhatsApp Server] Media fetch failed (${response.status}), retrying without auth headers...`);
      const retryResponse = await fetch(mediaUrl);
      if (!retryResponse.ok) return null;
      const arrayBuffer = await retryResponse.arrayBuffer();
      return Buffer.from(arrayBuffer).toString('base64');
    }

    const arrayBuffer = await response.arrayBuffer();
    return Buffer.from(arrayBuffer).toString('base64');
  } catch (err) {
    console.error('[WhatsApp Server] Media fetch exception:', err.message);
    return null;
  }
}

/**
 * Main Twilio WhatsApp Webhook Route
 */
app.post('/whatsapp/webhook', async (req, res) => {
  const twiml = new MessagingResponse();

  try {
    const body = req.body || {};
    const userMessage = (body.Body || '').trim();
    const fromNumber = body.From || 'User';
    const numMedia = parseInt(body.NumMedia || '0', 10);
    const mediaUrl = body.MediaUrl0 || '';
    const contentType = body.MediaContentType0 || '';

    console.log(`\n[WhatsApp Webhook] Message received from ${fromNumber}`);
    console.log(`Text: "${userMessage}" | Media Count: ${numMedia} | Type: ${contentType}`);

    let replyText = '';

    // 1. EMERGENCY KEYWORDS DETECTION
    const lowerText = userMessage.toLowerCase();
    if (
      lowerText.includes('emergency') || 
      lowerText.includes('108') || 
      lowerText.includes('ambulance') || 
      lowerText.includes('आपात') || 
      lowerText.includes('आणीबाणी') || 
      lowerText.includes('chest pain') || 
      lowerText.includes('bleeding')
    ) {
      replyText = `🚨 *AROGYASETU EMERGENCY RESPONSE* 🚨\n\n• *Immediate Action*: Call National Ambulance *108* or Emergency *112* immediately!\n• *First Aid Guidance*:\n  1. Position patient comfortably in a resting state.\n  2. Keep airways clear and do not force food or water.\n  3. If bleeding, apply firm, continuous pressure with a clean cloth.\n• *Hospital Referral*: Proceed directly to the nearest Primary Health Centre (PHC) or District Hospital.`;
    }

    // 2. PASSPORT / MEDICAL HISTORY LOOKUP KEYWORDS
    else if (
      lowerText.includes('passport') || 
      lowerText.includes('history') || 
      lowerText.includes('record') || 
      lowerText.includes('पासपोर्ट')
    ) {
      replyText = `🪪 *ArogyaSetu Digital Health Passport*\n\n• *Patient Record Access*: Your medical history and QR code are securely synced in the ArogyaSetu Edge system.\n• *Web Access*: Open your Web App Health Passport to view full clinical timeline and export official PDF doctor referrals.\n• *Support*: Reply with your symptoms, skin photos, or report images anytime to add a new clinical entry.`;
    }

    // 3. MEDIA ATTACHMENTS (PHOTOS / VOICE NOTES / DOCUMENTS)
    else if (numMedia > 0 && mediaUrl) {
      console.log(`[WhatsApp Server] Downloading media attachment from Twilio...`);
      const base64Data = await fetchMediaAsBase64(mediaUrl);

      if (contentType.startsWith('image/')) {
        console.log(`[WhatsApp Server] Processing photo visual triage with Gemini Vision...`);
        replyText = await processWhatsAppImageQuery(base64Data, contentType, userMessage);
      } 
      else if (contentType.startsWith('audio/')) {
        console.log(`[WhatsApp Server] Processing voice note triage with Gemini Audio...`);
        replyText = await processWhatsAppAudioQuery(base64Data, contentType, userMessage);
      } 
      else {
        replyText = `📄 *Document Received*\n• Document payload processed successfully.\n• *Advice*: Please visit your local Primary Health Centre (PHC) for report review or send a clear photo of the report page.`;
      }
    }

    // 4. GENERAL TEXT CONSULTATION / SYMPTOM TRIAGE
    else {
      console.log(`[WhatsApp Server] Processing text triage query with Gemini AI...`);
      replyText = await processWhatsAppTextQuery(userMessage);
    }

    // Construct TwiML XML Response
    twiml.message(replyText);

    res.set('Content-Type', 'text/xml');
    return res.status(200).send(twiml.toString());

  } catch (error) {
    console.error('[WhatsApp Webhook Error]:', error);
    
    // Fail-safe TwiML response
    twiml.message('📌 *ArogyaSetu Edge*: Message received. If you have an urgent medical query, please visit your nearest Primary Health Centre (PHC) or call 108.');
    res.set('Content-Type', 'text/xml');
    return res.status(200).send(twiml.toString());
  }
});

// Start Server on 0.0.0.0
app.listen(PORT, '0.0.0.0', () => {
  console.log(`\n======================================================`);
  console.log(`🚀 ArogyaSetu Edge WhatsApp Bot Server Online!`);
  console.log(`📡 Listening on: http://127.0.0.1:${PORT}`);
  console.log(`🔗 Webhook Endpoint: http://127.0.0.1:${PORT}/whatsapp/webhook`);
  console.log(`======================================================\n`);
});
