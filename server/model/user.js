const bcrypt = require('bcryptjs');
const { pool } = require('../db');

const User = {
  findByEmail: async (email) => {
    try {
      const result = await pool.query(
        "SELECT * FROM users WHERE email = $1",
        [email]
      );
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  },

  findById: async (id) => {
    try {
      const result = await pool.query(
        "SELECT * FROM users WHERE id = $1",
        [id]
      );
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  },

  create: async (name, email, password) => {
    try {
      const hashedPassword = bcrypt.hashSync(password, 12);
      const result = await pool.query(
        "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email",
        [name, email, hashedPassword]
      );
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  },

  comparePassword: (password, hashedPassword) => {
    return bcrypt.compare(password, hashedPassword);
  }
};

module.exports = User;