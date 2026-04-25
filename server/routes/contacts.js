const express = require('express');
const { body } = require('express-validator');
const Contact = require('../models/Contact');
const { auth, adminAuth } = require('../middleware/auth');  // ✅ THIS WAS MISSING
const router = express.Router();

router.post('/', [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('message').notEmpty().withMessage('Message is required')
], async (req, res) => {
  try {
    const { name, email, message } = req.body;
    await Contact.create(name, email, message);
    res.status(201).json({ msg: 'Message sent successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error' });
  }
});

router.get('/', auth, adminAuth, async (req, res) => {  // ✅ Now works!
  try {
    const contacts = await Contact.findAll();
    res.json(contacts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;