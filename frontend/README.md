# Clinic Management System — Frontend

Built with **React + TypeScript + Vite**, styled with **Bootswatch (Flatly)** / Bootstrap.

---

## `src/` structure

```
src/
├── main.tsx                 # Entry point (Bootstrap, index.css, App)
├── index.css                # Global CSS — imports shared stylesheets
│
├── app/                     # Application shell
│   ├── App.tsx              # Role routing, view state, page composition
│   ├── App.css              # Shell layout (.App, main)
│   └── layout/
│       └── Header.tsx       # Global navigation (per role)
│
├── pages/                   # Pages — view composition only (per role)
│   ├── auth/                # Login, ChangePassword
│   ├── admin/               # Administrator dashboard
│   ├── receptionist/        # Visits, patients, new visit
│   ├── doctor/              # Patients, visits, order exam
│   └── lab/                 # Lab technician, lab manager
│
├── features/                # Domain logic (feature-first)
│   ├── patients/            # api, types, ui, utils
│   ├── visits/
│   ├── doctors/
│   ├── lab/
│   ├── staff/
│   ├── exams/
│   └── errors/
│
└── shared/                  # Code shared across features
    ├── api/                 # Shared HTTP client (axios)
    ├── lib/                 # Pure functions (e.g. formatDoctorName)
    └── ui/                  # UI components + style tokens
        ├── styles.ts        # Bootstrap classes, dimensions, inline styles
        ├── status/          # Status badge colors + status-badges.css
        └── index.ts         # Barrel export — import from: `from '../../shared/ui'`
```

---

## Where to put new code

| What you add | Where | Example |
|--------------|-------|---------|
| New page / role view | `pages/<role>/` | `pages/receptionist/VisitsPage.tsx` |
| Component used in one domain | `features/<domain>/ui/` | `features/patients/ui/PatientList.tsx` |
| Domain API call | `features/<domain>/api/` | `features/patients/api/patientsApi.ts` |
| DTO type / interface | `features/<domain>/types/` | `features/visits/types/visit.types.ts` |
| Feature hook / state | `features/<domain>/model/` | `features/staff/model/useStaffDashboard.ts` |
| Domain helper logic | `features/<domain>/utils/` | `features/patients/utils/filterPatientsByQuery.ts` |
| Domain-specific constants | `features/<domain>/constants/` | `features/lab/constants/labManagerTabLabels.ts` |
| UI component used in ≥2 domains | `shared/ui/` | `SearchField`, `SegmentedTabs`, `StatusBadge` |
| Shared non-React function | `shared/lib/` | `formatDoctorName.ts` |
| HTTP client / interceptors | `shared/api/` | `client.ts` |
| API errors, parsers | `features/errors/` | `types/ErrorType.ts`, `utils/parseFetchError.ts` |

### What **not** to do

- **Do not** put business logic directly in `pages/` — pages compose components and pass props.
- **Do not** call `fetch` / `axios` in UI components — only in `features/*/api/` files.
- **Do not** duplicate button classes / padding — use tokens from `shared/ui/styles.ts`.
- **Do not** create a `components/` folder — use `features/*/ui` or `shared/ui` instead.

---

## Layers — responsibilities

### `app/`
Application entry after login: view selection by role, redirects, global layout (`Header` + `main`).

### `pages/`
One page = one file (e.g. `VisitsPage.tsx`). May hold page-level UI state (tabs, selected record), but should **not** contain detailed domain logic or raw HTTP requests.

Organized by **user role**:
- `auth/` — before / outside dashboards
- `admin/`, `receptionist/`, `doctor/`, `lab/` — role dashboards

### `features/<domain>/`
Each domain is a mini-module:

```
features/patients/
├── api/          # patientsApi.ts — HTTP methods
├── types/        # patient.types.ts — PatientDto, requests
├── ui/           # PatientList, PatientDetailsPanel, …
├── utils/        # filterPatientsByQuery, …
└── model/        # (optional) use* hooks
```

Existing domains: `patients`, `visits`, `doctors`, `staff`, `lab`, `exams`, `errors`.

### `shared/`
Code **not tied to a single domain**:

- **`shared/ui/`** — shared UI: search, tabs, status badges, field labels, CSS tokens.
- **`shared/lib/`** — pure functions (name formatting, dates, etc.).
- **`shared/api/`** — configured axios client with auth token.

Prefer importing UI from the barrel:

```ts
import {SearchField, SegmentedTabs, StatusBadge, DASHBOARD_PAGE_CLASS} from '../../shared/ui';
```

---

## Styles and CSS

| File | Purpose |
|------|---------|
| `main.tsx` | Bootswatch / Bootstrap import |
| `index.css` | Global entry — `@import` shared CSS files |
| `app/App.css` | Application shell layout (imported in `App.tsx`) |
| `shared/ui/styles.ts` | Tokens: button classes, padding, headings, `SPLIT_PANEL_TRANSITION_STYLE` |
| `shared/ui/status/status-badges.css` | Custom badge colors (outside Bootstrap palette) |
| `shared/ui/status/*.ts` | Enum → badge CSS class mapping |

**Rule:** Bootstrap utility classes via tokens in `styles.ts`. Add a separate `.css` file only when Bootstrap is not enough (e.g. custom status colors). Do not create per-component `.css` files unless there is a clear reason.

Shared UI components (use instead of copying code):

- `SearchField` — search with submit icon and clear button
- `SegmentedTabs` — tabs (receptionist, doctor, lab manager)
- `StatusBadge` — badge with consistent colors per enum
- `DetailFieldLabel` / `DetailRow` — fields in detail panels
- `DateStripline` — date picker in visit views

---

## API and environment variables

Create a `.env` file in the `frontend/` directory:

```
VITE_API_URL=http://localhost:8080/api/v1
```

The port in **`VITE_API_URL`** must match **`APP_PORT`** in the root backend `.env`. After changing the port, restart the dev server (`npm run dev`).

---

## Running the app

```bash
npm install
npm run dev      # development
npm run build    # production (tsc + vite build)
```

---

## Conventions

1. **File naming:** PascalCase for React components (`PatientList.tsx`), camelCase for utils/API (`patientsApi.ts`).
2. **Types:** `.types.ts` suffix (e.g. `visit.types.ts`).
3. **API:** `Api.ts` suffix or an `api/` folder with methods grouped by resource.
4. **Pull requests:** no direct pushes to `main` — every UI change goes through a PR.
5. **New feature:** start with `types/` → `api/` → `ui/` → wire up in `pages/`.
