import { Division } from './types';

// Set this to true to use local mock data instead of Google Sheets
export const USE_MOCK_DATA = false; 

// ====================================================================================
// IMPORTANT: ACTION REQUIRED
// 1. Open your Google Sheet.
// 2. Go to Extensions > Apps Script.
// 3. Paste the entire content of `backend_google_script.js` into the editor.
// 4. Click "Deploy" > "New deployment".
// 5. For "Execute as", select "Me". For "Who has access", select "Anyone".
// 6. Click "Deploy". Authorize the permissions.
// 7. Copy the "Web app" URL and PASTE IT BELOW, replacing the empty quotes.
//
// The application will NOT work without this URL.
// ====================================================================================
export const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzhAD61OWFh8ZUc8D_oWuAKzIJ-4T7QwXElP0uImdpik2zZffSzIUnCdQKMIrBGVKgKBg/exec';

// URL for the discrete, password-protected link in the header
export const GOOGLE_SHEET_URL = 'https://docs.google.com/spreadsheets/d/1YArYuZ-FF1BaRFx15z76zbkEE40-Ds8tuLfRhKidYc0/edit?gid=0#gid=0';

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