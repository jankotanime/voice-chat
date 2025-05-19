'use client';
import "./../../globals.css";
import { useState, useEffect, useRef } from "react";
import { useKeycloak } from '../../auth/provider/KeycloakProvider.js';
import DeleteRoom from './DeleteRoom.js'
import JoinRoom from './JoinRoom.js'
import CreateRoom from "./CreateRoom"
import { socket } from "../../handle-voice-chat/handleWebsocket.js";
import { handleVoice } from "../../handle-voice-chat/handleVoice.js"
import { roomMatesListener } from "../../handle-voice-chat/handleWebsocket.js";

const UserRooms = () => {
  socket.connect();
  const { getToken } = useKeycloak();
  const [rooms, setRooms] = useState([]);
  const [muted, setMuted] = useState(false);
  const [shouldHandleVoice, setShouldHandleVoice] = useState(false);
  const mutedRef = useRef(muted)
  const [roomMates, setRoomMates] = useState([])

  useEffect(() => {
    if (!socket) return;
    roomMatesListener(setRoomMates);
    return () => {
      socket.off("roomMates");
    };
  }, [socket]);

  const onDelete = (id) => {
    setRooms(rooms => rooms.filter(elem => elem._id != id))
  }

  const onLeave  = async () => {
    try {
      const token = await getToken();
      if (!token) {
        console.error("Brak tokenu – użytkownik nieautoryzowany.");
        return;
      }
      socket.emit("leave_room", token)
      setRooms(rooms => rooms.map(elem => {
        elem.joined = false
        return elem
      }))
    } catch (err) {
      console.log("Error: ", err)
    }
  }

  const onJoin = async (id, token) => {
    setShouldHandleVoice(true)
    socket.emit("join_room", id, token);
    const audio = new Audio("/audio/user-join.mp3");
    audio.play().catch(err => console.error("Error playing audio:", err));
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
    if (shouldHandleVoice) {
      handleVoice(mutedRef);
      setShouldHandleVoice(false)
    }
  }, [shouldHandleVoice]);

  useEffect(() => {
    mutedRef.current = muted;
  }, [muted]);

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

  return (<div>
    {rooms.map((elem) => (
      <div key={elem._id}>
        <JoinRoom id={elem._id} name={elem.name} joined={elem.joined} onJoin={onJoin}/> {/* Name is in this container */}
        <DeleteRoom id={elem._id} onDelete={onDelete} />
      </div>
    ))}
    <div onClick={() => {
      setMuted(!muted)
      setShouldHandleVoice(true)
    }}>{ muted ? "Zmutowany" : "Odmutowany"}</div>
    <CreateRoom setRooms={setRooms} />
    <div>Użytkownicy w pokoju:</div>
    {roomMates.map((elem, id) => (
      <div key={id}>
      {console.log(roomMates)}
      {elem}</div>
    ))}
    <div>-----</div>
    <div>{rooms.map((elem, id) => {
      if (elem.joined) {
        return (<div key={id} onClick={() => onLeave()}> Opuść pokój </div>)
      }
    })}</div>
  </div>)
}

export default UserRooms