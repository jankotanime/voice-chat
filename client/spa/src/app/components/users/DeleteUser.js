'use client';
import "./../../globals.css";
import { useState } from "react";
import { useKeycloak } from '../../auth/provider/KeycloakProvider.js';

const USER_URL = process.env.NEXT_PUBLIC_USER_URL

const handleDelete = async (getToken, user, setUsers) => {
  try {
    const token = await getToken();
    if (!token) {
      console.error("Brak tokenu – użytkownik nieautoryzowany.");
      return;
    }

    const response = await fetch(`${USER_URL}/user`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({user: user})
    });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    setUsers(prev => prev.filter(elem => elem.username !== user))
  } catch (err) {
    console.log(err)
  }
}

const DeleteUser = (props) => {
  const [sure, setSure] = useState(false);
  const { getToken } = useKeycloak()
  return (<div>
    { sure ? <div onClick={() => handleDelete(getToken, props.user, props.setUsers)}>Confirm</div> :
      <div onClick={() => setSure(true)}>Delete</div>
    }
  </div>)
}

export default DeleteUser