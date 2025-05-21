'use client';
import "./../../../globals.css";
import { useState } from "react";
import { useKeycloak } from '../../../auth/provider/KeycloakProvider.js';

const USER_URL = process.env.NEXT_PUBLIC_USER_URL

const handleDelete = async (getToken, id, onDelete) => {
  try {
    const token = await getToken();
    if (!token) {
      console.error("Brak tokenu – użytkownik nieautoryzowany.");
      return;
    }

    const response = await fetch(`${USER_URL}/room`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({id: id})
    });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    onDelete(id)
  } catch (err) {
    console.log(err)
  }
}

const DeleteRoom = (props) => {
  const { getToken } = useKeycloak();
  const [del, setDel] = useState(false)

  return del ? <div onClick={() => handleDelete(getToken, props.id, props.onDelete)}>Potwierdź usunięcie</div> : <div onClick={setDel}>Usuń</div>
}

export default DeleteRoom