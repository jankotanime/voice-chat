'use client';
import "./../../../globals.css";
import DeleteRoom from "./DeleteRoom";
import PutRoomRoles from "./PutRoomRoles"

const ManageRoom = (props) => {
  return (<div className="manage-room">
    <DeleteRoom id={props.id} name={props.name} onDelete={props.onDelete} />
    <PutRoomRoles id={props.id} name={props.name} setRooms={props.setRooms} />
  </div>)
}

export default ManageRoom