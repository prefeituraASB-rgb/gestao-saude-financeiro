const Movimentacao = require('../models/Movimentacao');
const Fonte = require('../models/Fonte');

exports.obterSaudeFinanceira = async (req, res) => {
  try {
    const ano = parseInt(req.query.ano) || new Date().getFullYear();
    const fonteFiltro = req.query.fonte ? parseInt(req.query.fonte) : null;

    // Monta o filtro da query
    let filtro = { ano_exercicio: ano };
    if (fonteFiltro) filtro.fonte_numero = fonteFiltro;

    // Executa a soma ultra-rápida no MongoDB usando os índices criados
    const resumo = await Movimentacao.aggregate([
      { $match: filtro },
      {
        $group: {
          _id: null,
          totalEntradaOrcamento: {
            $sum: { $cond: [ { $and: [ { $eq: ["$tipo_fluxo", "Orçamentário"] }, { $eq: ["$tipo_movimento", "Entrada"] } ] }, "$valor", 0 ] }
          },
          totalSaidaOrcamento: {
            $sum: { $cond: [ { $and: [ { $eq: ["$tipo_fluxo", "Orçamentário"] }, { $eq: ["$tipo_movimento", "Saída"] } ] }, "$valor", 0 ] }
          },
          totalEntradaFinanceiro: {
            $sum: { $cond: [ { $and: [ { $eq: ["$tipo_fluxo", "Financeiro (Conta Real)"] }, { $eq: ["$tipo_movimento", "Entrada"] } ] }, "$valor", 0 ] }
          },
          totalSaidaFinanceiro: {
            $sum: { $cond: [ { $and: [ { $eq: ["$tipo_fluxo", "Financeiro (Conta Real)"] }, { $eq: ["$tipo_movimento", "Saída"] } ] }, "$valor", 0 ] }
          }
        }
      }
    ]);

    const dados = resumo[0] || {
      totalEntradaOrcamento: 0, totalSaidaOrcamento: 0,
      totalEntradaFinanceiro: 0, totalSaidaFinanceiro: 0
    };

    const saldoOrcamentario = dados.totalEntradaOrcamento - dados.totalSaidaOrcamento;
    const saldoFinanceiro = dados.totalEntradaFinanceiro - dados.totalSaidaFinanceiro;

    // Lógica inteligente do Diagnóstico de Saúde Visual
    let statusSaude = 'Verde'; // Saudável
    let mensagem = 'Saúde Financeira Excelente. O Caixa Real cobre o planejado.';

    if (saldoFinanceiro < 0) {
      statusSaude = 'Vermelho';
      mensagem = 'CRÍTICO: Caixa Real Geral Negativo! Contas Bancárias Zeradas.';
    } else if (saldoFinanceiro < (saldoOrcamentario * 0.4)) {
      statusSaude = 'Amarelo';
      mensagem = 'ALERTA: Dinheiro Real em Caixa cobre menos de 40% das despesas planejadas.';
    }

    res.json({
      ano,
      saldoOrcamentario,
      saldoFinanceiro,
      statusSaude,
      mensagem
    });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao processar saúde financeira: ' + err.message });
  }
};
