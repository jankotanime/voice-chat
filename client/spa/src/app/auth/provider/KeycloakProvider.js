"use client"

import React, { createContext, useContext, useEffect, useState } from 'react';
import { initKeycloak, getName, logout, login, getToken, register } from '../config/keycloak.js';

const KeycloakContext = createContext({
  initialized: false,
  authenticated: false,
  user: null,
  logout: () => {},
});

export const KeycloakProvider = ({ children }) => {
  const [initialized, setInitialized] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      initKeycloak()
        .then(async auth => {
          if  (auth) {
            setAuthenticated(true);
            const name = await getName()
            if (name) {
              setUser({
                name: name,
              });
            }
          } else {
            setAuthenticated(false);
          }
          setInitialized(true);
        })
        .catch(err => {
          console.error('Keycloak initialization error:', err);
          setInitialized(true);
        });
    }
  }, []);

  return (
    <KeycloakContext.Provider value={{ initialized, authenticated, user, logout, login, register, getToken }}>
      {children}
    </KeycloakContext.Provider>
  );
};


export const useKeycloak = () => useContext(KeycloakContext);