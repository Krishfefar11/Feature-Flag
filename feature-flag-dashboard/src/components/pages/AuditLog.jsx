import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../AuthContext";

export default function AuditLog() {
  const { user } = useAuth();
  const [logs, setLogs] = useState([]);

  // 🟢 Hooks ALWAYS come first
  useEffect(() => {
    if (user && user.role !== "viewer") {
      fetchLogs();
    }
  }, [user]);

  async function fetchLogs() {
    try {
      const res = await axios.get("/api/audit");
      setLogs(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to load audit logs");
    }
  }

  // 🟡 After hooks -> SAFE early returns
  if (!user) {
    return <p style={{ padding: 20 }}>Loading...</p>;
  }

  if (user.role === "viewer") {
    return <h2 className="p-8 text-red-500">❌ Access Denied (Viewer)</h2>;
  }

  // 🟢 Normal JSX
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">🧾 Audit Logs</h1>

      <div className="bg-white p-4 shadow rounded max-h-[70vh] overflow-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b font-semibold">
              <th className="p-2 text-left">Action</th>
              <th className="p-2 text-left">User</th>
              <th className="p-2 text-left">Time</th>
              <th className="p-2 text-left">Details</th>
            </tr>
          </thead>

          <tbody>
            {logs.map((l) => (
              <tr key={l._id} className="border-b">
                <td className="p-2">{l.action}</td>
                <td className="p-2">{l.doneBy}</td>
                <td className="p-2">{new Date(l.timestamp).toLocaleString()}</td>
                <td className="p-2 text-gray-600">
                  <pre>{JSON.stringify(l.details, null, 2)}</pre>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
