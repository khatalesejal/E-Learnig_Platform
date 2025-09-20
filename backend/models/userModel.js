
const db = require("../config/db");

// Create new user
exports.createUser = (name, email, password, role = "student") => {
  return new Promise((resolve, reject) => {
    const sql = "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)";
    db.query(sql, [name, email, password, role], (err, result) => {
      if (err) return reject(err);
      resolve(result.insertId);
    });
  });
};

// Find user by email
exports.findByEmail = (email) => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM users WHERE email = ?";
    db.query(sql, [email], (err, results) => {
      if (err) return reject(err);
      resolve(results[0]);
    });
  });
};

// Find user by ID
exports.findById = (id) => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT id, name, email, role FROM users WHERE id = ?";
    db.query(sql, [id], (err, results) => {
      if (err) return reject(err);
      resolve(results[0]);
    });
  });
};
