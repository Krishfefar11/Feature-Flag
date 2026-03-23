import React from "react";
import Sidebar from "./Sidebar";
import Toast from "./Toast";

export default function Layout({ children }) {
  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <Toast />
        {children}
      </div>
    </div>
  );
}
