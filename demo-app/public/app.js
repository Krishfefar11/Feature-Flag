/**
 * Demo Store — Feature Flag Client
 *
 * On page load, evaluates three feature flags via the local proxy server
 * and dynamically shows/hides UI sections based on the results.
 */

const SIMULATED_USER_ID = "demo_user_42";

/**
 * Evaluate a single feature flag via the backend proxy.
 * Returns { name, enabled, error? }
 */
async function evaluateFlag(flagName) {
  try {
    // Add cache-buster timestamp
    const res = await fetch(`/api/flag/${flagName}?userId=${SIMULATED_USER_ID}&t=${Date.now()}`);
    const data = await res.json();
    return data;
  } catch (err) {
    console.warn(`⚠️ Failed to evaluate flag "${flagName}":`, err);
    return { name: flagName, enabled: false, error: err.message };
  }
}

/**
 * Update the flag status indicator in the side panel.
 */
function setFlagIndicator(flagName, enabled, isFound = true) {
  let el = document.getElementById(`flag-${flagName}`);
  
  // If the element doesn't exist, create it for custom/unknown flags
  if (!el) {
    const panel = document.getElementById("flag-panel");
    const div = document.createElement("div");
    div.className = "flag-item";
    div.innerHTML = `
      <span class="flag-name">${flagName}</span>
      <span class="flag-status loading" id="flag-${flagName}">⏳ …</span>
    `;
    panel.appendChild(div);
    el = document.getElementById(`flag-${flagName}`);
  }

  el.classList.remove("loading", "on", "off");
  
  if (!isFound) {
    el.classList.add("off");
    el.textContent = "❓ NOT FOUND";
    el.title = "Create this flag in the dashboard with this exact name!";
    return;
  }

  if (enabled) {
    el.classList.add("on");
    el.textContent = "🟢 ON";
  } else {
    el.classList.add("off");
    el.textContent = "🔴 OFF";
  }
}

/**
 * Apply flag results to the UI.
 */
function applyFlags(results) {
  const flags = {};
  results.forEach((r) => {
    flags[r.name] = r.enabled;
    const isFound = !r.error || !r.error.includes("404");
    setFlagIndicator(r.name, r.enabled, isFound);
  });

  // Specific Logic for Demo Features
  // promo-banner
  const promoBanner = document.getElementById("promo-banner");
  if (flags["promo-banner"]) {
    promoBanner.classList.add("visible");
  } else {
    promoBanner.classList.remove("visible");
  }

  // new-arrivals
  const badges = document.querySelectorAll("[data-new-badge]");
  if (flags["new-arrivals"]) {
    badges.forEach((badge) => badge.classList.add("visible"));
  } else {
    badges.forEach((badge) => badge.classList.remove("visible"));
  }

  // dark-mode
  const darkSection = document.getElementById("dark-mode-section");
  if (flags["dark-mode"]) {
    darkSection.classList.add("visible");
    document.body.classList.add("dark-mode-active");
  } else {
    darkSection.classList.remove("visible");
    document.body.classList.remove("dark-mode-active");
  }
}

/**
 * Bootstrap: evaluate all flags in parallel and apply them.
 */
async function syncFlags() {
  // We check for the 3 demo-specific flags + any the user might be testing
  const flagNames = ["promo-banner", "new-arrivals", "dark-mode"];
  
  // Try to find if user added 'first one' (from my DB check)
  if (!flagNames.includes("first one")) flagNames.push("first one");

  try {
    const results = await Promise.all(flagNames.map(evaluateFlag));
    console.log("🔄 Syncing flags:", results);
    applyFlags(results);
  } catch (err) {
    console.error("❌ Sync failed:", err);
  }
}

async function init() {
  await syncFlags();
  // Poll for changes every 2 seconds to make it feel instant
  setInterval(syncFlags, 2000);
  console.log("🚀 Real-time sync active (2s interval)");
}

document.addEventListener("DOMContentLoaded", init);
