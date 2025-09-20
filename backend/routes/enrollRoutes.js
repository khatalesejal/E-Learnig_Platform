const express = require("express");
const router = express.Router();
const { enrollCourse, getMyEnrollments } = require("../controllers/enrollController");
const verifyToken = require("../middleware/authMiddleware");

// ✅ Enroll in a course (requires token)
router.post("/enroll-course", verifyToken, enrollCourse);

// ✅ Get logged-in user's enrollments (requires token)
router.get("/my-enrollments", verifyToken, getMyEnrollments);

module.exports = router;
