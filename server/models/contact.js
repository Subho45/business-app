const { db } = require('../db');

const Contact = {
  create: (name, email, message) => {
    return new Promise((resolve, reject) => {
      db.run(
        "INSERT INTO contacts (name, email, message) VALUES (?, ?, ?)",
        [name, email, message],
        function(err) {
          if (err) reject(err);
          else resolve({ id: this.lastID, name, email, message, submittedAt: new Date().toISOString() });
        }
      );
    });
  },

  findAll: () => {
    return new Promise((resolve, reject) => {
      db.all("SELECT * FROM contacts ORDER BY submitted_at DESC", (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }
};

module.exports = Contact;