'use client';
import "./../../globals.css";
import DeleteUser from "./DeleteUser"
import AddRoleToUser from "./AddRoleToUser"

const ManageUser = (props) => {
  return (<div>
    <DeleteUser user={props.user} setUsers={props.setUsers} />
    <AddRoleToUser user={props.user} />
  </div>)
}

export default ManageUser