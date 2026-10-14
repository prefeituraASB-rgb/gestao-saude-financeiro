const express = require('express');
const path = require('path');
const conectarBanco = require('./config/db');

const app = express();
const PORT = process.env.PORT || 3000;

// 1. Inicializa a conexão estável com o banco de dados MongoDB Atlas
conectarBanco();

// 2. Middlewares essenciais para processamento de dados leves
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ==========================================================================
   🛣️ PRIORIDADE DAS ROTAS DA API (Correção do conflito de links)
   ========================================================================== */
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/dashboard', require('./routes/dashboardRoutes'));
app.use('/api/fontes', require('./routes/fonteRoutes'));

/* ==========================================================================
   🎨 ARQUIVOS ESTÁTICOS DA INTERFACE (Carregados após as rotas)
   ========================================================================== */
app.use(express.static(path.join(__dirname, 'public'), { maxAge: '1d' }));

// Rota padrão que serve a tela de login na raiz do endereço
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// Inicialização segura do servidor online
app.listen(PORT, () => {
  console.log(`🚀 Servidor de Alta Performance operando na porta ${PORT}`);
});
