'use client';
import "./../../globals.css";
import { useState, useEffect, useRef } from "react";
import { useKeycloak } from '../../auth/provider/KeycloakProvider.js';
import CreateRoom from "./CreateRoom"
import { socket } from "../../handle-voice-chat/handleWebsocket.js";
import JoinedRoom from "./JoinedRoom";
import UserRooms from "./UserRooms";
import { handleVoice } from "../../handle-voice-chat/handleVoice.js"
import Image from "next/image";

const USER_URL = process.env.NEXT_PUBLIC_USER_URL

const RoomsContainer = (props) => {
  socket.connect();
  const { getToken } = useKeycloak();
  const [rooms, setRooms] = useState([]);
  const [shouldHandleVoice, setShouldHandleVoice] = useState(false);
  const [muted, setMuted] = useState(false);
  const [creatingRoom, setCreatingRoom] = useState(false);
  const mutedRef = useRef(muted)

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
  
        const response = await fetch(`${USER_URL}/user/room`, {
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

  return (<div className="rooms-container">
    <div className="user-rooms">
    <UserRooms admin={props.admin} rooms={rooms} setRooms={setRooms} setShouldHandleVoice={setShouldHandleVoice} />
    <div className="createRoomButton" onClick={() => setCreatingRoom(!creatingRoom)}>
      {props.admin ? creatingRoom ? <Image src="/images/less.png" alt="Return" width={50} height={50}/>
      : <Image src="/images/more.png" alt="Create room" width={50} height={50}/> : null }
    </div>
    {creatingRoom ? <CreateRoom setRooms={setRooms} /> : null}
    </div>
    <div className="joined-room">
      {rooms.map((elem, id) => { return(
        <div key={id}>
        {elem.joined ? <JoinedRoom setRooms={setRooms} /> : null}
        </div>
      )})}
      <div className="mic" onClick={() => {
        setMuted(!muted)
        setShouldHandleVoice(true)
      }}>{ muted ? <Image src="/images/mute.png" alt="Mute" width={50} height={50}/> 
      : <Image src="/images/unmute.png" alt="Unmute" width={40} height={40}/>}</div>
    </div>
  </div>)
}

export default RoomsContainer