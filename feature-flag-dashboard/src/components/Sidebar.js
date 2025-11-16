import React from "react";
import { FaFlag, FaUsers, FaHistory, FaCog, FaMoon, FaSun } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import "./Sidebar.css";

export default function Sidebar({ darkMode, setDarkMode }) {
  const navigate = useNavigate();
  const location = useLocation();

  const menu = [
    { name: "Features", icon: <FaFlag />, path: "/" },
    { name: "Users", icon: <FaUsers />, path: "/users" },
    { name: "Audit Log", icon: <FaHistory />, path: "/audit" },
    { name: "Settings", icon: <FaCog />, path: "/settings" },
  ];

  return (
    <div className={`sidebar ${darkMode ? "dark" : ""}`}>
      <h2 className="logo">🚀 FF Console</h2>

      {menu.map((item) => (
        <div
          key={item.name}
          className={`menu-item ${
            location.pathname === item.path ? "active" : ""
          }`}
          onClick={() => navigate(item.path)}
        >
          {item.icon}
          <span>{item.name}</span>
        </div>
      ))}

      {/* 🌗 DARK MODE TOGGLE */}
      <div className="mode-toggle" onClick={() => setDarkMode(!darkMode)}>
        {darkMode ? <FaSun /> : <FaMoon />}
        <span>{darkMode ? "Light" : "Dark"}</span>
      </div>
    </div>
  );
}
