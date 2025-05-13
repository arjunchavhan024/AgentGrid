const Agent = require("../models/agent.js");

exports.createAgent = async (req, res) => {
  try {
    const { name, email, mobile, password } = req.body;

    if (!name || !email || !mobile || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existing = await Agent.findOne({ email });
    if (existing) {
      return res
        .status(409)
        .json({ message: "Agent with this email already exists" });
    }

    const agent = new Agent({ name, email, mobile, password });
    await agent.save();

    res.status(201).json({ message: "Agent created successfully", agent });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
