'use client';
import "./../../globals.css";
import { useEffect, useState } from "react";
import keycloak from './../../../lib/keycloak.js';

const handleRelogin = () => {
  keycloak.login({ redirectUri: window.location.origin });
};

const Login = () => {
  return (<div>
          <h1>BBB - Niezalogowany!</h1>
          <p>Proszę się zalogować, aby kontynuować.</p>
          <button onClick={handleRelogin}>Zaloguj</button>
        </div>)
}

export default Login