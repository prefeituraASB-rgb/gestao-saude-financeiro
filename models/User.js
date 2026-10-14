const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  nome: { type: String, required: true, trim: true },
  login: { type: String, required: true, unique: true, trim: true, lowercase: true },
  senha: { type: String, required: true },
  nivel: { type: String, enum: ['Admin', 'Operador', 'Visualizador'], default: 'Visualizador' },
  dataCriacao: { type: Date, default: Date.now }
});

// Criamos um índice no login para que a busca na hora de entrar no sistema leve menos de 1 milissegundo
UserSchema.index({ login: 1 });

module.exports = mongoose.model('User', UserSchema);
