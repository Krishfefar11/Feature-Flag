const express = require("express");
const Audit = require("../models/audit");
const { requireAuth, requireRole } = require("../middleware/authMiddleware");

const router = express.Router();

// GET all audit logs (admin & developer only)
router.get("/", requireAuth, requireRole("admin", "developer"), async (req, res) => {
  try {
    const logs = await Audit.find().sort({ timestamp: -1 }).limit(200);
    res.json(logs);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch audit logs", error: err.message });
  }
});

module.exports = router;
