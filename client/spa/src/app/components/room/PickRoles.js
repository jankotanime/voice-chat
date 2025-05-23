'use client';
import "./../../globals.css";
import { useEffect } from "react";
import { useKeycloak } from '../../auth/provider/KeycloakProvider.js';

const USER_URL = process.env.NEXT_PUBLIC_USER_URL

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
  
        const json = await response.json();
        props.setRoles(json.roles.map((elem) => {return {name: elem, picked: false}}));
      } catch (error) {
        console.error('Błąd podczas pobierania danych:', error);
      }
    };
  
    fetchRoles();
  }, [getToken]);

  return (<div className="change"> Pick roles:
    {props.roles.map((elem, id) => (<div key={id}>
      <input className="change" type="checkbox" 
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