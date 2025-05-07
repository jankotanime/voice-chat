import express from 'express';
import jwt from 'jsonwebtoken';
import jwksClient from 'jwks-rsa';
import axios from 'axios';

const server = express();
const port = 8003;
const keycloakUrl = process.env.KEYCLOAK_URL
const secretKey = process.env.SECRET_KEY;

server.use(express.json());

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

server.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const response = await axios.post(
      `${keycloakUrl}/realms/voice-chat/protocol/openid-connect/token`,
      new URLSearchParams({
        client_id: 'SPA',
        client_secret: 'F6FshOROgrWuP8RBttBUMdogLWYw4HVu',
        grant_type: 'password',
        username: username,
        password: password,
      }),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' }}
    );
    const token = response.data.access_token;
    console.log("logged:", username);
    res.status(200).json({ token: token });
  } catch (err) {
    console.error('Login failed:', err);
  }
});

server.get('/verify-test', verifyToken, async (req, res) => {
  res.status(200).json({ mess: "verifed" })
});

server.listen(port, () => {
  console.log(`Serwer działa na http://localhost:${port}`);
});