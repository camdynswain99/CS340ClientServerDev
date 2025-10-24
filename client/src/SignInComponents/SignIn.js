import React, { useState } from 'react';
import styles from '../SignUpComponents/SignUp.module.css';

import { useNavigate } from 'react-router-dom';

function SignIn({ onAuthSuccess }) {
    const [formData, setFormData] = useState({ identifier: '', password: '' });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
                const { identifier, password } = formData;
                const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ identifier, password }),
                });
                const data = await res.json(); // server returns user info
                if (res.ok) {
                    onAuthSuccess && onAuthSuccess(); // update app auth state
                    navigate('/');
                } else {
                    alert('Error: ' + (data.message || 'Login failed'));
                }
        } catch (err) {
            console.error('Sign in error', err);
            alert('An error occurred');
        }
    };

// clear client auth state (e.g., set isAuthenticated false)

    return (
        <div className={"parentdiv"}>
            <div className={styles.signupContainer}>
                <h2 className={styles.title}>Sign In</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        name="identifier"
                        value={formData.identifier}
                        onChange={handleChange}
                        placeholder="Username or Email"
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
                    <button type="submit" className={styles.button}>Sign In</button>
                </form>
            </div>
        </div>
    );
}

export default SignIn;