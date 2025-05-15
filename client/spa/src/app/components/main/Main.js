'use client';
import "./../../globals.css";
import LogoutButton from "./../authorization/LogoutButton";
import UserRooms from "./../room/UserRooms";

const MainScreen = (props) => {
  return (<div>
          <h1>Witaj, {props.user.name}</h1>
          <LogoutButton />
          <UserRooms />
        </div>)
}

export default MainScreen