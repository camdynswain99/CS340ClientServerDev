import React, { useState } from "react";

export default function Contact() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    question: ""
  });

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    alert("Thank you! Your question has been submitted.");
    // Later: here you can connect it to your backend API
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Contact Us</h2>
      <form onSubmit={handleSubmit} style={{ maxWidth: "500px" }}>
        
        {/* First Name */}
        <div style={{ marginBottom: "1rem" }}>
          <label>First Name:</label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: "0.5rem" }}
          />
        </div>

        {/* Last Name */}
        <div style={{ marginBottom: "1rem" }}>
          <label>Last Name:</label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: "0.5rem" }}
          />
        </div>

        {/* Email */}
        <div style={{ marginBottom: "1rem" }}>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: "0.5rem" }}
          />
        </div>

        {/* Phone */}
        <div style={{ marginBottom: "1rem" }}>
          <label>Phone Number:</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            style={{ width: "100%", padding: "0.5rem" }}
          />
        </div>

        {/* Question */}
        <div style={{ marginBottom: "1rem" }}>
          <label>Your Question:</label>
          <textarea
            name="question"
            value={formData.question}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: "0.5rem", minHeight: "100px" }}
          />
        </div>

        {/* Submit */}
        <button type="submit" style={{ padding: "0.7rem 1.5rem" }}>
          Submit
        </button>
      </form>
    </div>
  );
}
