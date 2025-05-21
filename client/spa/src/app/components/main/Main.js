'use client';
import "./../../globals.css";
import LogoutButton from "./../authorization/LogoutButton";
import RoomsContainer from "./../room/RoomsContainer";
import Users from "./../users/Users"
import Roles from "./../roles/Roles"
import { useKeycloak } from './../../auth/provider/KeycloakProvider.js';
import { useEffect, useState } from "react";

const MainScreen = (props) => {
  const { getToken } = useKeycloak();
  const [admin, setAdmin] = useState(false)

  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const token = await getToken();
        if (!token) {
          console.error("Brak tokenu – użytkownik nieautoryzowany.");
          return;
        }
  
        const response = await fetch(`http://localhost:8001/user/admin`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
  
        if (response.ok) {
          const json = (await response.json()).mess;
          if (json) setAdmin(json)
        }
      } catch (error) {
        console.error('Błąd podczas pobierania danych:', error);
      }
    }
    fetchAdmin()
  }, [])

  return (
  <div>
    <div className="header">    
      <h1>
        Witaj, {props.user.name}
        {admin ? "Jesteś adminem" : null}
      </h1>
      <LogoutButton />
    </div>
    <div className="main"> 
      <RoomsContainer admin={admin} />
      <Users admin={admin} />
      <Roles admin={admin} />
    </div>
  </div>)
}

export default MainScreen