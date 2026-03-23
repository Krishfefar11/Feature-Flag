const Audit = require("../models/audit");

async function logAction(action, doneBy, details = {}) {
  try {
    await Audit.create({ action, doneBy, details });
  } catch (err) {
    console.log("Audit log failed:", err);
  }
}

module.exports = logAction;
