const db = require("../config/db");

// Enroll a student in a course
exports.enrollStudent = (userId, courseId) => {
  return new Promise((resolve, reject) => {
    const sql = "INSERT INTO enrollments (user_id, course_id) VALUES (?, ?)";
    db.query(sql, [userId, courseId], (err, result) => {
      if (err) return reject(err);
      resolve(result.insertId);
    });
  });
};

// Get enrollments for a student
exports.getEnrollmentsByUser = (userId) => {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT e.id, c.title, c.description, c.price, e.enrolled_at 
      FROM enrollments e
      JOIN courses c ON e.course_id = c.id
      WHERE e.user_id = ?
    `;
    db.query(sql, [userId], (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
};
