const express = require('express');
const authController = require('../controllers/auth.controller');
const { authenticate } = require('../middlewares/auth.middleware');

const router = express.Router();

/**
 * @route POST /api/auth/register
 * @desc Registra um novo usuário
 * @access Public
 */
router.post('/register', authController.register);

/**
 * @route POST /api/auth/login
 * @desc Realiza o login de um usuário
 * @access Public
 */
router.post('/login', authController.login);

/**
 * @route GET /api/auth/verify
 * @desc Verifica se o token do usuário é válido
 * @access Private
 */
router.get('/verify', authenticate, authController.verifyToken);

module.exports = router;