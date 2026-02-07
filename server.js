const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const verifiedUsers = {};

app.post("/verify-from-roblox", (req, res) => {
  const { username, passes } = req.body;

  if (!username || !passes) {
    return res.status(400).json({ success: false });
  }

  verifiedUsers[username] = passes;
  res.json({ success: true });
});

app.post("/check-gamepass", (req, res) => {
  const { username, passKey } = req.body;

  if (!username || !passKey) {
    return res.json({ owned: false });
  }

  const userData = verifiedUsers[username];
  if (!userData) {
    return res.json({ owned: false });
  }

  res.json({ owned: userData[passKey] === true });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
