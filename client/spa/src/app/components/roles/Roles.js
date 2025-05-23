'use client';
import "./../../globals.css";
import { useState, useEffect } from "react";
import { useKeycloak } from '../../auth/provider/KeycloakProvider.js';
import CreateRole from "./CreateRole";
import ManageRole from "./ManageRole"
import Image from "next/image";

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
    <div className="title">Roles:</div>
    {roles.map((elem, id) => (<div className="role" key={id}>
      <div onClick={() => props.admin ? manage === elem ? setManage(null) : setManage(elem) : null}> {elem} </div>
      {manage === elem ? <ManageRole name={elem} onDelete={onDelete} /> : null }
    </div>))}
    <div className="createRoomButton" onClick={() => setCreateRole(!createRole)}>
      {props.admin ? createRole ? <Image src="/images/less.png" alt="Create role" width={50} height={50}/> 
      : <Image src="/images/more.png" alt="Create role" width={50} height={50}/> : null }
    </div>
    {createRole ? <CreateRole setRoles={setRoles}/> : null}
  </div>)
}

export default Roles