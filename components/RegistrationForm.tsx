import React, { useState, useEffect } from 'react';
import { EmployeeService } from '../services/api';
import { Employee, Division, Sex } from '../types';
import { COMORBIDITIES_COMMON, DIVISIONS, ICONS_MAP, PAST_MEDICAL_HISTORY } from '../constants';
import { Save, AlertCircle, Plus, Trash2 } from 'lucide-react';

interface RegistrationFormProps {
  onSuccess: () => void;
}

const RegistrationForm: React.FC<RegistrationFormProps> = ({ onSuccess }) => {
  const [formData, setFormData] = useState<Partial<Employee>>({
    firstName: '',
    lastName: '',
    middleInitial: '',
    sex: 'Male',
    dob: '',
    hospitalNumber: '',
    division: 'Clinical Division',
    comorbidities: [],
    otherComorbidities: '',
    pastMedicalHistory: [],
    otherPastMedicalHistory: '',
    maintenanceMeds: [],
    apeStatus: 'Pending',
    status: 'Active',
    sickLeaves: [],
    admissions: [],
    erVisits: [],
    weight: undefined,
    weightHistory: [],
    nutritionReferral: false,
    hypertensionHistory: [],
    diabetesHistory: [],
  });

  const [currentMed, setCurrentMed] = useState('');
  const [loading, setLoading] = useState(false);

  // Auto-compute age
  useEffect(() => {
    if (formData.dob) {
      const birthDate = new Date(formData.dob);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      setFormData((prev) => ({ ...prev, age }));
    }
  }, [formData.dob]);

  const toggleComorbidity = (item: string) => {
    setFormData((prev) => {
      const current = prev.comorbidities || [];
      if (current.includes(item)) {
        return { ...prev, comorbidities: current.filter((i) => i !== item) };
      } else {
        return { ...prev, comorbidities: [...current, item] };
      }
    });
  };

  const toggleHistory = (item: string) => {
    setFormData((prev) => {
      const current = prev.pastMedicalHistory || [];
      if (current.includes(item)) {
        return { ...prev, pastMedicalHistory: current.filter((i) => i !== item) };
      } else {
        return { ...prev, pastMedicalHistory: [...current, item] };
      }
    });
  };

  const addMedication = () => {
    if (currentMed.trim()) {
      setFormData(prev => ({
        ...prev,
        maintenanceMeds: [...(prev.maintenanceMeds || []), currentMed.trim()]
      }));
      setCurrentMed('');
    }
  };

  const removeMedication = (index: number) => {
    setFormData(prev => ({
      ...prev,
      maintenanceMeds: (prev.maintenanceMeds || []).filter((_, i) => i !== index)
    }));
  };

  const handleHospitalNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setFormData({ ...formData, hospitalNumber: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.lastName || !formData.firstName) {
      alert("Please fill in required fields");
      return;
    }

    setLoading(true);
    try {
      const newEmployee: Employee = {
        ...formData,
        id: Math.random().toString(36).substr(2, 9),
        weightHistory: formData.weight ? [{ date: new Date().toISOString().split('T')[0], weight: Number(formData.weight) }] : [],
        erVisits: [],
        hypertensionHistory: [],
        diabetesHistory: [],
      } as Employee;
      
      await EmployeeService.add(newEmployee);
      alert('Employee registered successfully!');
      onSuccess();
    } catch (error) {
      console.error(error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      alert(`Failed to register employee:\n\n${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-osmak-green mb-6 border-b pb-2">New Employee Registration</h2>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Personal Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Hospital No. (Numbers Only)</label>
            <input 
              type="text"
              pattern="\d*" 
              className="w-full p-2 bg-white border border-gray-300 text-gray-900 rounded-md focus:ring-2 focus:ring-osmak-green focus:border-osmak-green focus:outline-none"
              value={formData.hospitalNumber}
              onChange={handleHospitalNumberChange}
              placeholder="e.g. 2023001"
            />
          </div>
          <div className="col-span-1">
             <label className="block text-sm font-medium text-gray-700 mb-1">Division</label>
             <select 
               className="w-full p-2 bg-white border border-gray-300 text-gray-900 rounded-md focus:ring-2 focus:ring-osmak-green focus:border-osmak-green"
               value={formData.division}
               onChange={e => setFormData({...formData, division: e.target.value as Division})}
             >
               {DIVISIONS.map(d => <option key={d} value={d}>{d}</option>)}
             </select>
          </div>
          <div className="col-span-1">
             <label className="block text-sm font-medium text-gray-700 mb-1">Sex</label>
             <select 
               className="w-full p-2 bg-white border border-gray-300 text-gray-900 rounded-md focus:ring-2 focus:ring-osmak-green focus:border-osmak-green"
               value={formData.sex}
               onChange={e => setFormData({...formData, sex: e.target.value as Sex})}
             >
               <option value="Male">Male</option>
               <option value="Female">Female</option>
             </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
            <input required type="text" className="w-full p-2 bg-white border border-gray-300 text-gray-900 rounded-md focus:ring-2 focus:ring-osmak-green focus:border-osmak-green" value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} />
          </div>
          <div className="md:col-span-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
            <input required type="text" className="w-full p-2 bg-white border border-gray-300 text-gray-900 rounded-md focus:ring-2 focus:ring-osmak-green focus:border-osmak-green" value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} />
          </div>
          <div className="md:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">M.I.</label>
            <input type="text" maxLength={2} className="w-full p-2 bg-white border border-gray-300 text-gray-900 rounded-md focus:ring-2 focus:ring-osmak-green focus:border-osmak-green uppercase" value={formData.middleInitial} onChange={e => setFormData({...formData, middleInitial: e.target.value})} />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
            <input type="date" className="w-full p-2 bg-white border border-gray-300 text-gray-900 rounded-md focus:ring-2 focus:ring-osmak-green focus:border-osmak-green" value={formData.dob} onChange={e => setFormData({...formData, dob: e.target.value})} />
          </div>
          <div className="md:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
            <input disabled type="number" className="w-full p-2 border border-gray-300 rounded-md bg-gray-100 text-gray-500 cursor-not-allowed" value={formData.age || ''} />
          </div>
           <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Initial Weight (kg)</label>
            <input type="number" step="0.1" className="w-full p-2 bg-white border border-gray-300 text-gray-900 rounded-md focus:ring-2 focus:ring-osmak-green focus:border-osmak-green" value={formData.weight || ''} onChange={e => setFormData({...formData, weight: parseFloat(e.target.value)})} />
          </div>
        </div>

        {/* Comorbidities */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <AlertCircle size={18} className="text-osmak-red" />
            Comorbidities
          </h3>
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <div className="flex flex-wrap gap-2 mb-4">
              {COMORBIDITIES_COMMON.map(item => (
                <button
                  key={item}
                  type="button"
                  onClick={() => toggleComorbidity(item)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all border ${
                    formData.comorbidities?.includes(item)
                      ? 'bg-osmak-green text-white border-osmak-green shadow-md transform scale-105'
                      : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-100'
                  }`}
                >
                  <span className="mr-2">{ICONS_MAP[item] || '⚕️'}</span>
                  {item}
                </button>
              ))}
            </div>
            <div className="mt-2">
              <label className="block text-sm text-gray-600 mb-1">Other Comorbidities (Specify if not in list)</label>
              <input 
                type="text" 
                className="w-full p-2 bg-white border border-gray-300 text-gray-900 rounded-md focus:ring-2 focus:ring-osmak-green focus:border-osmak-green"
                placeholder="e.g. PCOS, Gouty Arthritis..."
                value={formData.otherComorbidities}
                onChange={e => setFormData({...formData, otherComorbidities: e.target.value})}
              />
            </div>
          </div>
        </div>

        {/* Past Medical History */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Past Medical History</h3>
          <div className="bg-white border rounded-lg p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 mb-4">
              {PAST_MEDICAL_HISTORY.map(item => (
                <label key={item} className="flex items-center space-x-2 p-2 border rounded-md hover:bg-gray-50 cursor-pointer">
                  <input 
                    type="checkbox"
                    checked={formData.pastMedicalHistory?.includes(item)}
                    onChange={() => toggleHistory(item)}
                    className="rounded text-osmak-green focus:ring-osmak-green"
                  />
                  <span className="text-sm text-gray-700">{item}</span>
                </label>
              ))}
            </div>
             <div>
              <label className="block text-sm text-gray-600 mb-1">Other Past History (Specify)</label>
              <input 
                type="text" 
                className="w-full p-2 bg-white border border-gray-300 text-gray-900 rounded-md focus:ring-2 focus:ring-osmak-green focus:border-osmak-green"
                placeholder="e.g. Appendectomy, etc."
                value={formData.otherPastMedicalHistory}
                onChange={e => setFormData({...formData, otherPastMedicalHistory: e.target.value})}
              />
            </div>
          </div>
        </div>

        {/* Meds */}
        <div>
           <label className="block text-lg font-semibold text-gray-800 mb-3">Maintenance Medications</label>
           <div className="bg-gray-50 p-4 rounded-lg border">
              <div className="flex gap-2 mb-3">
                <input 
                  type="text" 
                  className="flex-1 p-2 bg-white border border-gray-300 text-gray-900 rounded-md focus:ring-2 focus:ring-osmak-green focus:border-osmak-green"
                  placeholder="Enter medication name and dosage (e.g. Amlodipine 10mg OD)"
                  value={currentMed}
                  onChange={e => setCurrentMed(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addMedication())}
                />
                <button 
                  type="button" 
                  onClick={addMedication}
                  className="bg-osmak-green text-white px-4 py-2 rounded-md hover:bg-osmak-green-dark flex items-center gap-1"
                >
                  <Plus size={18} /> Add
                </button>
              </div>

              {formData.maintenanceMeds && formData.maintenanceMeds.length > 0 && (
                <ul className="space-y-2">
                  {formData.maintenanceMeds.map((med, idx) => (
                    <li key={idx} className="flex justify-between items-center bg-white p-2 px-3 rounded border shadow-sm">
                      <span className="text-gray-800">{med}</span>
                      <button 
                        type="button" 
                        onClick={() => removeMedication(idx)}
                        className="text-red-500 hover:text-red-700 p-1"
                      >
                        <Trash2 size={16} />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
              {(!formData.maintenanceMeds || formData.maintenanceMeds.length === 0) && (
                <p className="text-sm text-gray-400 italic">No medications added.</p>
              )}
           </div>
        </div>

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 bg-osmak-green hover:bg-osmak-green-dark text-white px-8 py-3 rounded-lg font-bold shadow-lg transition-all disabled:opacity-50"
          >
            <Save size={20} />
            {loading ? 'Saving...' : 'Register Employee'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default RegistrationForm;