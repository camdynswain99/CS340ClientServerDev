import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = ({ isAuthenticated, onSignOut }) => (
  <ul className="menu">
    <li><Link to="/">Home</Link></li>
    <li><Link to="/about">About</Link></li>
    <li><Link to="/services">Services</Link></li>
    <li><Link to="/contact">Contact</Link></li>
    {!isAuthenticated && <li><Link to="/signin">Sign In</Link></li>}
    {!isAuthenticated && <li><Link to="/signup">Sign Up</Link></li>}
    {isAuthenticated && <li><Link to="/YourNotesPage">Dashboard</Link></li>}
    {isAuthenticated && (
      <li className="spacer">
        <button className="SignOutButton" onClick={onSignOut}>Sign Out</button>
      </li>
    )}
  </ul>
);

export default Navbar;
