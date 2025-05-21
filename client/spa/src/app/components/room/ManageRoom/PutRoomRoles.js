'use client';
import "./../../../globals.css";
import { useState, useEffect } from "react";
import { useKeycloak } from '../../../auth/provider/KeycloakProvider.js';
import PickRoles from "./PickRoles";

const USER_URL = process.env.NEXT_PUBLIC_USER_URL

const handleAdd = async (getToken, roomId, roles, setRooms) => {
  try {
    const token = await getToken();
    if (!token) {
      console.error("Brak tokenu – użytkownik nieautoryzowany.");
      return;
    }
    const response = await fetch(`${USER_URL}/room/role`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({roomId: roomId, roles: roles})
    });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const json = await response.json();
    setRooms((prev) => [...prev.filter(elem => elem._id !== roomId), json.mess])
  } catch (err) {
    console.log(err)
  }
}

const PutRoomRoles = (props) => {
  const [add, setAdd] = useState(false);
  const [roles, setRoles] = useState([]);
  const { getToken } = useKeycloak()

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const token = await getToken();
        
        if (!token) {
          console.error("Brak tokenu – użytkownik nieautoryzowany.");
          return;
        }

        const roomRolesResponse = await fetch(`${USER_URL}/room`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
  
        if (!roomRolesResponse.ok) {
          throw new Error(`HTTP error! Status: ${roomRolesResponse.status}`);
        }
  
        const userRolesJson = await roomRolesResponse.json();
  
        const response = await fetch(`${USER_URL}/role`, {
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

        setRoles(json.roles.map((elem) => {return  {name: elem, 
          picked: userRolesJson.mess.filter(elem => elem._id === props.id)[0].roles.includes(elem)}}));
      } catch (error) {
        console.error('Błąd podczas pobierania danych:', error);
      }
    };
  
    fetchRoles();
  }, [getToken]);


  return (<div>
    { add ? <div><PickRoles name={props.name} roles={roles} setRoles={setRoles} />
    <div onClick={() => handleAdd(getToken, props.id, roles, props.setRooms)}>Zapisz</div></div> :
      <div onClick={() => setAdd(true)}>Aktualizuj role</div>
    }
  </div>)
}

export default PutRoomRoles