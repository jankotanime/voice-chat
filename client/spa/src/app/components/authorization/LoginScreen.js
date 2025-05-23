'use client';
import "./../../globals.css";
import { useKeycloak } from './../../auth/provider/KeycloakProvider.js';

const LoginScreen = () => {
  const { login } = useKeycloak();

  const toAdminPanel = () => {
    window.location.href = 'http://localhost:3001';
  }

  return (<div className="center">
          <div>Please login to continue</div>
          <div>
            <button className="loginButton" onClick={login}>Click to login or to register</button>
            <button className="loginButton" onClick={toAdminPanel}>Click to go to admin panel</button>
          </div>
        </div>)
}

export default LoginScreen