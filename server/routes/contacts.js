const express = require('express');
const { body } = require('express-validator');
const { auth, adminAuth } = require('../middleware/auth');
const { pool } = require('../db');

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
    
    const result = await pool.query(
      "INSERT INTO contacts (name, email, message) VALUES ($1, $2, $3) RETURNING *",
      [name, email, notes || '']
    );
    
    res.status(201).json({ 
      msg: 'Contact created successfully!',
      contact: result.rows[0]
    });
  } catch (error) {
    console.error('Create contact error:', error);
    res.status(500).json({ msg: 'Server error' });
  }
});

// ✅ GET /api/contacts - Get all contacts (Admin only)
router.get('/', auth, adminAuth, async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM contacts ORDER BY submitted_at DESC"
    );
    
    res.json({ contacts: result.rows });
  } catch (error) {
    console.error('Get contacts error:', error);
    res.status(500).json({ msg: 'Server error' });
  }
});

// ✅ GET /api/contacts/:id - Get single contact
router.get('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      "SELECT * FROM contacts WHERE id = $1",
      [id]
    );
    
    if (!result.rows[0]) {
      return res.status(404).json({ msg: 'Contact not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Get contact error:', error);
    res.status(500).json({ msg: 'Server error' });
  }
});

// ✅ DELETE /api/contacts/:id - Delete contact
router.delete('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query(
      "DELETE FROM contacts WHERE id = $1 RETURNING *",
      [id]
    );
    
    if (!result.rows[0]) {
      return res.status(404).json({ msg: 'Contact not found' });
    }
    
    res.json({ msg: 'Contact deleted successfully!' });
  } catch (error) {
    console.error('Delete contact error:', error);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;