import express from 'express';
import session from 'express-session';
import Keycloak from 'keycloak-connect';
import path from 'path';
import { fileURLToPath } from 'url';
import fetchData from './fetchData.js';

const app = express();
const port = 3001;

const IP = process.env.IP
const KEYCLOAK_URL = process.env.KEYCLOAK_URL
const USER_URL = process.env.USER_URL

const memoryStore = new session.MemoryStore();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: true,
  store: memoryStore,
}));

const keycloakConfig = {
  clientId: 'SSR',
  bearerOnly: false,
  serverUrl: KEYCLOAK_URL,
  realm: 'voice-chat',
};

const keycloak = new Keycloak({ store: memoryStore }, keycloakConfig);

app.use(keycloak.middleware({
  logout: '/logout',
  admin: '/',
  protected: '/',
  redirectUri: `http://${IP}:${port}/`
}));

app.set('views', path.join(__dirname, '..', 'views'));
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', keycloak.protect(), async (req, res) => {
  const token = req.kauth.grant.access_token.token;

  if (token) {
    try {
      const response = await fetch(`${USER_URL}/user/admin`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      if (response.ok) {
        const json = (await response.json()).mess;
        if (!json) {
          res.render('forbidden.ejs'); 
          return;
        }
      }
      const json = await fetchData(token);
      const username = req.kauth.grant.access_token.content.preferred_username;
      res.render('index.ejs', { ...json, username }); 
    } catch (error) {
      console.error('Błąd podczas pobierania danych:', error);
      res.status(500).send('Błąd serwera podczas pobierania danych');
    }
  } else {
    res.status(401).send('Brak tokena dostępu');
  }
});

app.get('/logout', (req, res, next) => {
  req.session.destroy(err => {
    if (err) {
      console.error('Błąd podczas niszczenia sesji:', err);
      return next(err);
    }
    const logoutUrl = `${KEYCLOAK_URL}/auth/realms/voice-chat/protocol/openid-connect/logout?redirect_uri=http://${IP}:${port}/`;
    res.redirect(logoutUrl);
  });
});

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
