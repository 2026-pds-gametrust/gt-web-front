# Frontend_Agents.md – Standards & FSD Architecture for React + TypeScript

This guide defines **architecture, naming conventions, folder structure, testing, and code standards** so that developers and AI agents (e.g., Copilot, Cursor) can contribute to the Front-End repository in a predictable, scalable way, fully aligned with Back-End standards.

**Stacks covered:** The same FSD rules apply whether the UI is **React for the web** (e.g., Vite, `react-router-dom`) or **React Native** (e.g., Metro, React Navigation). This repository uses the web stack; adjust routing and bootstrap examples accordingly.

---

## 1. Architectural Symmetry (Front-End vs Back-End)

To ensure seamless collaboration between teams, our **Feature-Sliced Design (FSD)** architecture maps back-end concepts in the following way:

| Back-End Concept | Front-End Equivalent (FSD) | Front-End Responsibility |
| :--- | :--- | :--- |
| **Domain** | `05-entities` | Data models (Interfaces) and raw UI components that represent the business domain (e.g., `IUser`, `user-card.tsx`). |
| **Service** | `04-features` | Business logic, global state management (Zustand), form validation, and API calls (`httpClient.post` / shared client). |
| **Controller** | `02-pages` & `03-widgets` | Orchestration. Pages and widgets do not hold business logic; they only "assemble" the UI by pulling data from *Features* and visuals from *Entities/Shared*. |
| **Infrastructure** | `06-shared/lib/http` | Agnostic HTTP client configuration (Axios), token interceptors, and global adapters. Keep a single place for the client; avoid duplicate empty stubs elsewhere. |
| **Configuration** | `01-app` | Global bootstrap: state providers, root routing (`react-router-dom`), and SDK initialization (e.g., observability). |

---

## 2. Folder Structure (FSD)

The project strictly follows the **Feature-Sliced Design** dependency hierarchy. A layer can only import resources from the layers *below* it.

| Layer | Path | Purpose / Examples |
| :--- | :--- | :--- |
| **App** | `src/01-app` | Global configurations, context providers, root routing. |
| **Pages** | `src/02-pages` | Full-screen components for navigation flows (e.g., `home-screen.tsx`, `login-screen.tsx`). |
| **Widgets** | `src/03-widgets` | Complex UI blocks composed of multiple features (e.g., sidebars, headers, page layouts). |
| **Features** | `src/04-features` | User interactions and use cases (e.g., `auth/`, `schedule-appointment/`). |
| **Entities** | `src/05-entities` | Core business domains (e.g., `user/`, `hospital/`). |
| **Shared** | `src/06-shared` | Business-agnostic code: base UI (buttons), HTTP client, icons, and utilities. |

---

## 3. Naming Conventions

We maintain the exact same naming conventions as the back-end to facilitate cross-stack readability:

### 3.1 Interfaces, Types, and Enums

| Type | Prefix | Casing | Example |
| :--- | :--- | :--- | :--- |
| **Domain interface** | `I` | PascalCase | `IUser`, `IPatientData` |
| **Enum** | `E` | PascalCase | `EStatus` with members `ACTIVE`, `PENDING` |

* **Files:** Must use `kebab-case.ts` or `kebab-case.tsx` (e.g., `user-profile.tsx`, `auth-api.ts`).
* **React Components:** Exported functions and variables use `PascalCase` (e.g., `export const UserProfile = () => {}`).
* **Global Constants:** Use `UPPER_SNAKE_CASE` (e.g., `API_BASE_URL`).

---

## 4. Testing & Linting Standards

### 4.1 Unit and Integration Tests Strategy
Unlike the back-end, which uses a global `tests/` folder, the front-end testing strategy is split based on the test scope and uses different extensions to easily separate them in CI/CD pipelines:

* **Unit Tests (Co-location):** Test files using the `*.test.ts` or `*.test.tsx` extension must live *exactly next to* the file they are testing, within their respective Slice/Segment.
* **Integration Tests:** Tests that validate the flow of a complete Slice (e.g., UI + State + Mocked API) must use the `*.spec.ts` or `*.spec.tsx` extension and be isolated in a `__tests__/` folder at the root of that specific Slice.

**Example:**
```text
src/04-features/auth/
 ├── __tests__/
 │   └── login-flow.spec.tsx     <-- Integration test (.spec.tsx)
 ├── model/
 │   ├── use-auth-store.ts       
 │   └── use-auth-store.test.ts  <-- Co-located unit test (.test.ts)
 ```
 ### 4.2 End-to-End (E2E) Tests
Tests that validate complete user journeys (crossing multiple layers) must be isolated in a separate folder at the root of the project, outside of the `src` folder (`e2e/` with Playwright).

### 4.3 Standard Commands

| Tool | Purpose | Command (yarn) |
| :--- | :--- | :--- |
| **Jest (Unit)** | Runs only co-located unit tests (`*.test.ts`) | `yarn test:unit` |
| **Jest (Integration)** | Runs only slice integration tests (`*.spec.ts`) | `yarn test:integration` |
| **Coverage** | Ensure ≥ 80% coverage | `yarn test:coverage` |
| **ESLint** | Linting with TypeScript/React rules | `yarn lint` / `yarn lint:fix` |
| **Prettier**| Code formatting | `yarn format` |

## 5. Codex Contribution Checklist ✅

When generating or editing code in this repository, **always**:

1. **Separation of Concerns (FSD)**
   * Never mix API calls (`axios`) directly into a `.tsx` file in the `Pages` layer.
   * Delegate business logic to the `Features` layer.
   * Keep the `Shared` layer free of any business logic (do not mention domain names like "Patient" or "Hospital" here).

2. **Strict Typing (Contract Symmetry)**
   * Types received from the API (in the `Entities` layer) must exactly mirror the Back-End *Domain* interfaces (e.g., `IUser`).

3. **Global Dependency Injection**
   * Third-party tools (Analytics, Logs, Maps) must be abstracted using the *Adapter* pattern in the `Shared` layer to avoid vendor lock-in across the codebase.

4. **Quality & Stability**
   * Create/update the appropriate `.test.ts` file (co-located for unit tests, or in `__tests__/` for integration tests) whenever adding logic to a Feature or Entity.
   * Ensure that UI changes do not break global state logic managed by Zustand.
