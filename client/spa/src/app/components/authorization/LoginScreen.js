'use client';
import "./../../globals.css";
import { useKeycloak } from './../../auth/provider/KeycloakProvider.js';

const LoginScreen = () => {
  const { login } = useKeycloak();

  return (<div className="center">
          <div>Please login to continue</div>
          <div>
            <button className="loginButton" onClick={login}>Click to login or to register</button>
          </div>
        </div>)
}

export default LoginScreen