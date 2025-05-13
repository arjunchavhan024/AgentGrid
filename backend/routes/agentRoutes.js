const express = require("express");
const router = express.Router();
const { createAgent } = require("../controllers/agentController");
const Agent = require("../models/agent.js");
const verifyToken = require("../middleware/authMiddleware");

// POST - Add Agent
router.post("/add", verifyToken, createAgent);

// GET - Fetch All Agents
router.get("/", verifyToken, async (req, res) => {
  try {
    const agents = await Agent.find().select("-password"); // Don't send passwords
    res.json(agents);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
