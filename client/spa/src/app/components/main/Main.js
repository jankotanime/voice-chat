'use client';
import "./../../globals.css";
import { useEffect, useState } from "react";

const Main = (props) => {
  return (<div>
          <h1>AAA - Zalogowany!</h1>
          <p>Witaj, {props.preferred_username}</p>
        </div>)
}

export default Main