export type Division = 
  | 'Clinical Division'
  | 'Ancillary Division'
  | 'Nursing Division'
  | 'Quality Assurance Division'
  | 'Central Information Management Division'
  | 'Internal Administrative Division'
  | 'Allied Health Division'
  | 'Research Development and Innovation Division'
  | 'Financial Management Division'
  | 'Medical Directors Office';

export type EmploymentStatus = 'Active' | 'Resigned' | 'Retired' | 'Expired' | 'Other';

export type Sex = 'Male' | 'Female';

export interface MedicalRecord {
  startDate: string;
  endDate: string;
  diagnosis?: string;
  notes: string;
}

export interface WeightRecord {
  date: string;
  weight: number; // in kg
}

export interface DiabetesRecord {
  date: string;
  type: 'FBS' | 'HbA1c';
  value: number;
}

export interface HypertensionRecord {
  date: string;
  systolic: number;
  diastolic: number;
  heartRate?: number;
}

export interface Employee {
  id: string;
  hospitalNumber: string; // Numbers only
  firstName: string;
  lastName: string;
  middleInitial: string;
  sex: Sex;
  dob: string;
  age: number;
  division: Division;
  comorbidities: string[];
  otherComorbidities?: string;
  pastMedicalHistory: string[];
  otherPastMedicalHistory?: string;
  maintenanceMeds: string[]; // Changed to array
  apeDate?: string; // Date of last APE
  apeStatus: 'Done' | 'Pending'; // Derived from date usually
  sickLeaves: MedicalRecord[];
  admissions: MedicalRecord[];
  erVisits: MedicalRecord[];
  weight?: number; // Initial weight on registration
  weightHistory: WeightRecord[];
  hypertensionHistory: HypertensionRecord[];
  diabetesHistory: DiabetesRecord[];
  nutritionReferral: boolean;
  nutritionReferralDate?: string;
  status: EmploymentStatus;
  statusReason?: string;
}

export interface ChartData {
  name: string;
  value: number;
}