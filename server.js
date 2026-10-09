const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config();

const app = express();
// O Render define a própria porta automaticamente, se não houver, usa a 3000 localmente
const PORT = process.env.PORT || 3000;

// ==========================================
// MIDDLEWARES (Configurações do Servidor)
// ==========================================
// Permite que o Express entenda dados enviados por formulários (POST)
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Servir arquivos estáticos (CSS personalizado, JS do front-end e a sua Logo PNG)
app.use(express.static(path.join(__dirname, 'public')));

// ==========================================
// ROTAS DO SISTEMA (Navegação de Telas)
// ==========================================

// 1. Rota Principal (Tela Inicial / Boas-vindas)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// 2. Rota para exibir a Tela de Login (Formulário)
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'login.html'));
});

// ==========================================
// CONEXÃO COM O BANCO DE DADOS & INICIALIZAÇÃO
// ==========================================
mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('=== Conexão com o MongoDB Atlas estabelecida com sucesso! ===');
        
        // O servidor só começa a rodar e ouvir a internet se o banco conectar perfeitamente
        app.listen(PORT, () => {
            console.log(`=== Servidor da Saúde rodando com sucesso na porta ${PORT} ===`);
        });
    })
    .catch((err) => {
        console.error('Erro crítico ao conectar no MongoDB Atlas:', err);
    });
