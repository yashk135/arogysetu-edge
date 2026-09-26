import jsPDF from 'jspdf';

/**
 * Generates and downloads a clean Health Passport PDF Referral Document
 */
export function generateHealthPassportPDF(patient, triageHistory = []) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const latestRecord = triageHistory[0] || null;
  const riskLevel = latestRecord ? latestRecord.riskLevel : 'GREEN';

  // Header Background Banner
  doc.setFillColor(18, 18, 18);
  doc.rect(0, 0, 210, 35, 'F');

  // Brand Header
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.setTextColor(16, 185, 129); // Emerald
  doc.text('ArogyaSetu Edge', 15, 18);

  doc.setFontSize(9);
  doc.setTextColor(160, 160, 160);
  doc.text('Clinical Triage & Patient Health Passport | ABDM Standard', 15, 25);

  doc.setFontSize(8);
  doc.setTextColor(255, 255, 255);
  doc.text(`Generated: ${new Date().toLocaleString()}`, 145, 18);

  // Divider Line
  doc.setDrawColor(16, 185, 129);
  doc.setLineWidth(1);
  doc.line(0, 35, 210, 35);

  let y = 48;

  // Patient Profile Section Box
  doc.setFillColor(245, 245, 245);
  doc.roundedRect(15, y, 180, 32, 3, 3, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(20, 20, 20);
  doc.text(patient.name || 'Anonymous Patient', 20, y + 10);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(80, 80, 80);
  doc.text(`Age: ${patient.age} yrs  |  Gender: ${patient.gender}  |  Pregnancy Status: ${patient.isPregnant ? 'Yes (Pregnant)' : 'No'}`, 20, y + 18);
  doc.text(`Village / District: ${patient.village || 'N/A'}  |  Patient ID: ${patient.id}`, 20, y + 25);

  y += 42;

  // Triage Assessment Status
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(20, 20, 20);
  doc.text('Current Clinical Triage Assessment:', 15, y);

  y += 6;

  // Risk Badge Pill Box
  if (riskLevel === 'RED') {
    doc.setFillColor(239, 68, 68);
    doc.setTextColor(255, 255, 255);
  } else if (riskLevel === 'YELLOW') {
    doc.setFillColor(245, 158, 11);
    doc.setTextColor(255, 255, 255);
  } else {
    doc.setFillColor(16, 185, 129);
    doc.setTextColor(255, 255, 255);
  }
  doc.roundedRect(15, y, 180, 14, 2, 2, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text(`TRIAGE TIER: ${riskLevel} RISK  (Score: ${latestRecord ? latestRecord.riskScore : 0} / 100)`, 20, y + 9);

  y += 22;

  // Key Clinical Findings Section
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(30, 30, 30);
  doc.text('Key Screening Findings & Recommendations:', 15, y);

  y += 6;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(60, 60, 60);

  if (latestRecord) {
    if (latestRecord.cameraResult) {
      doc.text(`• Visual Scan (${latestRecord.cameraResult.type}): ${latestRecord.cameraResult.message}`, 20, y);
      y += 6;
    }
    if (latestRecord.voiceResult) {
      doc.text(`• Voice Symptom Intake: "${latestRecord.voiceResult.transcript}"`, 20, y);
      y += 6;
      doc.text(`  Advice: ${latestRecord.voiceResult.adviceHindi}`, 20, y);
      y += 6;
    }
    if (latestRecord.ocrResult) {
      doc.text(`• Lab Report Summary: ${latestRecord.ocrResult.summaryHindi}`, 20, y);
      y += 6;
    }
  } else {
    doc.text('• Patient enrolled in registry. Initial visual & voice triage recommended.', 20, y);
    y += 6;
  }

  y += 15;

  // Referral Instructions Box
  doc.setFillColor(240, 253, 244);
  doc.setDrawColor(16, 185, 129);
  doc.roundedRect(15, y, 180, 28, 3, 3, 'DF');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(16, 185, 129);
  doc.text('HOSPITAL REFERRAL INSTRUCTIONS FOR MEDICAL OFFICER:', 20, y + 8);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(40, 40, 40);
  doc.text('1. Please present this document or QR code at Primary Health Centre (PHC) / District Hospital.', 20, y + 15);
  doc.text('2. Doctor may scan the QR code for instant full digital triage history.', 20, y + 21);

  // Footer Sign-off
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.text('ArogyaSetu Edge Healthcare Platform — Digitally Certified Health Passport Card', 15, 285);

  // Save PDF file
  doc.save(`Health_Passport_${patient.name.replace(/\s+/g, '_')}.pdf`);
}
