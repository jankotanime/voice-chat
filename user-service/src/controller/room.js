import { createRoom, findAllRooms, findRoomsByRoles, putRolesToRoom, removeRoomById } from '../service/room.js';

export const getUserRooms = async (req, res) => {
  const rooms = await findRoomsByRoles(req.user.preferred_username, req.token);
  return "err" in rooms
    ? res.status(404).send({err: rooms.err})
    : res.status(200).send(rooms);
};

export const getAllRooms = async (req, res) => {
  const rooms = await findAllRooms(req.user.preferred_username, req.token);
  return "err" in rooms
    ? res.status(404).send({err: rooms.err})
    : res.status(200).send(rooms);
};

export const createRoomC = async (req, res) => {
  const response = await createRoom(req.user.preferred_username, req.body.name, req.body.roles, req.token);
  return "err" in response
    ? res.status(404).send({err: response.err})
    : res.status(200).send(response);
};

export const removeRoomC = async (req, res) => {
  const response = await removeRoomById(req.user.preferred_username, req.body.id, req.token);
  return "err" in response
    ? res.status(404).send({err: response.err})
    : res.status(200).send(response);
};

export const putRolesToRoomC = async (req, res) => {
  const response = await putRolesToRoom(req.user.preferred_username, req.body.roomId, req.body.roles, req.token);
  return "err" in response
    ? res.status(404).send({err: response.err})
    : res.status(200).send(response);
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
