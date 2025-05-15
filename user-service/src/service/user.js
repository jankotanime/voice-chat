import axios from "axios"
import { getUserRoles } from "./role.js";
import getAdminAccessToken from "../adminToken.js"

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

export const isAdmin = async (username, id, token) => {
  try {
    const adminToken = await getAdminAccessToken()
    const allRoles = await getUserRoles(username, id, token)
    for (const role of allRoles) {
      const compositesRes = await axios.get(
        `${keycloakUrl}/admin/realms/voice-chat/roles/${role}/composites`,
        { headers: { Authorization: `Bearer ${adminToken}` } }
      );
      const compositeNames = compositesRes.data.map(r => r.name);
      if (compositeNames.includes("realm-admin")) {
        return true;
      }
    }
    return false;
  } catch (err) {
    return { err: err };
  }
};
