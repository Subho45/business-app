const bcrypt = require('bcryptjs');
const { db } = require('../db');

const User = {
  findByEmail: (email) => {
    return new Promise((resolve, reject) => {
      db.get("SELECT * FROM users WHERE email = ?", [email], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  },

  findById: (id) => {
    return new Promise((resolve, reject) => {
      db.get("SELECT * FROM users WHERE id = ?", [id], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  },

  create: (name, email, password) => {
    return new Promise((resolve, reject) => {
      const hashedPassword = bcrypt.hashSync(password, 12);
      db.run(
        "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
        [name, email, hashedPassword],
        function(err) {
          if (err) reject(err);
          else resolve({ id: this.lastID, name, email });
        }
      );
    });
  },

  comparePassword: (password, hashedPassword) => {
    return bcrypt.compare(password, hashedPassword);
  }
};

module.exports = User;