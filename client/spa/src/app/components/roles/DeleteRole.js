'use client';
import "./../../globals.css";
import { useState } from "react";
import { useKeycloak } from '../../auth/provider/KeycloakProvider.js';

const USER_URL = process.env.NEXT_PUBLIC_USER_URL

const handleDelete = async (getToken, name, onDelete) => {
  try {
    const token = await getToken();
    if (!token) {
      console.error("Brak tokenu – użytkownik nieautoryzowany.");
      return;
    }

    const response = await fetch(`${USER_URL}/role/${name}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    onDelete(name)
  } catch (err) {
    console.log(err)
  }
}

const DeleteRole = (props) => {
  const { getToken } = useKeycloak();
  const [del, setDel] = useState(false)

  return del ? <div onClick={() => handleDelete(getToken, props.name, props.onDelete)}>Confirm</div> : <div onClick={setDel}>Delete</div>
}

export default DeleteRole