const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const autenticar = require('../middlewares/autenticar');

// Rota protegida: Qualquer usuário logado pode ler os saldos do rodapé/dashboard
router.get('/saude', autenticar(), dashboardController.obterSaudeFinanceira);

module.exports = router;
