'use client';
import "./../../globals.css";
import DeleteRole from "./DeleteRole"

const ManageRole = (props) => {
  return (<div className="manage">
    <DeleteRole name={props.name} onDelete={props.onDelete} />
  </div>)
}

export default ManageRole