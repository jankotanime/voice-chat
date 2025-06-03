import axios from 'axios';
import fs from "fs"

const keycloakUrl = process.env.KEYCLOAK_URL;

function readSecret(path) {
  return fs.existsSync(path) ? fs.readFileSync(path, 'utf8').trim() : null;
}

const realm = readSecret('/app/secrets/backend_realm');
const secret = readSecret('/app/secrets/backend_secret');
const clientId = readSecret('/app/secrets/backend_id');

export default async function getAdminAccessToken() {
  const params = new URLSearchParams();
  params.append('client_id', clientId);
  params.append('client_secret', secret);
  params.append('grant_type', 'client_credentials');

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