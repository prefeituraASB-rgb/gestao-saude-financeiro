const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'secretasupersafesaudetoken123';

module.exports = (niveisPermitidos = []) => {
  return (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: 'Acesso negado. Faça login.' });

    const token = authHeader.split(' ')[1];
    try {
      const verificado = jwt.verify(token, JWT_SECRET);
      req.usuario = verificado;

      // Se passou níveis específicos (Ex: só Admin pode criar fonte) verifica aqui
      if (niveisPermitidos.length > 0 && !niveisPermitidos.includes(verificado.nivel)) {
        return res.status(403).json({ error: 'Você não tem permissão para esta ação.' });
      }

      next(); // Usuário limpo, pode passar para a rota
    } catch (err) {
      res.status(400).json({ error: 'Sessão expirada. Faça login novamente.' });
    }
  };
};
