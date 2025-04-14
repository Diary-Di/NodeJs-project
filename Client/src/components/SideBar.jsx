// src/components/Sidebar.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { MdHome, MdPostAdd, MdList } from 'react-icons/md';

const Sidebar = () => {
  return (
    <div className="sidebar">
      <h2>Menus</h2>
      <ul>
        <li>
          <Link to="/Home">
            <MdHome style={{ marginRight: '8px' }} />
            Accueil
          </Link>
        </li>
        <li>
          <Link to="/Students">
            <MdPostAdd style={{ marginRight: '8px' }} />
            Ajout
          </Link>
        </li>
        <li>
          <Link to="/ListPage">
            <MdList style={{ marginRight: '8px' }} />
            Liste
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
