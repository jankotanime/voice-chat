'use client';
import "./../../globals.css";
import LogoutButton from "./../authorization/LogoutButton";
import UserRooms from "./../room/UserRooms";
import Users from "./../users/Users"

const MainScreen = (props) => {
  return (<div>
          <h1>Witaj, {props.user.name}</h1>
          <LogoutButton />
          <UserRooms />
          <Users />
        </div>)
}

export default MainScreen