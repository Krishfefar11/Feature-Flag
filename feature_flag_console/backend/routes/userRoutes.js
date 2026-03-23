const express = require("express");
const { requireAuth, requireRole } = require("../middleware/authMiddleware");
const User = require("../models/User");
const logAction = require("../utils/logaction");

const router = express.Router();

// GET all users (admin only)
router.get("/", requireAuth, requireRole("admin"), async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch users", error: err.message });
  }
});

// UPDATE user role (admin only)
router.put("/role/:id", requireAuth, requireRole("admin"), async (req, res) => {
  try {
    const { role } = req.body;
    const targetUser = await User.findById(req.params.id);

    await User.findByIdAndUpdate(req.params.id, { role });

    await logAction("UPDATE_USER_ROLE", req.user.email, {
      targetUser: targetUser?.email,
      oldRole: targetUser?.role,
      newRole: role,
    });

    res.json({ message: "Role updated" });
  } catch (err) {
    res.status(500).json({ message: "Role update failed", error: err.message });
  }
});

// DELETE user (admin only)
router.delete("/:id", requireAuth, requireRole("admin"), async (req, res) => {
  try {
    const targetUser = await User.findById(req.params.id);

    await User.findByIdAndDelete(req.params.id);

    await logAction("DELETE_USER", req.user.email, {
      deletedUser: targetUser?.email,
    });

    res.json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json({ message: "Delete failed", error: err.message });
  }
});

module.exports = router;
