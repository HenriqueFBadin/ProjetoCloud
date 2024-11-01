const jwt = require('jsonwebtoken');
const pool = require('./postgresConfig');

const secret = process.env.JWT_SECRET || "f!3D@8gT4jK$2pR%9zY^7hB&5xC*1mQ"; // Carregando a chave secreta do JWT

const generateToken = (usuario) => {
  return jwt.sign(
    { id: usuario.id, nome: usuario.nome, email: usuario.email },
    secret,
    { expiresIn: '1h' }
  );
};

const autenticarJWT = async (req, res, next) => {
  const authHeader = req.header('Authorization');
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  if (!token) {
    return res.status(401).json({ error: 'Token não fornecido.' });
  }

  try {
    const decoded = jwt.verify(token, secret);
    
    // Consultar o banco para verificar se o usuário ainda existe e é válido
    const result = await pool.query(
      'SELECT * FROM usuarios WHERE email = $1 AND nome = $2',
      [decoded.email, decoded.nome]
    );

    if (result.rows.length === 0) {
      return res.status(403).json({ error: 'Token inválido: usuário não encontrado na base de dados.' });
    }
    
    req.user = decoded; // Se a verificação for bem-sucedida, armazene os dados do usuário no request
    next();
    
  } catch (err) {
    console.error("Erro na verificação do token:", err.message);
    
    // Respostas para diferentes erros
    if (err.name === 'TokenExpiredError') {
      return res.status(403).json({ error: 'Token expirado.' });
    } else if (err.name === 'JsonWebTokenError') {
      return res.status(403).json({ error: 'Token malformado ou assinatura inválida.' });
    } else {
      return res.status(403).json({ error: 'Token inválido por motivo desconhecido.' });
    }
  }
};

module.exports = { generateToken, autenticarJWT };
