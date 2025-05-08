import Channel from '../models/Channel.js';
import { getAllRoles, getUserRoles } from './role.js';
import { isAdmin } from './user.js';
const keycloakUrl = process.env.KEYCLOAK_URL;

export const findRoomsByRoles = async (username, token) => {
  try {
    const rolesResponse = await getUserRoles(username, token)
    console.log(rolesResponse)
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

// export const removeRoom = async (name, roles, token) => {
//   try {
//     const response = await fetch(`${keycloakUrl}/admin/realms/voice-chat`, {
//       headers: {
//         Authorization: `Bearer ${token}`
//       }
//     });
//     if ('error' in response) {return response}
//     const newChannel = await Channel.deleteOne({name: name});
//     return { mess: newChannel }
//   } catch (err) {
//     return { err: err };
//   }
// };
