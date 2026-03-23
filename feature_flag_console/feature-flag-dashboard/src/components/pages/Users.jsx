import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../AuthContext";

export default function Users() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && user.role !== "viewer") {
      getUsers();
    }
  }, [user]);

  async function getUsers() {
    try {
      const res = await axios.get("/api/users");
      setUsers(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to load users");
    } finally {
      setLoading(false);
    }
  }

  async function updateRole(id, role) {
    try {
      await axios.put(`/api/users/role/${id}`, { role });
      getUsers();
    } catch (err) {
      console.error(err);
      alert("Role update failed");
    }
  }

  async function deleteUser(id) {
    if (!window.confirm("Delete this user?")) return;
    try {
      await axios.delete(`/api/users/${id}`);
      getUsers();
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  }

  if (user === undefined) {
    return <p style={{ color: 'var(--text-muted)' }}>Loading...</p>;
  }

  if (user === null) {
    return <p style={{ color: 'var(--status-error)' }}>❌ Not logged in</p>;
  }

  if (user.role === "viewer") {
    return (
      <div className="glass-card" style={{ textAlign: 'center', marginTop: '40px' }}>
        <h2 style={{ color: 'var(--status-error)' }}>❌ Access Denied</h2>
        <p style={{ color: 'var(--text-secondary)' }}>You do not have permission to view users.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Users Management</h1>
        <p className="page-subtitle">Manage user roles and access</p>
      </div>

      {loading ? (
        <p style={{ color: 'var(--text-muted)' }}>Loading users...</p>
      ) : users.length === 0 ? (
        <div className="glass-card" style={{ textAlign: 'center', padding: '40px' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>No users found.</p>
        </div>
      ) : (
        <div className="glass-table-wrapper">
          <table className="glass-table">
            <thead>
              <tr>
                <th>Email</th>
                <th>Name</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id}>
                  <td style={{ fontWeight: 500 }}>{u.email}</td>
                  <td style={{ color: 'var(--text-secondary)' }}>{u.name || "—"}</td>
                  <td>
                    <select
                      value={u.role}
                      onChange={(e) => updateRole(u._id, e.target.value)}
                      className="glass-select"
                      disabled={user.role !== "admin"} 
                    >
                      <option value="admin">Administrator</option>
                      <option value="developer">Developer</option>
                      <option value="viewer">Viewer</option>
                    </select>
                  </td>
                  <td>
                    {user.role === "admin" && (
                      <button
                        onClick={() => deleteUser(u._id)}
                        className="btn btn-danger"
                        style={{ padding: '6px 14px', fontSize: '0.85rem' }}
                      >
                        Delete
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
