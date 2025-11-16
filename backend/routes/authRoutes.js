const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { requireAuth } = require("../middleware/authMiddleware");

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

// REGISTER
router.post("/register", async (req, res) => {
  const { email, password, name } = req.body;
  const existing = await User.findOne({ email });
  if (existing) return res.status(400).json({ message: "User exists" });

  const newUser = await User.create({
    email,
    password,
    name,
    role: "viewer",
  });

  res.status(201).json({ message: "User registered" });
});

// LOGIN
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ message: "Invalid" });

  const match = await user.matchPassword(password);
  if (!match) return res.status(401).json({ message: "Invalid" });

  const token = jwt.sign(
    {
      _id: user._id,
      email: user.email,
      role: user.role,
    },
    JWT_SECRET,
    { expiresIn: "7d" }
  );

  res.json({
    token,
    user: {
      _id: user._id,
      email: user.email,
      role: user.role,
    },
  });
});

// CHANGE PASSWORD
router.put("/change-password", requireAuth, async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const user = await User.findById(req.user._id);

  const match = await user.matchPassword(oldPassword);
  if (!match) return res.status(400).json({ message: "Wrong old password" });

  user.password = newPassword;
  await user.save();

  res.json({ message: "Password updated" });
});

module.exports = router;
