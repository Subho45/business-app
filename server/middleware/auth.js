const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    
    if (!user) {
      return res.status(401).json({ msg: 'Token is not valid' });
    }
    
    req.user = { id: user.id, isAdmin: user.is_admin };
    next();
  } catch (error) {
    console.error('Auth error:', error);
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

const adminAuth = (req, res, next) => {
  if (!req.user.isAdmin) {
    return res.status(403).json({ msg: 'Admin access required' });
  }
  next();
};

module.exports = { auth, adminAuth };