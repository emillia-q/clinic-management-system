# 🏥 Clinic Management System
## Web application for managing patients, visits and laboratory workflows in a medical clinic.

## 📺 Video Preview
<div align="center">
  <video src="https://github.com/emillia-q/clinic-management-system/blob/master/assets/clinic_demo.mp4"></video>
</div>

## 🏢 Project Origins
The project started as a **group prototype**.  
The goal was to model a real clinic's daily operations: receptionists registering patients and booking appointments, doctors conducting visits and ordering tests and laboratory staff processing results - all in one cohesive system instead of scattered spreadsheets and paper records.

Before implementation, the team prepared **UML class diagrams**, an **ERD** and **screen flow diagrams** to define entities, relationships, user journeys and role-based workflows.

---

## 🛠️ How it works
The system serves five main groups of users: **Administrators, Doctors, Receptionists, Lab Technicians and Lab Managers**.

Receptionists manage the patient registry and schedule visits with a chosen doctor. Doctors run consultations - updating visit status, recording diagnoses and ordering laboratory or physical examinations. Lab Technicians execute ordered tests and submit results; Lab Managers review and approve or reject them. Administrators oversee staff accounts, including onboarding new employees with temporary credentials.

---

## 📐 Architecture & Tech Stack
The application is a full-stack web system with a containerized PostgreSQL database for consistent local development. The full stack was also deployed on **Render** as a deployment experiment.

### Technology Stack
* **Backend:** **Java 21** with **Spring Boot 3.2** (REST API, Spring Security, Spring Data JPA).
* **Frontend:** **React 19** with **TypeScript** and **Vite**.
* **Database:** **PostgreSQL 16** relational database.
* **DevOps:** **Docker Compose** (PostgreSQL + pgAdmin) for local development; **Render** for hosted deployment (`clinic-db`, `clinic-backend`, `clinic-frontend`).
* **API Docs:** **OpenAPI / Swagger UI** for interactive endpoint exploration.

### Architecture Highlights
* **Strict layered backend:** Entity -> Repository -> Service -> DTO -> Controller - entities are never exposed directly to the client.
* **Feature-first frontend:** domain modules (`patients`, `visits`, `lab`, `staff`, ...) with shared UI components; all API calls go through one shared HTTP client that automatically attaches the JWT from `localStorage` to every request.
* **Role-based security:** Spring Security enforces per-role API access; the React app renders role-specific dashboards after login.

---

## ⚙️ Key Features
* **JWT Authentication:** Stateless login with signed tokens; the backend validates every protected request via a JWT filter.
* **Session Persistence:** Auth token, user role, and profile data are stored in **localStorage**, so sessions survive page refreshes and are attached automatically to API calls.
* **Visit Lifecycle:** Visits move through clear statuses - *Registered -> In Progress -> Finished / Cancelled* - with timestamps tracked at each transition.
* **Patient Registry:** Full CRUD with address data, duplicate PESEL protection and dynamic search using JPA Specifications.
* **Exam Ordering & Lab Pipeline:** Doctors order lab tests during a visit; technicians submit or cancel results; managers validate or reject with mandatory notes on rejection.
* **Physical Examinations:** Doctors can record in-clinic physical exam results linked to a visit, alongside lab orders.
* **Staff Administration:** Admins create role-specific accounts with auto-generated logins, hashed temporary passwords and a forced password-change flow on first login.
* **Input Validation:** Custom **PESEL** validator and structured error responses across the API.

---

## 🚀 Quick Start
1. Copy `.env_template` to `.env` and fill in database credentials.
2. Start the database: `docker-compose up -d`
3. Run the backend from **IntelliJ** (Spring Boot) - paste variables from `.env` into the Run Configuration **Environment variables** field.
4. Copy `frontend/.env_template` to `frontend/.env` - set `VITE_API_URL` so the port matches `APP_PORT` from the root `.env`, then run `npm install && npm run dev`.
5. Open Swagger UI at `http://localhost:8080/swagger-ui.html` to explore the API.

---

## 👥 The Team
This project was a collaborative effort by:

* **Emilia Kura**
* **Patryk Niesporek**
* **Maja Kucab**
* **Łukasz Góźdź**
* **Michał Szczepanik**
