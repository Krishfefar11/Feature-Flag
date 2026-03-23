import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import * as authService from "../../api/authService";

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (newPassword !== confirmPassword) {
      return setError("Passwords do not match.");
    }

    if (newPassword.length < 6) {
      return setError("Password must be at least 6 characters.");
    }

    setLoading(true);
    try {
      const res = await authService.resetPassword(token, newPassword);
      setMessage(res.data.message);
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // If no token in URL, show an error
  if (!token) {
    return (
      <div className="auth-wrapper">
        <div className="auth-card glass-card" style={{ textAlign: "center" }}>
          <div style={{ fontSize: "3rem", marginBottom: "16px" }}>⚠️</div>
          <h2 className="auth-card-title">Invalid Link</h2>
          <p style={{ color: "var(--text-secondary)", marginBottom: "24px" }}>
            This password reset link is invalid or has been used already.
          </p>
          <button
            className="btn btn-primary"
            onClick={() => navigate("/forgot-password")}
            style={{ padding: "14px 28px", fontSize: "1rem" }}
          >
            Request a New Link
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-wrapper">
      <div className="auth-card glass-card">
        <h2 className="auth-card-title">Set New Password</h2>

        {!success ? (
          <>
            <p style={{ color: "var(--text-secondary)", marginBottom: "24px", fontSize: "0.95rem" }}>
              Enter your new password below.
            </p>

            <form onSubmit={handleSubmit} className="auth-form">
              <input
                type="password"
                className="glass-input"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength={6}
                style={{ padding: "14px 16px", fontSize: "1rem" }}
              />

              <input
                type="password"
                className="glass-input"
                placeholder="Confirm New Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={6}
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
                {loading ? "Resetting..." : "Reset Password"}
              </button>
            </form>
          </>
        ) : (
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "3rem", marginBottom: "16px" }}>✅</div>
            <p style={{ color: "var(--status-success)", fontWeight: 600, fontSize: "1.05rem", marginBottom: "12px" }}>
              Password Reset Successful!
            </p>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", marginBottom: "24px" }}>
              {message}
            </p>
            <button
              className="btn btn-primary"
              onClick={() => navigate("/login")}
              style={{ padding: "14px 28px", fontSize: "1rem" }}
            >
              Go to Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
