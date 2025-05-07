import axios from "axios"
import { getUserId } from "./user.js";

const keycloakUrl = process.env.KEYCLOAK_URL;

export const getAllRoles = async (token) => {
  try {
    const roles = await axios.get(
      `${keycloakUrl}/admin/realms/voice-chat/roles`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return roles;
  } catch (err) {
    return { err: err?.response?.data || err.message };
  }
};

export const getUserRoles = async (username, token) => {
  try {
    const userId = await getUserId(username, token)
    if (!userId) { return {err: userId.err}}
    const roles = await axios.get(
      `${keycloakUrl}/admin/realms/voice-chat/users/${userId}/role-mappings/realm`,
      { headers: { Authorization: `Bearer ${token}`}}
    );
    return roles
  } catch (err) {
    return {err: err}
  }
}

export const getRoleResp = async (rolename, token) => {
  try {
    const roleResp = await axios.get(
      `${keycloakUrl}/admin/realms/voice-chat/roles/${rolename}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    if (!roleResp) { return { err: 'Wrong role name' }}
    return roleResp
  } catch (err) {
    return {err: err}
  }
}

export const addRoleToUser = async (username, rolename, token) => {
  try {
    const userId = await getUserId(username, token)
    if (!userId) { return {err: userId.err}}
    const roleResp = await getRoleResp(rolename, token)
    if (!roleResp) { return {err: userId.err}} 
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
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );    
    return {mess: "Rola nadana" }
  } catch (err) {
    return { err: err };
  }
};

export const removeRoleFromUser = async (username, rolename, token) => {
  try {
    const userId = await getUserId(username, token)
    if (!userId) { return {err: userId.err}}
    const roleResp = await getRoleResp(rolename, token)
    if (!roleResp) { return {err: userId.err}} 
    await axios.delete(
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
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );    
    return {mess: "Rola usunięta" }
  } catch (err) {
    return { err: err };
  }
};