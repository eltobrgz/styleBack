const supabaseService = require('../services/supabase.service');

/**
 * Controlador para gerenciar combinações de roupas
 */
class CombinationController {
  /**
   * Lista todas as combinações do usuário atual
   * @param {Object} req - Objeto de requisição Express
   * @param {Object} res - Objeto de resposta Express
   */
  async listCombinations(req, res) {
    try {
      const userId = req.user.id;
      const prisma = req.prisma;

      // Buscar todas as combinações do usuário
      const combinations = await prisma.combination.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
      });

      return res.status(200).json({ combinations });
    } catch (error) {
      console.error('Erro ao listar combinações:', error);
      return res.status(500).json({ message: 'Erro ao listar combinações' });
    }
  }

  /**
   * Obtém os detalhes de uma combinação específica
   * @param {Object} req - Objeto de requisição Express
   * @param {Object} res - Objeto de resposta Express
   */
  async getCombination(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      const prisma = req.prisma;

      // Buscar a combinação pelo ID
      const combination = await prisma.combination.findUnique({
        where: { id },
      });

      // Verificar se a combinação existe
      if (!combination) {
        return res.status(404).json({ message: 'Combinação não encontrada' });
      }

      // Verificar se a combinação pertence ao usuário atual
      if (combination.userId !== userId) {
        return res.status(403).json({ message: 'Acesso negado' });
      }

      return res.status(200).json({ combination });
    } catch (error) {
      console.error('Erro ao obter detalhes da combinação:', error);
      return res.status(500).json({ message: 'Erro ao obter detalhes da combinação' });
    }
  }

  /**
   * Cria uma nova combinação
   * @param {Object} req - Objeto de requisição Express
   * @param {Object} res - Objeto de resposta Express
   */
  async createCombination(req, res) {
    try {
      const { name, description } = req.body;
      const userId = req.user.id;
      const prisma = req.prisma;

      // Verificar se os arquivos foram enviados
      if (!req.files || !req.files.upperImage || !req.files.lowerImage) {
        return res.status(400).json({ message: 'Imagens superior e inferior são obrigatórias' });
      }

      // Fazer upload das imagens para o Supabase
      const upperImageUrl = await supabaseService.uploadClothingImage(
        req.files.upperImage[0].buffer,
        req.files.upperImage[0].originalname,
        userId,
        'upper'
      );

      const lowerImageUrl = await supabaseService.uploadClothingImage(
        req.files.lowerImage[0].buffer,
        req.files.lowerImage[0].originalname,
        userId,
        'lower'
      );

      // Criar a combinação no banco de dados
      const combination = await prisma.combination.create({
        data: {
          userId,
          name: name || 'Minha combinação',
          description: description || '',
          upperImage: upperImageUrl,
          lowerImage: lowerImageUrl,
        },
      });

      return res.status(201).json({
        message: 'Combinação criada com sucesso',
        combination,
      });
    } catch (error) {
      console.error('Erro ao criar combinação:', error);
      return res.status(500).json({ message: 'Erro ao criar combinação' });
    }
  }

  /**
   * Exclui uma combinação
   * @param {Object} req - Objeto de requisição Express
   * @param {Object} res - Objeto de resposta Express
   */
  async deleteCombination(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      const prisma = req.prisma;

      // Buscar a combinação pelo ID
      const combination = await prisma.combination.findUnique({
        where: { id },
      });

      // Verificar se a combinação existe
      if (!combination) {
        return res.status(404).json({ message: 'Combinação não encontrada' });
      }

      // Verificar se a combinação pertence ao usuário atual
      if (combination.userId !== userId) {
        return res.status(403).json({ message: 'Acesso negado' });
      }

      // Excluir as imagens do Supabase
      await supabaseService.deleteImage(combination.upperImage, 'clothing-images');
      await supabaseService.deleteImage(combination.lowerImage, 'clothing-images');

      // Excluir a combinação do banco de dados
      await prisma.combination.delete({
        where: { id },
      });

      return res.status(200).json({ message: 'Combinação excluída com sucesso' });
    } catch (error) {
      console.error('Erro ao excluir combinação:', error);
      return res.status(500).json({ message: 'Erro ao excluir combinação' });
    }
  }

  /**
   * Faz upload de imagens para uma combinação existente
   * @param {Object} req - Objeto de requisição Express
   * @param {Object} res - Objeto de resposta Express
   */
  async uploadCombinationImages(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      const prisma = req.prisma;

      // Buscar a combinação pelo ID
      const combination = await prisma.combination.findUnique({
        where: { id },
      });

      // Verificar se a combinação existe
      if (!combination) {
        return res.status(404).json({ message: 'Combinação não encontrada' });
      }

      // Verificar se a combinação pertence ao usuário atual
      if (combination.userId !== userId) {
        return res.status(403).json({ message: 'Acesso negado' });
      }

      // Verificar quais imagens foram enviadas
      const updateData = {};

      if (req.files.upperImage) {
        // Excluir a imagem anterior do Supabase
        await supabaseService.deleteImage(combination.upperImage, 'clothing-images');

        // Fazer upload da nova imagem
        const upperImageUrl = await supabaseService.uploadClothingImage(
          req.files.upperImage[0].buffer,
          req.files.upperImage[0].originalname,
          userId,
          'upper'
        );

        updateData.upperImage = upperImageUrl;
      }

      if (req.files.lowerImage) {
        // Excluir a imagem anterior do Supabase
        await supabaseService.deleteImage(combination.lowerImage, 'clothing-images');

        // Fazer upload da nova imagem
        const lowerImageUrl = await supabaseService.uploadClothingImage(
          req.files.lowerImage[0].buffer,
          req.files.lowerImage[0].originalname,
          userId,
          'lower'
        );

        updateData.lowerImage = lowerImageUrl;
      }

      // Atualizar a combinação no banco de dados
      const updatedCombination = await prisma.combination.update({
        where: { id },
        data: updateData,
      });

      return res.status(200).json({
        message: 'Imagens da combinação atualizadas com sucesso',
        combination: updatedCombination,
      });
    } catch (error) {
      console.error('Erro ao fazer upload de imagens da combinação:', error);
      return res.status(500).json({ message: 'Erro ao fazer upload de imagens da combinação' });
    }
  }
}

module.exports = new CombinationController();