'use client';
import "./../../globals.css";
import LogoutButton from "./../authorization/LogoutButton";
import RoomsContainer from "./../room/RoomsContainer";
import Users from "./../users/Users"
import Roles from "./../roles/Roles"

const MainScreen = (props) => {
  return (
  <div>
    <div className="header">    
      <h1>Witaj, {props.user.name}</h1>
      <LogoutButton />
    </div>
    <div className="main"> 
      <RoomsContainer />
      <Users />
      <Roles />
    </div>
  </div>)
}

export default MainScreen