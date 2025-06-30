const express = require('express');
const combinationController = require('../controllers/combination.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const { upload, handleMulterError } = require('../middlewares/upload.middleware');

const router = express.Router();

// Aplicar middleware de autenticação a todas as rotas
router.use(authenticate);

/**
 * @route GET /api/combinations
 * @desc Lista todas as combinações do usuário atual
 * @access Private
 */
router.get('/', combinationController.listCombinations);

/**
 * @route GET /api/combinations/:id
 * @desc Obtém os detalhes de uma combinação específica
 * @access Private
 */
router.get('/:id', combinationController.getCombination);

/**
 * @route POST /api/combinations
 * @desc Cria uma nova combinação
 * @access Private
 */
router.post(
  '/',
  upload.fields([
    { name: 'upperImage', maxCount: 1 },
    { name: 'lowerImage', maxCount: 1 }
  ]),
  handleMulterError,
  combinationController.createCombination
);

/**
 * @route DELETE /api/combinations/:id
 * @desc Exclui uma combinação
 * @access Private
 */
router.delete('/:id', combinationController.deleteCombination);

/**
 * @route POST /api/combinations/:id/images
 * @desc Faz upload de imagens para uma combinação existente
 * @access Private
 */
router.post(
  '/:id/images',
  upload.fields([
    { name: 'upperImage', maxCount: 1 },
    { name: 'lowerImage', maxCount: 1 }
  ]),
  handleMulterError,
  combinationController.uploadCombinationImages
);

module.exports = router;