import React, { useState } from 'react';
import styles from './SignUp.module.css';
import { useNavigate } from 'react-router-dom';

function SignUp() {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
    });

    // Handle input changes
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    // Handle form submission
        const handleSubmit = async (e) => {
            e.preventDefault();

            try {
                const res = await fetch('/api/auth/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData),
                });

                const data = await res.json();

                if (res.ok) {
                    console.log('✅ Registration successful:', data);
                    alert('Sign Up successful!');
                } else {
                    console.error('❌ Registration failed:', data.message);
                    alert('Error: ' + data.message);
                }
            } catch (error) {
                console.error('❌ Error:', error);
                alert('An error occurred. Please try again.');
            }
        };

    return (
        <div children={"parentdiv"}>
            <div className={styles.signupContainer}>
                <h2 className={styles.title}>Sign Up</h2>
                    <form onSubmit={handleSubmit}>
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            placeholder="Username"
                            required
                            className={styles.input}
                        />
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Email Address"
                            required
                            className={styles.input}
                        />
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Password"
                            required
                            className={styles.input}
                        />
                        <button type="submit" className={styles.button}>
                            Sign Up
                        </button>
                    </form>

            </div>
        </div>
    );
}

export default SignUp;
