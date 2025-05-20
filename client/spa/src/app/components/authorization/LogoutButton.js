'use client';
import "./../../globals.css";
import { useKeycloak } from '../../auth/provider/KeycloakProvider.js';

const LogoutButton = () => {
  const { logout } = useKeycloak();
  
  return (<div className="logout">
          <button onClick={logout}>Wyloguj</button>
        </div>)
}

export default LogoutButton