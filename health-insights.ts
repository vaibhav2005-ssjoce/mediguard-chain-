import { db } from './db';
import { healthInsights, medicalRecords } from '@shared/schema';

interface HealthData {
  bloodPressureSystolic?: number;
  bloodPressureDiastolic?: number;
  bloodGlucose?: number;
  cholesterolTotal?: number;
  cholesterolLDL?: number;
  heartRate?: number;
  temperature?: number;
  weight?: number;
  height?: number;
}

export class HealthInsightsAnalyzer {
  /**
   * Parse health data from file description or metadata
   * In a real system, this would use OCR/NLP on uploaded files
   */
  private static parseHealthData(description: string): HealthData {
    const data: HealthData = {};
    
    // Simple regex-based extraction (MVP - rule-based)
    const bpMatch = description.match(/BP:?\s*(\d+)\/(\d+)/i) || 
                   description.match(/blood pressure:?\s*(\d+)\/(\d+)/i);
    if (bpMatch) {
      data.bloodPressureSystolic = parseInt(bpMatch[1]);
      data.bloodPressureDiastolic = parseInt(bpMatch[2]);
    }

    const glucoseMatch = description.match(/glucose:?\s*(\d+)/i) ||
                        description.match(/blood sugar:?\s*(\d+)/i);
    if (glucoseMatch) {
      data.bloodGlucose = parseInt(glucoseMatch[1]);
    }

    const cholMatch = description.match(/cholesterol:?\s*(\d+)/i);
    if (cholMatch) {
      data.cholesterolTotal = parseInt(cholMatch[1]);
    }

    return data;
  }

  /**
   * Analyze health data and generate insights
   */
  static async analyzeRecord(recordId: string, patientId: string, description: string) {
    const healthData = this.parseHealthData(description);
    const insights: Array<{
      type: string;
      severity: string;
      title: string;
      description: string;
      recommendations: string;
    }> = [];

    // Blood Pressure Analysis
    if (healthData.bloodPressureSystolic && healthData.bloodPressureDiastolic) {
      if (healthData.bloodPressureSystolic >= 140 || healthData.bloodPressureDiastolic >= 90) {
        insights.push({
          type: 'alert',
          severity: 'high',
          title: 'Elevated Blood Pressure Detected',
          description: `Your blood pressure reading of ${healthData.bloodPressureSystolic}/${healthData.bloodPressureDiastolic} mmHg is above the normal range (120/80 mmHg).`,
          recommendations: 'Consult with your healthcare provider. Consider lifestyle modifications including reduced sodium intake, regular exercise, and stress management.',
        });
      } else if (healthData.bloodPressureSystolic >= 120 || healthData.bloodPressureDiastolic >= 80) {
        insights.push({
          type: 'recommendation',
          severity: 'medium',
          title: 'Pre-Hypertension Range',
          description: `Your blood pressure of ${healthData.bloodPressureSystolic}/${healthData.bloodPressureDiastolic} mmHg is in the pre-hypertension range.`,
          recommendations: 'Monitor your blood pressure regularly. Maintain a healthy diet and exercise routine.',
        });
      }
    }

    // Blood Glucose Analysis
    if (healthData.bloodGlucose) {
      if (healthData.bloodGlucose > 180) {
        insights.push({
          type: 'alert',
          severity: 'high',
          title: 'High Blood Sugar Level',
          description: `Blood glucose level of ${healthData.bloodGlucose} mg/dL is significantly elevated (normal: 70-140 mg/dL).`,
          recommendations: 'Immediate consultation with your doctor is recommended. Monitor your diet and consider diabetes screening.',
        });
      } else if (healthData.bloodGlucose > 140) {
        insights.push({
          type: 'recommendation',
          severity: 'medium',
          title: 'Elevated Blood Sugar',
          description: `Blood glucose of ${healthData.bloodGlucose} mg/dL is above normal range.`,
          recommendations: 'Consider reducing sugar intake and increasing physical activity. Schedule a follow-up test.',
        });
      } else if (healthData.bloodGlucose < 70) {
        insights.push({
          type: 'alert',
          severity: 'medium',
          title: 'Low Blood Sugar',
          description: `Blood glucose of ${healthData.bloodGlucose} mg/dL is below normal range.`,
          recommendations: 'Ensure regular meal times and adequate carbohydrate intake. Consult your healthcare provider.',
        });
      }
    }

    // Cholesterol Analysis
    if (healthData.cholesterolTotal) {
      if (healthData.cholesterolTotal > 240) {
        insights.push({
          type: 'alert',
          severity: 'high',
          title: 'High Cholesterol Level',
          description: `Total cholesterol of ${healthData.cholesterolTotal} mg/dL is above recommended levels (< 200 mg/dL).`,
          recommendations: 'Consult your doctor about cholesterol management. Consider dietary changes and regular exercise.',
        });
      } else if (healthData.cholesterolTotal > 200) {
        insights.push({
          type: 'recommendation',
          severity: 'medium',
          title: 'Borderline High Cholesterol',
          description: `Total cholesterol of ${healthData.cholesterolTotal} mg/dL is borderline high.`,
          recommendations: 'Focus on heart-healthy diet with reduced saturated fats. Increase fiber intake.',
        });
      }
    }

    // Save insights to database
    for (const insight of insights) {
      await db.insert(healthInsights).values({
        patientId,
        recordId,
        insightType: insight.type,
        severity: insight.severity,
        title: insight.title,
        description: insight.description,
        recommendations: insight.recommendations,
      });
    }

    return insights;
  }

  /**
   * Generate general health recommendations
   */
  static async generateGeneralRecommendations(patientId: string) {
    const generalInsights = [
      {
        type: 'recommendation',
        severity: 'low',
        title: 'Regular Health Checkups',
        description: 'Annual health screenings are important for early detection of potential health issues.',
        recommendations: 'Schedule yearly checkups with your primary care physician. Keep track of your vaccination schedule.',
      },
      {
        type: 'recommendation',
        severity: 'low',
        title: 'Maintain Healthy Lifestyle',
        description: 'A balanced diet and regular exercise are key to long-term health.',
        recommendations: 'Aim for 150 minutes of moderate exercise per week. Eat a variety of fruits, vegetables, and whole grains.',
      },
    ];

    for (const insight of generalInsights) {
      await db.insert(healthInsights).values({
        patientId,
        insightType: insight.type,
        severity: insight.severity,
        title: insight.title,
        description: insight.description,
        recommendations: insight.recommendations,
      });
    }

    return generalInsights;
  }
}
