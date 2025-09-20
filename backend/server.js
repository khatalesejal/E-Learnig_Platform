const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

const authRoutes = require("./routes/authRoutes");
const courseRoutes = require("./routes/courseRoutes");
const enrollRoutes = require("./routes/enrollRoutes");

dotenv.config();
const app = express();

require("dotenv").config();

app.use(cors());
app.use(express.json());


// ✅ API Routes FIRST
app.use("/api/auth", authRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/enroll", enrollRoutes);

// ✅ Serve static frontend after APIs
app.use(express.static(path.join(__dirname, "../frontend")));

app.get("/", (req, res) => {
  res.send("✅ E-Learning API is running...");
});

// ✅ Catch-all only for frontend routes
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend", "index.html"));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at: http://localhost:${PORT}`);
});
