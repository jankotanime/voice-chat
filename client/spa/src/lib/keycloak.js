import Keycloak from 'keycloak-js';

const keycloakUrl = process.env.NEXT_PUBLIC_KEYCLOAK_URL;

const keycloak = new Keycloak({
  url: `${keycloakUrl}/auth`,
  realm: 'voice-chat',
  clientId: 'SPA',
});

export default keycloak;
