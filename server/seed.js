const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const path = require('path');

const dbPath = path.join(__dirname, 'businessapp.db');
const db = new sqlite3.Database(dbPath);

console.log('🌱 Seeding database...');

// Create admin user
const adminEmail = 'admin@businessapp.com';
const adminPassword = bcrypt.hashSync('admin123', 12);
const adminName = 'Admin User';

db.run(
  "INSERT OR IGNORE INTO users (name, email, password, is_admin) VALUES (?, ?, ?, ?)",
  [adminName, adminEmail, adminPassword, 1],
  function(err) {
    if (err) {
      console.error('❌ Error creating admin:', err);
    } else {
      console.log('✅ Admin user created successfully!');
      console.log('📧 Email: admin@businessapp.com');
      console.log('🔑 Password: admin123');
    }
    db.close();
  }
);
