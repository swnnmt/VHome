const express = require('express');
const router = express.Router();
const {signup,login,getUserById,topup, useDesign,getCurrentUser} = require('../controllers/authController');
const authenticateToken = require('../middlewares/auth');

router.post('/signup', signup);
router.post('/login', login);
router.get('/user/me', authenticateToken, getCurrentUser);
router.get('/user/:id', getUserById);
router.post('/user/topup', authenticateToken, topup);
router.post('/use-design', authenticateToken, useDesign);

module.exports = router;
