import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Register.css';

const Register = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      });

      if (response.ok) {
        const user = await response.json();
        alert(`Registration successful! Welcome, ${user.username}.`);
        navigate('/login'); // Redirect to the login page
      } else {
        const error = await response.json();
        alert(`Registration failed: ${error.message}`);
      }
    } catch (error) {
      alert('An error occurred while registering. Please try again.');
      console.error(error);
    }
  };

  return (
    <div className="auth-form">
      <h2>Register</h2>
      <form onSubmit={handleRegister}>
        <label>Username</label>
        <input
          type="text"
          placeholder="Enter your username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <label>Email</label>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <label>Password</label>
        <input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" className="submit-btn">Register</button>
      </form>
      <p>
        Already have an account?{' '}
        <span onClick={() => navigate('/login')} className="link-text">
          Login here
        </span>
      </p>
    </div>
  );
};

export default Register;
