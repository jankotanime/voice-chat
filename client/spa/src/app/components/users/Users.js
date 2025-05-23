'use client';
import "./../../globals.css";
import { useState, useEffect } from "react";
import { useKeycloak } from '../../auth/provider/KeycloakProvider.js';
import ManageUser from "./ManageUser.js"

const USER_URL = process.env.NEXT_PUBLIC_USER_URL

const Users = (props) => {
  const { getToken } = useKeycloak();
  const [users, setUsers] = useState([]);
  const [manage, setManage] = useState(null);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const token = await getToken();
        if (!token) {
          console.error("Brak tokenu – użytkownik nieautoryzowany.");
          return;
        }
  
        const response = await fetch(`${USER_URL}/user`, {
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
        setUsers(json);
      } catch (error) {
        console.error('Błąd podczas pobierania danych:', error);
      }
    };
  
    fetchRooms();
  }, [getToken]);

  return (<div className="users">
    <div className="title">Users:</div>
    {users.map((elem, id) => (<div className="user" key={id}><div onClick={() => {
      props.admin ? manage === elem.username ? setManage(null) : setManage(elem.username) : null
    }}>{elem.username}</div>{manage && manage === elem.username ? <ManageUser user={manage} setUsers={setUsers} /> : null}</div>))}
  </div>)
}

export default Users