🚩 Feature Flag Console
A full-stack MERN-based Feature Flag Management System that lets you enable/disable features in real time, manage releases safely, and organize your app’s feature lifecycle without redeployments.
✨ Features
🔐 JWT Login Authentication
🧩 Create / Edit / Delete Feature Flags
🎛️ Modern Admin Console UI (Sidebar + Search + Dark Mode)
🗄️ MongoDB-based Feature Storage
🧾 Audit Log Page (Upcoming)
👥 User Roles Management (Upcoming)
⚙️ Settings Page
🗑️ Animated Delete-to-Bin UI
📂 Project Structure
Backend
server.js — Starts server, connects DB, loads routes
auth.js — Login + JWT generation
authMiddleware.js — Protects routes
Feature.js — Mongoose model
featureRoutes.js — CRUD API routes
featureService.js — Feature logic layer
Frontend
App.js — App layout + routing
Sidebar.js — Navigation
FeatureForm.js — Add features
FeatureList.js — Show all features
Toast.js — Alerts
Login.jsx — Login page
Settings.jsx — Settings
AuditLog.jsx — Audit Log
Users.jsx — User Management
CSS files — Styling
⚙️ Tech Stack
Frontend
React.js
Axios
React Router
Custom CSS
Backend
Node.js
Express.js
MongoDB / Mongoose
JWT Authentication
bcryptjs
🌱 Future Scope
Multi-environment flags (dev/stage/prod)
Percentage rollout
A/B testing
Targeted user groups
Notifications & Webhooks
Analytics dashboard
⚠️ Limitations
No RBAC yet
Audit log not fully implemented
Single environment only
