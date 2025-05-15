import axios from "axios"
import { getUserId } from "./user.js";
import getAdminAccessToken from "../adminToken.js"

const keycloakUrl = process.env.KEYCLOAK_URL;

export const getAllRoles = async (token) => {
  try {
    const roles = await axios.get(
      `${keycloakUrl}/admin/realms/voice-chat/roles`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )

    return roles;
  } catch (err) {
    return { err: err?.response?.data || err.message };
  }
};

export const deleteRole = async (rolename, token) => {
  try {
    console.log(rolename)
    const response = await axios.delete(
      `${keycloakUrl}/admin/realms/voice-chat/roles/${encodeURIComponent(rolename)}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );
    return {mess: "Rola usunięta" }
  } catch (err) {
    return { err: err?.response?.data || err.message };
  }
};

export const createRole = async (rolename, description = '', token) => {
  try {
    const response = await axios.post(
      `${keycloakUrl}/admin/realms/voice-chat/roles`, {
        name: rolename,
        description: description,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );
    return {mess: "Rola utworzona" }
  } catch (err) {
    return { err: err?.response?.data || err.message };
  }
};

export const createAdminRole = async (rolename, description = '', token) => {
  try {
    const realmMgmtClient = await axios.get(
      `${keycloakUrl}/admin/realms/voice-chat/clients?clientId=realm-management`,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );
    const realmMgmtClientId = realmMgmtClient.data[0].id;

    const realmRoles = [
      'realm-admin',
      'view-realm',
      'manage-realm',
      'manage-users'
    ];

    const clientRoles = await axios.get(
      `${keycloakUrl}/admin/realms/voice-chat/clients/${realmMgmtClientId}/roles`,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    const rolesToAssign = clientRoles.data.filter(role =>
      realmRoles.includes(role.name)
    );

    await createRole(rolename, description, token);

    await axios.post(
      `${keycloakUrl}/admin/realms/voice-chat/roles/${rolename}/composites`,
      rolesToAssign.map(role => ({
        id: role.id,
        name: role.name,
        containerId: realmMgmtClientId,
        clientRole: true,
      })),
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      }
    );

    return { mess: "Rola utworzona i przypisane role klienta realm-management" };
  } catch (err) {
    return { err: err?.response?.data || err.message };
  }
};

export const getUserRoles = async (username, userId, token) => {
  try {
    const adminToken = await getAdminAccessToken();
    const roles = await axios.get(
      `${keycloakUrl}/admin/realms/voice-chat/users/${userId}/role-mappings/realm`,
      { headers: { Authorization: `Bearer ${adminToken}`, 'Content-Type': 'application/json'}}
    );
    console.log(roles)
    const rolesNames = roles.data.map(role => role.name)
    return rolesNames
  } catch (err) {
    console.log(err)
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