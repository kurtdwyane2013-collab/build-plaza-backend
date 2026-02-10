const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// TEMP STORE (OK for now)
const verifiedUsers = new Set();

/**
 * ROBLOX → RAILWAY
 * Called when player joins verification game
 */
app.post("/roblox-verify", (req, res) => {
	const { userId, username } = req.body;

	if (!userId || !username) {
		return res.status(400).json({ success: false });
	}

	verifiedUsers.add(String(userId));
	console.log("Verified:", username, userId);

	res.json({ success: true });
});

/**
 * WIX → RAILWAY
 * Check if user is verified
 */
app.post("/check-verification", (req, res) => {
	const { userId } = req.body;

	if (!userId) {
		return res.json({ verified: false });
	}

	const verified = verifiedUsers.has(String(userId));
	res.json({ verified });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
	console.log("Railway running on port", PORT);
});

