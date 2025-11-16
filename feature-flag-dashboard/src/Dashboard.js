import React, { useEffect, useState } from "react";
import "./App.css";
import Sidebar from "./components/Sidebar";
import FeatureList from "./components/FeatureList";
import FeatureForm from "./components/FeatureForm";
import Toast from "./components/Toast";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import {
  getFeatures,
  addFeature,
  updateFeature,
  deleteFeature,
} from "./api/featureService";
import { useAuth } from "./AuthContext";

export default function Dashboard() {
  const { logout } = useAuth();

  const [features, setFeatures] = useState([]);
  const [form, setForm] = useState({ name: "", description: "", rollout: 0 });
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [darkMode, setDarkMode] = useState(false);

  // Load features
  const loadFeatures = async () => {
    setLoading(true);
    try {
      const res = await getFeatures();
      setFeatures(res.data || []);
    } catch (err) {
      console.error("Error loading features:", err);
      toast.error("Failed to load features");
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
      toast.error("Something went wrong!");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteFeature(id);
      toast.success("Feature deleted!");
      loadFeatures();
    } catch {
      toast.error("Delete failed!");
    }
  };

  const handleToggle = async (id, enabled) => {
    try {
      const f = features.find((x) => x._id === id);
      await updateFeature(id, { ...f, enabled });
      loadFeatures();
    } catch {
      toast.error("Toggle failed!");
    }
  };

  const filtered = features.filter((f) =>
    f.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="app-layout">

      {/* SIDEBAR */}
      <Sidebar darkMode={darkMode} setDarkMode={setDarkMode} />

      {/* MAIN CONTENT */}
      <div className={`main ${darkMode ? "dark" : ""}`}>
        <Toast />

        <div className="toolbar">
          <input
            type="text"
            placeholder="Search features..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <button
            onClick={logout}
            style={{
              marginLeft: "auto",
              cursor: "pointer",
              padding: "8px 12px",
            }}
          >
            Logout
          </button>
        </div>

        {/* Feature Form */}
        <FeatureForm
          form={form}
          setForm={setForm}
          onSubmit={handleSubmit}
          editing={editing}
        />

        {/* Feature List */}
        {loading ? (
          <p>⏳ Loading...</p>
        ) : filtered.length > 0 ? (
          <FeatureList
            features={filtered}
            toggle={handleToggle}
            edit={(f) => {
              setEditing(f._id);
              setForm(f);
            }}
            remove={handleDelete}
          />
        ) : (
          <p>🚫 No features found.</p>
        )}

        {/* Floating icon */}
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 3 }}
          style={{
            position: "fixed",
            bottom: "20px",
            right: "30px",
            fontSize: "24px",
          }}
        >
          🗑️
        </motion.div>
      </div>
    </div>
  );
}
