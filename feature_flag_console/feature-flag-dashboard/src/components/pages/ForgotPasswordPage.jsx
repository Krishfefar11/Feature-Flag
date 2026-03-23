import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as authService from "../../api/authService";

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const res = await authService.forgotPassword(email);
      setMessage(res.data.message);
      setSent(true);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card glass-card">
        <h2 className="auth-card-title">Reset Password</h2>

        {!sent ? (
          <>
            <p style={{ color: "var(--text-secondary)", marginBottom: "24px", fontSize: "0.95rem", lineHeight: 1.5 }}>
              Enter the email address linked to your account and we'll send you a link to reset your password.
            </p>

            <form onSubmit={handleSubmit} className="auth-form">
              <input
                type="email"
                className="glass-input"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{ padding: "14px 16px", fontSize: "1rem" }}
              />

              {error && (
                <p style={{ color: "var(--status-error)", textAlign: "center", fontWeight: 500, margin: 0 }}>
                  {error}
                </p>
              )}

              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
                style={{ padding: "14px", fontSize: "1.05rem", marginTop: "8px" }}
              >
                {loading ? "Sending..." : "Send Reset Link"}
              </button>
            </form>
          </>
        ) : (
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "3rem", marginBottom: "16px" }}>📧</div>
            <p style={{ color: "var(--status-success)", fontWeight: 600, fontSize: "1.05rem", marginBottom: "12px" }}>
              Check your email!
            </p>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", lineHeight: 1.6 }}>
              {message}
            </p>
            <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginTop: "16px" }}>
              The link will expire in 15 minutes.
            </p>
          </div>
        )}

        <p
          className="auth-link"
          onClick={() => navigate("/login")}
          style={{ cursor: "pointer", marginTop: "24px" }}
        >
          ← Back to Login
        </p>
      </div>
    </div>
  );
}
