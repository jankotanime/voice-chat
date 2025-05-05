import express from 'express';
import mongoose from 'mongoose';

const mongoURL = process.env.MONGO_URL;
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

server.get('/test', (req, res) => {
  res.send('Hello from user service!');
})

server.listen(port, () => {
  console.log(`Serwer działa na http://localhost:${port}`);
});