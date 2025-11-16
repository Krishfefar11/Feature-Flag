import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../AuthContext";

export default function Users() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🟢 1) Always call hooks FIRST
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

  // 🟡 2) Safe early returns AFTER all hooks  
  if (user === undefined) {
    return <p style={{ padding: 20 }}>Loading...</p>;
  }

  if (user === null) {
    return <p style={{ padding: 20, color: "red" }}>❌ Not logged in</p>;
  }

  if (user.role === "viewer") {
    return <p style={{ padding: 20, color: "red" }}>❌ Access Denied (Viewer)</p>;
  }

  // 🟢 3) Main UI  
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">👥 Users Management</h1>

      {loading ? (
        <p>Loading users...</p>
      ) : (
        <table className="min-w-full bg-white shadow rounded">
          <thead>
            <tr className="border-b">
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Role</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {users.map((u) => (
              <tr key={u._id} className="border-b">
                <td className="p-3">{u.email}</td>

                <td className="p-3">
                  <select
                    value={u.role}
                    onChange={(e) => updateRole(u._id, e.target.value)}
                    className="border p-1 rounded"
                  >
                    <option value="admin">admin</option>
                    <option value="developer">developer</option>
                    <option value="viewer">viewer</option>
                  </select>
                </td>

                <td className="p-3">
                  {user.role === "admin" && (
                    <button
                      onClick={() => deleteUser(u._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded"
                    >
                      Delete
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
