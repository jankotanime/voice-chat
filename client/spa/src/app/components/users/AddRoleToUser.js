'use client';
import "./../../globals.css";
import { useState } from "react";
import { useKeycloak } from '../../auth/provider/KeycloakProvider.js';
import PickRoles from "./PickRoles";

const handleAdd = async (getToken, user, roles) => {
  try {
    const token = await getToken();
    if (!token) {
      console.error("Brak tokenu – użytkownik nieautoryzowany.");
      return;
    }

    const response = await fetch(`http://localhost:8001/user/role`, {
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
  return (<div>
    { add ? <div><PickRoles user={props.user} roles={roles} setRoles={setRoles} />
    <div onClick={() => handleAdd(getToken, props.user, roles)}>Zapisz</div></div> :
      <div onClick={() => setAdd(true)}>Aktualizuj role</div>
    }
  </div>)
}

export default AddRoleToUser