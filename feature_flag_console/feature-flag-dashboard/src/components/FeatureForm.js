import React from "react";

export default function FeatureForm({ form, setForm, onSubmit, editing }) {
  return (
    <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div>
        <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Feature Name</label>
        <input
          type="text"
          className="glass-input"
          placeholder="e.g. beta-feature"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
      </div>
      
      <div>
        <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Description</label>
        <textarea
          className="glass-input"
          placeholder="What does this feature do?"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          style={{ minHeight: '80px' }}
        />
      </div>

      <div>
        <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Rollout Percentage</label>
        <input
          type="number"
          className="glass-input"
          placeholder="0-100"
          value={form.rollout}
          min="0"
          max="100"
          onChange={(e) => setForm({ ...form, rollout: e.target.value })}
        />
      </div>

      <button type="submit" className="btn btn-primary" style={{ marginTop: '8px' }}>
        {editing ? "Update Feature" : "Add Feature"}
      </button>
    </form>
  );
}
