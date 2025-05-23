'use client';
import "./../../globals.css";
import { useKeycloak } from '../../auth/provider/KeycloakProvider.js';

const LogoutButton = () => {
  const { logout } = useKeycloak();
  
  return (<div className="logout">
          <button className="logoutButton" onClick={logout}>Logout</button>
        </div>)
}

export default LogoutButton