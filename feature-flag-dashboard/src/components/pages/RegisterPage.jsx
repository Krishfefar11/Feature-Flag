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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await register(email, password);
      alert("Registration successful!");
      navigate("/login");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <form onSubmit={handleSubmit} className="login-card">
        <h2 style={{ textAlign: "center", marginBottom: "15px" }}>
          Create New Account
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

        <button type="submit">
          {loading ? "Registering..." : "Register"}
        </button>

        <p
          className="register-link"
          onClick={() => navigate("/login")}
        >
          Already have an account? Login
        </p>
      </form>
    </div>
  );
}
