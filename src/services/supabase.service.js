const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');

dotenv.config();

// Inicializar cliente do Supabase
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Erro: Variáveis de ambiente SUPABASE_URL e SUPABASE_KEY são obrigatórias');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Serviço para gerenciar operações com o Supabase Storage
 */
class SupabaseService {
  /**
   * Faz upload de uma imagem de perfil para o bucket do Supabase
   * @param {Buffer} fileBuffer - Buffer do arquivo
   * @param {string} fileName - Nome do arquivo
   * @param {string} userId - ID do usuário
   * @returns {Promise<string>} URL pública da imagem
   */
  async uploadProfileImage(fileBuffer, fileName, userId) {
    try {
      // Criar um nome de arquivo único baseado no ID do usuário
      const fileExt = fileName.split('.').pop();
      const uniqueFileName = `${userId}-${Date.now()}.${fileExt}`;
      
      // Upload do arquivo para o bucket 'profile-images'
      const { data, error } = await supabase.storage
        .from('profile-images')
        .upload(uniqueFileName, fileBuffer, {
          contentType: this._getContentType(fileExt),
          upsert: true
        });

      if (error) throw error;

      // Obter a URL pública do arquivo
      const { data: urlData } = supabase.storage
        .from('profile-images')
        .getPublicUrl(uniqueFileName);

      return urlData.publicUrl;
    } catch (error) {
      console.error('Erro ao fazer upload da imagem de perfil:', error);
      throw new Error('Falha ao fazer upload da imagem de perfil');
    }
  }

  /**
   * Faz upload de uma imagem de roupa para o bucket do Supabase
   * @param {Buffer} fileBuffer - Buffer do arquivo
   * @param {string} fileName - Nome do arquivo
   * @param {string} userId - ID do usuário
   * @param {string} type - Tipo da imagem (upper ou lower)
   * @returns {Promise<string>} URL pública da imagem
   */
  async uploadClothingImage(fileBuffer, fileName, userId, type) {
    try {
      // Criar um nome de arquivo único
      const fileExt = fileName.split('.').pop();
      const uniqueFileName = `${userId}-${type}-${Date.now()}.${fileExt}`;
      
      // Upload do arquivo para o bucket 'clothing-images'
      const { data, error } = await supabase.storage
        .from('clothing-images')
        .upload(uniqueFileName, fileBuffer, {
          contentType: this._getContentType(fileExt),
          upsert: true
        });

      if (error) throw error;

      // Obter a URL pública do arquivo
      const { data: urlData } = supabase.storage
        .from('clothing-images')
        .getPublicUrl(uniqueFileName);

      return urlData.publicUrl;
    } catch (error) {
      console.error('Erro ao fazer upload da imagem de roupa:', error);
      throw new Error('Falha ao fazer upload da imagem de roupa');
    }
  }

  /**
   * Exclui uma imagem do bucket do Supabase
   * @param {string} url - URL da imagem a ser excluída
   * @param {string} bucket - Nome do bucket ('profile-images' ou 'clothing-images')
   * @returns {Promise<boolean>} Sucesso da operação
   */
  async deleteImage(url, bucket) {
    try {
      // Extrair o nome do arquivo da URL
      const urlParts = url.split('/');
      const fileName = urlParts[urlParts.length - 1];

      // Excluir o arquivo do bucket
      const { error } = await supabase.storage
        .from(bucket)
        .remove([fileName]);

      if (error) throw error;

      return true;
    } catch (error) {
      console.error('Erro ao excluir imagem:', error);
      throw new Error('Falha ao excluir imagem');
    }
  }

  /**
   * Determina o tipo de conteúdo com base na extensão do arquivo
   * @private
   * @param {string} fileExt - Extensão do arquivo
   * @returns {string} Tipo de conteúdo MIME
   */
  _getContentType(fileExt) {
    const contentTypes = {
      'jpg': 'image/jpeg',
      'jpeg': 'image/jpeg',
      'png': 'image/png',
      'gif': 'image/gif',
      'webp': 'image/webp'
    };

    return contentTypes[fileExt.toLowerCase()] || 'application/octet-stream';
  }
}

module.exports = new SupabaseService();