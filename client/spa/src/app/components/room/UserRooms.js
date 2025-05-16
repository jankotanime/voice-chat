'use client';
import "./../../globals.css";
import { io } from 'socket.io-client';
import { useState, useEffect } from "react";
import { useKeycloak } from '../../auth/provider/KeycloakProvider.js';
import DeleteRoom from './DeleteRoom.js'
import JoinRoom from './JoinRoom.js'
import CreateRoom from "./CreateRoom"


const socket = io("http://localhost:8002", {
  transports: ['websocket', 'polling'],
  autoConnect: false
});

socket.on("connect_error", (err) => {
  console.error("Błąd połączenia z WebSocketem:", err.message);
});

socket.on("connect", () => {
  console.log("Połączono z serwerem WebSocket.");
});

socket.on("voice", (message) => {
  console.log(message);
});

const UserRooms = () => {
  const { getToken } = useKeycloak();
  const [rooms, setRooms] = useState([]);

  const onDelete = (id) => {
    setRooms(rooms => rooms.filter(elem => elem._id != id))
  }

  const onJoin = () => {
  }

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const token = await getToken();
        if (!token) {
          console.error("Brak tokenu – użytkownik nieautoryzowany.");
          return;
        }
  
        const response = await fetch(`http://localhost:8001/user/room`, {
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
        setRooms(json.mess);
      } catch (error) {
        console.error('Błąd podczas pobierania danych:', error);
      }
    };
  
    fetchRooms();
  }, [getToken]);

  return (<div>
    {rooms.map((elem) => (
      <div key={elem._id}>
        <JoinRoom id={elem._id} name={elem.name} onJoin={onJoin} socket={socket}/> {/* Name is in this container */}
        <DeleteRoom id={elem._id} onDelete={onDelete} />
      </div>
    ))}
    <CreateRoom setRooms={setRooms} />
  </div>)
}

export default UserRooms