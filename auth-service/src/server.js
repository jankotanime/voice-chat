import express from 'express';
import { login, register } from './controller.js';


const server = express();
const port = 8003;

server.use(express.json());

server.post('/login', login);
server.post('/register', register);

server.listen(port, () => {
  console.log(`Serwer działa na http://localhost:${port}`);
});