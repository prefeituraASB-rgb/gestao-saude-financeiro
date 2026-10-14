const express = require('express');
const path = require('path');
const conectarBanco = require('./config/db');
const User = require('./models/User');
const bcrypt = require('bcryptjs');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares essenciais e leves rodando no topo
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve a pasta de arquivos estáticos primeiro (Evita a lentidão e quebra do CSS)
app.use(express.static(path.join(__dirname, 'public'), { maxAge: '1d' }));

// Vinculação direta das Rotas da API
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/dashboard', require('./routes/dashboardRoutes'));
app.use('/api/fontes', require('./routes/fonteRoutes'));

// Rota raiz limpa que entrega a tela de login imediatamente
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// Inicializa o banco de dados Atlas e roda a trava de injeção mestre
conectarBanco().then(async () => {
    try {
        // Verifica se já existe qualquer usuário Admin cadastrado
        const adminExiste = await User.findOne({ login: 'admin' });
        
        if (!adminExiste) {
            console.log('⚠️ [Banco Vazio] Injetando operador mestre via código...');
            const senhaCriptografada = await bcrypt.hash('admin123', 10);
            
            const novoAdmin = new User({
                nome: 'Administrador da Saúde',
                login: 'admin',
                senha: senhaCriptografada,
                nivel: 'Admin'
            });

            await novoAdmin.save();
            console.log('✅ [SUCESSO] Usuário mestre criado: admin | Senha: admin123');
        } else {
            console.log('🛡️ [Segurança] Usuário mestre validado e operacional.');
        }
    } catch (err) {
        console.error('❌ Erro na inicialização do usuário:', err.message);
    }
});

// Inicialização estável do servidor online
app.listen(PORT, () => {
  console.log(`🚀 Servidor de Alta Performance operando na porta ${PORT}`);
});
