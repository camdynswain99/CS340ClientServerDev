import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

const Navbar = ({ isAuthenticated, onSignOut }) => {
  const [darkMode, setDarkMode] = useState(false);

  // Load saved theme on mount
  useEffect(() => {
    const savedMode = localStorage.getItem("theme");
    const isDark = savedMode === "dark";
    setDarkMode(isDark);
    document.body.classList.toggle("dark-mode", isDark);
  }, []);

  // Apply and save theme on change
  useEffect(() => {
    document.body.classList.toggle("dark-mode", darkMode);
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/">LlamaWrite</Link>
      </div>

      <ul className="navbar-menu">
        {/* Main Links */}
        <li><Link to="/">Home</Link></li>
        <li><Link to="/about">About</Link></li>
        <li><Link to="/services">Services</Link></li>
        <li><Link to="/gpt2testpage">Talk to Llama</Link></li>

        {/* Auth Links */}
        {!isAuthenticated && <li><Link to="/signin">Sign In</Link></li>}
        {!isAuthenticated && <li><Link to="/signup">Sign Up</Link></li>}
        {isAuthenticated && (
          <li>
            <button className="SignOutButton" onClick={onSignOut}>
              Sign Out
            </button>
          </li>
        )}

        {/* Dark Mode Toggle */}
        <li>
          <button
            className="toggle-darkmode"
            onClick={() => setDarkMode(prev => !prev)}
            aria-label="Toggle dark mode"
          >
            {darkMode ? "☀️" : "🌙"}
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
