import React from "react";

const About = () => {
  return (
    <div className="about-container" style={{ padding: "40px", textAlign: "center" }}>
      <h1>About Our Note App</h1>
      <p style={{ maxWidth: "800px", margin: "20px auto", lineHeight: "1.6" }}>
        Our Note App was created to help students and professionals organize their thoughts, 
        share ideas, and collaborate efficiently. It’s a simple yet powerful tool 
        that makes note-taking seamless, accessible, and intuitive.
      </p>

      <h2>Our Mission</h2>
      <p style={{ maxWidth: "800px", margin: "10px auto", lineHeight: "1.6" }}>
        We aim to make knowledge sharing easier through an online platform where users can 
        create, edit, and store notes in one secure place. Whether you’re working on a project, 
        studying for exams, or brainstorming ideas, our app helps you stay organized and connected.
      </p>

      <h2>Our Team</h2>
      <p style={{ maxWidth: "800px", margin: "10px auto", lineHeight: "1.6" }}>
        This project was developed by a group of students of the University Southern New Hampshire 
        as part of their coursework in CS 340 - Client/Server Development. 
      </p>
    </div>
  );
};

export default About;
