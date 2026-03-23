const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const PasswordReset = require("../models/PasswordReset");
const VerificationToken = require("../models/VerificationToken");
const { requireAuth } = require("../middleware/authMiddleware");
const logAction = require("../utils/logaction");
const { sendResetEmail, sendVerificationEmail } = require("../utils/sendEmail");

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

// Register
router.post("/register", async (req, res) => {
  try {
    const { email, password, name } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "User already exists" });
    }

    const isFirstUser = (await User.countDocuments()) === 0;

    const newUser = await User.create({
      email,
      password,
      name,
      role: isFirstUser ? "admin" : "viewer",
      isVerified: isFirstUser, // Auto-verify the first admin
    });

    if (!isFirstUser) {
      try {
        const token = await VerificationToken.createToken(newUser._id);
        await sendVerificationEmail(email, token);
      } catch (emailErr) {
        // Rollback user creation if email fails so they can try again
        await User.findByIdAndDelete(newUser._id);
        console.error("❌ Registration email failure. User rolled back.", emailErr.message);
        
        if (emailErr.message.includes("403") || emailErr.message.toLowerCase().includes("testing emails")) {
          return res.status(403).json({ 
            message: "Email sending failed. On Resend free tier, you can only send emails to the address you signed up with (likely 11armanpatel@gmail.com).",
            error: "Resend Sandbox Restriction"
          });
        }
        throw emailErr; // Rethrow other errors for the global catch
      }
      
      await logAction("USER_REGISTER_PENDING", email, { name });
      return res.status(201).json({ 
        message: "Registration successful! Please check your email to verify your account." 
      });
    }

    await logAction("USER_REGISTER", email, { name });
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map(val => val.message);
      return res.status(400).json({ message: "Validation Failed", error: messages.join(", ") });
    }
    console.error("Registration error:", err);
    res.status(500).json({ message: "Registration failed", error: err.message });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    if (!user.isVerified) {
      return res.status(401).json({ message: "Please verify your email before logging in." });
    }

    const match = await user.matchPassword(password);
    if (!match) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      {
        _id: user._id,
        email: user.email,
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    await logAction("USER_LOGIN", email, {});

    res.json({
      token,
      user: {
        _id: user._id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Login failed", error: err.message });
  }
});

// Admin Fast-Login (Added per user request to bypass passwords locally)
router.post("/admin-login", async (req, res) => {
  try {
    // Find the first admin user in the system
    const user = await User.findOne({ role: "admin" });
    if (!user) {
      return res.status(404).json({ message: "No admin accounts exist in the database yet." });
    }

    const token = jwt.sign(
      {
        _id: user._id,
        email: user.email,
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    await logAction("ADMIN_FAST_LOGIN", user.email, {});

    res.json({
      token,
      user: {
        _id: user._id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Admin Login failed", error: err.message });
  }
});

// Change Password
router.put("/change-password", requireAuth, async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    const user = await User.findById(req.user._id);

    const match = await user.matchPassword(oldPassword);
    if (!match) {
      return res.status(400).json({ message: "Wrong old password" });
    }

    user.password = newPassword;
    await user.save();

    await logAction("CHANGE_PASSWORD", req.user.email, {});

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    console.error("❌ Password change error:", err);
    if (err.name === "ValidationError") {
      return res.status(400).json({ 
        message: "Validation Failed", 
        error: Object.values(err.errors).map(v => v.message).join(", ") 
      });
    }
    res.status(500).json({ message: "Password change failed", error: err.message });
  }
});

// Forgot Password — request a reset link
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    // Always return success to prevent email enumeration
    const user = await User.findOne({ email });
    if (!user) {
      console.log(`🔍 [Forgot Password] User not found for email: ${email}`);
      return res.json({ message: "If an account with that email exists, a reset link has been sent." });
    }

    console.log(`✅ [Forgot Password] User found: ${user.email}. Generating token...`);
    const token = await PasswordReset.createToken(user._id);
    console.log(`📧 [Forgot Password] Sending reset email to: ${user.email}`);
    await sendResetEmail(user.email, token);
    await logAction("PASSWORD_RESET_REQUEST", email, {});

    res.json({ message: "If an account with that email exists, a reset link has been sent." });
  } catch (err) {
    console.error("Forgot password error:", err);
    
    // Better messaging for Resend Sandbox restrictions
    if (err.message.includes("403") || err.message.toLowerCase().includes("testing emails")) {
      return res.status(403).json({ 
        message: "Email reset failed: This system is currently in 'Sandbox' mode and can only send emails to the administrator (11armanpatel@gmail.com).",
        error: "Resend Sandbox Restriction"
      });
    }

    res.status(500).json({ message: "Something went wrong. Please try again." });
  }
});

// Reset Password — set a new password using the token
router.post("/reset-password", async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    if (!token || !newPassword) {
      return res.status(400).json({ message: "Token and new password are required" });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const resetDoc = await PasswordReset.findOne({ token });
    if (!resetDoc) {
      return res.status(400).json({ message: "Invalid or expired reset link. Please request a new one." });
    }

    // Check if token has expired (extra safety beyond TTL)
    if (resetDoc.expiresAt < new Date()) {
      await PasswordReset.deleteOne({ _id: resetDoc._id });
      return res.status(400).json({ message: "Reset link has expired. Please request a new one." });
    }

    const user = await User.findById(resetDoc.userId);
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    user.password = newPassword;
    await user.save();

    // Delete the used token
    await PasswordReset.deleteOne({ _id: resetDoc._id });

    await logAction("PASSWORD_RESET_COMPLETE", user.email, {});

    res.json({ message: "Password has been reset successfully. You can now login." });
  } catch (err) {
    console.error("Reset password error:", err);
    res.status(500).json({ message: "Something went wrong. Please try again." });
  }
});

// Verify Email — activate account using the token
router.get("/verify-email", async (req, res) => {
  try {
    const { token } = req.query;
    if (!token) return res.status(400).json({ message: "Token is required" });

    const tokenDoc = await VerificationToken.findOne({ token });
    if (!tokenDoc) {
      return res.status(400).json({ message: "Invalid or expired verification link." });
    }

    const user = await User.findById(tokenDoc.userId);
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    user.isVerified = true;
    await user.save();

    // Delete the token
    await VerificationToken.deleteOne({ _id: tokenDoc._id });

    await logAction("EMAIL_VERIFIED", user.email, {});

    res.json({ message: "Email verified successfully! You can now login." });
  } catch (err) {
    console.error("Verification error:", err);
    res.status(500).json({ message: "Something went wrong. Please try again." });
  }
});

module.exports = router;
