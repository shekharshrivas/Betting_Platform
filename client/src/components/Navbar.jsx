import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/navbar.css"; // Import Navbar CSS

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    navigate("/login");
  };

  const isLoggedIn = Boolean(localStorage.getItem("token"));

  return (
    <nav className="navbar">
      <div className="nav-links">
        <Link to="/">Home</Link>
        {isLoggedIn && <Link to="/profile">Profile</Link>}
        {isLoggedIn && <Link to="/post-event">Post Event</Link>} {/* Added Post Event Link */}
      </div>
      <div className="nav-auth">
        {isLoggedIn ? (
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register" className="register-link">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
