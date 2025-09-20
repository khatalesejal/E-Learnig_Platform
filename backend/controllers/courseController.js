const db = require("../config/db");

exports.getCourses = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM courses");
    res.json(rows);
  } catch (err) {
    console.error("Get courses error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
