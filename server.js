const express = require('express');
const path = require('path');
const conectarBanco = require('./config/db');
const User = require('./models/User'); // Importado para fazer a checagem rápida no banco

const app = express();
const PORT = process.env.PORT || 3000;

// 1. Inicializa a conexão otimizada com o banco de dados MongoDB Atlas
conectarBanco();

// 2. Middlewares essenciais para processamento de dados leves e JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ==========================================================================
   🛣️ ROTAS DA API
   ========================================================================== */
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/dashboard', require('./routes/dashboardRoutes'));
app.use('/api/fontes', require('./routes/fonteRoutes'));

/* ==========================================================================
   🎨 ARQUIVOS ESTÁTICOS DA INTERFACE (HTML, CSS, IMAGENS)
   ========================================================================== */
app.use(express.static(path.join(__dirname, 'public'), { maxAge: '1d' }));

/* ==========================================================================
   🧠 ROTEAMENTO INTELIGENTE DE ENTRADA (MÁXIMA SEGURANÇA)
   ========================================================================== */
app.get('/', async (req, res) => {
  try {
    // Busca ultra-rápida no índice para ver se existe qualquer usuário cadastrado
    const existeUsuario = await User.findOne();

    if (!existeUsuario) {
      // Cenário 1: Banco zerado na nuvem -> Abre automaticamente a Instalação Mestre
      console.log('📢 [Setup] Nenhum usuário detectado. Redirecionando para instalação inicial...');
      return res.sendFile(path.join(__dirname, 'public', 'setup.html'));
    }

    // Cenário 2: Sistema já configurado -> Abre a tela de Login normal de segurança
    res.sendFile(path.join(__dirname, 'public', 'login.html'));

  } catch (err) {
    console.error('❌ Erro no roteamento de entrada:', err.message);
    res.status(500).send('Erro interno do servidor ao processar inicialização.');
  }
});

// Inicialização estável do servidor online
app.listen(PORT, () => {
  console.log(`🚀 Servidor de Alta Performance operando na porta ${PORT}`);
});
