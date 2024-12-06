import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const user = await response.json();
        alert(`Login successful! Welcome, ${user.username}.`);
        navigate('/'); // Redirect to the home page
      } else {
        const error = await response.json();
        alert(`Login failed: ${error.error}`);
      }
    } catch (error) {
      alert('An error occurred while logging in. Please try again.');
      console.error(error);
    }
  };

  return (
    <div className="auth-form">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
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
        <button type="submit" className="submit-btn">Login</button>
      </form>
      <p>
        Don't have an account?{' '}
        <span onClick={() => navigate('/register')} className="link-text">
          Register here
        </span>
      </p>
    </div>
  );
};

export default Login;
