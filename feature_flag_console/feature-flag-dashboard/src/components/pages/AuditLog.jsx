import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../AuthContext";

export default function AuditLog() {
  const { user } = useAuth();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

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
    } finally {
      setLoading(false);
    }
  }

  if (!user) {
    return <p style={{ color: 'var(--text-muted)' }}>Loading...</p>;
  }

  if (user.role === "viewer") {
    return (
      <div className="glass-card" style={{ textAlign: 'center', marginTop: '40px' }}>
        <h2 style={{ color: 'var(--status-error)' }}>❌ Access Denied</h2>
        <p style={{ color: 'var(--text-secondary)' }}>You do not have permission to view audit logs.</p>
      </div>
    );
  }

  // Helper function to color badges based on action
  const getBadgeClass = (action) => {
    if (action.includes('REGISTER') || action.includes('CREATE') || action.includes('LOGIN')) return 'badge-success';
    if (action.includes('DELETE') || action.includes('FAIL')) return 'badge-error';
    if (action.includes('UPDATE') || action.includes('CHANGE')) return 'badge-warning';
    return 'badge-neutral';
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Audit Logs</h1>
        <p className="page-subtitle">Track all system activities and changes</p>
      </div>

      <div className="glass-table-wrapper">
        {loading ? (
          <p style={{ padding: '20px', color: 'var(--text-muted)' }}>Loading audit logs...</p>
        ) : logs.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>No audit logs yet.</p>
          </div>
        ) : (
          <table className="glass-table">
            <thead>
              <tr>
                <th>Action</th>
                <th>User</th>
                <th>Time</th>
                <th style={{ width: '40%' }}>Details</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((l) => (
                <tr key={l._id}>
                  <td>
                    <span className={`badge ${getBadgeClass(l.action)}`}>
                      {l.action}
                    </span>
                  </td>
                  <td style={{ fontWeight: 500 }}>{l.doneBy}</td>
                  <td style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                    {new Date(l.timestamp).toLocaleString()}
                  </td>
                  <td>
                    <pre style={{ 
                      margin: 0, 
                      fontSize: '0.8rem', 
                      color: 'var(--text-muted)',
                      background: 'rgba(0,0,0,0.2)',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      overflowX: 'auto',
                      border: '1px solid var(--border-glass)'
                    }}>
                      {JSON.stringify(l.details, null, 2)}
                    </pre>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
