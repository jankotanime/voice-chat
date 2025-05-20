'use client';
import "./../../globals.css";
import { useState } from "react";
import { useKeycloak } from '../../auth/provider/KeycloakProvider.js';

const handleDelete = async (getToken, user) => {
  try {
    const token = await getToken();
    if (!token) {
      console.error("Brak tokenu – użytkownik nieautoryzowany.");
      return;
    }

    // TODO: dodać usuwanie użytkownika po stronie api
    // const response = await fetch(`http://localhost:8001/user`, {
    //   method: 'DELETE',
    //   headers: {
    //     'Authorization': `Bearer ${token}`,
    //     'Content-Type': 'application/json'
    //   },
    //   body: JSON.stringify({name: name, roles: roomRoles})
    // });
    // if (!response.ok) {
    //   throw new Error(`HTTP error! Status: ${response.status}`);
    // }
    // const json = await response.json();
    // setRooms((prev) => [...prev, json.mess])
  } catch (err) {
    console.log(err)
  }
}

const DeleteUser = (props) => {
  const [sure, setSure] = useState(false);
  const { getToken } = useKeycloak()
  return (<div>
    { sure ? <div onClick={() => handleDelete(getToken, props.user)}>Na pewno?</div> :
      <div onClick={() => setSure(true)}>Usuń</div>
    }
  </div>)
}

export default DeleteUser