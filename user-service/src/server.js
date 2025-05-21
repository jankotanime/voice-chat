import express from 'express';
import mongoose from 'mongoose';
import verifyToken from './authorization.js';
import { createRoomC, getAllRooms, getUserRooms, joinRoomC, putRolesToRoomC, removeRoomC } from './controller/room.js';
import { getUsers, removeUserC, verifyAdminC } from './controller/user.js';
import { removeRoleFromUserC, addRoleToUserC, getUserRolesC, getRolesC, createRoleC, removeRoleC, createAdminRoleC, updateUserRolesC } from './controller/role.js';
import cors from 'cors';

const mongoURL = process.env.MONGO_URL;
const spaURL = process.env.SPA_URL;
const port = 8001;
const server = express();

mongoose.connect(mongoURL)
  .then(() => console.log('Połączono z MongoDB'))
  .catch((err) => console.error('Błąd połączenia z MongoDB:', err));

server.use(cors({
  origin: spaURL,
  credentials: true
}));

server.use(express.json());

server.get('/room', verifyToken, getAllRooms); // * admin
server.get('/user', verifyToken, getUsers);
server.get('/role', verifyToken, getRolesC);
server.get('/user/role', verifyToken, getUserRolesC);
server.get('/user/room', verifyToken, getUserRooms);

server.post('/room', verifyToken, createRoomC)
server.post('/room/user', verifyToken, joinRoomC)
server.post('/user/role', verifyToken, addRoleToUserC);
server.post('/role/admin', verifyToken, createAdminRoleC);
server.post('/role', verifyToken, createRoleC);
server.post('/user/admin', verifyToken, verifyAdminC);

server.put('/room/role', verifyToken, putRolesToRoomC);
server.put('/user/role', verifyToken, updateUserRolesC)

server.delete('/role/:role', verifyToken, removeRoleC);
server.delete('/user/role', verifyToken, removeRoleFromUserC);
server.delete('/room', verifyToken, removeRoomC);
server.delete('/user', verifyToken, removeUserC);

server.listen(port, () => {
  console.log(`Serwer działa na http://localhost:${port}`);
});
