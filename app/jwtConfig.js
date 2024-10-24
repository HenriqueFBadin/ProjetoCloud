const jwt = require('jsonwebtoken');

console.log("Computando senha secreta do JWT");
const secret = "f!3D@8gT4jK$2pR%9zY^7hB&5xC*1mQ"; // Carregando a chave secreta do JWT

const generateToken = (usuario) => {
  return jwt.sign({ id: usuario.id, nome: usuario.nome, email: usuario.email }, secret, { expiresIn: '1h' }); // Define o tempo de expiração
};

const autenticarJWT = (req, res, next) => {
  const token = req.header('Authorization'); 

  if (!token) {
      return res.status(401).json({ error: 'Token não fornecido.' });
  }

  jwt.verify(token, secret, (err, user) => {
      if (err) {
          return res.status(403).json({ error: 'Token inválido.' });
      }
      req.user = user; 
      next();
  });
};

module.exports = { generateToken, autenticarJWT };
