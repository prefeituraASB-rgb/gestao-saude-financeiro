const mongoose = require('mongoose');

const MovimentacaoSchema = new mongoose.Schema({
  ano_exercicio: { type: Number, required: true }, // Ex: 2026, 2027
  fonte_numero: { type: Number, required: true },  // Vincula ao número da fonte cadastrada
  
  // Realidade do Lançamento
  tipo_fluxo: { type: String, enum: ['Orçamentário', 'Financeiro (Conta Real)'], required: true },
  tipo_movimento: { type: String, enum: ['Entrada', 'Saída'], required: true },
  
  // Detalhes Governamentais (Estágios da despesa pública)
  estagio_despesa: { 
    type: String, 
    enum: ['Nenhum', 'Empenho', 'Liquidação', 'Pagamento'], 
    default: 'Nenhum' // 'Nenhum' é usado para Entradas (repasses que chegam)
  },
  
  fornecedor_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Fornecedor', default: null },
  valor: { type: Number, required: true },
  descricao: { type: String, required: true, trim: true },
  
  // Auditoria Integrada (Segurança Máxima)
  usuario_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  dataLancamento: { type: Date, default: Date.now }
});

// Índices compostos de alta performance. 
// Isso garante que o MongoDB faça somas matemáticas instantâneas de milhões de linhas filtando por ano e fonte.
MovimentacaoSchema.index({ ano_exercicio: 1, fonte_numero: 1 });
MovimentacaoSchema.index({ tipo_fluxo: 1, tipo_movimento: 1 });

module.exports = mongoose.model('Movimentacao', MovimentacaoSchema);
