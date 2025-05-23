'use client';
import "./../../globals.css";
import JoinRoom from './JoinRoom.js'
import { socket } from "../../handle-voice-chat/handleWebsocket.js";
import ManageRoom from "./ManageRoom/ManageRoom.js";
import { useState } from "react";
import Image from "next/image";

const UserRooms = (props) => {
  socket.connect();
  const [manage, setManage] = useState(null);

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
    <div className="title">Rooms:</div>
    {props.rooms.map((elem, i) => (
      <div key={i} className="room">
        <JoinRoom id={elem._id} name={elem.name} joined={elem.joined} onJoin={onJoin}/>
        {props.admin ? <div onClick={() => manage === elem._id ? setManage(null) : setManage(elem._id)}>
          <Image
          src="/images/edit.png"
          alt="Edit"
          width={30}
          height={30}
        />
        </div> : null}
        {manage === elem._id ? <ManageRoom id={elem._id} name={elem.name} onDelete={onDelete} setRooms={props.setRooms} /> : null}
      </div>
    ))}
  </div>)
}

export default UserRooms