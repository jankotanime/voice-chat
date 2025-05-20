'use client';
import "./../../globals.css";
import LogoutButton from "./../authorization/LogoutButton";
import RoomsContainer from "./../room/RoomsContainer";
import Users from "./../users/Users"
import Roles from "./../roles/Roles"

const MainScreen = (props) => {
  return (<div>
          <h1>Witaj, {props.user.name}</h1>
          <LogoutButton />
          <h2>Pokoje</h2>
          <RoomsContainer />
          <h2>Użytkownicy</h2>
          <Users />
          <h2>Role</h2>
          <Roles />
        </div>)
}

export default MainScreen