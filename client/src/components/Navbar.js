import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";
import "../Theme.css"; // ✅ correcto

const Navbar = ({ isAuthenticated, onSignOut }) => {
  const [darkMode, setDarkMode] = useState(false);

  // Cargar el modo guardado
  useEffect(() => {
    const savedMode = localStorage.getItem("theme");
    const isDark = savedMode === "dark";
    setDarkMode(isDark);
    document.body.classList.toggle("dark-mode", isDark);
  }, []);

  // Aplicar y guardar el modo cada vez que cambia
  useEffect(() => {
    document.body.classList.toggle("dark-mode", darkMode);
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/">Notes</Link>
      </div>

      <ul className="navbar-menu">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/about">About</Link></li>
        <li><Link to="/services">Services</Link></li>
        <li><Link to="/gpt2testpage">GPT2 Test</Link></li>

        {!isAuthenticated && <li><Link to="/signin">Sign In</Link></li>}
        {!isAuthenticated && <li><Link to="/signup">Sign Up</Link></li>}
        {isAuthenticated && <li><Link to="/YourNotesPage">Dashboard</Link></li>}
        {isAuthenticated && (
          <li>
            <button className="SignOutButton" onClick={onSignOut}>
              Sign Out
            </button>
          </li>
        )}

        {/* 🌙 Toggle modo oscuro clásico */}
        <li>
          <button
            className="toggle-darkmode"
            onClick={() => setDarkMode((prev) => !prev)}
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
