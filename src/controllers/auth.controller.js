const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

/**
 * Controlador para gerenciar autenticação de usuários
 */
class AuthController {
  /**
   * Registra um novo usuário
   * @param {Object} req - Objeto de requisição Express
   * @param {Object} res - Objeto de resposta Express
   */
  async register(req, res) {
    const { name, email, username, password } = req.body;

    try {
      // Verificar se os campos obrigatórios foram fornecidos
      if (!name || !email || !username || !password) {
        return res.status(400).json({ message: 'Todos os campos são obrigatórios' });
      }

      const prisma = req.prisma;

      // Verificar se o e-mail já está em uso
      const existingEmail = await prisma.user.findUnique({
        where: { email },
      });

      if (existingEmail) {
        return res.status(400).json({ message: 'Este e-mail já está em uso' });
      }

      // Verificar se o nome de usuário já está em uso
      const existingUsername = await prisma.user.findUnique({
        where: { username },
      });

      if (existingUsername) {
        return res.status(400).json({ message: 'Este nome de usuário já está em uso' });
      }

      // Hash da senha
      const hashedPassword = await bcrypt.hash(password, 10);

      // Criar o usuário no banco de dados
      const newUser = await prisma.user.create({
        data: {
          name,
          email,
          username,
          password: hashedPassword,
        },
      });

      // Criar token JWT
      const token = jwt.sign(
        { userId: newUser.id },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
      );

      // Retornar resposta sem a senha
      const { password: _, ...userWithoutPassword } = newUser;

      return res.status(201).json({
        message: 'Usuário registrado com sucesso',
        user: userWithoutPassword,
        token,
      });
    } catch (error) {
      console.error('Erro ao registrar usuário:', error);
      return res.status(500).json({ message: 'Erro ao registrar usuário' });
    }
  }

  /**
   * Realiza o login de um usuário
   * @param {Object} req - Objeto de requisição Express
   * @param {Object} res - Objeto de resposta Express
   */
  async login(req, res) {
    const { email, password } = req.body;

    try {
      // Verificar se os campos obrigatórios foram fornecidos
      if (!email || !password) {
        return res.status(400).json({ message: 'E-mail e senha são obrigatórios' });
      }

      const prisma = req.prisma;

      // Buscar o usuário pelo e-mail
      const user = await prisma.user.findUnique({
        where: { email },
      });

      // Verificar se o usuário existe
      if (!user) {
        return res.status(401).json({ message: 'Credenciais inválidas' });
      }

      // Verificar se a senha está correta
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Credenciais inválidas' });
      }

      // Criar token JWT
      const token = jwt.sign(
        { userId: user.id },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
      );

      // Retornar resposta sem a senha
      const { password: _, ...userWithoutPassword } = user;

      return res.status(200).json({
        message: 'Login realizado com sucesso',
        user: userWithoutPassword,
        token,
      });
    } catch (error) {
      console.error('Erro ao realizar login:', error);
      return res.status(500).json({ message: 'Erro ao realizar login' });
    }
  }

  /**
   * Verifica se o token do usuário é válido
   * @param {Object} req - Objeto de requisição Express
   * @param {Object} res - Objeto de resposta Express
   */
  async verifyToken(req, res) {
    // Se chegou até aqui, o middleware de autenticação já verificou o token
    return res.status(200).json({
      message: 'Token válido',
      user: req.user,
    });
  }
}

module.exports = new AuthController();