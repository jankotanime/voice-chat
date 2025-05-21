import { deleteUser, findUsers, isAdmin } from '../service/user.js';

export const getUsers = async (req, res) => {
  const users = await findUsers(req.token);
  return "err" in users
    ? res.status(404).send({err: users})
    : res.status(200).send(users);
};

export const verifyAdminC = async (req, res) => {
  const admin = await isAdmin(req.user.preferred_username, req.user.sub, req.token);
  return admin === true ? res.status(200).send({mess: true}) : 
  admin === false ? res.status(403).send({err: "Forbidden"})
  : res.status(404).send({err: admin})
};

export const removeUserC = async (req, res) => {
  const response = await deleteUser(req.user.preferred_username, req.user.sub, req.body.user, req.token);
  return "err" in response
  ? res.status(404).send({err: response})
  : res.status(200).send(response);
}
