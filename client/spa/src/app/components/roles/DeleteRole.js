'use client';
import "./../../globals.css";
import { useState } from "react";
import { useKeycloak } from '../../auth/provider/KeycloakProvider.js';

const handleDelete = async (getToken, name, onDelete) => {
  try {
    const token = await getToken();
    if (!token) {
      console.error("Brak tokenu – użytkownik nieautoryzowany.");
      return;
    }

    const response = await fetch(`http://localhost:8001/role/${name}`, {
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

  return del ? <div onClick={() => handleDelete(getToken, props.name, props.onDelete)}>Potwierdź usunięcie</div> : <div onClick={setDel}>Usuń</div>
}

export default DeleteRole