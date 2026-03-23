import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../../AuthContext";

export default function Settings() {
  const { user, logout } = useAuth();
  const [oldPass, setOldPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [msg, setMsg] = useState("");

  if (!user) return <p style={{ color: 'var(--text-muted)' }}>Loading...</p>;

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

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Settings</h1>
        <p className="page-subtitle">Manage your account preferences</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', maxWidth: '600px' }}>
        
        {/* Account Info */}
        <section className="glass-card">
          <h2 style={{ fontSize: '1.2rem', marginBottom: '20px' }}>Account Details</h2>
          <div style={{ background: 'rgba(0,0,0,0.2)', padding: '16px 20px', borderRadius: '12px', border: '1px solid var(--border-glass)' }}>
            <p style={{ margin: '0 0 8px 0', display: 'flex', justifyContent: 'space-between' }}>
              <strong style={{ color: 'var(--text-secondary)' }}>Email:</strong>
              <span style={{ fontWeight: 500 }}>{user.email}</span>
            </p>
            <p style={{ margin: 0, display: 'flex', justifyContent: 'space-between' }}>
              <strong style={{ color: 'var(--text-secondary)' }}>Role:</strong>
              <span className="badge badge-neutral" style={{ padding: '2px 10px' }}>{user.role}</span>
            </p>
          </div>
          <button onClick={logout} className="btn btn-danger" style={{ marginTop: '20px' }}>
            Logout
          </button>
        </section>

        {/* Change Password */}
        <section className="glass-card">
          <h2 style={{ fontSize: '1.2rem', marginBottom: '20px' }}>Change Password</h2>

          <form onSubmit={changePassword} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Old Password</label>
              <input
                type="password"
                placeholder="Enter old password"
                value={oldPass}
                onChange={(e) => setOldPass(e.target.value)}
                className="glass-input"
                required
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>New Password</label>
              <input
                type="password"
                placeholder="Enter new password"
                value={newPass}
                onChange={(e) => setNewPass(e.target.value)}
                className="glass-input"
                required
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ marginTop: '8px' }}>Update Password</button>
          </form>

          {msg && (
            <p style={{ 
              marginTop: '16px', 
              color: msg.includes('success') ? 'var(--status-success)' : 'var(--status-error)',
              fontWeight: 500 
            }}>
              {msg}
            </p>
          )}
        </section>

      </div>
    </div>
  );
}
