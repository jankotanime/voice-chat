import { findUsers } from '../service/user.js';

export const getUsers = async (req, res) => {
  const users = await findUsers();
  return "err" in users
    ? res.status(404).send({err: users})
    : res.status(200).send(users);
};
