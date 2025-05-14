"use client"

import React from 'react';
import { KeycloakProvider } from "./auth/provider/KeycloakProvider.js"
import './globals.css';

function MyApp({ children }) {
  return (
    <html>
      <body>
      <KeycloakProvider>{children}</KeycloakProvider>
      </body>
    </html>
  );
}

export default MyApp;