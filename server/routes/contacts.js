const express = require('express');
const { body } = require('express-validator');
const { auth, adminAuth } = require('../middleware/auth');
const { sql } = require('@vercel/postgres'); // ✅ Postgres queries

const router = express.Router();

// ✅ POST /api/contacts - Create new contact
router.post('/', [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('phone').optional(),
  body('company').optional(),
  body('notes').optional()
], async (req, res) => {
  try {
    const { name, email, phone, company, notes, user_id } = req.body;
    
    const { rows } = await sql`
      INSERT INTO contacts (user_id, name, email, phone, company, notes)
      VALUES (${user_id || null}, ${name}, ${email}, ${phone || null}, ${company || null}, ${notes || null})
      RETURNING *
    `;
    
    res.status(201).json({ 
      msg: 'Contact created successfully!',
      contact: rows[0]
    });
  } catch (error) {
    console.error('Create contact error:', error);
    res.status(500).json({ msg: 'Server error' });
  }
});

// ✅ GET /api/contacts - Get all contacts (Admin only)
router.get('/', auth, adminAuth, async (req, res) => {
  try {
    const { rows } = await sql`
      SELECT c.*, u.name as user_name, u.email as user_email
      FROM contacts c
      LEFT JOIN users u ON c.user_id = u.id
      ORDER BY c.created_at DESC
    `;
    
    res.json({ contacts: rows });
  } catch (error) {
    console.error('Get contacts error:', error);
    res.status(500).json({ msg: 'Server error' });
  }
});

// ✅ GET /api/contacts/:id - Get single contact
router.get('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await sql`
      SELECT c.*, u.name as user_name
      FROM contacts c
      LEFT JOIN users u ON c.user_id = u.id
      WHERE c.id = ${id}
    `;
    
    if (!rows[0]) {
      return res.status(404).json({ msg: 'Contact not found' });
    }
    
    res.json(rows[0]);
  } catch (error) {
    console.error('Get contact error:', error);
    res.status(500).json({ msg: 'Server error' });
  }
});

// ✅ DELETE /api/contacts/:id - Delete contact
router.delete('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    
    const { rows } = await sql`
      DELETE FROM contacts 
      WHERE id = ${id} 
      RETURNING *
    `;
    
    if (!rows[0]) {
      return res.status(404).json({ msg: 'Contact not found' });
    }
    
    res.json({ msg: 'Contact deleted successfully!' });
  } catch (error) {
    console.error('Delete contact error:', error);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;