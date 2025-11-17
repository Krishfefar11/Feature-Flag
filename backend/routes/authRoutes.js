const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { requireAuth } = require("../middleware/authMiddleware");

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

router.post("/register", async (req, res) => {
  const { email, password, name } = req.body;

  console.log("📝 REGISTER attempt:", email);

  const existing = await User.findOne({ email });
  if (existing) {
    console.log("❌ REGISTER FAILED: User already exists:", email);
    return res.status(400).json({ message: "User exists" });
  }

  const newUser = await User.create({
    email,
    password,
    name,
    role: "viewer",
  });

  console.log("✅ REGISTER SUCCESS:", newUser.email);

  res.status(201).json({ message: "User registered" });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  console.log("\n➡️ LOGIN attempt:", email);

  const user = await User.findOne({ email });
  if (!user) {
    console.log("❌ LOGIN FAILED: User not found:", email);
    return res.status(401).json({ message: "Invalid" });
  }

  const match = await user.matchPassword(password);
  if (!match) {
    console.log("❌ LOGIN FAILED: Wrong password for:", email);
    return res.status(401).json({ message: "Invalid" });
  }

  console.log("🔑 Generating JWT for:", user.email);

  const token = jwt.sign(
    {
      _id: user._id,
      email: user.email,
      role: user.role,
    },
    JWT_SECRET,
    { expiresIn: "7d" }
  );

  console.log("✅ LOGIN SUCCESS:", user.email);

  res.json({
    token,
    user: {
      _id: user._id,
      email: user.email,
      role: user.role,
    },
  });
});


router.put("/change-password", requireAuth, async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  console.log("\n🔐 PASSWORD CHANGE request by:", req.user.email);

  const user = await User.findById(req.user._id);

  const match = await user.matchPassword(oldPassword);
  if (!match) {
    console.log("❌ Password change FAILED: Old password incorrect for:", user.email);
    return res.status(400).json({ message: "Wrong old password" });
  }

  user.password = newPassword;
  await user.save();

  console.log("✅ Password updated successfully for:", user.email);

  res.json({ message: "Password updated" });
});

module.exports = router;
