import React from "react";
import "./Theme.css";               // Theme global (está en src/)
import "./components/StaticPages.css"; // CSS de páginas estáticas (está en src/components/)

function About() {
  return (
    <div className="page-wrapper">
      <div className="page-card">
        <h1 className="page-title">About Our Note App</h1>

        <p className="page-text">
          Our Note App was created to help students and professionals organize their thoughts,
          share ideas, and collaborate efficiently. It’s a simple yet powerful tool that makes
          note-taking seamless, accessible, and intuitive.
        </p>

        <h2 className="page-subtitle">Our Mission</h2>
        <p className="page-text">
          We aim to make knowledge sharing easier through an online platform where users can
          create, edit, and store notes in one secure place. Whether you’re working on a project,
          studying for exams, or brainstorming ideas, our app helps you stay organized and connected.
        </p>

        <h2 className="page-subtitle">Our Team</h2>
        <p className="page-text">
          This project was developed by a group of students of the University Southern New Hampshire
          as part of their coursework in CS 340 - Client/Server Development.
        </p>
      </div>
    </div>
  );
}

export default About;
