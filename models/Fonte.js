const mongoose = require('mongoose');

const FonteSchema = new mongoose.Schema({
  numero: { type: Number, required: true, unique: true }, // Ex: 1, 5, 120
  nome: { type: String, required: true, trim: true },      // Ex: "Custeio do SUS"
  tipo: { 
    type: String, 
    required: true, 
    enum: ['Próprio', 'Estadual', 'Federal', 'Emenda Parlamentar', 'Emenda Impositiva de Vereador'] 
  },
  dataCriacao: { type: Date, default: Date.now }
});

FonteSchema.index({ numero: 1 });

module.exports = mongoose.model('Fonte', FonteSchema);
