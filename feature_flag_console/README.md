# 🚩 Feature Flag Console

A full-stack **MERN-based Feature Flag Management System** that lets you enable/disable features in real time, manage releases safely, and organize your app's feature lifecycle without redeployments.

## ✨ Features

- 🔐 **JWT Authentication** — Register, login, and secure session management
- 🧩 **Feature Flag CRUD** — Create, edit, toggle, and delete feature flags
- 📉 **Percentage Rollouts** — Deterministic user-based rollout (e.g., enable for 25% of users)
- 🎛️ **Modern Admin Dashboard** — Glassmorphism UI with live search and statistics
- 🛡️ **Role-Based Access (RBAC)** — Granular permissions for Admin, Developer, and Viewer
- 🧾 **Audit Logging** — Full traceability for every change in the system
- ⚙️ **Real-Time Synchronization** — 2-second polling interval for instant flag updates in consumer apps
- 🗄️ **MongoDB Storage** — Persistent delivery with Mongoose ODM

## 📂 Project Structure

### Backend (`/backend`)

| File | Purpose |
|------|---------|
| `server.js` | Express server entry point, DB connection, route mounting |
| `routes/authRoutes.js` | Register, login, change password (JWT) |
| `routes/featureRoutes.js` | Feature flag CRUD (auth + RBAC protected) |
| `routes/userRoutes.js` | User management — admin only |
| `routes/auditRoutes.js` | Fetch audit logs — admin & developer |
| `middleware/authMiddleware.js` | JWT verification + role-based access middleware |
| `models/Feature.js` | Feature flag schema (name, description, enabled, rollout) |
| `models/User.js` | User schema with password hashing (bcrypt) |
| `models/audit.js` | Audit log schema |
| `utils/logaction.js` | Helper to log actions to audit collection |

### Frontend (`/feature-flag-dashboard`)

| File | Purpose |
|------|---------|
| `src/App.js` | Routing and layout |
| `src/AuthContext.js` | Auth state management (login, register, logout) |
| `src/Dashboard.js` | Main feature flag management page |
| `src/ProtectedRoute.js` | Route guard — redirects to login if not authenticated |
| `src/components/FeatureForm.js` | Create/edit feature form |
| `src/components/FeatureList.js` | Feature flag list with toggle/edit/delete |
| `src/components/Sidebar.js` | Navigation sidebar |
| `src/components/pages/LoginPage.jsx` | Login page |
| `src/components/pages/RegisterPage.jsx` | Registration page |
| `src/components/pages/Users.jsx` | User management (admin) |
| `src/components/pages/AuditLog.jsx` | Audit log viewer |
| `src/components/pages/Settings.jsx` | Account settings |
| `src/api/authService.js` | Auth API calls |
| `src/api/featureService.js` | Feature flag API calls |

## ⚙️ Tech Stack

| Layer | Technologies |
|-------|-------------|
| Frontend | React.js, Axios, React Router, Framer Motion, jwt-decode |
| Backend | Node.js, Express.js, Mongoose, JWT, bcryptjs |
| Database | MongoDB |

## 🚀 Getting Started

### 1. Local Setup

### MongoDB
Ensure you have MongoDB running locally on port `27017` or update the `MONGO_URI` backend `.env` file to point to your cloud instance (like MongoDB Atlas).

### Backend
1. Open a terminal and navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy `.env.example` to `utils/.env` and update values if needed:
   ```bash
   cp .env.example utils/.env
   ```
4. Start the server:
   ```bash
   npm run dev
   ```

### Frontend
1. Open a new terminal and navigate to the frontend folder:
   ```bash
   cd feature-flag-dashboard
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the React development server:
   ```bash
   npm start
   ```
The app will open automatically at `http://localhost:3000`.

---

## Initial Setup & Roles

The system uses Role-Based Access Control (RBAC).
**Important:** The very first user to register an account in the system is automatically assigned the `admin` role. All subsequent users who register will default to the `viewer` role and must be upgraded by an admin manually in the **Users** tab.

### 4. Environment Variables

Create `backend/utils/.env`:
```
MONGO_URI=mongodb://127.0.0.1:27017/featureflags
JWT_SECRET=your_secure_secret_key
PORT=5001
```

## 🛡️ Role Permissions

| Action | Admin | Developer | Viewer |
|--------|-------|-----------|--------|
| View features | ✅ | ✅ | ✅ |
| Create features | ✅ | ✅ | ❌ |
| Update/Toggle features | ✅ | ✅ | ❌ |
| Delete features | ✅ | ❌ | ❌ |
| Manage users | ✅ | ❌ | ❌ |
| View audit logs | ✅ | ✅ | ❌ |

## 🌱 Future Scope (Roadmap)

- 🌍 **Environment Support** — Separate flags for Dev, Staging, and Production
- 🎯 **Advanced User Targeting** — Enable flags for specific user IDs or email lists
- ⏱️ **Scheduled Rollouts** — Enable/disable features at a specific date and time
- 🚀 **Performance Caching** — Use **Redis** to reduce database load for high-traffic apps
- 🛡️ **Rate Limiting** — Prevent API abuse and enhance security
- 📊 **A/B Testing Analytics** — Measure impact of toggled features on user behavior
- 🔗 **Webhooks** — Notify external systems (Slack, Discord) when flags change
