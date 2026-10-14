const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

// 🔐 ROTA DE LOGIN ANTERIOR
router.post('/login', authController.login);

// 🛠️ NOVA ROTA DE INSTALAÇÃO: Executada pela tela temporária setup.html
router.post('/instalar', async (req, res) => {
  try {
    // 🛡️ TRAVA DE SEGURANÇA MÁXIMA: Confere se já existe qualquer usuário no banco
    const existeQualquerUsuario = await User.findOne();
    if (existeQualquerUsuario) {
      return res.status(400).json({ error: 'O sistema já foi instalado e configurado anteriormente!' });
    }

    const { nome, login, senha } = req.body;
    if (!nome || !login || !senha) {
      return res.status(400).json({ error: 'Preencha todos os campos da instalação.' });
    }

    // Cria o primeiro administrador com senha criptografada de fábrica
    const senhaCripto = await bcrypt.hash(senha, 10);
    const novoAdmin = new User({
      nome: nome.trim(),
      login: login.trim().toLowerCase(),
      senha: senhaCripto,
      nivel: 'Admin'
    });

    await novoAdmin.save();
    res.status(201).json({ message: 'Sistema instalado com sucesso! Usuário mestre criado.' });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao instalar sistema: ' + err.message });
  }
});

module.exports = router;
