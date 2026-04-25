const express = require('express');
const cors = require('cors');
const { initDB } = require('./db');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const contactsRoutes = require('./routes/contacts');  // ✅ Fixed import name

const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// Initialize SQLite database
initDB();

// Routes - ✅ Fixed middleware order
app.use('/api/auth', authRoutes);
app.use('/api/contacts', contactsRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log('📊 Database: SQLite (businessapp.db)');
  console.log('👤 Default Admin: admin@businessapp.com / admin123');
});