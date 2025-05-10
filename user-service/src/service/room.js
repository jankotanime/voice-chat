import { getUserRooms } from '../controller/room.js';
import Channel from '../models/Channel.js';
import { getAllRoles, getUserRoles } from './role.js';
import { isAdmin } from './user.js';
import { io } from 'socket.io-client';

const voiceUrl = process.env.VOICE_URL;
const socket = io(voiceUrl, {
  transports: ['websocket', 'polling'],
  autoConnect: false
});

socket.connect()

socket.on("connect_error", (err) => {
  console.error("Błąd połączenia z WebSocketem:", err.message);
});

socket.on("connect", () => {
  console.log("Połączono z serwerem WebSocket.");
});

export const findAllRooms = async (username, token) => {
  try {
    if (!(await isAdmin(username, token))) { return {err: "403 Forbidden"} }
    const rooms = await Channel.find();
    return { mess: rooms }
  } catch (err) {
    return { err: err };
  }
};

export const findRoomsByRoles = async (username, token) => {
  try {
    const rolesResponse = await getUserRoles(username, token)
    const roles = rolesResponse.data.map(elem => elem.name)
    const rooms = await Channel.find({ 'roles.name': { $in: roles } });
    return { mess: rooms }
  } catch (err) {
    return { err: err };
  }
};

export const createRoom = async (username, name, roles, token) => {
  try {
    if (!(await isAdmin(username, token))) { return {err: "403 Forbidden"} }
    const allRoles = (await getAllRoles(token)).data.map(role => role.name)
    const channelRoles = roles.filter(role => allRoles.includes(role))
    const newChannel = await Channel.create({name: name, roles: channelRoles});
    return { mess: newChannel }
  } catch (err) {
    return { err: err };
  }
};

export const checkRoomAccess = async (username, roomId, token) => {
  try {
    const userRoles = getUserRoles(username, token)
    const room = await Channel.findById(roomId)
    room.get().roles.forEach(role => {
      if (userRoles.includes(role)) {return true}
    })
    return false
  } catch (err) {
    return { err: err };
  }
};

export const joinRoom = async (username, roomId, token) => {
  try {
    const access = checkRoomAccess(username, roomId, token)
    if ('err' in access || !access) {return {err: "forbidden"}}
    socket.emit("join_room", username, roomId);
    return {mess: 'dolaczono'}
  } catch (err) {
    return { err: err };
  }
};

export const putRolesToRoom = async (username, roomId, roles, token) => {
  try {
    if (!(await isAdmin(username, token))) { return {err: "403 Forbidden"} }
    const channel = await Channel.findById(roomId);
    channel.roles = roles
    channel.save()
    return { mess: channel }
  } catch (err) {
    return { err: err };
  }
};

export const removeRoomById = async (username, id, token) => {
  try {
    if (!(await isAdmin(username, token))) { return {err: "403 Forbidden"} }
    const removedChannel = await Channel.findByIdAndDelete(id);
    return { mess: removedChannel }
  } catch (err) {
    return { err: err };
  }
};
