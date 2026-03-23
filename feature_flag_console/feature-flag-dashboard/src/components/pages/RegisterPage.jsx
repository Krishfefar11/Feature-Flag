import React, { useState } from "react";
import { useAuth } from "../../AuthContext.js";
import { useNavigate } from "react-router-dom";

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await register(email, password);
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card glass-card">
        <h2 className="auth-card-title">Create Account</h2>

        {!success ? (
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

            {error && (
              <p style={{ color: "var(--status-error)", textAlign: "center", fontWeight: 500, margin: 0 }}>
                {error}
              </p>
            )}

            <button type="submit" className="btn btn-primary" style={{ padding: '14px', fontSize: '1.05rem', marginTop: '8px' }}>
              {loading ? "Registering..." : "Register"}
            </button>
          </form>
        ) : (
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "3rem", marginBottom: "16px" }}>📧</div>
            <p style={{ color: "var(--status-success)", fontWeight: 600, fontSize: "1.05rem", marginBottom: "12px" }}>
              Registration Successful!
            </p>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", lineHeight: 1.6 }}>
              Please check your email to verify your account before logging in.
            </p>
            <button
              className="btn btn-primary"
              onClick={() => navigate("/login")}
              style={{ padding: "14px 28px", fontSize: "1rem", marginTop: "24px" }}
            >
              Back to Login
            </button>
          </div>
        )}

        {!success && (
          <p className="auth-link" onClick={() => navigate("/login")} style={{ cursor: 'pointer', marginTop: '24px' }}>
            Already have an account? Login
          </p>
        )}
      </div>
    </div>
  );
}
