const jwt = require('jsonwebtoken');
const consoleLog = require('../consoleLog'); 
// Middleware pour authentifier le token JWT
const authenticateToken = (req, res, next) => {
  // Récupérer le header Authorization
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; 

  if (!token) {
    consoleLog('Aucun token trouvé', 'red'); 
    return res.status(401).json({ message: 'Aucun token trouvé.' });
  }

  // Vérifier le token
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      consoleLog('Token invalide ou expiré', 'red'); // Optionnel
      return res.status(403).json({ message: 'Token invalide ou expiré.' });
    }
    req.user = user; 

    
    next();
  });
};

module.exports = authenticateToken;
