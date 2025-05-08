import Channel from '../models/Channel.js';
import { getAllRoles, getUserRoles } from './role.js';
import { isAdmin } from './user.js';

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
