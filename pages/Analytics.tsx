import React, { useState, useMemo, ComponentProps } from 'react';
import { Employee } from '../types';
import { COMORBIDITIES_COMMON, DIVISIONS } from '../constants';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, Sector } from 'recharts';
import { XCircle, Users, Target, HeartPulse, CalendarDays } from 'lucide-react';

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const name = data.fullName || data.name || label;
    const value = payload[0].value;
    return (
      <div className="bg-gray-800 text-white p-2 rounded-md shadow-lg border border-gray-700 text-sm">
        <p className="font-bold">{`${name}: ${value}`}</p>
      </div>
    );
  }
  return null;
};

const renderActiveShape = (props: any) => {
  const RADIAN = Math.PI / 180;
  const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + (outerRadius + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? 'start' : 'end';

  return (
    <g>
      <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill} className="font-bold text-lg">
        {payload.name}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill}
      />
      <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#333">{`Count: ${value}`}</text>
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#999">
        {`(Rate: ${(percent * 100).toFixed(2)}%)`}
      </text>
    </g>
  );
};

const PieWithActiveIndex = Pie as React.ComponentType<ComponentProps<typeof Pie> & { activeIndex: number }>;

interface AnalyticsProps {
  employees: Employee[];
  loading: boolean;
}

const Analytics: React.FC<AnalyticsProps> = ({ employees, loading }) => {
  // Global Filters
  const [filterDivision, setFilterDivision] = useState('All');
  const [filterAgeGroup, setFilterAgeGroup] = useState('All');
  const [filterSex, setFilterSex] = useState('All');
  
  // Interactive Filters for charts
  const [interactiveFilter, setInteractiveFilter] = useState<{type: string, value: string} | null>(null);
  const [activePieIndex, setActivePieIndex] = useState(0);
  
  const currentYear = new Date().getFullYear();
  const getApeStatus = (e: Employee) => (e.apeStatus === 'Done' && e.apeDate && new Date(e.apeDate).getFullYear() === currentYear) ? 'Done' : 'Pending';
  
  const handleChartClick = (type: string, value: string) => {
    if (interactiveFilter?.type === type && interactiveFilter?.value === value) {
        setInteractiveFilter(null); // Click again to reset
    } else {
        setInteractiveFilter({ type, value });
    }
  };

  // Base filtering from dropdowns
  const baseFilteredEmployees = useMemo(() => employees.filter(emp => {
    if (filterDivision !== 'All' && emp.division !== filterDivision) return false;
    if (filterSex !== 'All' && emp.sex !== filterSex) return false;
    if (filterAgeGroup !== 'All') {
       if (filterAgeGroup === '<30' && emp.age >= 30) return false;
       if (filterAgeGroup === '30-45' && (emp.age < 30 || emp.age > 45)) return false;
       if (filterAgeGroup === '46-59' && (emp.age < 46 || emp.age > 59)) return false;
       if (filterAgeGroup === '60+' && emp.age < 60) return false;
    }
    return true;
  }), [employees, filterDivision, filterAgeGroup, filterSex]);

  // Secondary filtering from chart clicks
  const finalFilteredEmployees = useMemo(() => {
    if (!interactiveFilter) return baseFilteredEmployees;
    
    return baseFilteredEmployees.filter(emp => {
        switch(interactiveFilter.type) {
            case 'age': return interactiveFilter.value === (emp.age < 30 ? '<30' : emp.age <= 45 ? '30-45' : emp.age <= 59 ? '46-59' : '60+');
            case 'ape': return getApeStatus(emp) === interactiveFilter.value;
            case 'comorbidity': return emp.comorbidities.includes(interactiveFilter.value);
            case 'division': return emp.division === interactiveFilter.value;
            default: return true;
        }
    })
  }, [baseFilteredEmployees, interactiveFilter]);

  // Data for charts derived from final filtered employees
  const comorbidityData = useMemo(() => COMORBIDITIES_COMMON.map(c => ({
    name: c.replace(/St II|Mellitus/g, '').trim(), 
    fullName: c,
    count: finalFilteredEmployees.filter(e => e.comorbidities.includes(c)).length
  })).filter(d => d.count > 0).sort((a,b) => b.count - a.count), [finalFilteredEmployees]);
  
  const stats = useMemo(() => {
    const total = finalFilteredEmployees.length;
    if (total === 0) {
      return {
        totalEmployees: 0,
        apePercentage: 0,
        averageAge: 'N/A',
        topComorbidity: { name: 'N/A', count: 0 },
      };
    }

    const apeDoneCount = finalFilteredEmployees.filter(e => getApeStatus(e) === 'Done').length;
    const apePercentage = (apeDoneCount / total) * 100;

    const totalAge = finalFilteredEmployees.reduce((sum, e) => sum + (e.age || 0), 0);
    const averageAge = (totalAge / total).toFixed(1);

    const topComorbidity = comorbidityData.length > 0
      ? { name: comorbidityData[0].fullName, count: comorbidityData[0].count }
      : { name: 'None', count: 0 };

    return {
      totalEmployees: total,
      apePercentage: Math.round(apePercentage),
      averageAge,
      topComorbidity,
    };
  }, [finalFilteredEmployees, comorbidityData]);

  const ageChartData = useMemo(() => {
    const groups = { '<30': 0, '30-45': 0, '46-59': 0, '60+': 0 };
    baseFilteredEmployees.forEach(e => {
        if (e.age < 30) groups['<30']++;
        else if (e.age <= 45) groups['30-45']++;
        else if (e.age <= 59) groups['46-59']++;
        else groups['60+']++;
    });
    return Object.entries(groups).map(([name, value]) => ({ name, value }));
  }, [baseFilteredEmployees]);

  const apeData = useMemo(() => [
    { name: 'Done', value: finalFilteredEmployees.filter(e => getApeStatus(e) === 'Done').length },
    { name: 'Pending', value: finalFilteredEmployees.filter(e => getApeStatus(e) === 'Pending').length },
  ], [finalFilteredEmployees]);
  
  if (loading) return <div className="p-8 text-center">Loading analytics...</div>;
  
  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
         <h1 className="text-3xl font-bold text-gray-800">Health Analytics</h1>
         <div className="flex flex-wrap gap-2">
           <select className="p-2 bg-white border border-gray-300 text-gray-900 rounded focus:ring-1 focus:ring-osmak-green focus:border-osmak-green" value={filterDivision} onChange={e => setFilterDivision(e.target.value)}>
             <option value="All">All Divisions</option>
             {DIVISIONS.map(d => <option key={d} value={d}>{d}</option>)}
           </select>
           <select className="p-2 bg-white border border-gray-300 text-gray-900 rounded focus:ring-1 focus:ring-osmak-green focus:border-osmak-green" value={filterSex} onChange={e => setFilterSex(e.target.value)}>
             <option value="All">All Sex</option>
             <option value="Male">Male</option>
             <option value="Female">Female</option>
           </select>
           <select className="p-2 bg-white border border-gray-300 text-gray-900 rounded focus:ring-1 focus:ring-osmak-green focus:border-osmak-green" value={filterAgeGroup} onChange={e => setFilterAgeGroup(e.target.value)}>
             <option value="All">All Ages</option>
             <option value="<30">&lt; 30</option>
             <option value="30-45">30 - 45</option>
             <option value="46-59">46 - 59</option>
             <option value="60+">60+</option>
           </select>
         </div>
      </div>
      
      {interactiveFilter ? (
        <div className="bg-yellow-100 border border-yellow-300 text-yellow-800 p-3 rounded-lg flex justify-between items-center text-sm">
            <span>Showing data for: <span className="font-bold">{interactiveFilter.type.replace(/_/g, ' ')}: {interactiveFilter.value}</span></span>
            <button onClick={() => setInteractiveFilter(null)} className="flex items-center gap-1 font-semibold hover:bg-yellow-200 p-1 rounded">
                <XCircle size={16}/> Reset
            </button>
        </div>
      ) : (
         <div className="bg-white p-3 rounded-lg shadow-sm border">
           <p className="text-gray-500 text-sm">Showing data for <span className="font-bold text-osmak-green">{baseFilteredEmployees.length}</span> employees. Click on chart elements to filter.</p>
         </div>
      )}

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl shadow-sm border flex items-center gap-4">
          <div className="p-3 rounded-full bg-blue-100 text-blue-600"><Users size={24}/></div>
          <div>
            <p className="text-3xl font-bold text-gray-800">{stats.totalEmployees}</p>
            <p className="text-sm text-gray-500">Total Employees</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border flex items-center gap-4">
          <div className="p-3 rounded-full bg-green-100 text-green-600"><Target size={24}/></div>
          <div>
            <p className="text-3xl font-bold text-gray-800">{stats.apePercentage}%</p>
            <p className="text-sm text-gray-500">APE Compliance</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border flex items-center gap-4">
          <div className="p-3 rounded-full bg-red-100 text-red-600"><HeartPulse size={24}/></div>
          <div>
            <p className="text-sm font-semibold text-gray-800 truncate" title={stats.topComorbidity.name}>{stats.topComorbidity.name}</p>
            <p className="text-sm text-gray-500">Top Comorbidity ({stats.topComorbidity.count})</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border flex items-center gap-4">
          <div className="p-3 rounded-full bg-yellow-100 text-yellow-600"><CalendarDays size={24}/></div>
          <div>
            <p className="text-3xl font-bold text-gray-800">{stats.averageAge}</p>
            <p className="text-sm text-gray-500">Average Age</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col h-[450px]">
          <h3 className="text-lg font-bold mb-4 text-center text-gray-700">APE Compliance ({currentYear})</h3>
          <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <PieWithActiveIndex
                  activeIndex={activePieIndex}
                  activeShape={renderActiveShape}
                  data={apeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={110}
                  fill="#8884d8"
                  dataKey="value"
                  onMouseEnter={(_, index) => setActivePieIndex(index)}
                >
                  {apeData.map((entry, index) => (
                    <Cell 
                        key={`cell-${index}`} 
                        fill={entry.name === 'Done' ? '#009a3e' : '#dc2626'} 
                        onClick={() => handleChartClick('ape', entry.name)}
                        className="cursor-pointer"
                    />
                  ))}
                </PieWithActiveIndex>
                <Tooltip content={<CustomTooltip />} />
                <Legend iconType="circle" wrapperStyle={{fontSize: "14px"}}/>
              </PieChart>
          </ResponsiveContainer>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col h-[450px]">
          <h3 className="text-lg font-bold mb-4 text-center text-gray-700">Census by Age Group</h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={ageChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="value" name="Count" fill="#8884d8" radius={[4, 4, 0, 0]} onClick={(data) => handleChartClick('age', data.name)} className="cursor-pointer">
                  {ageChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={interactiveFilter?.type === 'age' && interactiveFilter?.value === entry.name ? '#FF8042' : ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'][index % 4]} />
                  ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col h-[450px] lg:col-span-2">
          <h3 className="text-lg font-bold mb-4 text-center text-gray-700">Prevalence of Comorbidities</h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={comorbidityData} layout="vertical" margin={{ left: 50 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" allowDecimals={false} />
              <YAxis dataKey="name" type="category" width={110} tick={{fontSize: 12}} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" fill="#0088FE" radius={[0, 4, 4, 0]} className="cursor-pointer">
                {comorbidityData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={interactiveFilter?.type === 'comorbidity' && interactiveFilter?.value === entry.fullName ? '#FF8042' : '#0088FE'}
                      onClick={() => handleChartClick('comorbidity', entry.fullName)}
                    />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

      </div>
    </div>
  );
};

export default Analytics;
