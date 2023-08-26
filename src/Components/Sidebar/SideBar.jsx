import React, { useState } from 'react';
import './Sidebar.css';
import { Link, useNavigate } from 'react-router-dom';

const Sidebar = () => {

  const navigate = useNavigate()


  const handleRouteMovement = (route) => {
    navigate(route)
  }

  return (
    <div className='sidebar'>
      
      <ul className="menu">
        <li onClick={() => handleRouteMovement("/dashboard/user")}>Dashboard</li>
        <li onClick={() => handleRouteMovement("/addClient")}>Add Client</li>
        <li onClick={() => handleRouteMovement("/transactionDetails")}>Transactions</li>
      </ul>
    </div>
  );
};

export default Sidebar;
