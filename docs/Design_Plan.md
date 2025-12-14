
# Design and Development Plan (ISO 9001:2015 Clause 8.3.2)

**Project Title:** Employee Health & Wellness Tracker  
**Department:** Occupational Health / Human Resources / IT  
**Date Prepared:** 2024-05-10

---

## 1. Objective
To develop a web-based application that digitizes and centralizes employee health records. The system will track comorbidities, annual physical examinations (APE), medical events, and key health metrics to enable proactive health monitoring, reporting, and wellness program management for Ospital ng Makati staff.

## 2. Development Stages
The project will follow an agile Software Development Life Cycle (SDLC):

### Phase 1: Planning & Requirements Gathering
*   **Input:** Review of existing employee health forms (PDS, medical history), APE checklists, and HR reporting needs.
*   **Output:** Software Requirements Specification (SRS) detailing all functional and technical needs.

### Phase 2: Design & Prototyping
*   **Activity:** Creation of UI/UX wireframes for the Dashboard, Registration Form, Employee Profile Modal, and Analytics views.
*   **Activity:** Database schema design for the Google Sheet, defining headers and data formats (including JSON for nested data).
*   **Review:** Approval of the workflow logic by the Occupational Health Manager.

### Phase 3: Development / Coding
*   **Activity:** Frontend development using ReactJS and TailwindCSS.
*   **Activity:** Backend development using Google Apps Script to interface with the Google Sheet database.
*   **Key Features:** Role-agnostic interface, dynamic APE tracking, vitals monitoring (Weight, BP, Diabetes), and a real-time analytics dashboard.

### Phase 4: Verification (Testing)
*   **Activity:** Developer performs unit testing on components and services.
*   **Activity:** End-to-end testing of the data flow from the UI to the Google Sheet and back.
*   **Output:** Execution of Test Scripts (See `DOCS_Test_Scripts.md`).

### Phase 5: Validation & Deployment
*   **Activity:** User Acceptance Testing (UAT) by the Occupational Health team and HR personnel.
*   **Activity:** Deployment of the Google Apps Script as a web app.
*   **Output:** UAT Sign-off and Go-Live.

## 3. Responsibilities and Authorities
*   **Project Lead / Developer:** Responsible for system architecture, coding, and technical deployment.
*   **Process Owner (Occupational Health Manager):** Responsible for defining health tracking requirements, validating data fields, and final acceptance.
*   **End Users (HR / OH Staff):** Responsible for UAT and ongoing data entry.

## 4. Resources
*   **Hardware:** Standard hospital workstations.
*   **Software:** Visual Studio Code, Google Workspace (Sheets, Apps Script).
*   **Libraries:** `react`, `tailwindcss`, `recharts` (Analytics), `lucide-react` (Icons).
*   **Reference Standards:** Internal hospital policies on employee health management.

## 5. Interface Control
*   The system is a standalone application. Data is primarily managed within the system but can be accessed directly via the linked Google Sheet for advanced analysis or backup by authorized personnel.

---
**Prepared By:** _________________________ (Developer)  
**Approved By:** _________________________ (Occupational Health Manager)