"use client";
import Keycloak from "keycloak-js";

const keycloakConfig = {
  url: "http://localhost:8080",
  realm: "voice-chat",
  clientId: "SPA",
};

let keycloak;
let isInitialized = false;

export const initKeycloak = () => {
  if (typeof window !== "undefined") {
    if (!isInitialized) {
      console.log("Initializing Keycloak with config:", keycloakConfig);
      keycloak = new Keycloak(keycloakConfig);
      isInitialized = true;

      return keycloak
        .init({
          onLoad: "login-required",
          checkLoginIframe: false,
          redirectUri: window.location.origin,
        })
        .then(authenticated => {
          console.log("Keycloak initialized:", authenticated);
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



export const logout = () => {
  if (keycloak) {
    keycloak.logout();
  }
};

function parseJwt(token) {
  const base64Url = token.split('.')[1]; // bierzemy środkową część
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

export default { keycloak };
