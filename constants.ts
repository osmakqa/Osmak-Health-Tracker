import { Division } from './types';

// Set this to true to use local mock data instead of Google Sheets
export const USE_MOCK_DATA = false; 

// IMPORTANT: Replace this with your own Google Apps Script Web App URL after deploying
export const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzhAD61OWFh8ZUc8D_oWuAKzIJ-4T7QwXElP0uImdpik2zZffSzIUnCdQKMIrBGVKgKBg/exec';

export const DIVISIONS: Division[] = [
  'Clinical Division',
  'Ancillary Division',
  'Nursing Division',
  'Quality Assurance Division',
  'Central Information Management Division',
  'Internal Administrative Division',
  'Allied Health Division',
  'Research Development and Innovation Division',
  'Financial Management Division',
  'Medical Directors Office'
];

export const COMORBIDITIES_COMMON = [
  'Hypertension St II',
  'Type 2 Diabetes Mellitus',
  'Dyslipidemia',
  'Chronic Kidney Disease',
  'Hyperthyroidism',
  'Hypothyroidism',
  'Coronary Artery Disease',
  'Cardiovascular Disease',
  'Obesity',
  'Overweight',
  'Asthma'
];

export const PAST_MEDICAL_HISTORY = [
  'Cerebrovascular Disease',
  'Myocardial Infarction',
  'Tuberculosis',
  'Pneumonia',
  'Surgery (Major)',
  'Cancer/Malignancy'
];

export const ICONS_MAP: Record<string, string> = {
  'Hypertension St II': '❤️',
  'Type 2 Diabetes Mellitus': '🩸',
  'Dyslipidemia': '🍔',
  'Chronic Kidney Disease': '💧',
  'Asthma': '🫁',
  'Obesity': '⚖️',
  'Overweight': '⚠️',
  'Coronary Artery Disease': '💔'
};