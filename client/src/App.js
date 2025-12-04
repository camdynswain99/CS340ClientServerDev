import React, { useState, useEffect } from "react";
import "./App.css";
import "./Theme.css"; // ✅ Importamos el tema global aquí también

import { Routes, Route, useNavigate } from "react-router-dom"; // no BrowserRouter aquí

// Components
import Navbar from "./components/Layout/Navbar.js";
import HomePage from "./pages/HomePage.js";
import PrivateRoute from "./SignInComponents/PrivateRouteLogin.jsx";

// Pages
import Contact from "./Contact.js";
import About from "./About.js";
import Services from "./Services.js";
import SignIn from "./SignInComponents/SignIn";
import SignUp from "./SignUpComponents/SignUp";
import HiddenNotesPage from "./components/YourNotesPage";
import GPT2TestPage from "./components/GPT-2TestPage.jsx";

/**
 * Main application with routing.
 * NOTE: BrowserRouter is already in index.js
 */
export default function AppWithRouter(props) {
  const navigate = useNavigate();

  // 🔐 Estado de autenticación
  const [userIsLoggedIn, setUserIsLoggedIn] = useState(false);

  // 🎨 Tema oscuro (por si queremos sincronizar en más lugares en el futuro)
  const [darkMode, setDarkMode] = useState(false);

  // ✅ Cargar modo oscuro guardado en localStorage al iniciar
  useEffect(() => {
    const savedMode = localStorage.getItem("theme") === "dark";
    setDarkMode(savedMode);
    document.body.classList.toggle("dark-mode", savedMode);
  }, []);

  // 💾 Guardar preferencia cuando cambia
  useEffect(() => {
    document.body.classList.toggle("dark-mode", darkMode);
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  // 🧠 Verificar autenticación al cargar
  useEffect(() => {
    const base = process.env.REACT_APP_API_URL || "";
    fetch(`${base}/api/auth/me`, { credentials: "include" })
      .then((res) => {
        if (!res.ok) throw new Error("Not authenticated");
        return res.json();
      })
      .then(() => setUserIsLoggedIn(true))
      .catch(() => setUserIsLoggedIn(false));
  }, []);

  // 🚪 Cerrar sesión
  const handleSignOut = async () => {
    try {
      const base = process.env.REACT_APP_API_URL || "";
      await fetch(`${base}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (err) {
      console.error("Logout failed", err);
    } finally {
      setUserIsLoggedIn(false);
      navigate("/signin");
    }
  };

  return (
    <>
      {/* Navbar siempre visible; recibe auth y control de tema */}
      <Navbar
        isAuthenticated={userIsLoggedIn}
        onSignOut={handleSignOut}
      />

      {/* Rutas de la aplicación */}
      <Routes>
        <Route
          path="/"
          element={
            <PrivateRoute isAuthenticated={userIsLoggedIn}>
              <HomePage
                {...props}
                navigate={navigate}
                isAuthenticated={userIsLoggedIn}
              />
            </PrivateRoute>
          }
        />

        <Route
          path="/contact"
          element={
            <PrivateRoute isAuthenticated={userIsLoggedIn}>
              <Contact />
            </PrivateRoute>
          }
        />
        <Route
          path="/services"
          element={
            <PrivateRoute isAuthenticated={userIsLoggedIn}>
              <Services />
            </PrivateRoute>
          }
        />
        <Route
          path="/about"
          element={
            <PrivateRoute isAuthenticated={userIsLoggedIn}>
              <About />
            </PrivateRoute>
          }
        />
        <Route
          path="/gpt2testpage"
          element={
            <PrivateRoute isAuthenticated={userIsLoggedIn}>
              <GPT2TestPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/signin"
          element={<SignIn onAuthSuccess={() => setUserIsLoggedIn(true)} />}
        />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
    </>
  );
}
