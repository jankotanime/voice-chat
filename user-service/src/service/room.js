import { getAllRooms, getUserRooms } from '../controller/room.js';
import Channel from '../models/Channel.js';
import { getAllRoles, getUserRoles } from './role.js';
import { getUserId, isAdmin } from './user.js';
import getAdminAccessToken from "../adminToken.js"

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
    const admin = await isAdmin(username, id, token)
    const roles = await getUserRoles(username, id, token)
    const rooms = admin ? await Channel.find() : await Channel.find({ 'roles': { $in: roles } });
    return { mess: rooms }
  } catch (err) {
    return { err: err };
  }
};

export const createRoom = async (username, userId, name, roles, token) => {
  try {
    if (!(await isAdmin(username, userId, token))) { return {err: "403 Forbidden"} }
    const allRoles = await getAllRoles(token)
    const channelRoles = roles.filter(role => allRoles.includes(role))
    const newChannel = await Channel.create({name: name, roles: channelRoles});
    return { mess: newChannel }
  } catch (err) {
    return { err: err };
  }
};

export const checkRoomAccess = async (username, userId, roomId, token) => {
  try {
    const userRoles = await getUserRoles(username, userId, token)
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

export const putRolesToRoom = async (username, id, roomId, roles, token) => {
  try {
    if (!(await isAdmin(username, id, token))) { return {err: "403 Forbidden"} }
    const channel = await Channel.findById(roomId);
    channel.roles = roles.filter(elem => elem.picked).map(elem => elem.name)
    channel.save()
    return { mess: channel }
  } catch (err) {
    return { err: err };
  }
};

export const removeRoomById = async (username, userId, id, token) => {
  try {
    if (!(await isAdmin(username, userId, token))) { return {err: "403 Forbidden"} }
    const removedChannel = await Channel.findByIdAndDelete(id);
    return { mess: removedChannel }
  } catch (err) {
    return { err: err };
  }
};
