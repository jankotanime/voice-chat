'use client';
import "./../../globals.css";
import { useState, useEffect } from "react";
import { useKeycloak } from '../../auth/provider/KeycloakProvider.js';
import PickRoles from "./PickRoles";

const USER_URL = process.env.NEXT_PUBLIC_USER_URL

const handleAdd = async (getToken, user, roles) => {
  try {
    const token = await getToken();
    if (!token) {
      console.error("Brak tokenu – użytkownik nieautoryzowany.");
      return;
    }

    const response = await fetch(`${USER_URL}/user/role`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({username: user, roles: roles})
    });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const json = await response.json();
    setRooms((prev) => [...prev, json.mess])
  } catch (err) {
    console.log(err)
  }
}

const AddRoleToUser = (props) => {
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

        const userRolesResponse = await fetch(`${USER_URL}/user/role?username=${props.user}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
  
        if (!userRolesResponse.ok) {
          throw new Error(`HTTP error! Status: ${userRolesResponse.status}`);
        }
  
        const userRolesJson = await userRolesResponse.json();
  
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
        setRoles(json.roles.map((elem) => {return  {name: elem, picked: userRolesJson.roles.includes(elem)}}));
      } catch (error) {
        console.error('Błąd podczas pobierania danych:', error);
      }
    };
  
    fetchRoles();
  }, [getToken]);


  return (<div>
    { add ? <div><PickRoles user={props.user} roles={roles} setRoles={setRoles} />
    <div onClick={() => handleAdd(getToken, props.user, roles)}>Zapisz</div></div> :
      <div onClick={() => setAdd(true)}>Aktualizuj role</div>
    }
  </div>)
}

export default AddRoleToUser