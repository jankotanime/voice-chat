import express from 'express';
import mongoose from 'mongoose';
import verifyToken from './authorization.js';
import { getUserRooms, joinRoom } from './controller/room.js';
import { removeRoleFromUser, addRoleToUser, getUsers } from './controller/user.js';

const mongoURL = process.env.MONGO_URL;
const port = 8001;
const server = express();

mongoose.connect(mongoURL)
  .then(() => console.log('Połączono z MongoDB'))
  .catch((err) => console.error('Błąd połączenia z MongoDB:', err));

server.use(express.json());

server.get('/rooms', verifyToken, getUserRooms);
server.get('/users', verifyToken, getUsers);
server.get('/room/join/:room', verifyToken, joinRoom);
server.patch('/user/role/add', verifyToken, addRoleToUser);
server.patch('/user/role/remove', verifyToken, removeRoleFromUser);

server.listen(port, () => {
  console.log(`Serwer działa na http://localhost:${port}`);
});
