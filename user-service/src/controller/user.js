import { removeRole, addRole, findUsers } from '../service/user.js';

export const getUsers = async (req, res) => {
  const users = await findUsers(req);
  return "err" in users
    ? res.status(404).send({err: users})
    : res.status(200).send(users);
};

export const addRoleToUser = async (req, res) => {
  const users = await addRole(req);
  return "err" in users
    ? res.status(404).send({err: users})
    : res.status(200).send(users);
};

export const removeRoleFromUser = async (req, res) => {
  const users = await removeRole(req);
  return "err" in users
    ? res.status(404).send({err: users})
    : res.status(200).send(users);
};
