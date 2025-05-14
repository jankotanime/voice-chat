import React from 'react';
import withAuth from './auth/middleware/withAuth';
import LogoutButton from './auth/components/LogoutButton';

export default function Home() {
  return (
    <div>
      <h1>Welcome to the Home Page</h1>
      <LogoutButton />
    </div>
  );
};
