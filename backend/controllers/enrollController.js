// backend/controllers/enrollController.js
const db = require("../config/db");

// Enroll a course
const enrollCourse = async (req, res) => {
  try {
    const userId = req.user.id; // from authMiddleware
    const { courseId } = req.body;

    if (!courseId) {
      return res.status(400).json({ message: "Course ID is required" });
    }

    // ✅ Prevent duplicate enrollments
    const [existing] = await db.query(
      "SELECT * FROM enrollments WHERE user_id = ? AND course_id = ?",
      [userId, courseId]
    );

    if (existing.length > 0) {
      return res.status(400).json({ message: "Already enrolled in this course" });
    }

    // ✅ Insert enrollment
    await db.query(
      "INSERT INTO enrollments (user_id, course_id, enrolled_at) VALUES (?, ?, NOW())",
      [userId, courseId]
    );

    res.status(200).json({ message: "Enrolled successfully" });
  } catch (err) {
    console.error("Enroll Error:", err);
    res.status(500).json({ message: "Server error, please try again later" });
  }
};

// Get logged-in user's enrollments
const getMyEnrollments = async (req, res) => {
  try {
    const userId = req.user.id;

    const [enrollments] = await db.query(
      `SELECT c.id, c.title, c.description, c.teacher
       FROM enrollments e
       JOIN courses c ON e.course_id = c.id
       WHERE e.user_id = ?`,
      [userId]
    );

    res.status(200).json(enrollments);
  } catch (err) {
    console.error("Fetch Enrollments Error:", err);
    res.status(500).json({ message: "Server error, please try again later" });
  }
};

module.exports = { enrollCourse, getMyEnrollments };
