const express = require('express');
const path = require('path');
const conectarBanco = require('./config/db');
const User = require('./models/User');

const app = express();
const PORT = process.env.PORT || 3000;

// Inicializa a conexão com o banco de dados MongoDB Atlas
conectarBanco();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ==========================================================================
   🛣️ 1º PRIORIDADE MÁXIMA: AS ROTAS DA API
   ========================================================================== */
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/dashboard', require('./routes/dashboardRoutes'));
app.use('/api/fontes', require('./routes/fonteRoutes'));

/* ==========================================================================
   🧠 2º PRIORIDADE: O ROTEAMENTO INTELIGENTE DE ENTRADA (MÁXIMA SEGURANÇA)
   --------------------------------------------------------------------------
   Ele PRECISA vir antes do express.static para interceptar a entrada limpa!
   ========================================================================== */
app.get('/', async (req, res) => {
  try {
    const existeUsuario = await User.findOne();

    if (!existeUsuario) {
      console.log('📢 [Setup] Nenhum usuário detectado. Abrindo instalação inicial...');
      return res.sendFile(path.join(__dirname, 'public', 'setup.html'));
    }

    res.sendFile(path.join(__dirname, 'public', 'login.html'));

  } catch (err) {
    console.error('❌ Erro no roteamento:', err.message);
    res.status(500).send('Erro interno do servidor.');
  }
});

/* ==========================================================================
   🎨 3º PRIORIDADE: ARQUIVOS ESTÁTICOS (Movido para o final do arquivo)
   ========================================================================== */
app.use(express.static(path.join(__dirname, 'public'), { maxAge: '1d' }));

app.listen(PORT, () => {
  console.log(`🚀 Servidor de Alta Performance operando na porta ${PORT}`);
});
