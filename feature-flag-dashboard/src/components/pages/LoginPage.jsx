import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../AuthContext.js";
import { motion } from "framer-motion";

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
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (isAuthenticated) {
    navigate("/");
    return null;
  }

  return (
  <div className="login-wrapper">
    <form onSubmit={handleSubmit} className="login-card">
      <h2 style={{ textAlign: "center", marginBottom: "15px" }}>
        Feature Flag Console
      </h2>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      {error && (
        <p style={{ color: "yellow", textAlign: "center", marginBottom: "10px" }}>
          {error}
        </p>
      )}

      <button type="submit">{loading ? "Logging in..." : "Login"}</button>

      <p className="register-link" onClick={() => navigate("/register")}>
        Don’t have an account? Register
      </p>
    </form>
  </div>
);
}
