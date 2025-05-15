'use client';
import "./../../globals.css";
import { useEffect, useState } from "react";
import { useKeycloak } from '../../auth/provider/KeycloakProvider.js';

const LogoutButton = () => {
  const { logout } = useKeycloak();
  
  return (<div>
          <button onClick={logout}>Wyloguj</button>
        </div>)
}

export default LogoutButton