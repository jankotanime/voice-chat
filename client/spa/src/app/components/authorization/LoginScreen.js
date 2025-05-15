'use client';
import "./../../globals.css";
import { useKeycloak } from './../../auth/provider/KeycloakProvider.js';

const LoginScreen = () => {
  const { login } = useKeycloak();

  return (<div>
          <h1>Użytkownik niezalogowany!</h1>
          <button onClick={login}>Zaloguj</button>
        </div>)
}

export default LoginScreen