import { addRoleToUser, getAllRoles, getUserRoles, removeRoleFromUser } from '../service/role.js';

export const getRolesC = async (req, res) => {
  const roles = await getAllRoles(req.token);
  return "err" in roles
    ? res.status(404).send({err: roles.err})
    : res.status(200).send({roles: roles.data});
};

export const getUserRolesC = async (req, res) => {
  const roles = await getUserRoles(req.user.preferred_username, req.token);
  return "err" in roles
    ? res.status(404).send({err: roles.err})
    : res.status(200).send({roles: roles.data});
};

export const addRoleToUserC = async (req, res) => {
  const users = await addRoleToUser(req.body.username, req.body.rolename, req.token);
  return "err" in users
    ? res.status(404).send({err: users})
    : res.status(200).send(users);
};

export const removeRoleFromUserC = async (req, res) => {
  const users = await removeRoleFromUser(req.body.username, req.body.rolename, req.token);
  return "err" in users
    ? res.status(404).send({err: users})
    : res.status(200).send(users);
};