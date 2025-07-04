# Style Backend

Backend para o projeto Style, desenvolvido com Express, Prisma e Supabase.

## Visão Geral

Este backend fornece uma API RESTful para o aplicativo Style, permitindo:

- Autenticação de usuários (registro, login)
- Gerenciamento de perfil de usuário
- Armazenamento de preferências de estilo
- Criação e gerenciamento de combinações de roupas
- Upload de imagens para o Supabase Storage

## Tecnologias Utilizadas

- **Node.js**: Ambiente de execução JavaScript
- **Express**: Framework web para Node.js
- **Prisma**: ORM para acesso ao banco de dados
- **PostgreSQL**: Banco de dados (via Supabase)
- **Supabase**: Plataforma para banco de dados e armazenamento
- **JWT**: Autenticação baseada em tokens
- **Multer**: Middleware para upload de arquivos
- **bcrypt**: Biblioteca para hash de senhas

## Estrutura do Projeto

```
backend/
  ├── prisma/
  │   └── schema.prisma    # Esquema do banco de dados
  ├── src/
  │   ├── controllers/     # Controladores da API
  │   ├── middlewares/     # Middlewares (autenticação, etc.)
  │   ├── routes/          # Rotas da API
  │   ├── services/        # Serviços (Supabase, etc.)
  │   └── index.js         # Ponto de entrada da aplicação
  ├── .env                 # Variáveis de ambiente
  ├── package.json         # Dependências e scripts
  └── README.md            # Documentação
```

## Configuração

Consulte o arquivo `tutorial.txt` para instruções detalhadas sobre como configurar e executar o backend.

## API Endpoints

### Autenticação

- `POST /api/auth/register` - Registrar novo usuário
- `POST /api/auth/login` - Login de usuário
- `GET /api/auth/verify` - Verificar token JWT

### Usuários

- `GET /api/users/me` - Obter dados do usuário atual
- `PUT /api/users/me` - Atualizar dados do usuário atual
- `POST /api/users/me/profile-image` - Fazer upload de imagem de perfil

### Preferências

- `GET /api/preferences` - Obter preferências do usuário
- `POST /api/preferences` - Salvar preferências do usuário
- `PUT /api/preferences` - Atualizar preferências do usuário

### Combinações

- `GET /api/combinations` - Listar combinações do usuário
- `POST /api/combinations` - Criar nova combinação
- `GET /api/combinations/:id` - Obter detalhes de uma combinação
- `DELETE /api/combinations/:id` - Excluir uma combinação
- `POST /api/combinations/:id/images` - Fazer upload de imagens para uma combinação

## Integração com o Frontend

O frontend deve ser configurado para fazer requisições para os endpoints da API. Consulte o arquivo `tutorial.txt` para mais informações sobre como integrar o frontend com o backend.#   s t y l e B a c k  
 