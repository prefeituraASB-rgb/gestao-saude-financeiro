const express = require('require('express');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Permite que o Express entenda dados enviados por formulários (POST)
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// =========================================================================
// CORREÇÃO DO BOOTSTRAP: Servindo as pastas oficiais de CSS e JS locais
// =========================================================================
app.use('/css/bootstrap.min.css', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/css/bootstrap.min.css')));
app.use('/js/bootstrap.bundle.min.js', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/js/bootstrap.bundle.min.js')));

// Servir os arquivos estáticos da prefeitura (Sua Logo PNG e estilos extras)
app.use(express.static(path.join(__dirname, 'public')));

// ROTAS DO SISTEMA (Navegação de Telas)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'login.html'));
});

// CONEXÃO COM O BANCO DE DADOS
mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('=== Conexão com o MongoDB Atlas estabelecida com sucesso! ===');
        app.listen(PORT, () => {
            console.log(`=== Servidor da Saúde rodando com sucesso na porta ${PORT} ===`);
        });
    })
    .catch((err) => {
        console.error('Erro crítico ao conectar no MongoDB Atlas:', err);
    });
