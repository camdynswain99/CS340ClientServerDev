import React from 'react';
import './App.css';
import { useState, useEffect } from 'react';

import HomePage from './components/HomePage/HomePage';
import Navbar from './components/Navbar';
import PrivateRoute from './SignInComponents/PrivateRouteLogin.jsx';

import { Routes, Route, useNavigate } from "react-router-dom";  // no BrowserRouter aquí

// Pages
import Contact from "./Contact.js";
import About from "./About.js";
import Services from "./Services.js";
import SignIn from "./SignInComponents/SignIn";
import SignUp from "./SignUpComponents/SignUp";
import HiddenNotesPage from "./components/YourNotesPage";


/**
 * Routes live here. Do NOT wrap with BrowserRouter (it's already in index.js).
 */
export default function AppWithRouter(props) {
  const navigate = useNavigate();

  // manage auth state here so it can be updated after SignIn
  const [userIsLoggedIn, setUserIsLoggedIn] = useState(false);

  // initial check on mount using cookie-based auth
  useEffect(() => {
    const base = process.env.REACT_APP_API_URL || '';
    fetch(`${base}/api/auth/me`, { credentials: 'include' })
      .then(res => {
        if (!res.ok) throw new Error('Not authenticated');
        return res.json();
      })
      .then(() => setUserIsLoggedIn(true))
      .catch(() => setUserIsLoggedIn(false));
  }, []);

  // sign out handler: call server to clear cookie then update UI
  const handleSignOut = async () => {
    try {
      const base = process.env.REACT_APP_API_URL || '';
      await fetch(`${base}/api/auth/logout`, { method: 'POST', credentials: 'include' });
    } catch (err) {
      console.error('Logout failed', err);
    } finally {
      setUserIsLoggedIn(false);
      navigate('/signin');
    }
  };

  return (
    <>
      {/* Navbar always visible; receives auth status */}
      <Navbar isAuthenticated={userIsLoggedIn} onSignOut={handleSignOut} />

    <Routes>
      {/* Home (existing UI) */}
      <Route path="/" element={<HomePage {...props} navigate={navigate} isAuthenticated={userIsLoggedIn} />} />

      {/* New pages */}
      <Route path="/contact" element={<Contact />} />
      <Route path="/services" element={<Services />} />
      <Route path="/about" element={<About />} />
      {/* pass setter so SignIn can notify AppWithRouter on success */}
      <Route path="/signin" element={<SignIn onAuthSuccess={() => setUserIsLoggedIn(true)} />} />
      <Route path="/signup" element={<SignUp />} />
      <Route
        path="/YourNotesPage"
        element={
          <PrivateRoute isAuthenticated={userIsLoggedIn}>
            {<HiddenNotesPage />}
          </PrivateRoute>
        }
      />
    </Routes>
   </>
  );
}
