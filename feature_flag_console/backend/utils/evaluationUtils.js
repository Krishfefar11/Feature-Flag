const crypto = require("crypto");

/**
 * Consistently determines if a feature is enabled for a specific user based on rollout percentage.
 * @param {Object} feature - The feature flag document from MongoDB.
 * @param {string} userId - Unique identifier for the user (could be email, user ID, or device ID).
 * @returns {boolean} - Whether the feature should be enabled for this user.
 */
const evaluateFeature = (feature, userId) => {
  // 1. If feature is globally disabled, it's false for everyone
  if (!feature.enabled) {
    return false;
  }

  // 2. If rollout is 100%, it's true for everyone
  if (feature.rollout === 100) {
    return true;
  }

  // 3. If rollout is 0%, it's false for everyone
  if (feature.rollout === 0) {
    return false;
  }

  // 4. If no userId is provided, we can't do a consistent rollout, return false
  if (!userId) {
    return false;
  }

  // 5. Hash the userId + featureName to get a deterministic bucket (0-99)
  // We use MD5 for simplicity and consistency across different platforms/languages
  const hash = crypto.createHash("md5").update(userId + feature.name).digest("hex");
  
  // Take first 8 chars of hash to get a large enough integer (32-bitish)
  const hashInt = parseInt(hash.substring(0, 8), 16);
  
  // Map integer to 0-99 range
  const bucket = hashInt % 100;

  // 6. Compare bucket to rollout percentage
  return bucket < feature.rollout;
};

module.exports = { evaluateFeature };
