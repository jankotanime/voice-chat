'use client';
import "./../../globals.css";
import { useState } from "react";
import { useKeycloak } from '../../auth/provider/KeycloakProvider.js';

const handleJoin = async (getToken, id, onJoin, setJoined, socket) => {
  try {
    const token = await getToken();
    if (!token) {
      console.error("Brak tokenu – użytkownik nieautoryzowany.");
      return;
    }

    socket.connect()
    socket.emit("join_room", id, token);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    setJoined(true)
  } catch (err) {
    console.log(err)
  }
}

const JoinRoom = (props) => {
  const { getToken } = useKeycloak();
  const [joined, setJoined] = useState(false)

  return joined ? 
  <div style={{ fontWeight: 'bold' }}>{props.name}</div> : 
  <div onClick={() => handleJoin(getToken, props.id, props.onJoin, setJoined, props.socket)}>{props.name}</div>
}

export default JoinRoom