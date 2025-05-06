import express from 'express';

const server = express();
const port = 8003;

server.use(express.json());

server.get('/test', (req, res) => {
  res.send('Hello from auth service!');
})

server.get('/keycloak/authorization', (req, res) => {
  res.status(400).send('nie ok');
})

server.listen(port, () => {
  console.log(`Serwer działa na http://localhost:${port}`);
});