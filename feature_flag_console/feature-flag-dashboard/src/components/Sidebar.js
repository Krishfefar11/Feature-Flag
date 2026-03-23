import React from "react";
import { FaFlag, FaUsers, FaHistory, FaCog } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const menu = [
    { name: "Features", icon: <FaFlag />, path: "/" },
    { name: "Users", icon: <FaUsers />, path: "/users" },
    { name: "Audit Log", icon: <FaHistory />, path: "/audit" },
    { name: "Settings", icon: <FaCog />, path: "/settings" },
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-brand">
        🚀 FF Console
      </div>

      <div className="sidebar-nav">
        {menu.map((item) => (
          <div
            key={item.name}
            className={`nav-item ${
              location.pathname === item.path ? "active" : ""
            }`}
            onClick={() => navigate(item.path)}
            style={{ cursor: "pointer" }}
          >
            {item.icon}
            <span>{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
