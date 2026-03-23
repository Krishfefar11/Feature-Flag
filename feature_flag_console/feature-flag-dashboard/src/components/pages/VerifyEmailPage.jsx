import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";

export default function VerifyEmailPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [message, setMessage] = useState("Verifying your email...");
  const [status, setStatus] = useState("loading"); // loading, success, error

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("Invalid verification link.");
      return;
    }

    const verify = async () => {
      try {
        const res = await axios.get(`http://localhost:5001/api/auth/verify-email?token=${token}`);
        setMessage(res.data.message);
        setStatus("success");
      } catch (err) {
        setStatus("error");
        setMessage(err.response?.data?.message || "Verification failed. The link may have expired.");
      }
    };

    verify();
  }, [token]);

  return (
    <div className="auth-wrapper">
      <div className="auth-card glass-card" style={{ textAlign: "center" }}>
        {status === "loading" && (
          <>
            <div className="spinner" style={{ margin: "0 auto 24px" }}></div>
            <h2 className="auth-card-title">Verifying...</h2>
            <p style={{ color: "var(--text-secondary)" }}>{message}</p>
          </>
        )}

        {status === "success" && (
          <>
            <div style={{ fontSize: "3rem", marginBottom: "16px" }}>✅</div>
            <h2 className="auth-card-title" style={{ color: "var(--status-success)" }}>Verified!</h2>
            <p style={{ color: "var(--text-secondary)", marginBottom: "24px" }}>
              {message}
            </p>
            <button
              className="btn btn-primary"
              onClick={() => navigate("/login")}
              style={{ padding: "14px 28px", fontSize: "1rem" }}
            >
              Go to Login
            </button>
          </>
        )}

        {status === "error" && (
          <>
            <div style={{ fontSize: "3rem", marginBottom: "16px" }}>❌</div>
            <h2 className="auth-card-title" style={{ color: "var(--status-error)" }}>Failed</h2>
            <p style={{ color: "var(--text-secondary)", marginBottom: "24px" }}>
              {message}
            </p>
            <button
              className="btn btn-primary"
              onClick={() => navigate("/register")}
              style={{ padding: "14px 28px", fontSize: "1rem" }}
            >
              Back to Register
            </button>
          </>
        )}
      </div>
    </div>
  );
}
