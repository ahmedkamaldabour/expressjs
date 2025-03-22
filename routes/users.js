const express = require('express');
const authController = require('../app/Http/Controllers/Auth/AuthController');
const router = express.Router();

router.post('/signup', authController.register)
router.post('/login', authController.login)

module.exports = router;
