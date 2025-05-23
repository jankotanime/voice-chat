'use client';
import "./../../globals.css";
import LogoutButton from "./../authorization/LogoutButton";
import RoomsContainer from "./../room/RoomsContainer";
import Users from "./../users/Users"
import Roles from "./../roles/Roles"
import { useKeycloak } from './../../auth/provider/KeycloakProvider.js';
import { useEffect, useState } from "react";

const USER_URL = process.env.NEXT_PUBLIC_USER_URL

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
  
        const response = await fetch(`${USER_URL}/user/admin`, {
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
      return
      } catch (error) {
        console.warn('Błąd podczas pobierania danych:', error);
      }
    }
    fetchAdmin()
  }, [])

  return (
  <div>
    <div className="header">
      <div className={admin ? "admin" : "notAdmin" }>
        Hello, {props.user.name}
      </div>
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