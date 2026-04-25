const express = require('express');
const cors = require('cors');

// ✅ NEW: Vercel Postgres (instead of SQLite)
const { sql } = require('@vercel/postgres');

// Load .env for Vercel
require('dotenv').config();

const authRoutes = require('./routes/auth');
const contactsRoutes = require('./routes/contacts');

const app = express();

// Vercel CORS
app.use(cors({
  origin: process.env.VERCEL_URL ? 
    `https://${process.env.VERCEL_URL}` : 
    'http://localhost:3000',
  credentials: true
}));

app.use(express.json());

// ✅ NEW: Postgres initDB (async)
async function initDB() {
  try {
    // Create users table
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        name TEXT,
        role TEXT DEFAULT 'user',
        created_at TIMESTAMP DEFAULT NOW()
      )
    `;
    
    // Create contacts table
    await sql`
      CREATE TABLE IF NOT EXISTS contacts (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        name TEXT NOT NULL,
        email TEXT,
        phone TEXT,
        company TEXT,
        notes TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `;
    
    console.log('✅ Postgres database initialized');
  } catch (error) {
    console.error('❌ Database init error:', error.message);
  }
}

// Initialize database
initDB().catch(console.error);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/contacts', contactsRoutes);

// Health check
app.get('/api/health', async (req, res) => {
  try {
    const result = await sql`SELECT 1`;
    res.json({ status: 'OK', db: 'Postgres', timestamp: new Date().toISOString() });
  } catch (error) {
    res.status(500).json({ status: 'Error', error: error.message });
  }
});

// ✅ Vercel serverless export
module.exports = app;