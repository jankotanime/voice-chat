import axios from 'axios';

const keycloakUrl = process.env.KEYCLOAK_URL;

export const loginService = async (username, password) => {
  const response = await axios.post(
    `${keycloakUrl}/realms/voice-chat/protocol/openid-connect/token`,
    new URLSearchParams({
      client_id: 'SPA',
      client_secret: 'F6FshOROgrWuP8RBttBUMdogLWYw4HVu',
      grant_type: 'password',
      username,
      password
    }),
    { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
  );

  return response.data.access_token;
};

export const registerService = async (username, password, email) => {
  const adminTokenResponse = await axios.post(
    `${keycloakUrl}/realms/master/protocol/openid-connect/token`,
    new URLSearchParams({
      client_id: 'admin-cli',
      username: 'admin',
      password: 'admin',
      grant_type: 'password'
    }),
    { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
  );
  
  const adminToken = adminTokenResponse.data.access_token;

  await axios.post(
    `${keycloakUrl}/admin/realms/voice-chat/users`,
    {
      username,
      email,
      enabled: true,
      credentials: [{ type: 'password', value: password, temporary: false }]
    },
    {
      headers: {
        Authorization: `Bearer ${adminToken}`,
        'Content-Type': 'application/json'
      }
    }
  );
};
