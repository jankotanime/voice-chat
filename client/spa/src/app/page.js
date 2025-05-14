"use client";

import { useAuth } from '../context/AuthContext.js';
import Login from './components/authorization/Login.js';
import Main from './components/main/Main.js';

export default function Home() {
  const { authenticated, userInfo } = useAuth();

  return (
    <div>
      {authenticated ? <Main user = {userInfo} /> : <Login />}
    </div>
  );
}
