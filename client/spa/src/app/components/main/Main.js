'use client';
import "./../../globals.css";
import LogoutButton from "./../authorization/LogoutButton";

const MainScreen = (props) => {
  return (<div>
          <h1>Witaj, {props.user.name}</h1>
          <LogoutButton />
        </div>)
}

export default MainScreen