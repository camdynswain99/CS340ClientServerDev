import React from "react";

export default function Services() {
  return (
    <div style={{ padding: "2rem" }}>
      {/* Title */}
      <h1 style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>
        Our Services
      </h1>

      {/* Description */}
      <p style={{ fontSize: "1.2rem", marginBottom: "2rem" }}>
        Welcome to our application! Here you can explore the main services we provide 
        to make your experience smoother and more efficient.
      </p>

      {/* Services List */}
      <ul style={{ fontSize: "1.1rem", lineHeight: "1.8" }}>
        <li><strong>Note Management:</strong> Create, edit, and organize your notes easily.</li>
        <li><strong>User Authentication:</strong> Sign up and sign in securely with your credentials.</li>
        <li><strong>Folders System:</strong> Keep your notes well organized in folders.</li>
        <li><strong>Search Functionality:</strong> Quickly find notes using our search bar.</li>
      </ul>
    </div>
  );
}
