const express = require("express");
const Feature = require("../models/Feature");
const { requireAuth, requireRole } = require("../middleware/authMiddleware");
const logAction = require("../utils/logaction");
const { evaluateFeature } = require("../utils/evaluationUtils");

const router = express.Router();

// EVALUATE a feature (Public/Internal API)
// GET /api/features/evaluate/:name?userId=...
router.get("/evaluate/:name", async (req, res) => {
  try {
    const { name } = req.params;
    const { userId } = req.query;

    const feature = await Feature.findOne({ name });

    if (!feature) {
      return res.status(404).json({ message: "Feature not found", enabled: false });
    }

    const isEnabled = evaluateFeature(feature, userId);

    res.json({
      name: feature.name,
      enabled: isEnabled,
      rollout: feature.rollout,
      userId: userId || "none"
    });
  } catch (error) {
    res.status(500).json({ message: "Error evaluating feature", error: error.message });
  }
});

// GET all features (any authenticated user)
router.get("/", requireAuth, async (req, res) => {
  try {
    const features = await Feature.find();
    res.json(features);
  } catch (error) {
    res.status(500).json({ message: "Error fetching features", error: error.message });
  }
});

// CREATE a feature (admin & developer only)
router.post("/", requireAuth, requireRole("admin", "developer"), async (req, res) => {
  try {
    const { name, description, enabled, rollout } = req.body;
    const newFeature = new Feature({ name, description, enabled, rollout });
    const savedFeature = await newFeature.save();

    await logAction("CREATE_FEATURE", req.user.email, {
      featureId: savedFeature._id,
      name: savedFeature.name,
    });

    res.status(201).json(savedFeature);
  } catch (error) {
    res.status(400).json({ message: "Error creating feature", error: error.message });
  }
});

// UPDATE a feature (admin & developer only)
router.put("/:id", requireAuth, requireRole("admin", "developer"), async (req, res) => {
  try {
    const oldFeature = await Feature.findById(req.params.id);
    const updatedFeature = await Feature.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    await logAction("UPDATE_FEATURE", req.user.email, {
      featureId: updatedFeature._id,
      name: updatedFeature.name,
      changes: {
        enabledBefore: oldFeature?.enabled,
        enabledAfter: updatedFeature.enabled,
      },
    });

    res.json(updatedFeature);
  } catch (error) {
    res.status(400).json({ message: "Error updating feature", error: error.message });
  }
});

// DELETE a feature (admin only)
router.delete("/:id", requireAuth, requireRole("admin"), async (req, res) => {
  try {
    const feature = await Feature.findById(req.params.id);
    const featureName = feature?.name || "unknown";

    await Feature.findByIdAndDelete(req.params.id);

    await logAction("DELETE_FEATURE", req.user.email, {
      featureId: req.params.id,
      name: featureName,
    });

    res.json({ message: "Feature deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting feature", error: error.message });
  }
});

module.exports = router;
