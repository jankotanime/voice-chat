'use client';
import "./../../globals.css";
import { useEffect } from "react";
import { useKeycloak } from '../../auth/provider/KeycloakProvider.js';

const PickRoles = (props) => {
  const { getToken } = useKeycloak();

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const token = await getToken();
        
        if (!token) {
          console.error("Brak tokenu – użytkownik nieautoryzowany.");
          return;
        }

        const userRolesResponse = await fetch(`http://localhost:8001/user/role?username=${props.user}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
  
        if (!userRolesResponse.ok) {
          throw new Error(`HTTP error! Status: ${userRolesResponse.status}`);
        }
  
        const userRolesJson = await userRolesResponse.json();
  
        const response = await fetch(`http://localhost:8001/role`, {
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

        console.log(userRolesJson)
        console.log(json)
        props.setRoles(json.roles.map((elem) => {return  {name: elem, picked: userRolesJson.roles.includes(elem)}}));
      } catch (error) {
        console.error('Błąd podczas pobierania danych:', error);
      }
    };
  
    fetchRoles();
  }, [getToken]);

  return (<div>
    {props.roles.map((elem, id) => (<div key={id}>
      <input type="checkbox" 
      checked={elem.picked} onChange={(e) => {
        props.setRoles((prevRoles) =>
          prevRoles.map((role, i) =>
            i === id ? { ...role, picked: !role.picked } : role
          )
        );
      }}>
      </input>
      {elem.name}
    </div>))}
  </div>)
}

export default PickRoles