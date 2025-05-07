import axios from "axios"

const keycloakUrl = process.env.KEYCLOAK_URL;

export const findUsers = async () => {
  try {
    const adminTokenResp = await axios.post(
      `${keycloakUrl}/realms/master/protocol/openid-connect/token`,
      new URLSearchParams({
        client_id: 'admin-cli',
        username: 'admin',
        password: 'admin',
        grant_type: 'password',
      }),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    );
    const adminToken = adminTokenResp.data.access_token;
    const usersResp = await axios.get(`${keycloakUrl}/admin/realms/voice-chat/users`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    const simplified = usersResp.data.map(u => ({ username: u.username }));

    return simplified
  } catch (err) {
    return { err: err };
  }
};