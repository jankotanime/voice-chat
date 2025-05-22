import axios from "axios"
import getAdminAccessToken from "../adminToken.js"
import { isAdmin } from "./user.js";

const keycloakUrl = process.env.KEYCLOAK_URL;

export const getAdminPanel = async (username, id, token) => {
  try {
    const admin = await isAdmin(username, id, token)
    if (!admin) return { err: "Forbidden!" }

    const adminToken = await getAdminAccessToken()

    const usersResp = await axios.get(`${keycloakUrl}/admin/realms/voice-chat/users`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });

    const usersWithRoles = await Promise.all(usersResp.data.map(async (u) => {
      const realmRoles = await axios.get(
        `${keycloakUrl}/admin/realms/voice-chat/users/${u.id}/role-mappings/realm`,
        { headers: { Authorization: `Bearer ${adminToken}` } }
      );

      return {
        username: u.username,
        realmRoles: realmRoles.data.map(r => r.name)
      }
    }));

    return usersWithRoles;

  } catch (err) {
    console.error(err);
    return { err };
  }
}
