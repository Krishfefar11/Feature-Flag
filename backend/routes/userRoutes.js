const express = require("express");
const { requireAuth, requireRole } = require("../middleware/authMiddleware");
const User = require("../models/User");

const router = express.Router();

router.get("/", requireAuth, requireRole("admin"), async (req, res) => {
  const users = await User.find().select("-password");
  res.json(users);
});

router.put("/role/:id", requireAuth, requireRole("admin"), async (req, res) => {
  const { role } = req.body;
  await User.findByIdAndUpdate(req.params.id, { role });
  res.json({ message: "Role updated" });
});

router.delete("/:id", requireAuth, requireRole("admin"), async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

module.exports = router;
