import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../AuthContext.js";

export default function LoginPage() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(email, password);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  };

  if (isAuthenticated) {
    navigate("/");
    return null;
  }

  return (
    <div className="auth-wrapper">
      <div className="auth-card glass-card">
        <h2 className="auth-card-title">Feature Flag Console</h2>

        <form onSubmit={handleSubmit} className="auth-form">
          <input
            type="email"
            className="glass-input"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ padding: '14px 16px', fontSize: '1rem' }}
          />

          <input
            type="password"
            className="glass-input"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ padding: '14px 16px', fontSize: '1rem' }}
          />

          <p
            className="auth-link"
            onClick={() => navigate("/forgot-password")}
            style={{ cursor: 'pointer', textAlign: 'right', margin: '-4px 0 0', fontSize: '0.85rem' }}
          >
            Forgot Password?
          </p>

          {error && (
            <p style={{ color: "var(--status-error)", textAlign: "center", fontWeight: 500, margin: 0 }}>
              {error}
            </p>
          )}

          <button type="submit" className="btn btn-primary" style={{ padding: '14px', fontSize: '1.05rem', marginTop: '8px' }}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div style={{ margin: '20px 0', borderTop: '1px solid var(--border-color)', position: 'relative' }}>
          <span style={{ position: 'absolute', top: '-10px', left: '50%', transform: 'translateX(-50%)', background: 'var(--glass-bg)', padding: '0 10px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>OR</span>
        </div>

        <button 
          onClick={async () => {
            setError("");
            setLoading(true);
            try {
              await useAuth().adminLogin();
              navigate("/");
            } catch (err) {
              setError(err.response?.data?.message || err.message);
            } finally {
              setLoading(false);
            }
          }} 
          className="btn" 
          style={{ width: '100%', padding: '14px', fontSize: '1.05rem', background: 'rgba(59, 130, 246, 0.15)', color: '#60a5fa', border: '1px solid rgba(59, 130, 246, 0.3)' }}
        >
          {loading ? "Logging in..." : "⚡ Quick Admin Login"}
        </button>

        <p className="auth-link" onClick={() => navigate("/register")} style={{ cursor: 'pointer', marginTop: '24px' }}>
          Don't have an account? Register
        </p>
      </div>
    </div>
  );
}
