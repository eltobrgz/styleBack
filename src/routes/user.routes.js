const express = require('express');
const userController = require('../controllers/user.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const { upload, handleMulterError } = require('../middlewares/upload.middleware');

const router = express.Router();

// Aplicar middleware de autenticação a todas as rotas
router.use(authenticate);

/**
 * @route GET /api/users/me
 * @desc Obtém os dados do usuário atual
 * @access Private
 */
router.get('/me', userController.getCurrentUser);

/**
 * @route PUT /api/users/me
 * @desc Atualiza os dados do usuário atual
 * @access Private
 */
router.put('/me', userController.updateCurrentUser);

/**
 * @route POST /api/users/me/profile-image
 * @desc Faz upload da imagem de perfil do usuário
 * @access Private
 */
router.post(
  '/me/profile-image',
  upload.single('image'),
  handleMulterError,
  userController.uploadProfileImage
);

module.exports = router;