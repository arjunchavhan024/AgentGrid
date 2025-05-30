require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const connection = require("./db");
const userRoutes = require("./routes/users");
const authRoutes = require("./routes/auth");
const agentRoutes = require("./routes/agentRoutes");
const uploadRoutes = require("./routes/distribute.js"); // adjust path

// Connection
connection();

// Middlewars
app.use(express.json());
app.use(cors());

// routes
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/agents", agentRoutes);
app.use("/api", uploadRoutes); // makes POST /api/upload available

const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log(`App is listining to port ${port}`);
});
