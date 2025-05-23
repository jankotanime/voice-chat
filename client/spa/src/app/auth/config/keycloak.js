"use client";
import Keycloak from "keycloak-js";

const KEYCLOAK_URL = process.env.NEXT_PUBLIC_KEYCLOAK_URL
const REALM = process.env.NEXT_PUBLIC_REALM
const CLIENT = process.env.NEXT_PUBLIC_CLIENT_ID

const keycloakConfig = {
  url: KEYCLOAK_URL,
  realm: REALM,
  clientId: CLIENT,
};

let keycloak;
let isInitialized = false;

export const initKeycloak = () => {
  if (typeof window !== "undefined") {
    if (!isInitialized) {
      keycloak = new Keycloak(keycloakConfig);
      isInitialized = true;

      return keycloak
        .init({
          onLoad: "check-sso",
          checkLoginIframe: false,
          redirectUri: window.location.origin,
        })
        .then(authenticated => {
          return authenticated;
        })
        .catch(err => {
          console.error("Failed to initialize Keycloak", err);
          isInitialized = false;
          return false;
        });
    }
    return Promise.resolve(keycloak?.authenticated ?? false);
  }
  return Promise.reject("Keycloak init failed, window is undefined.");
};

export const login = () => {
  if (keycloak) {
    keycloak.login();
  } else {
    console.error("Keycloak is not initialized yet.");
  }
};

export const logout = () => {
  if (keycloak) {
    keycloak.logout();
  }
};

function parseJwt(token) {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split('')
      .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
      .join('')
  );
  return JSON.parse(jsonPayload);
}

export const getName = async () => {
  if (keycloak) {
    if (keycloak.isTokenExpired()) {
      try {
        await keycloak.updateToken(30);
      } catch (error) {
        console.error("Failed to refresh the token", error);
        keycloak.logout();
        return null;
      }
    }
    return parseJwt(keycloak.token).preferred_username ?? null;
  }
  return null;
};

export const getToken = async () => {
  if (keycloak) {
    if (keycloak.isTokenExpired()) {
      try {
        await keycloak.updateToken(30);
      } catch (error) {
        console.error("Failed to refresh the token", error);
        keycloak.logout();
        return null;
      }
    }
    return keycloak.token ?? null;
  }
  return null;
};

export default { keycloak };
