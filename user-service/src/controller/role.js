import getAdminAccessToken from '../adminToken.js';
import { addRoleToUser, createAdminRole, createRole, deleteRole, getAllRoles, getUserRoles, removeRoleFromUser, updateUserRoles } from '../service/role.js';
import { getUserId, isAdmin } from '../service/user.js';

export const getRolesC = async (req, res) => {
  const roles = await getAllRoles(req.token);
  return "err" in roles
    ? res.status(404).send({err: roles.err})
    : res.status(200).send({roles: roles});
};

export const createRoleC = async (req, res) => {
  const roles = await createRole(req.body.rolename, req.body.description, req.token);
  return "err" in roles
    ? res.status(404).send({err: roles.err})
    : res.status(200).send({roles: roles.data});
};

export const createAdminRoleC = async (req, res) => {
  const roles = await createAdminRole(req.body.rolename, req.body.description, req.token);
  return "err" in roles
    ? res.status(404).send({err: roles.err})
    : res.status(200).send({roles: roles.data});
};

export const removeRoleC = async (req, res) => {
  const roles = await deleteRole(req.params.role, req.token);
  return "err" in roles
    ? res.status(404).send({err: roles.err})
    : res.status(200).send({roles: roles.data});
};

export const getUserRolesC = async (req, res) => {
  const admin = await isAdmin(req.user.preferred_username, req.user.sub, req.token)
  if (!admin) res.status(403).send({err: "forbidden!"})
  const userId = await getUserId(req.query.username, req.token)
  const roles = await getUserRoles(req.query.username, userId, req.token);
  return "err" in roles
    ? res.status(404).send({err: roles.err})
    : res.status(200).send({roles: roles});
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

export const updateUserRolesC = async (req, res) => {
  const users = await updateUserRoles(req.user.preferred_username, req.user.sub, req.body.username, req.body.roles, req.token);
  return "err" in users
    ? res.status(404).send({err: users})
    : res.status(200).send(users);
};