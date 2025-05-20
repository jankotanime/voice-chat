'use client';
import "./../../globals.css";
import { useKeycloak } from '../../auth/provider/KeycloakProvider.js';
import { socket } from "../../handle-voice-chat/handleWebsocket.js";
import { useState, useEffect } from "react";
import { roomMatesListener } from "../../handle-voice-chat/handleWebsocket.js";

const JoinedRoom = (props) => {
  const { getToken } = useKeycloak();
  const [roomMates, setRoomMates] = useState([])

  useEffect(() => {
    if (!socket) return;
    roomMatesListener(setRoomMates);
    return () => {
      socket.off("roomMates");
    };
  }, [socket]);

  const onLeave  = async () => {
    try {
      const token = await getToken();
      if (!token) {
        console.error("Brak tokenu – użytkownik nieautoryzowany.");
        return;
      }
      socket.emit("leave_room", token)
      props.setRooms(rooms => rooms.map(elem => {
        elem.joined = false
        return elem
      }))
    } catch (err) {
      console.log("Error: ", err)
    }
  }

  return (<div>
<div>Użytkownicy w pokoju:</div>
    {roomMates.map((elem, id) => (
      <div key={id}>
      {elem}</div>
    ))}
    <div>-----</div>
    <div onClick={() => onLeave()}> Opuść pokój </div>
  </div>)
}

export default JoinedRoom
