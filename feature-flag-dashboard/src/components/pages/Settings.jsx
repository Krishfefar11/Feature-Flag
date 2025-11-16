import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../../AuthContext";
import "./settings.css";   // ⭐ ADD THIS LINE ⭐

export default function Settings() {
  const { user, logout } = useAuth();
  const [oldPass, setOldPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [msg, setMsg] = useState("");

  if (!user) return <p className="settings-loading">Loading...</p>;

  async function changePassword(e) {
    e.preventDefault();
    try {
      await axios.put("/api/auth/change-password", {
        oldPassword: oldPass,
        newPassword: newPass,
      });

      setMsg("Password updated successfully!");
      setOldPass("");
      setNewPass("");
    } catch (err) {
      setMsg("Old password incorrect");
    }
  }

  function toggleTheme() {
    const t = localStorage.getItem("theme") || "light";
    const next = t === "light" ? "dark" : "light";
    localStorage.setItem("theme", next);
    window.location.reload();
  }

  return (
    <div className="settings-container">
      <h1 className="settings-title">⚙️ Settings</h1>

      <section className="settings-section">
        <h2 className="settings-heading">Theme</h2>
        <button onClick={toggleTheme} className="settings-btn">
          Toggle Theme
        </button>
      </section>

      <section className="settings-section">
        <h2 className="settings-heading">Change Password</h2>

        <form onSubmit={changePassword}>
          <input
            type="password"
            placeholder="Old Password"
            value={oldPass}
            onChange={(e) => setOldPass(e.target.value)}
            className="settings-input"
          />

          <input
            type="password"
            placeholder="New Password"
            value={newPass}
            onChange={(e) => setNewPass(e.target.value)}
            className="settings-input"
          />

          <button className="settings-btn">Update</button>
        </form>

        {msg && <p className="settings-msg">{msg}</p>}
      </section>

      <section className="settings-section">
        <h2 className="settings-heading">Account Details</h2>

        <div className="account-box">
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Role:</strong> {user.role}</p>
        </div>

        <button onClick={logout} className="logout-btn">
          Logout
        </button>
      </section>
    </div>
  );
}
