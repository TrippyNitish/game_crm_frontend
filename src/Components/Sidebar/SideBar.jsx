import React, { useState } from 'react';
import './Sidebar.css';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Sidebar = () => {

  const navigate = useNavigate()

  const userDesignation = useSelector(state=>state.user.designation)

  const handleRouteMovement = (route) => {
    navigate(route)
  }

  const clientDesignation = {
    company: "Master",
    master: "Distributer",
    distributer: "SubDistributer",
    subDistributer: "Store",
    store: "Player"
}
  
  return (
    <div className='sidebar'>
      
      <ul className="menu">
        <li onClick={() => handleRouteMovement("/dashboard/user")}>Dashboard</li>
        <li onClick={() => handleRouteMovement("/addClient")}>Add {clientDesignation[userDesignation]}</li>
        <li onClick={() => handleRouteMovement("/transactionDetails")}>Transactions</li>
      </ul>
    </div>
  );
};

export default Sidebar;
