'use client';
import "./../../globals.css";
import DeleteUser from "./DeleteUser"
import AddRoleToUser from "./AddRoleToUser"

const ManageUser = (props) => {
  return (<div>
    <DeleteUser />
    <AddRoleToUser user={props.user} />
  </div>)
}

export default ManageUser