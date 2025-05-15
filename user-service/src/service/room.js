import { getUserRooms } from '../controller/room.js';
import Channel from '../models/Channel.js';
import { getAllRoles, getUserRoles } from './role.js';
import { getUserId, isAdmin } from './user.js';

export const findAllRooms = async (username, token) => {
  try {
    if (!(await isAdmin(username, token))) { return {err: "403 Forbidden"} }
    const rooms = await Channel.find();
    return { mess: rooms }
  } catch (err) {
    return { err: err };
  }
};

export const findRoomsByRoles = async (username, id, token) => {
  try {
    const roles = await getUserRoles(username, id, token)
    const rooms = await Channel.find({ 'roles': { $in: roles } });
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
    const userRoles = await getUserRoles(username, token)
    const room = await Channel.findById(roomId)
    let isAccess = false
    room.roles.forEach(role => {
      if (userRoles.includes(role)) {
        isAccess = true
      }
    })
    return isAccess ? {mess: true} : {err: "No access"}
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
