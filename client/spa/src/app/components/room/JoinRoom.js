'use client';
import "./../../globals.css";
import { useState } from "react";
import { useKeycloak } from '../../auth/provider/KeycloakProvider.js';

const handleJoin = async (getToken, id, onJoin) => {
  try {
    const token = await getToken();
    if (!token) {
      console.error("Brak tokenu – użytkownik nieautoryzowany.");
      return;
    }
    onJoin(id, token)
  } catch (err) {
    console.log(err)
  }
}

const JoinRoom = (props) => {
  const { getToken } = useKeycloak();

  return props.joined ? 
  <div style={{ fontWeight: 'bold' }}>{props.name}</div> : 
  <div onClick={() => handleJoin(getToken, props.id, props.onJoin)}>{props.name}</div>
}

export default JoinRoom