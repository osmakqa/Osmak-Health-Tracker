import { Employee } from '../types';

export const MOCK_EMPLOYEES: Employee[] = [
  {
    id: '1',
    hospitalNumber: '2023001',
    firstName: 'Juan',
    lastName: 'Dela Cruz',
    middleInitial: 'A',
    sex: 'Male',
    dob: '1980-05-15',
    age: 44,
    division: 'Nursing Division',
    comorbidities: ['Hypertension St II', 'Dyslipidemia'],
    pastMedicalHistory: ['Myocardial Infarction'],
    maintenanceMeds: ['Losartan 50mg OD', 'Atorvastatin 20mg OD'],
    apeDate: '2024-02-10',
    apeStatus: 'Done',
    sickLeaves: [
      { startDate: '2024-03-01', endDate: '2024-03-03', notes: 'Flu', diagnosis: 'Influenza A' }
    ],
    admissions: [],
    erVisits: [],
    weight: 85,
    weightHistory: [
        { date: '2023-01-10', weight: 88 },
        { date: '2024-02-10', weight: 85 }
    ],
    hypertensionHistory: [
      { date: '2024-05-10', systolic: 145, diastolic: 92, heartRate: 78 },
      { date: '2024-04-08', systolic: 140, diastolic: 90, heartRate: 80 }
    ],
    diabetesHistory: [],
    nutritionReferral: false,
    status: 'Active'
  },
  {
    id: '2',
    hospitalNumber: '2023002',
    firstName: 'Maria',
    lastName: 'Santos',
    middleInitial: 'B',
    sex: 'Female',
    dob: '1975-12-01',
    age: 48,
    division: 'Clinical Division',
    comorbidities: ['Type 2 Diabetes Mellitus', 'Overweight'],
    pastMedicalHistory: [],
    maintenanceMeds: ['Metformin 500mg BID'],
    apeStatus: 'Pending',
    sickLeaves: [],
    admissions: [
      { startDate: '2023-11-20', endDate: '2023-11-23', diagnosis: 'Dengue Fever', notes: 'Admitted 3 days' }
    ],
    erVisits: [
      { startDate: '2024-05-01', endDate: '2024-05-01', diagnosis: 'Migraine', notes: '' }
    ],
    weight: 70,
    weightHistory: [
        { date: '2024-01-15', weight: 72 },
        { date: '2024-04-15', weight: 70 }
    ],
    hypertensionHistory: [],
    diabetesHistory: [
        { date: '2024-04-20', type: 'HbA1c', value: 7.2 },
        { date: '2024-05-21', type: 'FBS', value: 135 }
    ],
    nutritionReferral: true,
    nutritionReferralDate: '2024-01-15',
    status: 'Active'
  },
  {
    id: '3',
    hospitalNumber: '2023003',
    firstName: 'Pedro',
    lastName: 'Penduko',
    middleInitial: 'C',
    sex: 'Male',
    dob: '1990-08-20',
    age: 33,
    division: 'Internal Administrative Division',
    comorbidities: [],
    pastMedicalHistory: [],
    maintenanceMeds: [],
    apeStatus: 'Pending',
    sickLeaves: [],
    admissions: [],
    erVisits: [],
    weight: 75,
    weightHistory: [{ date: '2024-01-01', weight: 75 }],
    hypertensionHistory: [],
    diabetesHistory: [],
    nutritionReferral: false,
    status: 'Active'
  },
  {
    id: '4',
    hospitalNumber: '2023004',
    firstName: 'Ana',
    lastName: 'Reyes',
    middleInitial: 'L',
    sex: 'Female',
    dob: '1960-03-10',
    age: 64,
    division: 'Ancillary Division',
    comorbidities: ['Hypertension St II', 'Chronic Kidney Disease'],
    pastMedicalHistory: ['Surgery (Major)'],
    maintenanceMeds: ['Amlodipine 10mg'],
    apeDate: '2024-01-05',
    apeStatus: 'Done',
    sickLeaves: [],
    admissions: [],
    erVisits: [],
    weight: 60,
    weightHistory: [],
    hypertensionHistory: [],
    diabetesHistory: [],
    nutritionReferral: true,
    nutritionReferralDate: '2024-01-06',
    status: 'Active'
  }
];