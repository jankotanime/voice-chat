'use client';
import "./../../globals.css";
import LogoutButton from "./../authorization/LogoutButton";
import UserRooms from "./../room/UserRooms";
import Users from "./../users/Users"
import CreateRoom from "./../room/CreateRoom"

const MainScreen = (props) => {
  return (<div>
          <h1>Witaj, {props.user.name}</h1>
          <LogoutButton />
          <h2>Pokoje</h2>
          <UserRooms />
          <CreateRoom />
          <h2>Użytkownicy</h2>
          <Users />
        </div>)
}

export default MainScreen