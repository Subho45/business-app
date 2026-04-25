const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'businessapp.db');
const db = new sqlite3.Database(dbPath);

const initDB = () => {
  // Users table
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      is_admin BOOLEAN DEFAULT FALSE,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Contacts table
  db.run(`
    CREATE TABLE IF NOT EXISTS contacts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      message TEXT NOT NULL,
      submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Create default admin user (email: admin@businessapp.com, password: admin123)
  db.get("SELECT * FROM users WHERE email = 'admin@businessapp.com'", (err, row) => {
    if (!row) {
      const bcrypt = require('bcryptjs');
      const hashedPassword = bcrypt.hashSync('admin123', 12);
      db.run(
        "INSERT INTO users (name, email, password, is_admin) VALUES (?, ?, ?, ?)",
        ['Admin User', 'admin@businessapp.com', hashedPassword, true]
      );
      console.log('✅ Default admin created: admin@businessapp.com / admin123');
    }
  });
};

module.exports = { db, initDB };