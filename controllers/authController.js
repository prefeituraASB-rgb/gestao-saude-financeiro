const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'secretasupersafesaudetoken123';

// 🔐 ROTA DE LOGIN: Validação direta por índice do banco
exports.login = async (req, res) => {
  try {
    const { login, senha } = req.body;
    
    if (!login || !senha) {
      return res.status(400).json({ error: 'Preencha todos os campos.' });
    }

    const usuario = await User.findOne({ login: login.trim().toLowerCase() });
    if (!usuario) {
      return res.status(401).json({ error: 'Usuário ou senha incorretos.' });
    }

    const senhaValida = await bcrypt.compare(senha, usuario.senha);
    if (!senhaValida) {
      return res.status(401).json({ error: 'Usuário ou senha incorretos.' });
    }

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
