const express = require('express');
const path = require('path');
const conectarBanco = require('./config/db');

const app = express();
const PORT = process.env.PORT || 3000;

conectarBanco();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public'), { maxAge: '1d' }));

// Vinculação de todas as Rotas da API
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/dashboard', require('./routes/dashboardRoutes'));
app.use('/api/fontes', require('./routes/fonteRoutes')); // ➕ Nova rota integrada

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor de Alta Performance rodando na porta ${PORT}`);
});
