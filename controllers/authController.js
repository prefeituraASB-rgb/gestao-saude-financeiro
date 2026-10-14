const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Chave secreta token (Em produção, mude para variáveis de ambiente)
const JWT_SECRET = process.env.JWT_SECRET || 'secretasupersafesaudetoken123';

exports.login = async (req, res) => {
  try {
    const { login, senha } = req.body;
    
    // Busca otimizada pelo índice
    const usuario = await User.findOne({ login: login.trim().toLowerCase() });
    if (!usuario) {
      return res.status(401).json({ error: 'Usuário ou senha incorretos.' });
    }

    // Compara senha usando criptografia rápida
    const senhaValida = await bcrypt.compare(senha, usuario.senha);
    if (!senhaValida) {
      return res.status(401).json({ error: 'Usuário ou senha incorretos.' });
    }

    // Gera token válido por 1 dia
    const token = jwt.sign(
      { id: usuario._id, nome: usuario.nome, nivel: usuario.nivel },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({
      token,
      usuario: { nome: usuario.nome, nivel: usuario.nivel }
    });
  } catch (err) {
    res.status(500).json({ error: 'Erro interno no processamento do login.' });
  }
};

// Função auxiliar exclusiva para o Admin criar o primeiro usuário via sistema
exports.criarPrimeiroUsuarioAdmin = async (req, res) => {
  try {
    const existeAdmin = await User.findOne({ nivel: 'Admin' });
    if (existeAdmin) return res.status(400).json({ error: 'Admin já configurado.' });

    const senhaCripto = await bcrypt.hash('admin123', 10);
    const novoAdmin = new User({
      nome: 'Administrador da Saúde',
      login: 'admin',
      senha: senhaCripto,
      nivel: 'Admin'
    });

    await novoAdmin.save();
    res.status(201).json({ message: 'Primeiro Admin criado! Login: admin | Senha: admin123' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
