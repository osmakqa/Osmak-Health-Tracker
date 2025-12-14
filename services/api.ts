import { Employee } from '../types';
import { MOCK_EMPLOYEES } from './mockData';
import { USE_MOCK_DATA, SCRIPT_URL } from '../constants';

// --- Client-Side Caching Service ---
interface CachedData {
  timestamp: number;
  data: Employee[];
}
const CACHE_KEY = 'employee_data';
const CACHE_DURATION_MS = 10 * 60 * 1000; // 10 minutes

export const CacheService = {
  get: (): Employee[] | null => {
    const cachedItem = localStorage.getItem(CACHE_KEY);
    if (!cachedItem) return null;

    try {
      const { timestamp, data }: CachedData = JSON.parse(cachedItem);
      const isCacheValid = (new Date().getTime() - timestamp) < CACHE_DURATION_MS;
      return isCacheValid ? data : null;
    } catch (e) {
      console.error("Failed to parse cache", e);
      return null;
    }
  },
  set: (data: Employee[]): void => {
    try {
      const item: CachedData = {
        timestamp: new Date().getTime(),
        data,
      };
      localStorage.setItem(CACHE_KEY, JSON.stringify(item));
    } catch (e) {
      console.error("Failed to set cache", e);
    }
  },
  clear: (): void => {
    localStorage.removeItem(CACHE_KEY);
  }
};
// ------------------------------------

// In-memory store for mock mode
let localEmployees = [...MOCK_EMPLOYEES];

// Helper function for API calls to Google Apps Script
const callAppsScript = async (action: string, payload?: any) => {
  // Fix: The comparison against a placeholder URL was removed as it caused a TypeScript error
  // when SCRIPT_URL is correctly configured with a real URL. The check for an empty URL is sufficient.
  if (!SCRIPT_URL) {
      throw new Error("Backend URL not configured. Please deploy the Apps Script and update SCRIPT_URL in constants.ts");
  }
  
  const res = await fetch(SCRIPT_URL, {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'text/plain;charset=utf-8',
    },
    body: JSON.stringify({ action, payload }),
  });

  const result = await res.json();

  if (!result.success) {
    throw new Error(result.error || 'An unknown error occurred with the backend.');
  }

  return result.data;
};


export const EmployeeService = {
  getAll: async (forceRefresh: boolean = false): Promise<Employee[]> => {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return [...localEmployees];
    } else {
      return callAppsScript('getEmployees', { forceRefresh });
    }
  },

  add: async (employee: Employee): Promise<void> => {
    if (USE_MOCK_DATA) {
      localEmployees.push({ ...employee, id: Math.random().toString(36).substr(2, 9) });
    } else {
       await callAppsScript('addEmployee', employee);
    }
    CacheService.clear(); // Invalidate cache on change
  },

  update: async (employee: Employee): Promise<void> => {
    if (USE_MOCK_DATA) {
      const index = localEmployees.findIndex(e => e.id === employee.id);
      if (index !== -1) {
        localEmployees[index] = employee;
      }
    } else {
      await callAppsScript('updateEmployee', employee);
    }
    CacheService.clear(); // Invalidate cache on change
  },

  remove: async (id: string, reason: string, status: string): Promise<void> => {
    if (USE_MOCK_DATA) {
        const index = localEmployees.findIndex(e => e.id === id);
        if (index !== -1) {
            localEmployees[index] = {
                ...localEmployees[index],
                status: status as any,
                statusReason: reason
            };
        }
    } else {
        await callAppsScript('removeEmployee', { id, reason, status });
    }
    CacheService.clear(); // Invalidate cache on change
  }
};