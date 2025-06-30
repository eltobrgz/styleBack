/**
 * Arquivo com funções utilitárias para o backend
 */

/**
 * Valida um endereço de e-mail
 * @param {string} email - Endereço de e-mail a ser validado
 * @returns {boolean} - Verdadeiro se o e-mail for válido
 */
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Valida uma senha (mínimo 6 caracteres)
 * @param {string} password - Senha a ser validada
 * @returns {boolean} - Verdadeiro se a senha for válida
 */
const isValidPassword = (password) => {
  return password && password.length >= 6;
};

/**
 * Valida um nome de usuário (apenas letras, números, pontos e underscores)
 * @param {string} username - Nome de usuário a ser validado
 * @returns {boolean} - Verdadeiro se o nome de usuário for válido
 */
const isValidUsername = (username) => {
  const usernameRegex = /^[a-zA-Z0-9._]+$/;
  return username && username.length >= 3 && usernameRegex.test(username);
};

/**
 * Formata uma data para o formato local
 * @param {Date} date - Data a ser formatada
 * @returns {string} - Data formatada
 */
const formatDate = (date) => {
  return new Date(date).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

/**
 * Gera um nome de arquivo único
 * @param {string} originalName - Nome original do arquivo
 * @returns {string} - Nome de arquivo único
 */
const generateUniqueFileName = (originalName) => {
  const extension = originalName.split('.').pop();
  return `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${extension}`;
};

/**
 * Sanitiza um objeto removendo campos indefinidos ou nulos
 * @param {Object} obj - Objeto a ser sanitizado
 * @returns {Object} - Objeto sanitizado
 */
const sanitizeObject = (obj) => {
  const sanitized = {};
  
  Object.keys(obj).forEach(key => {
    if (obj[key] !== undefined && obj[key] !== null) {
      sanitized[key] = obj[key];
    }
  });
  
  return sanitized;
};

module.exports = {
  isValidEmail,
  isValidPassword,
  isValidUsername,
  formatDate,
  generateUniqueFileName,
  sanitizeObject,
};