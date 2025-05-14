"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import keycloak from './../lib/keycloak.js';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authenticated, setAuthenticated] = useState(false);
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    keycloak
      .init({
        onLoad: 'check-sso',
        silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html',
        pkceMethod: 'S256',
      })
      .then(auth => {
        setAuthenticated(auth);
        if (auth) {
          setUserInfo(keycloak.tokenParsed);
        }
      })
      .catch(err => {
        console.error('Keycloak init failed', err);
      });
  }, []);  
  
  return (
    <AuthContext.Provider value={{ authenticated, userInfo, keycloak }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
