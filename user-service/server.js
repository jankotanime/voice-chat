import express from 'express';
import mongoose from 'mongoose';

const mongoURL = process.env.MONGO_URL;
const authURL = process.env.AUTH_URL;
const server = express();
const port = 8001;

mongoose.connect(mongoURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Połączono z MongoDB');
})
.catch((err) => {
  console.error('Błąd połączenia z MongoDB:', err);
});

server.use(express.json());

server.get('/test', async (req, res) => {
  try {
    const authorization = await fetch(`${authURL}/keycloak/authorization`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    console.log(authorization)
    authorization.ok ? res.send('Hello from user service!') : res.send('Not hello!!!')
  } catch {
    res.send('Server connection error!')
  }
})

server.listen(port, () => {
  console.log(`Serwer działa na http://localhost:${port}`);
});