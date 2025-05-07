import jwt from 'jsonwebtoken';
import jwksClient from 'jwks-rsa';

const keycloakUrl = process.env.KEYCLOAK_URL

const client = jwksClient({
  jwksUri: `${keycloakUrl}/realms/voice-chat/protocol/openid-connect/certs`
});

const getKey = (header, callback) => {
  client.getSigningKey(header.kid, (err, key) => {
    if (err) {
      return callback(err);
    }
    callback(null, key.getPublicKey());
  });
};

const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) { return res.status(403).json({ message: 'No token provided' })}
  const tokenWithoutBearer = token.split(' ')[1];
  jwt.verify(tokenWithoutBearer, getKey, { algorithms: ['RS256'] }, (err, decoded) => {
    if (err) { return res.status(401).json({ message: 'Failed to authenticate token' })}
    req.user = decoded;
    next();
  });
};

export default verifyToken
