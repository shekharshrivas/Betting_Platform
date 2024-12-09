import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./components/HomePage";
import Navbar from "./components/Navbar";
import LoginPage from "./components/LoginPage";
import RegisterPage from "./components/RegisterPage";
import PostEventPage from "./components/PostEventPage"; // Import the PostEventPage
import ProfilePage from './components/ProfilePage';
const App = () => {
  return (
    <Router>
      <Navbar />
      <div style={{ padding: "20px" }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/post-event" element={<PostEventPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
