const mongoose = require('mongoose');

const conectarBanco = async () => {
  try {
    // URL Oficial integrada com seu usuário e senha da Saúde
    const mongoURI = 'mongodb+srv://admin_saude:cesar120187@cluster-saude.4qeop5z.mongodb.net/gestao_saude?retryWrites=true&w=majority&appName=cluster-saude';

    await mongoose.connect(mongoURI, {
      maxPoolSize: 10,
      minPoolSize: 2,
      socketTimeoutMS: 45000,
      serverSelectionTimeoutMS: 5000
    });

    console.log('⚡ MongoDB Atlas conectado com sucesso e 100% online!');
  } catch (error) {
    console.error('❌ Erro crítico ao conectar no MongoDB Atlas:', error.message);
    process.exit(1);
  }
};

module.exports = conectarBanco;
