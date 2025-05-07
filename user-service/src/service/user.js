import axios from "axios"

const keycloakUrl = process.env.KEYCLOAK_URL;

export const findUsers = async (req) => {
  try {
    const token = req.headers['authorization'];
    if (!token) { return res.status(403).json({ message: 'No token provided' })}
    const tokenWithoutBearer = token.split(' ')[1];
    const usersResp = await axios.get(`${keycloakUrl}/admin/realms/voice-chat/users`, {
      headers: { Authorization: `Bearer ${tokenWithoutBearer}` }
    });
    const simplified = usersResp.data.map(u => ({ username: u.username }));

    return simplified
  } catch (err) {
    return { err: err };
  }
};

export const addRole = async (req) => {
  try {
    const {username, rolename} = req.body
    const token = req.headers['authorization'];
    if (!token) { return res.status(403).json({ message: 'No token provided' })}
    const tokenWithoutBearer = token.split(' ')[1];
    const user = await axios.get(
      `${keycloakUrl}/admin/realms/voice-chat/users?username=${username}`,
      { headers: { Authorization: `Bearer ${tokenWithoutBearer}` } }
    );
    const userId = user.data[0].id
    if (!userId) { return res.status(403).json({ message: 'Wrong username' })}
    const roleResp = await axios.get(
      `${keycloakUrl}/admin/realms/voice-chat/roles/${rolename}`,
      { headers: { Authorization: `Bearer ${tokenWithoutBearer}` } }
    );
    if (!roleResp) { return res.status(403).json({ message: 'Wrong role name' })}
    await axios.post(
      `${keycloakUrl}/admin/realms/voice-chat/users/${userId}/role-mappings/realm`,
      [
        {
          name: rolename,
          id: roleResp.data.id,
          description: roleResp.data.description,
          composite: roleResp.data.composite,
          clientRole: false,
          containerId: roleResp.data.containerId
        }
      ],
      {
        headers: {
          Authorization: `Bearer ${tokenWithoutBearer}`,
          'Content-Type': 'application/json'
        }
      }
    );    
    return {mess: "Rola nadana" }
  } catch (err) {
    return { err: err };
  }
};

export const removeRole = async (req) => {
  try {
    const {username, rolename} = req.body
    const token = req.headers['authorization'];
    if (!token) { return res.status(403).json({ message: 'No token provided' })}
    const tokenWithoutBearer = token.split(' ')[1];
    const user = await axios.get(
      `${keycloakUrl}/admin/realms/voice-chat/users?username=${username}`,
      { headers: { Authorization: `Bearer ${tokenWithoutBearer}` } }
    );
    const userId = user.data[0].id
    if (!userId) { return res.status(403).json({ message: 'Wrong username' })}
    const roleResp = await axios.get(
      `${keycloakUrl}/admin/realms/voice-chat/roles/${rolename}`,
      { headers: { Authorization: `Bearer ${tokenWithoutBearer}` } }
    );
    if (!roleResp) { return res.status(403).json({ message: 'Wrong role name' })}
    await axios.delete(
      `${keycloakUrl}/admin/realms/voice-chat/users/${userId}/role-mappings/realm`,
      {
        headers: {
          Authorization: `Bearer ${tokenWithoutBearer}`,
          'Content-Type': 'application/json'
        },
        data: [
          {
            name: rolename,
            id: roleResp.data.id,
            description: roleResp.data.description,
            composite: roleResp.data.composite,
            clientRole: false,
            containerId: roleResp.data.containerId
          }
        ]
      }
    );
    return {mess: "Rola usunięta" }
  } catch (err) {
    return { err: 'Brak uprawnień' };
  }
};