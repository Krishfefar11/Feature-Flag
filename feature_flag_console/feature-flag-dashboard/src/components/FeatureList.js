import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaTrash, FaEdit } from "react-icons/fa";

export default function FeatureList({ features, toggle, edit, remove, userRole }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <AnimatePresence>
        {features.map((f) => (
          <motion.div
            key={f._id}
            className="glass-card glass-card-hover"
            layout
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{
              opacity: 0,
              scale: 0.9,
              transition: { duration: 0.2 },
            }}
            style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px' }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '6px' }}>
                <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-primary)' }}>{f.name}</h3>
                <span className={`badge ${f.enabled ? 'badge-success' : 'badge-neutral'}`}>
                  {f.enabled ? 'Enabled' : 'Disabled'}
                </span>
              </div>
              <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '8px' }}>
                {f.description || "No description provided."}
              </p>
              <small style={{ color: 'var(--text-muted)' }}>Rollout: {f.rollout}%</small>
            </div>

            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              {/* Animated Custom Toggle */}
              <div 
                className="toggle-switch" 
                data-ison={f.enabled.toString()} 
                onClick={() => { if(userRole !== 'viewer') toggle(f._id, !f.enabled) }}
                style={{ opacity: userRole === 'viewer' ? 0.5 : 1, cursor: userRole === 'viewer' ? 'not-allowed' : 'pointer' }}
              >
                <motion.div 
                  className="toggle-handle" 
                  layout
                  transition={{ type: "spring", stiffness: 700, damping: 30 }}
                  style={{
                    marginLeft: f.enabled ? "24px" : "0px"
                  }}
                />
              </div>

              {/* Edit Button */}
              {userRole !== 'viewer' && (
                <button className="btn btn-ghost btn-icon-only" onClick={() => edit(f)} title="Edit">
                  <FaEdit size={18} />
                </button>
              )}

              {/* Delete Button */}
              {userRole === 'admin' && (
                <button 
                  className="btn btn-icon-only" 
                  style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--status-error)' }}
                  onClick={() => remove(f._id)} 
                  title="Delete"
                >
                  <FaTrash size={16} />
                </button>
              )}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
