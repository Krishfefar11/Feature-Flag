const mongoose = require("mongoose");
const User = require("./models/User");
const VerificationToken = require("./models/VerificationToken");
const { sendVerificationEmail } = require("./utils/sendEmail");

async function diagnose() {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/featureflags");
    console.log("✅ MongoDB Connected");

    const email = "diag_" + Date.now() + "@gmail.com";
    const password = "password123";

    console.log(`Testing registration for ${email}...`);
    
    // 1. Create User
    const newUser = await User.create({
      email,
      password,
      role: "viewer",
      isVerified: false
    });
    console.log("✅ User created");

    // 2. Create Token
    const token = await VerificationToken.createToken(newUser._id);
    console.log("✅ Token created:", token);

    // 3. Send Email (This might fail if API key is missing or invalid in this shell)
    // We'll wrap this specifically to see if it's the culprit
    try {
      await sendVerificationEmail(email, token);
      console.log("✅ Email sent");
    } catch (emailErr) {
      console.error("❌ Email sending failed:", emailErr.message);
    }

    console.log("DIAGNOSIS COMPLETE");
    process.exit(0);
  } catch (err) {
    console.error("❌ DIAGNOSIS FAILED:", err);
    process.exit(1);
  }
}

diagnose();
