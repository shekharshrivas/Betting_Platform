import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar/Sidebar';
import LiveBetting from './components/LiveBetting/LiveBetting';
import Leaderboard from './components/Leaderboard/Leaderboard';
import Messages from './components/Messages/Messages';
import AboutUs from './components/AboutUs/AboutUs';
import Coupon from './components/Coupon/Coupon';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';

const App = () => {
  return (
    <Router>
      <div className="app-container">
        <Sidebar />
        <div className="content">
          <Routes>
            {/* Routes for existing pages */}
            <Route path="/" element={<LiveBetting />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/about-us" element={<AboutUs />} />
            <Route path="/coupon" element={<Coupon />} />

            {/* Routes for authentication */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
