const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  agentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Agent",
    required: true,
  },
  firstName: String,
  phone: String,
  notes: String,
});

module.exports = mongoose.model("Task", taskSchema);
