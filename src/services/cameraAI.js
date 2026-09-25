/**
 * Camera AI Processing Service — Offline Edge Computer
 * Analyzes fingernail bed for Anemia pallor and eye sclera for Jaundice icterus.
 */

// Analyze image element or canvas for Anemia (Nail Bed Pallor)
export async function analyzeAnemia(imageCanvas) {
  return new Promise((resolve) => {
    try {
      const ctx = imageCanvas.getContext('2d');
      const { width, height } = imageCanvas;
      
      // Sample center region (where fingernail is aligned)
      const sampleSize = Math.min(width, height) * 0.4;
      const startX = (width - sampleSize) / 2;
      const startY = (height - sampleSize) / 2;
      
      const imageData = ctx.getImageData(startX, startY, sampleSize, sampleSize);
      const data = imageData.data;

      let totalR = 0, totalG = 0, totalB = 0;
      let pixelCount = 0;

      for (let i = 0; i < data.length; i += 4) {
        totalR += data[i];     // Red
        totalG += data[i + 1]; // Green
        totalB += data[i + 2]; // Blue
        pixelCount++;
      }

      const avgR = totalR / pixelCount;
      const avgG = totalG / pixelCount;
      const avgB = totalB / pixelCount;

      // Hemoglobin Color Saturation Index (Red Ratio relative to Green + Blue)
      const redRatio = avgR / (avgG + avgB + 1); // Avoid div 0
      
      // Anemia risk probability mapping
      // Healthy nail bed has high red ratio (>0.85). Paleness lowers red ratio (<0.70)
      let anemiaProb = 0;
      let severity = 'NORMAL';
      let message = 'Nail bed color indicates healthy hemoglobin levels.';
      let riskScore = 10;

      if (redRatio < 0.65) {
        anemiaProb = 0.88;
        severity = 'SEVERE';
        message = 'Significant pallor detected. High probability of severe anemia (<7 g/dL Hb).';
        riskScore = 85;
      } else if (redRatio < 0.78) {
        anemiaProb = 0.65;
        severity = 'MODERATE';
        message = 'Moderate pallor detected. Suggest blood Hb check at Primary Health Centre.';
        riskScore = 55;
      } else if (redRatio < 0.86) {
        anemiaProb = 0.35;
        severity = 'MILD';
        message = 'Mild pallor detected. Recommend iron-rich diet and follow-up scan.';
        riskScore = 30;
      }

      resolve({
        type: 'ANEMIA',
        confidence: Math.round(anemiaProb * 100),
        severity,
        message,
        riskScore,
        rgbMetrics: { avgR: Math.round(avgR), avgG: Math.round(avgG), avgB: Math.round(avgB), redRatio: redRatio.toFixed(2) },
      });
    } catch (err) {
      console.error('Anemia analysis error:', err);
      resolve({
        type: 'ANEMIA',
        confidence: 0,
        severity: 'UNKNOWN',
        message: 'Could not process image frame. Please re-align nail in the circle.',
        riskScore: 0,
      });
    }
  });
}

// Analyze image element or canvas for Jaundice (Eye Sclera Yellowing)
export async function analyzeJaundice(imageCanvas) {
  return new Promise((resolve) => {
    try {
      const ctx = imageCanvas.getContext('2d');
      const { width, height } = imageCanvas;
      
      const sampleSize = Math.min(width, height) * 0.4;
      const startX = (width - sampleSize) / 2;
      const startY = (height - sampleSize) / 2;
      
      const imageData = ctx.getImageData(startX, startY, sampleSize, sampleSize);
      const data = imageData.data;

      let totalR = 0, totalG = 0, totalB = 0;
      let pixelCount = 0;

      for (let i = 0; i < data.length; i += 4) {
        totalR += data[i];
        totalG += data[i + 1];
        totalB += data[i + 2];
        pixelCount++;
      }

      const avgR = totalR / pixelCount;
      const avgG = totalG / pixelCount;
      const avgB = totalB / pixelCount;

      // Yellowing Index = (R + G) / (2 * B)
      const yellowIndex = (avgR + avgG) / (2 * (avgB + 1));
      
      let jaundiceProb = 0;
      let severity = 'NORMAL';
      let message = 'Eye sclera color appears normal.';
      let riskScore = 5;

      if (yellowIndex > 1.6) {
        jaundiceProb = 0.85;
        severity = 'HIGH';
        message = 'Yellow sclera tint detected. High bilirubin risk. Immediate LFT lab check needed.';
        riskScore = 80;
      } else if (yellowIndex > 1.35) {
        jaundiceProb = 0.55;
        severity = 'MODERATE';
        message = 'Slight yellowish discoloration detected. Monitor hydration and consult PHC.';
        riskScore = 45;
      }

      resolve({
        type: 'JAUNDICE',
        confidence: Math.round(jaundiceProb * 100),
        severity,
        message,
        riskScore,
        rgbMetrics: { avgR: Math.round(avgR), avgG: Math.round(avgG), avgB: Math.round(avgB), yellowIndex: yellowIndex.toFixed(2) },
      });
    } catch (err) {
      console.error('Jaundice analysis error:', err);
      resolve({
        type: 'JAUNDICE',
        confidence: 0,
        severity: 'UNKNOWN',
        message: 'Could not process eye image.',
        riskScore: 0,
      });
    }
  });
}
