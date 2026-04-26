# Clinic Management System - Frontend

Built with **React**.

---

## Project Structure

To keep the UI scalable, we use a **feature-first** structure:

### 1. `src/features`
Domain modules. Each feature owns its UI, API, model/hooks, and types.

Current examples:
* `features/staff/api/staffApi.ts`
* `features/staff/model/useStaffDashboard.ts`
* `features/staff/ui/*`
* `features/staff/types/staff.types.ts`
* `features/patients/types/patient.types.ts`
* `features/visits/types/visit.types.ts`

### 2. `src/shared`
Cross-feature reusable code:
* `shared/api/client.ts` - common axios client
* shared UI / helpers / constants (add here when reused by multiple features)

### 3. `src/pages`
Route-level composition only. Pages should assemble feature components and keep minimal business logic.

### 4. `src/components`
Legacy folder. Do not add new domain components here; put new code in `features/*/ui`.

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
2. **Where to add new code:**
    * New API endpoint call -> `features/<domain>/api/*Api.ts` (or `shared/api` if truly global)
    * New domain type/interface -> `features/<domain>/types/*.types.ts`
    * New feature hook/state logic -> `features/<domain>/model/*`
    * New feature component -> `features/<domain>/ui/*`
    * Route/page composition -> `src/pages/*`
3. **API rule:** avoid raw `fetch`/`axios` in UI components; keep HTTP calls in feature API files.
4. **Pull Requests:** No pushes to `main`. Every UI change requires a PR.
5. **Styling:** Stick to the predefined color palette (medical blues/whites).

---