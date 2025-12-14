import React, { useEffect, useState } from 'react';
import { EmployeeService } from '../services/api';
import { Employee } from '../types';
import EmployeeModal from '../components/EmployeeModal';
import { Search, Filter, RefreshCw, AlertTriangle } from 'lucide-react';
import { DIVISIONS, COMORBIDITIES_COMMON } from '../constants';

interface DashboardProps {
  employees: Employee[];
  loading: boolean;
  error: string | null;
  onRefresh: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ employees, loading, error, onRefresh }) => {
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  // Filters state
  const [search, setSearch] = useState('');
  const [filterDivision, setFilterDivision] = useState<string>('All');
  const [filterApe, setFilterApe] = useState<string>('All');
  const [filterComorbidity, setFilterComorbidity] = useState<string>('All');

  // Compute APE status dynamically
  const getDynamicApeStatus = (emp: Employee) => {
    const currentYear = new Date().getFullYear();
    const apeYear = emp.apeDate ? new Date(emp.apeDate).getFullYear() : 0;
    return (emp.apeStatus === 'Done' && apeYear === currentYear) ? 'Done' : 'Pending';
  };

  const handleToggleApe = async (emp: Employee) => {
    const currentStatus = getDynamicApeStatus(emp);
    
    if (currentStatus === 'Pending') {
      const today = new Date().toISOString().split('T')[0];
      const updatedEmployee = { ...emp, apeStatus: 'Done' as const, apeDate: today };
      await EmployeeService.update(updatedEmployee);
    } else { // currentStatus is 'Done'
      if (window.confirm('Are you sure you want to undo the APE status for this employee? This will mark it as Pending.')) {
        const updatedEmployee = { ...emp, apeStatus: 'Pending' as const, apeDate: undefined };
        await EmployeeService.update(updatedEmployee);
      }
    }
    onRefresh(); // Trigger global refresh via props
  };

  // Effect to apply filters whenever the source data or filter values change
  useEffect(() => {
    let result = employees;

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(e => 
        e.lastName?.toLowerCase().includes(q) || 
        e.firstName?.toLowerCase().includes(q) ||
        e.hospitalNumber?.toLowerCase().includes(q)
      );
    }

    if (filterDivision !== 'All') {
      result = result.filter(e => e.division === filterDivision);
    }

    if (filterApe !== 'All') {
      result = result.filter(e => getDynamicApeStatus(e) === filterApe);
    }

    if (filterComorbidity !== 'All') {
      result = result.filter(e => e.comorbidities?.includes(filterComorbidity));
    }

    setFilteredEmployees(result);
  }, [employees, search, filterDivision, filterApe, filterComorbidity]);

  const renderLatestVitals = (emp: Employee) => {
    const latestBp = emp.hypertensionHistory && emp.hypertensionHistory.length > 0
        ? [...emp.hypertensionHistory].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0]
        : null;

    const latestDiabetes = emp.diabetesHistory && emp.diabetesHistory.length > 0
        ? [...emp.diabetesHistory].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0]
        : null;
        
    const hasHtn = emp.comorbidities?.includes('Hypertension St II');
    const hasDm = emp.comorbidities?.includes('Type 2 Diabetes Mellitus');

    const vitals = [];

    if (hasHtn && latestBp) {
        const isHigh = latestBp.systolic >= 130 || latestBp.diastolic >= 80;
        vitals.push(
            <div key="bp" className={`text-xs ${isHigh ? 'font-bold text-red-600' : 'text-gray-700'}`}>
                BP: {latestBp.systolic}/{latestBp.diastolic}
            </div>
        );
    }
    
    if (hasDm && latestDiabetes) {
        const isFbsHigh = latestDiabetes.type === 'FBS' && latestDiabetes.value >= 126;
        const isHba1cHigh = latestDiabetes.type === 'HbA1c' && latestDiabetes.value >= 6.5;
        const isHigh = isFbsHigh || isHba1cHigh;
        vitals.push(
             <div key="dm" className={`text-xs ${isHigh ? 'font-bold text-orange-600' : 'text-gray-700'}`}>
                {latestDiabetes.type}: {latestDiabetes.value}
            </div>
        );
    }

    if (vitals.length === 0) {
        return <span className="text-gray-400">-</span>;
    }

    return <div className="space-y-1">{vitals}</div>;
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
           <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
           <p className="text-gray-500">Active Employee Roster: {filteredEmployees.length}</p>
        </div>
        <button onClick={onRefresh} className="flex items-center gap-2 text-osmak-green hover:text-osmak-green-dark">
            <RefreshCw size={18} /> Refresh
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
             <Search className="absolute left-3 top-3 text-gray-500" size={18} />
             <input 
               type="text" 
               placeholder="Search Name or Hosp #" 
               className="w-full pl-10 p-2 bg-white border border-gray-300 text-gray-900 rounded-lg focus:ring-1 focus:ring-osmak-green focus:border-osmak-green"
               value={search}
               onChange={e => setSearch(e.target.value)}
             />
          </div>
          
          <select 
            className="p-2 bg-white border border-gray-300 text-gray-900 rounded-lg focus:ring-1 focus:ring-osmak-green focus:border-osmak-green"
            value={filterDivision}
            onChange={e => setFilterDivision(e.target.value)}
          >
            <option value="All">All Divisions</option>
            {DIVISIONS.map(d => <option key={d} value={d}>{d}</option>)}
          </select>

          <select 
            className="p-2 bg-white border border-gray-300 text-gray-900 rounded-lg focus:ring-1 focus:ring-osmak-green focus:border-osmak-green"
            value={filterApe}
            onChange={e => setFilterApe(e.target.value)}
          >
            <option value="All">All APE Status</option>
            <option value="Done">APE Done ({new Date().getFullYear()})</option>
            <option value="Pending">APE Pending</option>
          </select>

           <select 
            className="p-2 bg-white border border-gray-300 text-gray-900 rounded-lg focus:ring-1 focus:ring-osmak-green focus:border-osmak-green"
            value={filterComorbidity}
            onChange={e => setFilterComorbidity(e.target.value)}
          >
            <option value="All">All Comorbidities</option>
            {COMORBIDITIES_COMMON.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading records...</div>
        ) : error ? (
            <div className="p-8 text-center text-red-600 bg-red-50 flex flex-col items-center gap-4">
                <AlertTriangle size={32} />
                <h3 className="font-bold text-lg">Failed to load data</h3>
                <p className="text-sm">{error}</p>
                <p className="text-xs text-gray-500">Please check your Google Sheet connection and try refreshing.</p>
            </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="p-4 font-semibold text-gray-600 text-sm">Hosp #</th>
                  <th className="p-4 font-semibold text-gray-600 text-sm">Employee Name</th>
                  <th className="p-4 font-semibold text-gray-600 text-sm">Division</th>
                  <th className="p-4 font-semibold text-gray-600 text-sm">Age</th>
                  <th className="p-4 font-semibold text-gray-600 text-sm">Comorbidities</th>
                  <th className="p-4 font-semibold text-gray-600 text-sm">Latest Vitals</th>
                  <th className="p-4 font-semibold text-gray-600 text-sm">APE Status</th>
                  <th className="p-4 font-semibold text-gray-600 text-sm">APE Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredEmployees.map(emp => {
                  const dynamicApe = getDynamicApeStatus(emp);
                  return (
                    <tr 
                      key={emp.id} 
                      onClick={() => setSelectedEmployee(emp)}
                      className="hover:bg-green-50 transition-colors cursor-pointer"
                    >
                      <td className="p-4 text-sm font-medium text-gray-800">{emp.hospitalNumber}</td>
                      <td className="p-4 text-sm text-gray-800 font-medium">{emp.lastName}, {emp.firstName}</td>
                      <td className="p-4 text-sm text-gray-600">{emp.division}</td>
                      <td className="p-4 text-sm text-gray-600">{emp.age}</td>
                      <td className="p-4 text-sm text-gray-600 max-w-xs truncate">
                        {emp.comorbidities?.join(', ') || '-'}
                      </td>
                      <td className="p-4">
                        {renderLatestVitals(emp)}
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                          dynamicApe === 'Done' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {dynamicApe}
                        </span>
                      </td>
                      <td className="p-4">
                          <button
                            onClick={(e) => {
                                e.stopPropagation(); // Prevent modal from opening
                                handleToggleApe(emp);
                            }}
                            className={`px-3 py-1 text-xs font-medium rounded-md shadow-sm transition-colors ${
                                dynamicApe === 'Done' 
                                ? 'bg-yellow-400 hover:bg-yellow-500 text-white' 
                                : 'bg-osmak-green hover:bg-osmak-green-dark text-white'
                            }`}
                        >
                            {dynamicApe === 'Done' ? 'Undo' : 'Mark Done'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
                {filteredEmployees.length === 0 && !loading && (
                   <tr>
                    <td colSpan={8} className="p-8 text-center text-gray-400">No employees found matching criteria.</td>
                   </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selectedEmployee && (
        <EmployeeModal 
          employee={selectedEmployee} 
          onClose={() => setSelectedEmployee(null)} 
          onUpdate={() => {
              onRefresh();
              setSelectedEmployee(null);
          }}
        />
      )}
    </div>
  );
};

export default Dashboard;
