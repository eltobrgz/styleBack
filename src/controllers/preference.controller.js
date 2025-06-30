/**
 * Controlador para gerenciar preferências dos usuários
 */
class PreferenceController {
  /**
   * Obtém as preferências do usuário atual
   * @param {Object} req - Objeto de requisição Express
   * @param {Object} res - Objeto de resposta Express
   */
  async getUserPreferences(req, res) {
    try {
      const userId = req.user.id;
      const prisma = req.prisma;

      // Buscar as preferências do usuário
      const preferences = await prisma.preference.findUnique({
        where: { userId },
      });

      // Se não houver preferências, retornar um objeto vazio
      if (!preferences) {
        return res.status(200).json({ preferences: {} });
      }

      return res.status(200).json({ preferences });
    } catch (error) {
      console.error('Erro ao obter preferências do usuário:', error);
      return res.status(500).json({ message: 'Erro ao obter preferências do usuário' });
    }
  }

  /**
   * Salva as preferências do usuário
   * @param {Object} req - Objeto de requisição Express
   * @param {Object} res - Objeto de resposta Express
   */
  async savePreferences(req, res) {
    try {
      const userId = req.user.id;
      const prisma = req.prisma;
      const {
        gender,
        bodyType,
        bodyShape,
        mainStyle,
        pecaFrequente,
        corPreferida,
        estiloEvitar,
        ocasiaoComum,
      } = req.body;

      // Verificar se o usuário já tem preferências
      const existingPreferences = await prisma.preference.findUnique({
        where: { userId },
      });

      let preferences;

      if (existingPreferences) {
        // Atualizar preferências existentes
        preferences = await prisma.preference.update({
          where: { userId },
          data: {
            gender,
            bodyType,
            bodyShape,
            mainStyle,
            pecaFrequente,
            corPreferida,
            estiloEvitar,
            ocasiaoComum,
          },
        });
      } else {
        // Criar novas preferências
        preferences = await prisma.preference.create({
          data: {
            userId,
            gender,
            bodyType,
            bodyShape,
            mainStyle,
            pecaFrequente,
            corPreferida,
            estiloEvitar,
            ocasiaoComum,
          },
        });
      }

      return res.status(200).json({
        message: 'Preferências salvas com sucesso',
        preferences,
      });
    } catch (error) {
      console.error('Erro ao salvar preferências do usuário:', error);
      return res.status(500).json({ message: 'Erro ao salvar preferências do usuário' });
    }
  }

  /**
   * Atualiza as preferências do usuário
   * @param {Object} req - Objeto de requisição Express
   * @param {Object} res - Objeto de resposta Express
   */
  async updatePreferences(req, res) {
    try {
      const userId = req.user.id;
      const prisma = req.prisma;
      const updateData = req.body;

      // Verificar se o usuário já tem preferências
      const existingPreferences = await prisma.preference.findUnique({
        where: { userId },
      });

      if (!existingPreferences) {
        return res.status(404).json({ message: 'Preferências não encontradas' });
      }

      // Atualizar apenas os campos fornecidos
      const preferences = await prisma.preference.update({
        where: { userId },
        data: updateData,
      });

      return res.status(200).json({
        message: 'Preferências atualizadas com sucesso',
        preferences,
      });
    } catch (error) {
      console.error('Erro ao atualizar preferências do usuário:', error);
      return res.status(500).json({ message: 'Erro ao atualizar preferências do usuário' });
    }
  }
}

module.exports = new PreferenceController();