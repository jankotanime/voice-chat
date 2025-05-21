"use client"

import React from 'react';
import { useKeycloak } from './auth/provider/KeycloakProvider.js';
import MainScreen from './components/main/Main'
import LoadingScreen from './components/main/LoadingScreen'
import LoginScreen from './components/authorization/LoginScreen'

export default function Home() {
  const { initialized, authenticated, user } = useKeycloak();
  return (<div>{
    initialized ? 
    authenticated && user ? 
    <MainScreen user = {user} /> : 
    <LoginScreen /> : 
    <LoadingScreen />
  }</div>)
};
