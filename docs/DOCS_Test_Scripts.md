# Verification Record - Test Scripts (ISO 9001:2015 Clause 8.3.4)

**Project:** Employee Health & Wellness Tracker  
**Test Date:** [Insert Date]  
**Tester:** [Insert Name]  

---

| Test ID | Feature Tested | Description / Steps | Expected Result | Actual Result | Pass/Fail |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **TC-001** | **Register Employee** | Navigate to "Register Employee". Fill all required fields, add one comorbidity and one medication. Click "Register". | A success message appears. The user is redirected to the dashboard, and the new employee is visible in the list. | | |
| **TC-002** | **Dashboard Filter** | Go to Dashboard. Select "Nursing Division" from the division filter. | The list should only show employees belonging to the Nursing Division. | | |
| **TC-003** | **APE Quick Action** | On the Dashboard, find an employee with "Pending" APE status. Click the "Mark Done" button. | The button should change to "Undo" and the status badge should update to "Done" without a full page reload. | | |
| **TC-004** | **Open Profile Modal** | Click on any employee row in the dashboard table. | The Employee Profile modal should open, displaying the correct employee's data. | | |
| **TC-005** | **Add BP Reading** | In the modal, go to "Health Trackers". Enter valid Systolic/Diastolic values. Click "Add BP Reading". | The new reading should appear at the top of the history list. The input fields should clear. | | |
| **TC-006** | **Log Sick Leave** | In the modal, go to "Logs & Actions". Fill in dates and diagnosis for a sick leave. Click "Add". | The new sick leave record should appear in the log below the form. | | |
| **TC-007** | **Deactivate Employee** | In the modal, go to "Status Management". Select "Retired" and enter a reason. Click "Confirm Removal". | The modal should close. The employee should no longer appear in the active dashboard list. | | |
| **TC-008** | **Analytics Chart** | Go to "Data Analysis". The page should load charts. Click on a bar in the "Age Group" chart. | A filter tag should appear at the top. All other charts and stats on the page should update to reflect the filter. | | |
| **TC-010** | **Data Persistence** | Register a new employee. Force refresh the page (Ctrl+F5). | The new employee should still be present in the dashboard list, confirming data was saved to the backend. | | |

---
**Overall Test Result:**  
[ ] Passed  
[ ] Failed  

**Tester Signature:** _________________________  
**Date:** _________________________
