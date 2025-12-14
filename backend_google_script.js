// ==========================================
// PASTE THIS INTO EXTENSIONS > APPS SCRIPT
// AND DEPLOY AS A WEB APP
// ==========================================

// This function is useful for the initial setup. 
// You can run it manually from the Apps Script editor via Run > initialSetup
function initialSetup() {
  setupSheet();
}

// This is the entry point for GET requests.
// It can be used to check if the script is deployed and running.
function doGet() {
  return ContentService.createTextOutput("Backend is active. Use POST requests for API calls.");
}

// This is the main entry point for all API calls from the frontend.
function doPost(e) {
  try {
    const request = JSON.parse(e.postData.contents);
    let responseData;

    if (!request.action) {
      throw new Error("API action not specified in request.");
    }

    switch (request.action) {
      case 'getEmployees':
        // Pass forceRefresh parameter from the payload to the function
        responseData = getEmployees(request.payload && request.payload.forceRefresh);
        break;
      case 'addEmployee':
        responseData = addEmployee(request.payload);
        break;
      case 'updateEmployee':
        responseData = updateEmployee(request.payload);
        break;
      case 'removeEmployee':
        const { id, reason, status } = request.payload;
        responseData = removeEmployee(id, reason, status);
        break;
      default:
        throw new Error("Invalid action specified: " + request.action);
    }

    const response = { success: true, data: responseData };
    return ContentService
      .createTextOutput(JSON.stringify(response))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    Logger.log(error.stack); // Log stack for better debugging
    const response = { success: false, error: error.message };
    return ContentService
      .createTextOutput(JSON.stringify(response))
      .setMimeType(ContentService.MimeType.JSON);
  }
}


// ==========================================
// HELPER FUNCTIONS
// ==========================================

function getSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  if (!ss) {
    throw new Error("Could not get active spreadsheet. Is the script bound to a sheet?");
  }
  const sheet = ss.getSheetByName('Employees');
  if (!sheet) {
    throw new Error("Sheet 'Employees' not found. Please run the 'initialSetup' function from the Apps Script editor to create it.");
  }
  return sheet;
}

function setupSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName('Employees');
  if (!sheet) {
    sheet = ss.insertSheet('Employees');
    const headers = [
      'ID', 'Hospital Number', 'First Name', 'Last Name', 'Middle Initial', 'Sex',
      'DOB', 'Age', 'Division', 'Comorbidities (JSON)', 'Other Comorbidities', 
      'Past Medical History (JSON)', 'Other Past Medical History', 'Maintenance Meds (JSON)', 'APE Date', 'APE Status', 
      'Sick Leaves (JSON)', 'Admissions (JSON)', 'Nutrition Referral', 
      'Nutrition Referral Date', 'Status', 'Status Reason', 'Weight', 'Weight History (JSON)', 'ER Visits (JSON)',
      'Hypertension History (JSON)', 'Diabetes History (JSON)'
    ];
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]).setFontWeight('bold');
    sheet.setFrozenRows(1);
  }
}

function employeeToRow(emp) {
  // The order of this array MUST EXACTLY MATCH the order of headers in setupSheet()
  return [
    emp.id || Utilities.getUuid(),
    emp.hospitalNumber,
    emp.firstName,
    emp.lastName,
    emp.middleInitial,
    emp.sex,
    emp.dob,
    emp.age,
    emp.division,
    JSON.stringify(emp.comorbidities || []),
    emp.otherComorbidities || '',
    JSON.stringify(emp.pastMedicalHistory || []),
    emp.otherPastMedicalHistory || '',
    JSON.stringify(emp.maintenanceMeds || []),
    emp.apeDate || '',
    emp.apeStatus,
    JSON.stringify(emp.sickLeaves || []),
    JSON.stringify(emp.admissions || []),
    emp.nutritionReferral,
    emp.nutritionReferralDate || '',
    emp.status,
    emp.statusReason || '',
    emp.weight || '',
    JSON.stringify(emp.weightHistory || []),
    JSON.stringify(emp.erVisits || []),
    JSON.stringify(emp.hypertensionHistory || []),
    JSON.stringify(emp.diabetesHistory || [])
  ];
}


function getEmployees(forceRefresh = false) {
  const cache = CacheService.getScriptCache();
  const cacheKey = 'employee_data_json';

  // If not forcing a refresh, try to get data from cache
  if (!forceRefresh) {
    const cachedData = cache.get(cacheKey);
    if (cachedData != null) {
      Logger.log("Serving from cache.");
      return JSON.parse(cachedData);
    }
  }

  Logger.log("Serving from sheet.");
  const sheet = getSheet();
  if (sheet.getLastRow() < 2) return [];
  
  const values = sheet.getDataRange().getValues();
  const headers = values.shift(); // Get and remove header row
  
  const headerToKeyMap = {
    'ID': 'id', 'Hospital Number': 'hospitalNumber', 'First Name': 'firstName', 'Last Name': 'lastName', 
    'Middle Initial': 'middleInitial', 'Sex': 'sex', 'DOB': 'dob', 'Age': 'age', 'Division': 'division', 
    'Comorbidities (JSON)': 'comorbidities', 'Other Comorbidities': 'otherComorbidities', 
    'Past Medical History (JSON)': 'pastMedicalHistory', 'Other Past Medical History': 'otherPastMedicalHistory', 
    'Maintenance Meds (JSON)': 'maintenanceMds', 'APE Date': 'apeDate', 'APE Status': 'apeStatus', 
    'Sick Leaves (JSON)': 'sickLeaves', 'Admissions (JSON)': 'admissions', 'Nutrition Referral': 'nutritionReferral', 
    'Nutrition Referral Date': 'nutritionReferralDate', 'Status': 'status', 'Status Reason': 'statusReason', 
    'Weight': 'weight', 'Weight History (JSON)': 'weightHistory', 'ER Visits (JSON)': 'erVisits', 
    'Hypertension History (JSON)': 'hypertensionHistory', 'Diabetes History (JSON)': 'diabetesHistory'
  };

  const employees = values.map(row => {
    const employee = {};
    headers.forEach((header, i) => {
        const key = headerToKeyMap[header.trim()];
        if (!key) return;

        let value = row[i];

        if (header.includes('(JSON)')) {
            try { value = (value && typeof value === 'string') ? JSON.parse(value) : []; } catch (e) { value = []; }
        } else if (key === 'age' || key === 'weight') { value = value ? parseFloat(value) : undefined;
        } else if (key === 'nutritionReferral') { value = value === true || String(value).toLowerCase() === 'true';
        } else if (value instanceof Date) { value = value.toISOString().split('T')[0]; }
        
        employee[key] = value;
    });

    employee.comorbidities = employee.comorbidities || [];
    employee.pastMedicalHistory = employee.pastMedicalHistory || [];
    employee.maintenanceMeds = employee.maintenanceMeds || [];
    employee.sickLeaves = employee.sickLeaves || [];
    employee.admissions = employee.admissions || [];
    employee.erVisits = employee.erVisits || [];
    employee.weightHistory = employee.weightHistory || [];
    employee.hypertensionHistory = employee.hypertensionHistory || [];
    employee.diabetesHistory = employee.diabetesHistory || [];
    return employee;
  });

  // Store the processed data in cache for 10 minutes (600 seconds)
  const jsonData = JSON.stringify(employees);
  cache.put(cacheKey, jsonData, 600);

  return employees;
}


function addEmployee(emp) {
  const sheet = getSheet();
  const newRow = employeeToRow(emp);
  sheet.appendRow(newRow);
  CacheService.getScriptCache().remove('employee_data_json'); // Invalidate cache
  return { status: "success", message: "Employee added." };
}

function updateEmployee(emp) {
  const sheet = getSheet();
  const dataRange = sheet.getDataRange();
  const values = dataRange.getValues();
  const headers = values[0];
  const idIndex = headers.indexOf('ID');
  if (idIndex === -1) throw new Error("ID column not found in sheet.");
  const rowIndex = values.findIndex(row => row[idIndex] == emp.id);

  if (rowIndex > 0) {
    const rowInSheet = rowIndex + 1; 
    const updatedRow = employeeToRow(emp);
    sheet.getRange(rowInSheet, 1, 1, updatedRow.length).setValues([updatedRow]);
    CacheService.getScriptCache().remove('employee_data_json'); // Invalidate cache
    return { status: 'success', message: 'Employee updated.' };
  }
  throw new Error('Employee not found to update.');
}

function removeEmployee(id, reason, status) {
  const sheet = getSheet();
  const dataRange = sheet.getDataRange();
  const values = dataRange.getValues();
  const headers = values[0];
  const idIndex = headers.indexOf('ID');
  const statusIndex = headers.indexOf('Status');
  const reasonIndex = headers.indexOf('Status Reason');
  if (idIndex === -1 || statusIndex === -1 || reasonIndex === -1) {
      throw new Error("A required column (ID, Status, or Status Reason) was not found.");
  }
  const rowIndex = values.findIndex(row => row[idIndex] == id);
  if (rowIndex > 0) {
    const rowInSheet = rowIndex + 1;
    sheet.getRange(rowInSheet, statusIndex + 1).setValue(status);
    sheet.getRange(rowInSheet, reasonIndex + 1).setValue(reason);
    CacheService.getScriptCache().remove('employee_data_json'); // Invalidate cache
    return { status: 'success', message: `Employee ${id} status updated to ${status}.` };
  }
  throw new Error('Employee not found to remove.');
}