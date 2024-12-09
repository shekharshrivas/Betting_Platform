import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/homePage.css"; // Import HomePage CSS

const HomePage = () => {
  const [events, setEvents] = useState([]); // Initialize events as an empty array
  const [betAmounts, setBetAmounts] = useState({}); // Object to store bet amounts for each event
  const [error, setError] = useState(""); // State for errors
  const [successMessage, setSuccessMessage] = useState(""); // State for success messages
  const [loading, setLoading] = useState(false); // Loading state for fetching events
  const isLoggedIn = Boolean(localStorage.getItem("token"));
  const userId = localStorage.getItem("userId"); // Assuming userId is in localStorage

  // Fetch events from the API
  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true); // Start loading
      try {
        const response = await axios.get("http://localhost:5000/api/events");
        setEvents(response.data);
        console.log(events) 
      } catch (error) {
        setError("Failed to load events. Please try again later.");
      } finally {
        setLoading(false); // Stop loading
      }
    };
    fetchEvents();
  }, []);

  const handleBetSubmit = async (eventId) => {
    const betAmount = parseFloat(betAmounts[eventId]); // Ensure it's a number

    if (isNaN(betAmount) || betAmount <= 0) {
      setError("Please enter a valid bet amount.");
      return;
    }

    if (!userId) {
      setError("User not logged in.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/bets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventId, userId, betAmount }), // Ensure `betAmount` is properly serialized
      });

      const data = await response.json();
      if (response.ok) {
        setSuccessMessage("Bet placed successfully!");
        setError("");
        setBetAmounts((prev) => ({ ...prev, [eventId]: "" }));
      } else {
        setError(data.message || "Failed to place bet. Please try again.");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    }
  };

  // Handle bet amount change for a specific event
  const handleBetAmountChange = (eventId, value) => {
    if (isNaN(value) || value < 0) {
      setError("Please enter a valid positive number.");
      return;
    }
    setError(""); // Clear any previous error on valid input
    setBetAmounts((prev) => ({
      ...prev,
      [eventId]: value, // Update bet amount for the specific event
    }));
  };

  // Clear success message after 5 seconds
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(""), 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  return (
    <div className="home-page">
      <div className="welcome-container">
        <h1>Welcome to the Betting System</h1>
        <p className="platform-charges-info">
          10% of winnings will be platform charges.
        </p>

        {isLoggedIn ? (
          <p>Explore events and place your bets!</p>
        ) : (
          <p>Login or register to get started.</p>
        )}

        {error && <p className="error-message">{error}</p>}
        {successMessage && <p className="success-message">{successMessage}</p>}
      </div>

      <div className="events-container">
        {loading ? (
          <p>Loading events...</p>
        ) : events.length === 0 ? (
          <p>No events available at the moment.</p>
        ) : (
          events.map((event) => (
            <div key={event.eventId} className="event-card">
              <h3>Match: {event.title}</h3>
              <p>{event.description}</p>
              <p>Return {event.returnratio}x</p>
              <p className="event-owner">Owner: {event.owner}</p>

              {isLoggedIn && (
                <>
                  <input
                    type="number"
                    value={betAmounts[event.eventId] || ""}
                    onChange={(e) =>
                      handleBetAmountChange(event.eventId, e.target.value)
                    }
                    placeholder="Enter bet amount"
                  />
                  <button
                    onClick={() => handleBetSubmit(event.eventId)}
                    disabled={!betAmounts[event.eventId]} // Corrected from event._id to event.eventId
                  >
                    Place Bet
                  </button>
                </>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default HomePage;
