import axios from "axios"

const keycloakUrl = process.env.KEYCLOAK_URL;

export const findUsers = async (token) => {
  try {
    const usersResp = await axios.get(`${keycloakUrl}/admin/realms/voice-chat/users`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const simplified = usersResp.data.map(u => ({ username: u.username }));

    return simplified
  } catch (err) {
    return { err: err };
  }
};

export const getUserId = async (username, token) => {
  try {
    const user = await axios.get(
      `${keycloakUrl}/admin/realms/voice-chat/users?username=${username}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    const userId = user.data[0].id
    if (!userId) {return { err: 'Wrong username' }}
    return userId
  } catch (err) {
    return {err: err}
  }
}