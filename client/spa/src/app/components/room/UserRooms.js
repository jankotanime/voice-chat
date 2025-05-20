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

const UserRooms = (props) => {
  socket.connect();

  const onDelete = (id) => {
    props.setRooms(rooms => rooms.filter(elem => elem._id != id))
  }

  const onJoin = async (id, token) => {
    props.setShouldHandleVoice(true)
    socket.emit("join_room", id, token);
    const audio = new Audio("/audio/user-join.mp3");
    audio.play().catch(err => console.error("Error playing audio:", err));
    props.setRooms(rooms => rooms.map(elem =>{
      if (elem._id === id) {
        elem.joined = true
        return elem
      }
      elem.joined = false
      return elem
    }))
  }

  return (<div>
    {props.rooms.map((elem) => (
      <div key={elem._id}>
        <JoinRoom id={elem._id} name={elem.name} joined={elem.joined} onJoin={onJoin}/>
        <DeleteRoom id={elem._id} onDelete={onDelete} />
      </div>
    ))}
    <div>-----</div>
  </div>)
}

export default UserRooms