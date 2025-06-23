const express = require('express')
const router = express.Router()
const { signup, login, getUserById, topup } = require('../controllers/authController')
const authenticateToken = require('../middlewares/auth');
router.post('/signup', signup);
router.post('/login', login);
router.get('/user/:id', getUserById);
router.post('/user/topup', authenticateToken, topup);
module.exports = router
