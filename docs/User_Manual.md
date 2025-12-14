
# User Manual: Employee Health & Wellness Tracker
**Ospital ng Makati – Occupational Health**

---

## 1. System Overview
The **Employee Health & Wellness Tracker** is a web-based application designed to centralize and manage the health records of all Ospital ng Makati employees. It provides tools for tracking medical histories, monitoring chronic conditions, ensuring compliance with annual physical exams (APE), and analyzing population health trends.

---

## 2. Accessing the System
1.  Open your web browser (Chrome is recommended).
2.  Navigate to the system URL provided by the IT or Occupational Health Department.
3.  The system does not require a login. Access is controlled via the unique URL.

### Secret Admin Access
For administrative purposes, direct access to the backend Google Sheet is available.
1.  Click the **Ospital ng Makati logo** in the top-left corner 5 times in quick succession.
2.  An input box will appear. Enter the admin password (`osmak123`).
3.  The Google Sheet will open in a new tab.

---

## 3. Navigating the Application
The application is divided into three main sections, accessible via the sidebar on the left:
*   **Dashboard:** View and manage the list of active employees.
*   **Register Employee:** Add new employees to the system.
*   **Data Analysis:** View charts and statistics about employee health.

---

## 4. Feature Guide

### 4.1 Registering a New Employee
1.  Click **Register Employee** in the sidebar.
2.  Fill out the **Personal Information** section, including Hospital No., Division, Name, DOB, etc. The age will be calculated automatically.
3.  In the **Comorbidities** section, click the buttons to select common conditions. Specify any other conditions in the text box below.
4.  Select known conditions from the **Past Medical History** checklist.
5.  Add any **Maintenance Medications** one by one using the "Add" button.
6.  Click **Register Employee** to save the record. You will be automatically redirected to the Dashboard.

### 4.2 Using the Dashboard
The dashboard displays a table of all **active** employees.

*   **Searching and Filtering:** Use the search bar and dropdown menus at the top to find specific employees or groups (e.g., all employees from the Nursing Division with a pending APE).
*   **Viewing a Profile:** Click anywhere on an employee's row to open their detailed profile in a pop-up window (modal).
*   **Quick APE Action:** Without opening the full profile, you can click the **Mark Done** button in the "APE Action" column to quickly update an employee's APE status for the current year. Click **Undo** to reverse this action if needed.

### 4.3 Managing an Employee's Profile (Modal)
When you click on an employee, a detailed modal appears with four tabs.

#### A. Profile & History Tab
*   This tab shows the core medical information.
*   Click the **Edit Profile** button to modify comorbidities, past history, or maintenance medications. Click **Save Changes** when done.

#### B. Health Trackers Tab
*   This tab is for monitoring ongoing health metrics.
*   **Hypertension (BP) Tracker:** Enter Systolic, Diastolic, and Pulse values and click "Add BP Reading".
*   **Diabetes Tracker:** Select the reading type (FBS or HbA1c), enter the value, and click "Add Reading".
*   **Weight Tracker:** View the latest weight and add a new reading.
*   All readings are added to a historical log visible within each tracker.

#### C. Logs & Actions Tab
*   This tab is for logging events and performing key actions.
*   **Annual Physical Exam:** Click **Mark as DONE** to log the APE for the current year.
*   **Nutrition Management:** Click **Refer Now** to record a nutrition referral.
*   **Record Sick Leave / Admission / ER Visit:** Fill in the start date, end date, and diagnosis for the event and click the corresponding "Add" button. The event will be logged in the history below.

#### D. Status Management Tab
*   This tab is used when an employee leaves the hospital.
*   Select the reason (**Resigned, Retired, Expired, Other**).
*   If "Other" is selected, specify the reason in the text box.
*   Click **Confirm Removal**. The employee will be marked as inactive and will no longer appear on the main dashboard.

### 4.4 Using Data Analysis
1.  Click **Data Analysis** in the sidebar.
2.  Use the dropdown filters at the top to narrow down the data by Division, Sex, or Age Group.
3.  **Stat Cards:** View high-level statistics like total employees, APE compliance rate, and average age.
4.  **Interactive Charts:** The charts display information about APE status, age distribution, and common comorbidities. You can click on parts of the charts (e.g., a specific bar or pie slice) to temporarily filter the entire dashboard to that selection. A yellow notice will appear at the top indicating the active filter. Click **Reset** to remove it.

---

## 5. Troubleshooting

| Issue | Solution |
| :--- | :--- |
| **Data is not loading or seems outdated.** | Click the "Refresh" button on the Dashboard. If the problem persists, contact IT to ensure the Google Apps Script backend is running correctly. |
| **"Failed to load data" error on Dashboard.**| This indicates a problem connecting to the Google Sheet backend. Verify your internet connection and check if the Google Sheet is accessible. |
| **A removed employee still appears.**| Data is cached for performance. Click the "Refresh" button to force an update from the backend. |

