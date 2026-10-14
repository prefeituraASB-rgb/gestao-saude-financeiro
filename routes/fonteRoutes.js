const express = require('express');
const router = express.Router();
const fonteController = require('../controllers/fonteController');
const autenticar = require('../middlewares/autenticar');

// Rotas de Fontes
router.post('/cadastrar', autenticar(['Admin']), fonteController.cadastrarFonte); // Apenas Admin cria fontes
router.get('/listar', autenticar(), fonteController.listarFontes); // Qualquer usuário logado lê as fontes

// Rotas de Lançamentos e Movimentações
router.post('/movimentar', autenticar(['Admin', 'Operador']), fonteController.lancarMovimentacao); // Apenas Admin e Operador lançam gastos
router.get('/relatorio', autenticar(), fonteController.obterExtratoPorFonte); // Qualquer nível lê relatórios

module.exports = router;
