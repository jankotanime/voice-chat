import express from 'express';
import session from 'express-session';
import Keycloak from 'keycloak-connect';
import path from 'path';
import { fileURLToPath } from 'url';
import fetchData from './fetchData.js';
import fs from "fs"

const app = express();
const port = 3001;

function readSecret(path) {
  return fs.existsSync(path) ? fs.readFileSync(path, 'utf8').trim() : null;
}

const IP = process.env.IP
const KEYCLOAK_INT_URL = process.env.KEYCLOAK_INT_URL
const KEYCLOAK_PUB_URL = process.env.KEYCLOAK_PUB_URL
const USER_URL = process.env.USER_URL
const SSR_URL = process.env.SSR_URL
const secret = readSecret('/app/secrets/backend_secret');

const memoryStore = new session.MemoryStore();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set('trust proxy', 1);

app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: true,
  store: memoryStore,
}));

const keycloakConfig = {
  clientId: 'SSR',
  bearerOnly: false,
  serverUrl: KEYCLOAK_INT_URL,
  realm: 'voice-chat',
  secret: secret
};

const keycloak = new Keycloak({ store: memoryStore }, keycloakConfig);

app.use(keycloak.middleware({
  logout: '/ssr/logout',
  admin: '/ssr',
  protected: '/ssr',
  redirectUri: process.env.SSR_URL + "/ssr"
}));

app.set('views', path.join(__dirname, '.', 'views'));
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));

app.get('/ssr', keycloak.protect({ redirectTo: `${KEYCLOAK_PUB_URL}/ssr` }), async (req, res) => {
  console.log("aaa")
  const token = req.kauth.grant.access_token.token;
  console.log(token)
  if (token) {
    try {
      console.log("przed fetch")
      const response = await fetch(`${USER_URL}/user/admin`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      console.log(response)
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      console.log("aaa")
      if (response.ok) {
        const json = (await response.json()).mess;
        if (!json) {
          console.log(json)
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

app.get('/ssr/logout', (req, res, next) => {
  req.session.destroy(err => {
    if (err) {
      console.error('Błąd podczas niszczenia sesji:', err);
      return next(err);
    }
    const logoutUrl = `${KEYCLOAK_PUB_URL}/auth/realms/voice-chat/protocol/openid-connect/logout?redirect_uri=${SSR_URL}`;
    res.redirect(logoutUrl);
  });
});

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
