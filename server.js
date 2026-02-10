import express from "express";

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

// TEMP STORE (works for now)
const verifiedUsers = new Set();

/**
 * ROBLOX → RAILWAY
 * Called when player joins verification game
 */
app.post("/roblox-verify", (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ success: false });
  }

  verifiedUsers.add(String(userId));
  console.log("✅ Verified user:", userId);

  res.json({ success: true });
});

/**
 * WIX → RAILWAY
 * Check verification status
 */
app.post("/check-gamepass", (req, res) => {
  const { username, passKey } = req.body;

  // passKey is optional now, kept for compatibility
  if (!username) {
    return res.json({ owned: false });
  }

  // IMPORTANT: Wix must send userId OR username->userId mapping
  // For now, expect userId directly
  const userId = req.body.userId;

  if (!userId) {
    return res.json({ owned: false });
  }

  const owned = verifiedUsers.has(String(userId));
  res.json({ owned });
});

app.get("/", (_, res) => {
  res.send("Build Plaza backend running");
});

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
