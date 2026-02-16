# PortHire - Project Documentation

## 1. Project Overview
**PortHire** is a comprehensive Portfolio Builder application designed to bridge the gap between Professionals (Job Seekers) and Recruiters. It allows professionals to build, customize, and deploy stunning portfolios using templates (Medium, Modern), while Recruiters can discover and view these portfolios through a dedicated dashboard.

## 2. Technology Stack
-   **Frontend Library**: [React](https://reactjs.org/) (Version 18+)
-   **Build Tool**: [Vite](https://vitejs.dev/) (For fast development and bundling)
-   **Routing**: [React Router DOM](https://reactrouter.com/) (Client-side routing)
-   **State Management**: React Context API & Hooks
-   **HTTP Client**: [Axios](https://axios-http.com/) (via a custom `apiClient` wrapper)
-   **Styling**: Vanilla CSS with CSS Variables (`var(--color)`) for theming (Light/Dark mode)

---

## 3. Core React Concepts Used
Responsive, interactive, and scalable features were built using the following core React concepts:

### 3.1. Functional Components
The entire application uses **Functional Components**, which are JavaScript functions that return JSX.
*   **Example**: `Dashboard.jsx`, `UserCard.jsx`, `SharedLayout.jsx`.
*   **Benefit**: Cleaner code, easier to test, and support for Hooks.

### 3.2. React Hooks
We utilized standard React Hooks to manage logic and state:

*   **`useState`**: Used for local component state.
    *   *Usage*: Managing form inputs, loading states (`loading`), error messages (`error`), and data arrays (`professionals`).
    *   *Example*: `const [professionals, setProfessionals] = useState([]);`

*   **`useEffect`**: Used for side effects (actions that happen outside the render cycle).
    *   *Usage*: Fetching data from the API when a component mounts, checking authentication status, or updating the document title.
    *   *Example*: Fetching the list of professionals when `RecruiterDashboardPage` loads.

*   **`useContext`**: Used to consume global state.
    *   *Usage*: Accessing the `AuthContext` to get the current `user` object and `logout` function anywhere in the app.
    *   *Example*: `const { logout } = useContext(AuthContext);`

*   **`useNavigate`** (from React Router): Used for programmatic navigation.
    *   *Usage*: Redirecting the user after login, logout, or clicking a card.
    *   *Example*: `navigate('/login');`

### 3.3. Context API (Global State)
We implemented a **Global Store** using `src/context/AuthContext.jsx`.
*   **Purpose**: To hold authentication state (User details, Access Token) that needs to be accessible by many components (Header, Private Routes, Dashboard).
*   **Mechanism**: The `<AuthProvider>` wraps the entire application in `App.jsx`, making the state available to the entire component tree.

### 3.4. Layouts & Composition
We used the **Compound Component Pattern** (composition) for the layout.
*   **`SharedLayout.jsx`**: Acts as a wrapper (shell) for authenticated pages. It contains the fixed **Header** (Logo, Theme Toggle, Logout) and a dynamic **Footer**.
*   **`{children}` Prop**: The specific page content (e.g., Dashboard grid) is passed as `children` to this layout, ensuring a consistent look and feel across different pages (`DashboardPage`, `RecruiterDashboardPage`).

### 3.5. Protected Routes
We created a **`PrivateRoute`** component (`src/routes/PrivateRoute.jsx`).
*   **Logic**: It checks if a user is authenticated (has a token). If yes, it renders the child component; if no, it redirects to `/login`.
*   **Security**: This prevents unauthorized access to the Dashboard and Editor pages.

---

## 4. Key Features & Implementation Details

### 4.1. Authentication Flow
1.  **Login/Register**: Forms submit credentials to the backend.
2.  **Tokens**: On success, an `accessToken` and `refreshToken` are stored in `localStorage` and State.
3.  **Interceptors**: `src/services/apiClient.js` automatically attaches the generic `Authorization: Bearer <token>` header to every request. It also handles **401 Unauthorized** errors by attempting to refresh the token transparently.

### 4.2. Dashboard System
We implemented two distinct dashboards based on user roles:
*   **Professional Dashboard**:
    *   View available templates (Medium, Modern).
    *   Edit portfolio details (Hero, Experience, Projects).
    *   Deploy/Publish the portfolio to a public URL.
*   **Recruiter Dashboard**:
    *   **Grid Layout**: Displays a list of professionals using a responsive CSS Grid (`auto-fill`).
    *   **User Cards**: Reusable `UserCard` component showing avatar, name, role, and skills.
    *   **Preview**: Clicking a card opens the candidate's portfolio in a read-only view.

### 4.3. Portfolio Editor
*   **Real-time Updates**: Changing inputs updates the local state immediately.
*   **Data Structure**: Complex nested objects (e.g., `experience: [{ company, role, dates }]`) are managed to mirror the MongoDB schema.
*   **Templates**: Two distinct visual templates (`Medium`, `Modern`) use the same underlying data but render it differently.

### 4.4. Theming (Dark Mode)
*   **CSS Variables**: Colors are defined in `index.css` as variables (e.g., `--bg-primary`, `--text-primary`).
*   **Toggling**: The `SharedLayout` toggles a `data-theme="dark"` attribute on the root element.
*   **Implementation**: CSS rules use these variables, so changing the attribute automatically repaints the entire app with the new color scheme.

---

## 5. Recent Improvements (What we just did)
1.  **Recruiter Dashboard Refactor**:
    *   Moved to `SharedLayout` for consistency.
    *   Added **Logout Button** and Confirmation Modal.
    *   Cleaned up CSS to remove unused styles.
2.  **Grid System Alignment**:
    *   Updated the Recruiter grid to use the exact same CSS classes (`.dashboard-grid`) as the Professional Dashboard.
    *   Fixed a bug where single items stretched to 100% width by switching from `auto-fit` to `auto-fill`.
3.  **Visual Enhancements**:
    *   Added `undraw_portfolio_btd8.svg` to the header.
    *   Ensured the layout respects a maximum width (`1200px`) for better readability on large screens.

---

## 6. How to Run & Build
-   **Development**: `npm run dev` (Starts Vite server)
-   **Production Build**: `npm run build` (Outputs optimized static files to `dist/`)
-   **Preview Build**: `npm run preview`
