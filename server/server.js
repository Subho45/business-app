const express = require('express');
const cors = require('cors');
const { initDB } = require('./db');

// Load .env for Vercel
require('dotenv').config();

const authRoutes = require('./routes/auth');
const contactsRoutes = require('./routes/contacts');

const app = express();

// Vercel CORS (allow frontend)
app.use(cors({
  origin: process.env.VERCEL_URL ? 
    `https://${process.env.VERCEL_URL}` : 
    'http://localhost:3000',
  credentials: true
}));

app.use(express.json());

// Initialize SQLite database
initDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/contacts', contactsRoutes);

// Vercel serverless handler
if (process.env.VERCEL) {
  module.exports = app;
} else {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log('📊 Database: SQLite (businessapp.db)');
    console.log('👤 Default Admin: admin@businessapp.com / admin123');
  });
}