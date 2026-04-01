# Clinic Management System - Frontend

Built with **React**.

---

## Project Structure

To keep the UI consistent and maintainable, we use the following directory structure:

### 1. `src/pages`
Complete views mapped to routes. One file per page (e.g., `PatientDashboard.jsx`).

### 2. `src/components`
Reusable UI elements. Keep them "dumb" (focus on display, not logic).

### 3. `src/services`
**Crucial:** All API calls go here.
* Example: `patientService.js` handles `axios.get('/api/v1/patients')`.
* **Rule:** Never use `axios` or `fetch` directly inside a component. Use services.

### 4. `src/context`
Global state management (e.g., User Authentication, Theme).

---

## API Integration

### Environment Variables
Create a `.env` file in the `frontend` root:
`VITE_API_URL=http://localhost:8080/api/v1`

### Proxy Configuration
We use the standard `/api/v1` prefix. Ensure you point your base URL to the backend port defined in the root `.env`.
> ### Important Sync Note
> The port in **`VITE_API_URL`** (default: `8080`) **must match** the **`APP_PORT`** defined in our root `.env` file.
> If you change the backend port (e.g., to `9000`), you **must update it here as well** and then restart the frontend development server (`npm start` or `npm run dev`).
---

## Development Guidelines

1. **Component Naming:** Use PascalCase (e.g., `UserProfile.jsx`).
2. **Standard Workflow:**
    * Create the UI component in `components/`.
    * Add the API call logic in `services/`.
    * Connect everything in `pages/`.
3. **Pull Requests:** Just like the backend, no pushes to `main`. Every UI change requires a PR.
4. **Styling:** Stick to the predefined color palette (medical blues/whites).

---