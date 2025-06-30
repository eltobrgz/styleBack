const multer = require('multer');
const path = require('path');

// Configuração de armazenamento temporário em memória
const storage = multer.memoryStorage();

// Filtro para permitir apenas imagens
const fileFilter = (req, file, cb) => {
  // Verificar se o arquivo é uma imagem
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  
  if (allowedMimeTypes.includes(file.mimetype)) {
    // Aceitar o arquivo
    cb(null, true);
  } else {
    // Rejeitar o arquivo
    cb(new Error('Formato de arquivo não suportado. Apenas imagens JPEG, PNG, GIF e WEBP são permitidas.'), false);
  }
};

// Configuração do multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // Limite de 5MB
  },
});

// Middleware para lidar com erros do multer
const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    // Erro do multer
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: 'Arquivo muito grande. O tamanho máximo permitido é 5MB.' });
    }
    return res.status(400).json({ message: `Erro no upload: ${err.message}` });
  } else if (err) {
    // Outro erro
    return res.status(400).json({ message: err.message });
  }
  next();
};

module.exports = {
  upload,
  handleMulterError,
};