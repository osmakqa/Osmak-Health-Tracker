import React, { useState } from 'react';
import { Employee, EmploymentStatus } from '../types';
import { X, Activity, Pill, Stethoscope, Utensils, AlertTriangle, Trash2, HeartPulse, Pencil, Save, Plus, Scale, Droplets, BookHeart } from 'lucide-react';
import { EmployeeService } from '../services/api';
import { COMORBIDITIES_COMMON, ICONS_MAP, PAST_MEDICAL_HISTORY } from '../constants';

interface EmployeeModalProps {
  employee: Employee;
  onClose: () => void;
  onUpdate: () => void;
}

const EmployeeModal: React.FC<EmployeeModalProps> = ({ employee, onClose, onUpdate }) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'trackers' | 'logs' | 'remove'>('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [editableEmployee, setEditableEmployee] = useState<Employee>({ ...employee });
  
  // State for actions
  const [sickStartDate, setSickStartDate] = useState('');
  const [sickEndDate, setSickEndDate] = useState('');
  const [sickDiagnosis, setSickDiagnosis] = useState('');
  
  const [admitStartDate, setAdmitStartDate] = useState('');
  const [admitEndDate, setAdmitEndDate] = useState('');
  const [admitDiagnosis, setAdmitDiagnosis] = useState('');
  
  const [erStartDate, setErStartDate] = useState('');
  const [erEndDate, setErEndDate] = useState('');
  const [erDiagnosis, setErDiagnosis] = useState('');

  // State for trackers
  const [newWeight, setNewWeight] = useState('');
  const [systolic, setSystolic] = useState('');
  const [diastolic, setDiastolic] = useState('');
  const [heartRate, setHeartRate] = useState('');
  const [readingType, setReadingType] = useState<'FBS' | 'HbA1c'>('FBS');
  const [readingValue, setReadingValue] = useState('');

  // State for profile edit
  const [currentMed, setCurrentMed] = useState('');
  
  const [removalReason, setRemovalReason] = useState('');
  const [removalStatus, setRemovalStatus] = useState<EmploymentStatus>('Resigned');

  const currentYear = new Date().getFullYear();
  const apeYear = editableEmployee.apeDate ? new Date(editableEmployee.apeDate).getFullYear() : 0;
  const isApeCurrent = editableEmployee.apeStatus === 'Done' && apeYear === currentYear;
  const latestWeight = editableEmployee.weightHistory?.slice(-1)[0];

  const handleUpdate = async (updatedEmployee: Employee) => {
    await EmployeeService.update(updatedEmployee);
    onUpdate();
  };

  const handleMarkAPE = async () => {
    if (!confirm('Mark Annual Physical Exam as DONE for this year?')) return;
    const today = new Date().toISOString().split('T')[0];
    const updated = { ...editableEmployee, apeStatus: 'Done' as const, apeDate: today };
    setEditableEmployee(updated);
    await handleUpdate(updated);
  };

  const addRecord = async (type: 'sick' | 'admission' | 'er') => {
    let newRecord, field, startDate, endDate, diagnosis;
    if (type === 'sick') {
      [field, startDate, endDate, diagnosis] = ['sickLeaves', sickStartDate, sickEndDate, sickDiagnosis];
    } else if (type === 'admission') {
      [field, startDate, endDate, diagnosis] = ['admissions', admitStartDate, admitEndDate, admitDiagnosis];
    } else {
      [field, startDate, endDate, diagnosis] = ['erVisits', erStartDate, erEndDate, erDiagnosis];
    }
    
    if (!startDate || !endDate || !diagnosis) return;
    newRecord = { startDate, endDate, diagnosis, notes: '' };
    const updated = { ...editableEmployee, [field]: [...(editableEmployee[field] || []), newRecord] };
    
    setEditableEmployee(updated);
    await handleUpdate(updated);
    
    if (type === 'sick') { setSickStartDate(''); setSickEndDate(''); setSickDiagnosis(''); }
    else if (type === 'admission') { setAdmitStartDate(''); setAdmitEndDate(''); setAdmitDiagnosis(''); }
    else { setErStartDate(''); setErEndDate(''); setErDiagnosis(''); }
  };
  
  const handleNutritionReferral = async () => {
    if (!confirm('Refer this employee to Nutrition Management?')) return;
    const today = new Date().toISOString().split('T')[0];
    const updated = { ...editableEmployee, nutritionReferral: true, nutritionReferralDate: today };
    setEditableEmployee(updated);
    await handleUpdate(updated);
  };

  const handleRemoveEmployee = async () => {
      if(!removalReason && removalStatus === 'Other') {
          alert("Please specify a reason for 'Other'.");
          return;
      }
      if(confirm("Are you sure you want to remove this employee from the active list?")) {
        await EmployeeService.remove(editableEmployee.id, removalReason, removalStatus);
        onUpdate();
        onClose();
      }
  };

  const handleSaveChanges = async () => {
    await handleUpdate(editableEmployee);
    setIsEditing(false);
  };
  
  const handleCancelEdit = () => {
    setEditableEmployee({ ...employee });
    setIsEditing(false);
  };

  const handleAddNewWeight = async () => {
    if (!newWeight || Number(newWeight) <= 0) return;
    const today = new Date().toISOString().split('T')[0];
    const newRecord = { date: today, weight: Number(newWeight) };
    const updated = { ...editableEmployee, weightHistory: [...(editableEmployee.weightHistory || []), newRecord] };
    setEditableEmployee(updated);
    await handleUpdate(updated);
    setNewWeight('');
  };
  
  const handleAddBp = async () => {
    if (!systolic || !diastolic || Number(systolic) <= 0 || Number(diastolic) <= 0) return;
    const today = new Date().toISOString().split('T')[0];
    const newRecord = { 
        date: today, 
        systolic: Number(systolic), 
        diastolic: Number(diastolic),
        heartRate: heartRate ? Number(heartRate) : undefined,
    };
    const updated = { ...editableEmployee, hypertensionHistory: [...(editableEmployee.hypertensionHistory || []), newRecord] };
    setEditableEmployee(updated);
    await handleUpdate(updated);
    setSystolic(''); setDiastolic(''); setHeartRate('');
  };

  const handleAddDiabetes = async () => {
    if (!readingValue || Number(readingValue) <= 0) return;
    const today = new Date().toISOString().split('T')[0];
    const newRecord = { date: today, type: readingType, value: Number(readingValue) };
    const updated = { ...editableEmployee, diabetesHistory: [...(editableEmployee.diabetesHistory || []), newRecord] };
    setEditableEmployee(updated);
    await handleUpdate(updated);
    setReadingValue('');
  };


  // Edit mode toggles
  const toggleComorbidity = (item: string) => {
    setEditableEmployee((prev) => {
      const current = prev.comorbidities || [];
      if (current.includes(item)) {
        return { ...prev, comorbidities: current.filter((i) => i !== item) };
      } else {
        return { ...prev, comorbidities: [...current, item] };
      }
    });
  };

  const toggleHistory = (item: string) => {
    setEditableEmployee((prev) => {
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
      setEditableEmployee(prev => ({
        ...prev,
        maintenanceMeds: [...(prev.maintenanceMeds || []), currentMed.trim()]
      }));
      setCurrentMed('');
    }
  };

  const removeMedication = (index: number) => {
    setEditableEmployee(prev => ({
      ...prev,
      maintenanceMeds: (prev.maintenanceMeds || []).filter((_, i) => i !== index)
    }));
  };

  const tabClass = (tabName: string) => 
    `flex-1 py-3 font-medium text-sm transition-colors ${activeTab === tabName ? 'bg-white border-t-2 border-t-osmak-green text-osmak-green' : 'text-gray-500 hover:bg-gray-100'}`;

  return (
    <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-osmak-green text-white p-4 flex justify-between items-start sticky top-0 z-10">
          <div>
            <h2 className="text-2xl font-bold uppercase">{employee.lastName}, {employee.firstName} {employee.middleInitial}</h2>
            <div className="text-sm opacity-90 flex gap-4 mt-1">
              <span>Hosp #: {employee.hospitalNumber}</span>
              <span>|</span>
              <span>Sex: {employee.sex}</span>
              <span>|</span>
              <span>Age: {employee.age}</span>
              <span>|</span>
              <span>{employee.division}</span>
            </div>
          </div>
          <button onClick={onClose} className="hover:bg-white/20 p-1 rounded-full"><X size={24} /></button>
        </div>

        {/* Tabs */}
        <div className="flex border-b bg-gray-50 flex-shrink-0">
          <button onClick={() => setActiveTab('profile')} className={tabClass('profile')}>Profile & History</button>
          <button onClick={() => setActiveTab('trackers')} className={tabClass('trackers')}>Health Trackers</button>
          <button onClick={() => setActiveTab('logs')} className={tabClass('logs')}>Logs & Actions</button>
          <button onClick={() => setActiveTab('remove')} className={`flex-1 py-3 font-medium text-sm transition-colors ${activeTab === 'remove' ? 'bg-white border-t-2 border-t-osmak-red text-osmak-red' : 'text-gray-500 hover:bg-gray-100'}`}>Status Management</button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto">
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center pb-2 border-b">
                 <h3 className="text-xl font-bold text-gray-800">Medical Profile</h3>
                 {!isEditing ? (
                    <button onClick={() => setIsEditing(true)} className="flex items-center gap-2 text-sm bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-1 rounded-md">
                        <Pencil size={14} /> Edit Profile
                    </button>
                 ) : (
                    <div className="flex gap-2">
                        <button onClick={handleCancelEdit} className="text-sm bg-gray-500 hover:bg-gray-600 text-white px-4 py-1 rounded-md">Cancel</button>
                        <button onClick={handleSaveChanges} className="flex items-center gap-2 text-sm bg-osmak-green hover:bg-osmak-green-dark text-white px-4 py-1 rounded-md">
                            <Save size={14} /> Save Changes
                        </button>
                    </div>
                 )}
              </div>
              <div>
                <h4 className="font-bold text-gray-800 mb-2 flex items-center gap-2"><Activity size={18} className="text-osmak-green"/> Comorbidities</h4>
                {!isEditing ? (
                  <>
                    {editableEmployee.comorbidities.length > 0 ? <ul className="list-disc pl-5 space-y-1 text-gray-700">{editableEmployee.comorbidities.map(c => <li key={c}>{c}</li>)}</ul> : <span className="text-gray-400 italic">None listed</span>}
                    {editableEmployee.otherComorbidities && <p className="mt-2 text-sm text-gray-600">Other: {editableEmployee.otherComorbidities}</p>}
                  </>
                ) : (
                   <div className="bg-gray-50 p-4 rounded-lg border">
                      <div className="flex flex-wrap gap-2 mb-4">
                        {COMORBIDITIES_COMMON.map(item => (
                            <button key={item} type="button" onClick={() => toggleComorbidity(item)} className={`px-3 py-1.5 rounded-full text-xs font-medium border ${editableEmployee.comorbidities?.includes(item) ? 'bg-osmak-green text-white border-osmak-green' : 'bg-white text-gray-600 hover:bg-gray-100'}`}>
                              <span className="mr-1.5">{ICONS_MAP[item] || '⚕️'}</span>{item}
                            </button>
                        ))}
                      </div>
                      <input type="text" placeholder="Other comorbidities..." className="w-full p-2 bg-white border border-gray-300 rounded-md text-sm" value={editableEmployee.otherComorbidities} onChange={e => setEditableEmployee({...editableEmployee, otherComorbidities: e.target.value})} />
                   </div>
                )}
              </div>
              <div>
                <h4 className="font-bold text-gray-800 mb-2">Past Medical History</h4>
                 {!isEditing ? (
                    <>
                      {editableEmployee.pastMedicalHistory.length > 0 ? <ul className="list-disc pl-5 space-y-1 text-gray-700">{editableEmployee.pastMedicalHistory.map(c => <li key={c}>{c}</li>)}</ul> : <span className="text-gray-400 italic">None listed</span>}
                      {editableEmployee.otherPastMedicalHistory && <p className="mt-2 text-sm text-gray-600">Other: {editableEmployee.otherPastMedicalHistory}</p>}
                    </>
                 ) : (
                    <div className="bg-gray-50 p-4 rounded-lg border">
                      <div className="grid grid-cols-2 gap-2 mb-3">
                        {PAST_MEDICAL_HISTORY.map(item => (
                          <label key={item} className="flex items-center space-x-2 p-1.5 rounded hover:bg-gray-100 cursor-pointer">
                            <input type="checkbox" checked={editableEmployee.pastMedicalHistory?.includes(item)} onChange={() => toggleHistory(item)} className="rounded text-osmak-green focus:ring-osmak-green"/>
                            <span className="text-sm">{item}</span>
                          </label>
                        ))}
                      </div>
                      <input type="text" placeholder="Other past history..." className="w-full p-2 bg-white border border-gray-300 rounded-md text-sm" value={editableEmployee.otherPastMedicalHistory} onChange={e => setEditableEmployee({...editableEmployee, otherPastMedicalHistory: e.target.value})} />
                    </div>
                 )}
              </div>
              <div>
                <h4 className="font-bold text-gray-800 mb-2 flex items-center gap-2"><Pill size={18} className="text-blue-500"/> Maintenance Meds</h4>
                {!isEditing ? (
                  editableEmployee.maintenanceMeds && editableEmployee.maintenanceMeds.length > 0 ? <ul className="bg-yellow-50 p-3 rounded text-gray-700 border border-yellow-100 space-y-1">{editableEmployee.maintenanceMeds.map((med, i) => <li key={i}>{med}</li>)}</ul> : <p className="text-gray-400 italic">None</p>
                ) : (
                   <div className="bg-gray-50 p-4 rounded-lg border">
                      <div className="flex gap-2 mb-3">
                        <input type="text" className="flex-1 p-2 bg-white border border-gray-300 rounded-md text-sm" placeholder="Add medication..." value={currentMed} onChange={e => setCurrentMed(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addMedication())} />
                        <button type="button" onClick={addMedication} className="bg-osmak-green text-white px-3 py-1 rounded-md hover:bg-osmak-green-dark flex items-center gap-1 text-sm"><Plus size={16} /> Add</button>
                      </div>
                      <ul className="space-y-1">
                        {editableEmployee.maintenanceMeds?.map((med, idx) => (
                          <li key={idx} className="flex justify-between items-center bg-white p-1.5 px-2 rounded border text-sm">
                            <span>{med}</span><button type="button" onClick={() => removeMedication(idx)} className="text-red-500 hover:text-red-700 p-0.5"><Trash2 size={14} /></button>
                          </li>
                        ))}
                      </ul>
                   </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'trackers' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* HTN Tracker */}
                <div className="space-y-4">
                   <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2"><HeartPulse className="text-red-500"/> Hypertension (BP) Tracker</h3>
                   <div className="bg-gray-50 p-4 rounded-lg border">
                      <div className="grid grid-cols-3 gap-2 mb-2">
                        <input type="number" placeholder="SYS" className="p-2 border rounded-md text-sm" value={systolic} onChange={e => setSystolic(e.target.value)} />
                        <input type="number" placeholder="DIA" className="p-2 border rounded-md text-sm" value={diastolic} onChange={e => setDiastolic(e.target.value)} />
                        <input type="number" placeholder="Pulse" className="p-2 border rounded-md text-sm" value={heartRate} onChange={e => setHeartRate(e.target.value)} />
                      </div>
                      <button onClick={handleAddBp} className="w-full bg-red-500 text-white font-semibold py-2 rounded-md hover:bg-red-600">Add BP Reading</button>
                   </div>
                   <div className="max-h-60 overflow-y-auto border rounded-md p-2">
                      {[...(editableEmployee.hypertensionHistory || [])].reverse().map((rec, i) => {
                          const isHigh = rec.systolic >= 130 || rec.diastolic >= 80;
                          return (
                            <div key={i} className={`p-2 border-b flex justify-between items-center text-sm ${isHigh ? 'bg-red-50' : ''}`}>
                              <span className="text-gray-500">{rec.date}</span>
                              <span className={`font-bold ${isHigh ? 'text-red-600' : 'text-gray-800'}`}>{rec.systolic} / {rec.diastolic}</span>
                              <span className="text-gray-500">{rec.heartRate ? `${rec.heartRate} bpm` : ''}</span>
                            </div>
                          )
                      })}
                   </div>
                </div>

                {/* Diabetes Tracker */}
                <div className="space-y-4">
                   <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2"><Droplets className="text-blue-500"/> Diabetes Tracker</h3>
                   <div className="bg-gray-50 p-4 rounded-lg border">
                      <div className="flex gap-2 mb-2">
                        <select className="p-2 border rounded-md text-sm" value={readingType} onChange={e => setReadingType(e.target.value as any)}>
                            <option value="FBS">FBS (mg/dL)</option>
                            <option value="HbA1c">HbA1c (%)</option>
                        </select>
                        <input type="number" step="0.1" placeholder="Value" className="flex-1 p-2 border rounded-md text-sm" value={readingValue} onChange={e => setReadingValue(e.target.value)} />
                      </div>
                      <button onClick={handleAddDiabetes} className="w-full bg-blue-500 text-white font-semibold py-2 rounded-md hover:bg-blue-600">Add Reading</button>
                   </div>
                   <div className="max-h-60 overflow-y-auto border rounded-md p-2">
                      {[...(editableEmployee.diabetesHistory || [])].reverse().map((rec, i) => {
                          const isFbsHigh = rec.type === 'FBS' && rec.value >= 126;
                          const isHba1cHigh = rec.type === 'HbA1c' && rec.value >= 6.5;
                          const isHigh = isFbsHigh || isHba1cHigh;
                          return (
                             <div key={i} className={`p-2 border-b flex justify-between items-center text-sm ${isHigh ? 'bg-orange-50' : ''}`}>
                               <span className="text-gray-500">{rec.date}</span>
                               <span className="font-medium text-gray-600">{rec.type}</span>
                               <span className={`font-bold ${isHigh ? 'text-orange-600' : 'text-gray-800'}`}>{rec.value} {rec.type === 'HbA1c' ? '%' : 'mg/dL'}</span>
                             </div>
                          )
                      })}
                   </div>
                </div>

                {/* Weight Tracker */}
                <div className="space-y-4 lg:col-span-2 pt-4 border-t">
                  <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2"><Scale className="text-indigo-500"/> Weight Tracker</h3>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100">
                         <p className="text-sm text-indigo-800">Latest Weight</p>
                         <p className="text-3xl font-bold text-indigo-900">{latestWeight?.weight || 'N/A'} <span className="text-lg font-normal">kg</span></p>
                         <p className="text-xs text-indigo-600">as of {latestWeight?.date || 'N/A'}</p>
                         <div className="flex gap-2 mt-4">
                            <input type="number" step="0.1" placeholder="New weight (kg)" className="w-full bg-white border border-gray-300 text-gray-900 p-2 rounded text-sm" value={newWeight} onChange={e => setNewWeight(e.target.value)} />
                            <button onClick={handleAddNewWeight} className="bg-indigo-500 text-white px-4 rounded hover:bg-indigo-600 text-sm font-semibold">Add</button>
                         </div>
                     </div>
                     <div className="max-h-48 overflow-y-auto border rounded-md bg-gray-50">
                        <h4 className="font-semibold p-2 bg-white border-b sticky top-0">History</h4>
                         {editableEmployee.weightHistory?.length > 0 ? (
                            <ul className="divide-y">
                                {[...editableEmployee.weightHistory].reverse().map((rec, i) => (
                                  <li key={i} className="flex justify-between p-2 text-sm">
                                      <span className="text-gray-500">{rec.date}</span>
                                      <span className="font-bold text-gray-800">{rec.weight} kg</span>
                                  </li>
                                ))}
                            </ul>
                         ) : <p className="p-4 text-sm text-gray-400 italic">No weight history.</p>}
                     </div>
                   </div>
                </div>
            </div>
          )}
          
          {activeTab === 'logs' && (
             <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3"><Stethoscope className="text-osmak-green" /><div><h4 className="font-bold">Annual Physical Exam</h4><p className="text-sm text-gray-500">{isApeCurrent ? `Completed for ${currentYear}` : `Action required for ${currentYear}`}</p></div></div>
                {!isApeCurrent ? <button onClick={handleMarkAPE} className="bg-osmak-green text-white px-4 py-2 rounded shadow hover:bg-osmak-green-dark">Mark as DONE</button> : <span className="text-green-600 font-bold">Completed on {editableEmployee.apeDate}</span>}
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3"><Utensils className="text-orange-500" /><div><h4 className="font-bold">Nutrition Management</h4><p className="text-sm text-gray-500">Referral for dietary counseling</p></div></div>
                {editableEmployee.nutritionReferral ? <span className="text-orange-600 font-bold">Referred on {editableEmployee.nutritionReferralDate}</span> : <button onClick={handleNutritionReferral} className="bg-orange-500 text-white px-4 py-2 rounded shadow hover:bg-orange-600">Refer Now</button>}
              </div>
              <div className="border rounded-lg p-4"><h4 className="font-bold mb-3 flex items-center gap-2"><BookHeart size={16} /> Record Sick Leave</h4><div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-3"><div><label className="text-xs text-gray-500">From</label><input type="date" className="w-full bg-white border border-gray-300 text-gray-900 p-2 rounded text-sm" value={sickStartDate} onChange={e => setSickStartDate(e.target.value)} /></div><div><label className="text-xs text-gray-500">To</label><input type="date" className="w-full bg-white border border-gray-300 text-gray-900 p-2 rounded text-sm" value={sickEndDate} onChange={e => setSickEndDate(e.target.value)} /></div><div className="md:col-span-2"><label className="text-xs text-gray-500">Reason</label><div className="flex gap-2"><input type="text" placeholder="Diagnosis" className="w-full bg-white border border-gray-300 text-gray-900 p-2 rounded text-sm" value={sickDiagnosis} onChange={e => setSickDiagnosis(e.target.value)} /><button onClick={() => addRecord('sick')} className="bg-gray-800 text-white px-4 rounded hover:bg-black text-sm">Add</button></div></div></div><div className="max-h-32 overflow-y-auto">{editableEmployee.sickLeaves.map((sl, i) => <div key={i} className="text-sm border-b py-1 flex justify-between"><span className="text-gray-600">{sl.startDate} to {sl.endDate}</span><span className="font-medium">{sl.diagnosis}</span></div>)}</div></div>
              <div className="border rounded-lg p-4 border-red-100 bg-red-50"><h4 className="font-bold mb-3 flex items-center gap-2 text-red-700"><Activity size={16} /> Record Hospital Admission</h4><div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-3"><div><label className="text-xs text-red-500">From</label><input type="date" className="w-full bg-white border border-gray-300 text-gray-900 p-2 rounded text-sm" value={admitStartDate} onChange={e => setAdmitStartDate(e.target.value)} /></div><div><label className="text-xs text-red-500">To</label><input type="date" className="w-full bg-white border border-gray-300 text-gray-900 p-2 rounded text-sm" value={admitEndDate} onChange={e => setAdmitEndDate(e.target.value)} /></div><div className="md:col-span-2"><label className="text-xs text-red-500">Reason</label><div className="flex gap-2"><input type="text" placeholder="Admitting Diagnosis" className="w-full bg-white border border-gray-300 text-gray-900 p-2 rounded text-sm" value={admitDiagnosis} onChange={e => setAdmitDiagnosis(e.target.value)} /><button onClick={() => addRecord('admission')} className="bg-red-600 text-white px-4 rounded hover:bg-red-700 text-sm">Add</button></div></div></div><div className="max-h-32 overflow-y-auto">{editableEmployee.admissions.map((ad, i) => <div key={i} className="text-sm border-b border-red-200 py-1 flex justify-between"><span className="text-gray-600">{ad.startDate} to {ad.endDate}</span><span className="font-medium">{ad.diagnosis}</span></div>)}</div></div>
              <div className="border rounded-lg p-4 border-blue-100 bg-blue-50"><h4 className="font-bold mb-3 flex items-center gap-2 text-blue-700"><AlertTriangle size={16} /> Record ER Visit</h4><div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-3"><div><label className="text-xs text-blue-500">From</label><input type="date" className="w-full bg-white border border-gray-300 text-gray-900 p-2 rounded text-sm" value={erStartDate} onChange={e => setErStartDate(e.target.value)} /></div><div><label className="text-xs text-blue-500">To</label><input type="date" className="w-full bg-white border border-gray-300 text-gray-900 p-2 rounded text-sm" value={erEndDate} onChange={e => setErEndDate(e.target.value)} /></div><div className="md:col-span-2"><label className="text-xs text-blue-500">Reason</label><div className="flex gap-2"><input type="text" placeholder="Diagnosis / Reason" className="w-full bg-white border border-gray-300 text-gray-900 p-2 rounded text-sm" value={erDiagnosis} onChange={e => setErDiagnosis(e.target.value)} /><button onClick={() => addRecord('er')} className="bg-blue-600 text-white px-4 rounded hover:bg-blue-700 text-sm">Add</button></div></div></div><div className="max-h-32 overflow-y-auto">{editableEmployee.erVisits?.map((er, i) => <div key={i} className="text-sm border-b border-blue-200 py-1 flex justify-between"><span className="text-gray-600">{er.startDate} to {er.endDate}</span><span className="font-medium">{er.diagnosis}</span></div>)}</div></div>
            </div>
          )}

          {activeTab === 'remove' && (
              <div className="p-6 bg-red-50 rounded-lg border border-red-200 text-center">
                  <Trash2 className="mx-auto text-red-500 mb-4" size={48} />
                  <h3 className="text-xl font-bold text-red-700 mb-2">Remove Employee from Active Roster</h3>
                  <p className="text-red-600 mb-6">This action will change the employee status. Please specify the reason.</p>
                  
                  <div className="max-w-md mx-auto space-y-4">
                      <select 
                        className="w-full p-2 bg-white border border-red-300 text-gray-900 rounded focus:ring-1 focus:ring-red-500 focus:border-red-500"
                        value={removalStatus}
                        onChange={(e) => setRemovalStatus(e.target.value as EmploymentStatus)}
                      >
                          <option value="Resigned">Resigned</option>
                          <option value="Retired">Retired</option>
                          <option value="Expired">Expired</option>
                          <option value="Other">Other</option>
                      </select>
                      <input 
                        type="text" 
                        placeholder="Specify reason..." 
                        className="w-full p-2 bg-white border border-red-300 text-gray-900 rounded focus:ring-1 focus:ring-red-500 focus:border-red-500"
                        value={removalReason}
                        onChange={e => setRemovalReason(e.target.value)}
                      />
                      <button 
                        onClick={handleRemoveEmployee}
                        className="w-full bg-red-600 text-white py-3 rounded font-bold hover:bg-red-700 transition"
                      >
                          Confirm Removal
                      </button>
                  </div>
              </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployeeModal;
