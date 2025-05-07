import express from 'express';
import mongoose from 'mongoose';
import Channel from './models/Channel.js'
import verifyToken from './authorization.js'

const mongoURL = process.env.MONGO_URL;
const authURL = process.env.AUTH_URL;
const server = express();
const port = 8001;

mongoose.connect(mongoURL)
  .then(() => {
    console.log('Połączono z MongoDB');
  })
  .catch((err) => {
    console.error('Błąd połączenia z MongoDB:', err);
  });

server.use(express.json());

const findAllRooms = async () => {
  try {
    const channels = await Channel.find();
    return channels
  } catch (err) {
    return "Error"
  }
}

const findRoomsByRoles = async (roles) => {
  try {
    const channels = await Channel.find({
      'roles.name': { $in: roles }
    });
    return channels
  } catch (err) {
    return "Error"
  }
}

server.get('/room', verifyToken, async (req, res) => {
  const rooms = await findAllRooms()
  rooms == "Error" ? res.status(404).send("Error") : res.status(200).send(rooms)
})

server.get('/room/join/:room', verifyToken, async (req, res) => {
  const roles = req.user.realm_access.roles
  const room = req.params.room
  const rooms = await findRoomsByRoles(roles)
  rooms == "Error" ? res.status(404).send("Error") : null
  rooms.forEach(elem => {
    elem.name == room ? res.status(200).send(elem) : res.status(403).send("Zakaz")
  })
})

server.listen(port, () => {
  console.log(`Serwer działa na http://localhost:${port}`);
});