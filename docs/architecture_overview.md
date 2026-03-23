# Feature Flag Architecture Overview

The system is composed of two primary components: the **Control Plane** (Feature Flag Console) and the **Consumer Applications** (Demo App).

## Component Interaction

```mermaid
graph TD
    subgraph Control Plane (Port 5001/3000)
        D[React Dashboard] -- CRUD --> B[Express Backend]
        B -- Store/Fetch --> DB[(MongoDB)]
    end

    subgraph Consumer App (Port 3001)
        F[Frontend UI] -- Check Flag --> S[Express Server]
        S -- Proxy Request --> B
    end

    B -- Evaluate Flag --> S
    S -- Flag Status --> F
```

### 1. Feature Flag Console (`feature_flag_console`)
- **Backend (Node.js/Express):** Manages the logic for creating, updating, and evaluating flags. It uses a consistent hashing algorithm for deterministic rollouts.
- **Frontend (React):** Provides a visual interface for admins to manage flags, users, and audit logs.
- **Database (MongoDB):** Stores flag definitions and their current state.

### 2. Demo App (`demo-app`)
- **Server (Node.js):** Acts as a bridge between the frontend and the Feature Flag API. It evaluates flags by calling the Console's evaluation endpoint.
- **Frontend (HTML/JS):** Dynamically updates the UI based on the flag statuses received from the local server.

## 🎓 Resume-Ready Feature Mapping

This table maps the 16 key features of this project to their actual implementation in the codebase. Use this for interview preparation!

| # | Feature | Implementation Detail | Location in Code |
| :--- | :--- | :--- | :--- |
| 1 | **CRUD Ops** | Full lifecycle for Flags | `backend/routes/featureRoutes.js` |
| 2 | **Evaluation API** | High-performance check | `GET /api/features/evaluate/:name` |
| 3 | **Dashboard** | React-based Admin UI | `feature-flag-dashboard/src/Dashboard.js` |
| 4 | **Authentication** | JWT + Bcrypt protection | `backend/routes/authRoutes.js` |
| 5 | **Rollout %** | Deterministic Hashing | `backend/utils/evaluationUtils.js` |
| 6 | **Targeting** | User-specific overrides | *Implementation Planned* |
| 7 | **RBAC** | Admin/Dev/Viewer roles | `backend/middleware/authMiddleware.js` |
| 8 | **Real-Time** | 2s Polling Synchronization | `demo-app/public/app.js` |
| 9 | **Metadata** | History & Descriptions | `backend/models/Feature.js` |
| 10 | **Search** | Live frontend filtering | `Dashboard.js` (Search State) |
| 11 | **Audit Logs** | Change traceability | `backend/routes/auditRoutes.js` |
| 12 | **Environments** | Dev/Prod scoping | *Future Roadmap* |
| 13 | **Scheduled** | Time-based releases | *Future Roadmap* |
| 14 | **A/B Testing** | Core rollout foundation | `evaluationUtils.js` |
| 15 | **Caching** | Redis-ready design | *Future Roadmap* |
| 16 | **Security** | Throttling & Protection | `authMiddleware.js` (JWT) |
