const db = require("../config/db");

// Get all courses
exports.getAllCourses = () => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM courses";
    db.query(sql, (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
};

// Find course by ID
exports.findById = (id) => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM courses WHERE id = ?";
    db.query(sql, [id], (err, results) => {
      if (err) return reject(err);
      resolve(results[0]);
    });
  });
};
