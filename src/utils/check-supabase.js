/**
 * Script para verificar a conexão com o Supabase
 * Execute este script para testar se as credenciais do Supabase estão configuradas corretamente
 */

const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');

// Carregar variáveis de ambiente
dotenv.config();

// Verificar se as variáveis de ambiente estão definidas
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Erro: Variáveis de ambiente SUPABASE_URL e SUPABASE_KEY são obrigatórias');
  console.error('Por favor, configure-as no arquivo .env');
  process.exit(1);
}

// Inicializar cliente do Supabase
const supabase = createClient(supabaseUrl, supabaseKey);

// Função para verificar a conexão com o Supabase
async function checkSupabaseConnection() {
  console.log('Verificando conexão com o Supabase...');
  
  try {
    // Tentar obter a lista de buckets do Storage
    const { data, error } = await supabase.storage.listBuckets();
    
    if (error) {
      throw error;
    }
    
    console.log('✅ Conexão com o Supabase estabelecida com sucesso!');
    console.log('Buckets disponíveis:');
    
    if (data.length === 0) {
      console.log('- Nenhum bucket encontrado. Você precisa criar os buckets "profile-images" e "clothing-images".');
    } else {
      data.forEach(bucket => {
        console.log(`- ${bucket.name}`);
      });
      
      // Verificar se os buckets necessários existem
      const profileBucket = data.find(bucket => bucket.name === 'profile-images');
      const clothingBucket = data.find(bucket => bucket.name === 'clothing-images');
      
      if (!profileBucket) {
        console.warn('⚠️ Bucket "profile-images" não encontrado. Você precisa criá-lo no painel do Supabase.');
      }
      
      if (!clothingBucket) {
        console.warn('⚠️ Bucket "clothing-images" não encontrado. Você precisa criá-lo no painel do Supabase.');
      }
    }
    
    // Verificar a conexão com o banco de dados
    console.log('\nVerificando conexão com o banco de dados...');
    
    // Tentar executar uma consulta simples
    const { data: dbData, error: dbError } = await supabase.from('_prisma_migrations').select('*').limit(1);
    
    if (dbError && dbError.code !== 'PGRST116') {
      // PGRST116 significa que a tabela não existe, o que é normal se as migrações ainda não foram executadas
      throw dbError;
    }
    
    console.log('✅ Conexão com o banco de dados estabelecida com sucesso!');
    
    console.log('\n🎉 Tudo pronto! Você pode iniciar o servidor com "npm run dev".');
  } catch (error) {
    console.error('❌ Erro ao conectar com o Supabase:', error.message);
    console.error('Por favor, verifique suas credenciais no arquivo .env');
    
    if (error.message.includes('auth/invalid_credentials')) {
      console.error('Credenciais inválidas. Verifique se a SUPABASE_KEY está correta.');
    } else if (error.message.includes('Failed to fetch')) {
      console.error('Não foi possível conectar ao servidor. Verifique se a SUPABASE_URL está correta e se você tem acesso à internet.');
    }
  }
}

// Executar a verificação
checkSupabaseConnection();