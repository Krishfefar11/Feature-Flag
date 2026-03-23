const express = require("express");
const path = require("path");

const app = express();
const PORT = 3001;

// The URL of the Feature Flag Console backend
const FF_BACKEND_URL = process.env.FF_BACKEND_URL || "http://127.0.0.1:5001";

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, "public")));

// Proxy route: Evaluate a feature flag
// This avoids CORS issues and decouples the frontend from the FF backend URL
app.get("/api/flag/:name", async (req, res) => {
  const { name } = req.params;
  const { userId } = req.query;

  try {
    // Disable caching to ensure real-time updates
    res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");

    console.log(`🔍 Evaluating flag: ${name} for user: ${userId}`);
    const url = `${FF_BACKEND_URL}/api/features/evaluate/${name}${userId ? `?userId=${userId}` : ""}`;
    console.log(`🔗 Proxying to: ${url}`);
    const response = await fetch(url);

    if (!response.ok) {
      return res.status(response.status).json({
        name,
        enabled: false,
        error: `Feature Flag API returned ${response.status}`,
      });
    }

    const data = await response.json();
    console.log(`✅ Result for ${name}:`, data);
    res.json(data);
  } catch (error) {
    console.error(`⚠️  Could not reach Feature Flag backend at ${FF_BACKEND_URL}:`, error.message);
    res.json({
      name,
      enabled: false,
      error: "Feature Flag backend unreachable — defaulting to OFF",
    });
  }
});

// Fallback: serve index.html for any other route
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`🛍️  Demo Store running at http://localhost:${PORT}`);
  console.log(`🔗 Feature Flag backend: ${FF_BACKEND_URL}`);
});
