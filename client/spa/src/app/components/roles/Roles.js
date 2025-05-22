'use client';
import "./../../globals.css";
import { useState, useEffect } from "react";
import { useKeycloak } from '../../auth/provider/KeycloakProvider.js';
import CreateRole from "./CreateRole";
import ManageRole from "./ManageRole"

const USER_URL = process.env.NEXT_PUBLIC_USER_URL

const Roles = (props) => {
  const { getToken } = useKeycloak();
  const [roles, setRoles] = useState([]);
  const [createRole, setCreateRole] = useState(false)
  const [manage, setManage] = useState(null);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const token = await getToken();
        if (!token) {
          console.error("Brak tokenu – użytkownik nieautoryzowany.");
          return;
        }
  
        const response = await fetch(`${USER_URL}/role`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
  
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
  
        const json = (await response.json()).roles;
        setRoles(json);
      } catch (error) {
        console.error('Błąd podczas pobierania danych:', error);
      }
    };
  
    fetchRooms();
  }, [getToken]);

  const onDelete = (name) => {
    setRoles(prev => prev.filter(elem => elem !== name))
  }

  return (<div className="roles">
    {roles.map((elem, id) => (<div key={id}>
      <div onClick={() => props.admin ? setManage(elem) : null}> {elem} </div>
      {manage === elem ? <ManageRole name={elem} onDelete={onDelete} /> : null }
    </div>))}
    <div onClick={() => setCreateRole(!createRole)}>
      {createRole ? "Anuluj" : "Stwórz role" }
    </div>
    {createRole ? <CreateRole setRoles={setRoles}/> : null}
  </div>)
}

export default Roles