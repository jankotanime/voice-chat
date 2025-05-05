import express from 'express';
import http from 'http';

const server = express();
const port = 8002;

server.use(express.json());

server.get('/test', (req, res) => {
  res.send('Hello from voice service!');
})

http.createServer(server).listen(port, () => {
  console.log(`Serwer działa na https://localhost:${port}`);
});