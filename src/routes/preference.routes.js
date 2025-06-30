const express = require('express');
const preferenceController = require('../controllers/preference.controller');
const { authenticate } = require('../middlewares/auth.middleware');

const router = express.Router();

// Aplicar middleware de autenticação a todas as rotas
router.use(authenticate);

/**
 * @route GET /api/preferences
 * @desc Obtém as preferências do usuário atual
 * @access Private
 */
router.get('/', preferenceController.getUserPreferences);

/**
 * @route POST /api/preferences
 * @desc Salva as preferências do usuário
 * @access Private
 */
router.post('/', preferenceController.savePreferences);

/**
 * @route PUT /api/preferences
 * @desc Atualiza as preferências do usuário
 * @access Private
 */
router.put('/', preferenceController.updatePreferences);

module.exports = router;