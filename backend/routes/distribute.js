const express = require("express");
const router = express.Router();
const XLSX = require("xlsx");
const upload = require("../middleware/upload");
const Agent = require("../models/agent");
const Task = require("../models/task");

router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file)
      return res.status(400).json({ message: "No file uploaded." });

    const workbook = XLSX.read(req.file.buffer, { type: "buffer" });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = XLSX.utils.sheet_to_json(sheet);

    for (const item of data) {
      if (!item.FirstName || !item.Phone || !item.Notes) {
        return res
          .status(400)
          .json({
            message: "Invalid format: Missing FirstName, Phone, or Notes.",
          });
      }
    }

    const agents = await Agent.find();
    if (agents.length < 1)
      return res.status(400).json({ message: "No agents found." });

    const agentCount = agents.length;
    let distributed = Array.from({ length: agentCount }, () => []);

    data.forEach((item, idx) => {
      const agentIndex = idx % agentCount;
      distributed[agentIndex].push(item);
    });

    for (let i = 0; i < distributed.length; i++) {
      await Task.insertMany(
        distributed[i].map((task) => ({
          agentId: agents[i]._id,
          firstName: task.FirstName,
          phone: task.Phone,
          notes: task.Notes,
        }))
      );
    }

    res.json({ message: "Tasks distributed successfully." });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ message: "Server error during file processing." });
  }
});

router.get("/tasks", async (req, res) => {
  try {
    const tasks = await Task.find().populate("agentId", "name email");
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: "Error fetching tasks." });
  }
});

module.exports = router;
