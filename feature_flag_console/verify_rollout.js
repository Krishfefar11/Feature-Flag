const { evaluateFeature } = require("./backend/utils/evaluationUtils");

const runTest = (rollout, numUsers = 1000) => {
  const feature = {
    name: "test-feature",
    enabled: true,
    rollout: rollout
  };

  let enabledCount = 0;
  for (let i = 0; i < numUsers; i++) {
    const userId = `user-${i}`;
    if (evaluateFeature(feature, userId)) {
      enabledCount++;
    }
  }

  const actualPercentage = (enabledCount / numUsers) * 100;
  console.log(`Rollout Set: ${rollout}% | Actual Enabled: ${actualPercentage.toFixed(2)}% (${enabledCount}/${numUsers})`);
};

console.log("--- Feature Flag Rollout Verification ---");
runTest(0);
runTest(10);
runTest(25);
runTest(50);
runTest(75);
runTest(90);
runTest(100);

// Test Consistency
const feature = { name: "consistency-test", enabled: true, rollout: 50 };
const user = "fixed-user-123";
const result1 = evaluateFeature(feature, user);
const result2 = evaluateFeature(feature, user);
console.log(`\nConsistency Test (User: ${user}): ${result1 === result2 ? "PASS (Consistent)" : "FAIL (Inconsistent)"}`);

// Test Disabled Feature
const disabledFeature = { name: "disabled", enabled: false, rollout: 100 };
console.log(`Disabled Feature Test: ${evaluateFeature(disabledFeature, "any-user") === false ? "PASS" : "FAIL"}`);
