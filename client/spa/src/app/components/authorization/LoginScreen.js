'use client';
import "./../../globals.css";
import { useKeycloak } from './../../auth/provider/KeycloakProvider.js';

const LoginScreen = () => {
  const { login, register } = useKeycloak();

  return (<div>
          <h1>Użytkownik niezalogowany!</h1>
          <button onClick={login}>Zaloguj</button>
          <button onClick={register}>Zarejestruj</button>
        </div>)
}

export default LoginScreen