const mongoose = require("mongoose");
const crypto = require("crypto");

const verificationTokenSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  token: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 86400, // 24 hours
  },
});

// Static helper to generate a verification token
verificationTokenSchema.statics.createToken = async function (userId) {
  const token = crypto.randomBytes(32).toString("hex");
  await this.create({ userId, token });
  return token;
};

module.exports = mongoose.model("VerificationToken", verificationTokenSchema);
