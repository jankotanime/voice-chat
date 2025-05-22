import express from 'express';
import session from 'express-session';
import Keycloak from 'keycloak-connect';

const app = express();
const port = 3001;

const memoryStore = new session.MemoryStore();

app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: true,
  store: memoryStore,
}));

const keycloakConfig = {
  clientId: 'SSR',
  bearerOnly: false,
  serverUrl: 'http://192.168.0.12:8080',
  realm: 'voice-chat',
};

const keycloak = new Keycloak({ store: memoryStore }, keycloakConfig);

app.use(keycloak.middleware({
  logout: '/logout',
  admin: '/',
  protected: '/',
  redirectUri: 'http://localhost:3001/'
}));

app.get('/', keycloak.protect(), async (req, res) => {
  const token = req.kauth.grant.access_token.token;

  if (token) {
    try {
      const response = await fetch(`http://192.168.0.12:8001/user`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const json = await response.json();
      res.send(json);

    } catch (error) {
      console.error('Błąd podczas pobierania danych:', error);
      res.status(500).send('Błąd serwera podczas pobierania danych');
    }
  } else {
    res.status(401).send('Brak tokena dostępu');
  }
});


app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
