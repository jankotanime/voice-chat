'use client';
import "./../../globals.css";

const PickRoles = (props) => {
  return (<div>
    {props.roles.map((elem, id) => (<div key={id}>
      <input type="checkbox" 
      checked={elem.picked} onChange={(e) => {
        props.setRoles((prevRoles) =>
          prevRoles.map((role, i) =>
            i === id ? { ...role, picked: !role.picked } : role
          )
        );
      }}>
      </input>
      {elem.name}
    </div>))}
  </div>)
}

export default PickRoles