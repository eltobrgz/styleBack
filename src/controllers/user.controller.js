const supabaseService = require('../services/supabase.service');

/**
 * Controlador para gerenciar operações relacionadas aos usuários
 */
class UserController {
  /**
   * Obtém os dados do usuário atual
   * @param {Object} req - Objeto de requisição Express
   * @param {Object} res - Objeto de resposta Express
   */
  async getCurrentUser(req, res) {
    try {
      const userId = req.user.id;
      const prisma = req.prisma;
      
      // Buscar as preferências do usuário
      const preferences = await prisma.preference.findUnique({
        where: { userId },
      });
      
      // O usuário já está disponível no objeto req graças ao middleware de autenticação
      return res.status(200).json({
        user: req.user,
        preferences: preferences || {}
      });
    } catch (error) {
      console.error('Erro ao obter dados do usuário:', error);
      return res.status(500).json({ message: 'Erro ao obter dados do usuário' });
    }
  }

  /**
   * Atualiza os dados do usuário atual
   * @param {Object} req - Objeto de requisição Express
   * @param {Object} res - Objeto de resposta Express
   */
  async updateCurrentUser(req, res) {
    const { name, username, bio } = req.body;
    const userId = req.user.id;

    try {
      const prisma = req.prisma;

      // Verificar se o nome de usuário já está em uso (se foi alterado)
      if (username && username !== req.user.username) {
        const existingUsername = await prisma.user.findUnique({
          where: { username },
        });

        if (existingUsername) {
          return res.status(400).json({ message: 'Este nome de usuário já está em uso' });
        }
      }

      // Atualizar os dados do usuário
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: {
          name: name || undefined,
          username: username || undefined,
          bio: bio !== undefined ? bio : undefined,
        },
      });

      // Retornar resposta sem a senha
      const { password: _, ...userWithoutPassword } = updatedUser;

      return res.status(200).json({
        message: 'Dados do usuário atualizados com sucesso',
        user: userWithoutPassword,
      });
    } catch (error) {
      console.error('Erro ao atualizar dados do usuário:', error);
      return res.status(500).json({ message: 'Erro ao atualizar dados do usuário' });
    }
  }

  /**
   * Faz upload da imagem de perfil do usuário
   * @param {Object} req - Objeto de requisição Express
   * @param {Object} res - Objeto de resposta Express
   */
  async uploadProfileImage(req, res) {
    try {
      // Verificar se um arquivo foi enviado
      if (!req.file) {
        return res.status(400).json({ message: 'Nenhuma imagem foi enviada' });
      }

      const userId = req.user.id;
      const prisma = req.prisma;

      // Fazer upload da imagem para o Supabase
      const imageUrl = await supabaseService.uploadProfileImage(
        req.file.buffer,
        req.file.originalname,
        userId
      );

      // Atualizar a URL da imagem de perfil no banco de dados
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: { profileImage: imageUrl },
      });

      // Retornar resposta sem a senha
      const { password: _, ...userWithoutPassword } = updatedUser;

      return res.status(200).json({
        message: 'Imagem de perfil atualizada com sucesso',
        user: userWithoutPassword,
      });
    } catch (error) {
      console.error('Erro ao fazer upload da imagem de perfil:', error);
      return res.status(500).json({ message: 'Erro ao fazer upload da imagem de perfil' });
    }
  }
}

module.exports = new UserController();