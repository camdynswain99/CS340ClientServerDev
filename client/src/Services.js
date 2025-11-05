import React from "react";
import "./Theme.css";               // Theme global (src/)
import "./components/StaticPages.css"; // CSS compartido (src/components/)

function Services() {
  return (
    <div className="page-wrapper">
      <div className="page-card">
        <h1 className="page-title">Our Services</h1>

        <p className="page-text">
          Welcome to our application! Here you can explore the main services we provide
          to make your experience smoother and more efficient.
        </p>

        <ul className="page-list">
          <li>
            <strong>Note Management:</strong> Create, edit, and organize your notes easily.
          </li>
          <li>
            <strong>User Authentication:</strong> Sign up and sign in securely with your credentials.
          </li>
          <li>
            <strong>Folders System:</strong> Keep your notes well organized in folders.
          </li>
          <li>
            <strong>Search Functionality:</strong> Quickly find notes using our search bar.
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Services;
