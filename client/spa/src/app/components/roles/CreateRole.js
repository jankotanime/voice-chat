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
  return (<div className="createRole">
          <div className="change"><input type="checkbox" checked={admin} onChange={e => SetAdmin(!admin)} />Admin role</div>
          <input className="change" placeholder="Name..." style={{ backgroundColor: 'white', color: "black" }} onChange={(e) => SetName(e.target.value)} type="text"></input>
          <input className="change" placeholder="Description..." style={{ backgroundColor: 'white', color: "black" }} onChange={(e) => setDescription(e.target.value)} type="text"></input>
          <div className="createRoomButtonFinish" onClick={() => handleCreate(getToken, name, description, admin, props.setRoles)}>Create role</div>
        </div>)
}

export default CreateRole