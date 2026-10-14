const mongoose = require('mongoose');

const FornecedorSchema = new mongoose.Schema({
  cnpj_cpf: { type: String, required: true, unique: true, trim: true },
  nome_razao: { type: String, required: true, trim: true },
  dataCadastro: { type: Date, default: Date.now }
});

FornecedorSchema.index({ cnpj_cpf: 1 });

module.exports = mongoose.model('Fornecedor', FornecedorSchema);
