import Channel from '../models/Channel.js';

export const findRoomsByRoles = async (roles) => {
  try {
    return await Channel.find({ 'roles.name': { $in: roles } });
  } catch (err) {
    return { Error: err };
  }
};
