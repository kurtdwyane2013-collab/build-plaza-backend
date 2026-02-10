import express from "express";
import fetch from "node-fetch";

const app = express();
app.use(express.json()); // 🔥 REQUIRED or POST will fail

const PORT = process.env.PORT || 3000;

// 🔹 GAMEPASS IDS
const GAMEPASSES = {
  boat1: 1691812343, // Gipsy Avenger
  boat2: 1700921812, // Gipsy Danger
  boat3: 1700989528  // Gipsy Danger 2.5
};

// 🔹 Convert username → userId
async function getUserId(username) {
  const res = await fetch("https://users.roblox.com/v1/usernames/users", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      usernames: [username],
      excludeBannedUsers: true
    })
  });

  const data = await res.json();
  return data?.data?.[0]?.id;
}

// 🔹 CHECK GAMEPASS ROUTE
app.post("/check-gamepass", async (req, res) => {
  try {
    const { username, passKey } = req.body;

    if (!username || !passKey) {
      return res.status(400).json({ owned: false });
    }

    const userId = await getUserId(username);
    if (!userId) {
      return res.json({ owned: false });
    }

    const gamepassId = GAMEPASSES[passKey];
    if (!gamepassId) {
      return res.json({ owned: false });
    }

    const ownsRes = await fetch(
      `https://inventory.roblox.com/v1/users/${userId}/items/GamePass/${gamepassId}`
    );

    const ownsData = await ownsRes.json();
    const owned = ownsData?.data?.length > 0;

    return res.json({ owned });

  } catch (err) {
    console.error("ERROR:", err);
    return res.status(500).json({ owned: false });
  }
});

// 🔹 HEALTH CHECK
app.get("/", (_, res) => {
  res.send("Build Plaza backend running");
});

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
