'use client';
import "./../../globals.css";
import { useState, useEffect } from "react";
import { useKeycloak } from '../../auth/provider/KeycloakProvider.js';
import DeleteRoom from './DeleteRoom.js'

const UserRooms = () => {
  const { getToken } = useKeycloak();
  const [rooms, setRooms] = useState([]);

  const onDelete = (id) => {
    setRooms(rooms => rooms.filter(elem => elem._id != id))
  }

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const token = await getToken();
        if (!token) {
          console.error("Brak tokenu – użytkownik nieautoryzowany.");
          return;
        }
  
        const response = await fetch(`http://localhost:8001/user/room`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
  
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
  
        const json = await response.json();
        setRooms(json.mess);
      } catch (error) {
        console.error('Błąd podczas pobierania danych:', error);
      }
    };
  
    fetchRooms();
  }, [getToken]);

  return (<div>
    {rooms.map((elem) => (<div key={elem._id}>{elem.name}<DeleteRoom id={elem._id} onDelete={onDelete} /></div>))}
  </div>)
}

export default UserRooms