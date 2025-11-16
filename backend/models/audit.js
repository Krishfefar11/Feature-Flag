const mongoose = require("mongoose");

const auditSchema = new mongoose.Schema({
  action: { type: String, required: true },   // e.g., CREATE_FEATURE
  doneBy: { type: String, required: true },    // email of user
  timestamp: { type: Date, default: Date.now },
  details: { type: mongoose.Schema.Types.Mixed },
});

module.exports = mongoose.model("Audit", auditSchema);
