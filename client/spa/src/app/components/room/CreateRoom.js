'use client';
import "./../../globals.css";
import { useState } from "react";
import { useKeycloak } from '../../auth/provider/KeycloakProvider.js';
import PickRoles from './PickRoles.js'

const USER_URL = process.env.NEXT_PUBLIC_USER_URL

const handleCreate = async (getToken, roles, name, setRooms) => {
  try {
    const roomRoles = roles.filter(elem => elem.picked).map(elem => elem.name)
    const token = await getToken();
    if (!token) {
      console.error("Brak tokenu – użytkownik nieautoryzowany.");
      return;
    }

    const response = await fetch(`${USER_URL}/room`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({name: name, roles: roomRoles})
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

const CreateRoom = (props) => {
  const [name, SetName] = useState("")
  const [roles, setRoles] = useState([]);
  const { getToken } = useKeycloak()
  return (<div>
          <div onClick={() => handleCreate(getToken, roles, name, props.setRooms)}>Stwórz pokój</div>
          <PickRoles roles={roles} setRoles={setRoles} />
          <input style={{ backgroundColor: 'white', color: "black" }} onChange={(e) => SetName(e.target.value)} type="text"></input>
        </div>)
}

export default CreateRoom