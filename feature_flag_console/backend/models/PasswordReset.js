const mongoose = require("mongoose");
const crypto = require("crypto");

const passwordResetSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  token: {
    type: String,
    required: true,
    unique: true,
  },
  expiresAt: {
    type: Date,
    required: true,
    default: () => new Date(Date.now() + 15 * 60 * 1000), // 15 minutes
  },
});

// Auto-delete expired tokens via MongoDB TTL index
passwordResetSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Static helper to generate a secure token
passwordResetSchema.statics.createToken = async function (userId) {
  // Delete any existing tokens for this user first
  await this.deleteMany({ userId });

  const token = crypto.randomBytes(32).toString("hex");
  const resetDoc = await this.create({ userId, token });
  return resetDoc.token;
};

module.exports = mongoose.model("PasswordReset", passwordResetSchema);
