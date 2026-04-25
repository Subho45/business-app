import React from 'react';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      <div className="user-info">
        <h2>Welcome back, {user?.name}!</h2>
        <p>Email: {user?.email}</p>
        {user?.isAdmin && <p><strong>You have Admin access!</strong></p>}
      </div>
    </div>
  );
};

export default Dashboard;