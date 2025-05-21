'use client';
import "./../../globals.css";
import { useState } from "react";
import { useKeycloak } from '../../auth/provider/KeycloakProvider.js';

const USER_URL = process.env.NEXT_PUBLIC_USER_URL

const handleCreate = async (getToken, name, description, admin, setRoles) => {
  try {
    const token = await getToken();
    if (!token) {
      console.error("Brak tokenu – użytkownik nieautoryzowany.");
      return;
    }

    const response = await fetch(admin ? `${USER_URL}/role/admin` : `${USER_URL}/role`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({rolename: name, description: description})
    });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    setRoles((prev) => [...prev, name])
  } catch (err) {
    console.log(err)
  }
}

const CreateRole = (props) => {
  const [name, SetName] = useState("")
  const [description, setDescription] = useState("")
  const [admin, SetAdmin] = useState(false)
  const { getToken } = useKeycloak()
  return (<div>
          <div onClick={() => handleCreate(getToken, name, description, admin, props.setRoles)}>Stwórz role</div>
          <input type="checkbox" checked={admin} onChange={e => SetAdmin(!admin)} />Rola admina
          <input style={{ backgroundColor: 'white', color: "black" }} onChange={(e) => SetName(e.target.value)} type="text"></input>
          <input style={{ backgroundColor: 'white', color: "black" }} onChange={(e) => setDescription(e.target.value)} type="text"></input>
        </div>)
}

export default CreateRole