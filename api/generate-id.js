const express = require("express");
const crypto = require("crypto");
const router = express.Router();

router.get("/generate-id", (req, res) => {
  const userId = crypto.randomUUID();
  res.json({ userId });
});

module.exports = router;
