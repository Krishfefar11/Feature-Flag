import React, { useEffect, useState } from "react";
import FeatureList from "./components/FeatureList";
import FeatureForm from "./components/FeatureForm";
import toast from "react-hot-toast";
import {
  getFeatures,
  addFeature,
  updateFeature,
  deleteFeature,
} from "./api/featureService";
import { useAuth } from "./AuthContext";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [features, setFeatures] = useState([]);
  const [form, setForm] = useState({ name: "", description: "", rollout: 0 });
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const loadFeatures = async () => {
    setLoading(true);
    try {
      const res = await getFeatures();
      setFeatures(res.data || []);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to load features");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFeatures();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await updateFeature(editing, form);
        toast.success("Feature updated!");
      } else {
        await addFeature(form);
        toast.success("Feature added!");
      }
      setForm({ name: "", description: "", rollout: 0 });
      setEditing(null);
      loadFeatures();
    } catch (err) {
      toast.error(err.response?.data?.message || "Error saving feature!");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteFeature(id);
      toast.success("Feature deleted!");
      loadFeatures();
    } catch (err) {
      toast.error(err.response?.data?.message || "Delete failed!");
    }
  };

  const handleToggle = async (id, enabled) => {
    try {
      const f = features.find((x) => x._id === id);
      await updateFeature(id, { ...f, enabled });
      loadFeatures();
    } catch (err) {
      toast.error(err.response?.data?.message || "Toggle failed!");
    }
  };

  const filtered = features.filter((f) =>
    f.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="page-title">Feature Flags</h1>
          <p className="page-subtitle">Manage rollouts and toggles</p>
        </div>
        
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <input
            type="text"
            className="glass-input"
            placeholder="Search features..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: '250px' }}
          />
          <button className="btn btn-ghost" onClick={logout}>
            Logout
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 3fr', gap: '32px', alignItems: 'start' }}>
        
        {/* Left Column: Form */}
        <div className="glass-card">
          <h2 style={{ fontSize: '1.2rem', marginBottom: '20px' }}>
            {editing ? "✏️ Edit Feature" : "✨ New Feature"}
          </h2>
          {user?.role === "viewer" ? (
             <div style={{ textAlign: 'center', padding: '20px' }}>
               <p style={{ color: 'var(--status-warning)' }}>🔒 Read-Only Mode</p>
               <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>You don't have permission to create or edit features. Ask an Admin for access.</p>
             </div>
          ) : (
            <FeatureForm
              form={form}
              setForm={setForm}
              onSubmit={handleSubmit}
              editing={editing}
            />
          )}
        </div>

        {/* Right Column: List */}
        <div>
          {loading ? (
            <p style={{ color: 'var(--text-muted)' }}>⏳ Loading...</p>
          ) : filtered.length > 0 ? (
            <FeatureList
              features={filtered}
              toggle={handleToggle}
              edit={(f) => {
                setEditing(f._id);
                setForm(f);
              }}
              remove={handleDelete}
              userRole={user?.role}
            />
          ) : (
            <div className="glass-card" style={{ textAlign: 'center', padding: '40px' }}>
              <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>No features found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
