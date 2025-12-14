
# Software Requirements Specification (SRS) (ISO 9001:2015 Clause 8.3.3)

**Project:** Employee Health & Wellness Tracker  
**Version:** 1.0  

---

## 1. Introduction
This document defines the functional and non-functional inputs required for the design and development of the Employee Health & Wellness Tracker. The system aims to provide a comprehensive tool for managing employee health data.

## 2. Functional Requirements

### 2.1 User Roles & Access
*   **System Administrator / Data Custodian:** A single-role design where the user has full access to all functionalities, including registering, viewing, updating, and managing all employee records. Access is controlled by the URL of the web app.
*   **Secret Admin Access:** Tapping the header logo 5 times and entering a password provides a direct link to the underlying Google Sheet database for administrative purposes.

### 2.2 Core Modules
*   **Registration Module:**
    *   Capture employee demographics: Name, Hospital No., Division, DOB, Sex, Age (auto-computed).
    *   Record comprehensive health profile: Comorbidities, Past Medical History, Maintenance Medications, and Initial Weight.
*   **Dashboard Module:**
    *   Display a filterable and searchable list of all **active** employees.
    *   Filters must include: Name/Hospital No., Division, APE Status (for the current year), and specific comorbidities.
    *   Provide a quick-action button to mark an employee's APE as 'Done' or 'Undo'.
*   **Employee Profile Module (Modal View):**
    *   **Profile Tab:** View and edit the employee's core health profile.
    *   **Health Trackers Tab:** Log and view historical data for Weight, Blood Pressure (Hypertension), and Blood Sugar (Diabetes).
    *   **Logs & Actions Tab:** Log specific medical events (Sick Leave, Hospital Admission, ER Visit) and perform actions (Mark APE Done, Refer to Nutrition).
    *   **Status Management Tab:** Change an employee's status to inactive (e.g., Resigned, Retired) with a reason.
*   **Data Analysis Module:**
    *   Provide visual charts and key performance indicators (KPIs) of the employee population's health.
    *   Charts must include: APE Compliance, Census by Age Group, and Prevalence of Common Comorbidities.
    *   KPI cards must show: Total active employees, APE compliance rate, top comorbidity, and average age.
    *   Allow global and interactive filtering of analytics data.

## 3. Technical & Database Requirements
*   **Architecture:** ReactJS Frontend + Google Apps Script Backend.
*   **Database Design (Google Sheet):** 
    *   A single sheet named 'Employees' will serve as the database.
    *   Multi-value and historical data (e.g., `comorbidities`, `weightHistory`, `sickLeaves`) must be stored as **JSON strings** within their respective cells to maintain a flat table structure.
*   **Performance:**
    *   The application must implement both client-side (localStorage) and server-side (Apps Script CacheService) caching to reduce Google Sheet API calls and improve load times.
    *   The UI should load cached data first for a near-instant experience, then fetch fresh data in the background.

## 4. Statutory & Regulatory Requirements
*   **Data Privacy:** The system will handle sensitive employee health information. Access to the application and the backend Google Sheet must be restricted to authorized personnel (e.g., Occupational Health, HR).
*   **Data Integrity:** All updates and additions must be transactional. Employee records are not deleted but are marked with an 'inactive' status to preserve historical data.

---
**Verified By:** _________________________ (Project Lead)  
**Date:** _________________________
