import Channel from '../models/Channel.js';
import { getAllRoles, getUserRoles } from './role.js';
import { isAdmin } from './user.js';
import mongoose from 'mongoose';

const keycloakUrl = process.env.KEYCLOAK_URL;

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
    const newChannel = await Channel.create({name: name, roles: roles});
    return { mess: newChannel }
  } catch (err) {
    return { err: err };
  }
};

export const removeRoomById = async (username, id, token) => {
  try {
    if (!(await isAdmin(username, token))) { return {err: "403 Forbidden"} }
    const removedChannel = await Channel.deleteOne({ _id: new mongoose.Types.ObjectId(id) });
    return { mess: removedChannel }
  } catch (err) {
    return { err: err };
  }
};
