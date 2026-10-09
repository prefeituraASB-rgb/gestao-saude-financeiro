const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Configuração para o Express entender formulários e dados JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Servir os arquivos estáticos (CSS, JS do front-end, Logo em PNG)
app.use(express.static(path.join(__dirname, 'public')));

// Rota Principal (Tela de Boas-vindas / Entrar no Sistema)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// Conexão com o Banco de Dados MongoDB Atlas
mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('=== Conexão com o MongoDB Atlas estabelecida com sucesso! ===');
        // Inicia o servidor apenas se o banco de dados conectar corretamente
        app.listen(PORT, () => {
            console.log(`=== Servidor da Saúde rodando com sucesso na porta ${PORT} ===`);
        });
    })
    .catch((err) => {
        console.error('Erro crítico ao conectar no MongoDB Atlas:', err);
    });
