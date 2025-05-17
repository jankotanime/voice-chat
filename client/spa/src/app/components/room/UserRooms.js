'use client';
import "./../../globals.css";
import { useState, useEffect, useRef } from "react";
import { useKeycloak } from '../../auth/provider/KeycloakProvider.js';
import DeleteRoom from './DeleteRoom.js'
import JoinRoom from './JoinRoom.js'
import CreateRoom from "./CreateRoom"
import { socket } from "../../handle-voice-chat/handleWebsocket.js";
import { handleVoice } from "../../handle-voice-chat/handleVoice.js"

const UserRooms = () => {
  const { getToken } = useKeycloak();
  const [rooms, setRooms] = useState([]);

  const onDelete = (id) => {
    setRooms(rooms => rooms.filter(elem => elem._id != id))
  }

  const onJoin = async (id, token) => {
    rooms.forEach(elem => {
      if (elem.joined === true) {
        socket.emit("leave_room", token);
      }
    })
    if (socket.connected) {
      socket.disconnect();
    }
    socket.connect()
    socket.emit("join_room", id, token);
    await handleVoice();
    setRooms(rooms => rooms.map(elem =>{
      if (elem._id === id) {
        elem.joined = true
        return elem
      }
      elem.joined = false
      return elem
    }))
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
        json.mess.forEach(elem => elem.joined = false);
        setRooms(json.mess);
      } catch (error) {
        console.error('Błąd podczas pobierania danych:', error);
      }
    };
  
    fetchRooms();
  }, [getToken]);

  handleVoice()

  return (<div>
    {rooms.map((elem) => (
      <div key={elem._id}>
        <JoinRoom id={elem._id} name={elem.name} joined={elem.joined} onJoin={onJoin}/> {/* Name is in this container */}
        <DeleteRoom id={elem._id} onDelete={onDelete} />
      </div>
    ))}
    <CreateRoom setRooms={setRooms} />
  </div>)
}

export default UserRooms