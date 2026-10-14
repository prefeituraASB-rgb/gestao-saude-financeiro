const Fonte = require('../models/Fonte');
const Movimentacao = require('../models/Movimentacao');

// Cadastrar uma nova fonte com número e tipo livres
exports.cadastrarFonte = async (req, res) => {
  try {
    const { numero, nome, tipo } = req.body;
    
    // Validação rápida
    if (!numero || !nome || !tipo) {
      return res.status(400).json({ error: 'Preencha todos os campos da ficha.' });
    }

    const fonteExiste = await Fonte.findOne({ numero });
    if (fonteExiste) {
      return res.status(400).json({ error: `A Fonte nº ${numero} já está cadastrada.` });
    }

    const novaFonte = new Fonte({ numero, nome, tipo });
    await novaFonte.save();
    
    res.status(201).json({ message: 'Fonte cadastrada com sucesso!', novaFonte });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao cadastrar fonte: ' + err.message });
  }
};

// Listar todas as fontes cadastradas para alimentar os menus e painéis
exports.listarFontes = async (req, res) => {
  try {
    const fontes = await Fonte.find().sort({ numero: 1 });
    res.json(fontes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Cadastrar movimentação de entrada ou saída (Orçamentária ou Financeira)
exports.lancarMovimentacao = async (req, res) => {
  try {
    const { ano_exercicio, fonte_numero, tipo_fluxo, tipo_movimento, estagio_despesa, valor, descricao } = req.body;

    if (!ano_exercicio || !fonte_numero || !tipo_fluxo || !tipo_movimento || !valor || !descricao) {
      return res.status(400).json({ error: 'Campos obrigatórios ausentes na ficha de lançamento.' });
    }

    // Cria o lançamento amarrando o ID do usuário logado (Auditoria de segurança)
    const novaMovimentacao = new Movimentacao({
      ano_exercicio,
      fonte_numero,
      tipo_fluxo,
      tipo_movimento,
      estagio_despesa: tipo_movimento === 'Saída' ? estagio_despesa : 'Nenhum',
      valor: parseFloat(valor),
      descricao,
      usuario_id: req.usuario.id // Puxado automaticamente do token de segurança do login
    });

    await novaMovimentacao.save();
    res.status(201).json({ message: 'Lançamento efetuado com sucesso!', novaMovimentacao });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao processar lançamento: ' + err.message });
  }
};

// Obter extrato detalhado por fonte (Relatório de duas colunas)
exports.obterExtratoPorFonte = async (req, res) => {
  try {
    const ano = parseInt(req.query.ano) || new Date().getFullYear();
    const fonte = parseInt(req.query.fonte);

    if (!fonte) return res.status(400).json({ error: 'Selecione uma fonte para o relatório.' });

    // Busca o histórico ordenando dos lançamentos mais novos para os mais antigos
    const historico = await Movimentacao.find({ ano_exercicio: ano, fonte_numero: fonte })
      .populate('usuario_id', 'nome') // Traz o nome de quem auditou/lançou
      .sort({ dataLancamento: -1 });

    res.json(historico);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
