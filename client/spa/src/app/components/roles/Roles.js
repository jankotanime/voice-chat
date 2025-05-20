'use client';
import "./../../globals.css";
import { useState, useEffect } from "react";
import { useKeycloak } from '../../auth/provider/KeycloakProvider.js';

const Roles = () => {
  const { getToken } = useKeycloak();
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const token = await getToken();
        if (!token) {
          console.error("Brak tokenu – użytkownik nieautoryzowany.");
          return;
        }
  
        const response = await fetch(`http://localhost:8001/role`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
  
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
  
        const json = (await response.json()).roles;
        setRoles(json);
      } catch (error) {
        console.error('Błąd podczas pobierania danych:', error);
      }
    };
  
    fetchRooms();
  }, [getToken]);

  return (<div>
    {roles.map((elem, id) => (<div key={id}>{elem}</div>))}
  </div>)
}

export default Roles