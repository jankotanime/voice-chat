import { findRoomsByRoles } from '../service/room.js';

export const getUserRooms = async (req, res) => {
  const roles = req.user.realm_access.roles;
  const rooms = await findRoomsByRoles(roles);
  return "err" in rooms
    ? res.status(404).send({err: rooms.err})
    : res.status(200).send(rooms);
};

export const joinRoom = async (req, res) => {
  const roles = req.user.realm_access.roles;
  const room = req.params.room;
  const rooms = await findRoomsByRoles(roles);

  if ("err" in rooms) return res.status(404).send({err: rooms.err});

  const found = rooms.find(elem => elem.name === room);
  return found
    ? res.status(200).send(found)
    : res.status(403).send({err: "Brak uprawnień"});
};
