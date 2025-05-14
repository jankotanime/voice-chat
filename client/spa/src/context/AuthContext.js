"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import keycloak from '../lib/keycloak.js';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authenticated, setAuthenticated] = useState(false);
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    keycloak.init({ 
      onLoad: 'login-required' ,
      pkceMethod: 'S256',
      redirectUri: window.location.origin,
    }).then(auth => {
      setAuthenticated(auth);
      if (auth) {
        setUserInfo(keycloak.tokenParsed);
      }
    });
  }, []);

  return (
    <AuthContext.Provider value={{ authenticated, userInfo, keycloak }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
