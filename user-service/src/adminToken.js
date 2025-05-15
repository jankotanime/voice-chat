import axios from 'axios';

const keycloakUrl = process.env.KEYCLOAK_URL;

const realm = 'master';
const clientId = 'admin-cli';
const username = 'admin';
const password = 'admin';

export default async function getAdminAccessToken() {
  const params = new URLSearchParams();
  params.append('client_id', clientId);
  params.append('grant_type', 'password');
  params.append('username', username);
  params.append('password', password);

  try {
    const response = await axios.post(
      `${keycloakUrl}/realms/${realm}/protocol/openid-connect/token`,
      params.toString(),
      {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      }
    );

    return response.data.access_token;
  } catch (err) {
    console.error('Błąd pobierania tokena admina:', err.response?.data || err.message);
    throw err;
  }
}