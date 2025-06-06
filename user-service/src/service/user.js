import axios from "axios"
import { getUserRoles } from "./role.js";
import getAdminAccessToken from "../adminToken.js"

const keycloakUrl = process.env.KEYCLOAK_URL;

export const findUsers = async (token) => {
  try {
    const adminToken = await getAdminAccessToken()
    const usersResp = await axios.get(`${keycloakUrl}/admin/realms/voice-chat/users`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    const simplified = usersResp.data.map(u => ({ username: u.username }));

    return simplified
  } catch (err) {
    return { err: err };
  }
};

export const getUserId = async (username) => {
  try {
    const adminToken = await getAdminAccessToken()
    const user = await axios.get(
      `${keycloakUrl}/admin/realms/voice-chat/users?username=${username}`,
      { headers: { Authorization: `Bearer ${adminToken}` } }
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

export const deleteUser = async (username, id, user, token) => {
  try {
    const admin = await isAdmin(username, id, token)
    if (!admin) return {err: "Forbidden"}
    const adminToken = await getAdminAccessToken()
    const userId = await getUserId(user)
    await axios.delete(
      `${keycloakUrl}/admin/realms/voice-chat/users/${userId}`,
      { headers: { Authorization: `Bearer ${adminToken}` } }
    );
    return {mess: "Usunięto"}
  } catch (err) {
    return {err: err}
  }
}
