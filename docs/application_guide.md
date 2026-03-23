# Guide: How to Apply Feature Flags

Follow these steps to add and use a new feature flag in your application.

## Step 1: Create a Flag in the Console
1.  Open the **Feature Flag Console Dashboard** (`http://localhost:3000`).
2.  Log in as an **Admin** (the first account you registered).
3.  Click **Create Feature**.
4.  Enter a name (e.g., `special-offer`) and description.
5.  Set the **Enabled** toggle and the **Rollout (%)**.
    - *Example:* Set to 50% to show the feature to half your users.

## Step 2: Proxy the Evaluation on the Server
Your application server should act as a middleman to avoid sharing secrets or CORS issues.

In `demo-app/server.js`, use the evaluation endpoint:
```javascript
app.get("/api/flag/:name", async (req, res) => {
  const { name } = req.params;
  const { userId } = req.query; // Always pass a unique identity for consistent rollout
  const response = await fetch(`${FF_BACKEND_URL}/api/features/evaluate/${name}?userId=${userId}`);
  const data = await response.json();
  res.json(data);
});
```

## Step 3: Consume the Flag in the Frontend
Now you can dynamically update your UI based on the flag status.

In `demo-app/public/app.js`:
```javascript
async function checkSpecialOffer() {
  const userId = "current-user-uuid"; // Get from your session/auth
  const response = await fetch(`/api/flag/special-offer?userId=${userId}`);
  const { enabled } = await response.json();

  if (enabled) {
    document.getElementById("special-offer-banner").style.display = "block";
    console.log("🎁 Special offer is ON for you!");
  } else {
    console.log("🎁 Special offer is OFF for you.");
  }
}
```

## Why use a User ID?
Providing a `userId` ensures that once a user sees a feature (e.g., in a 50% rollout), they continue to see it even after refreshing. This provides a consistent experience.
