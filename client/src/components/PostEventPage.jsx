import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/postEventPage.css"; // Add your custom CSS for this page

const PostEventPage = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [returnratio, setReturnratio] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handlePostEvent = async (e) => {
    e.preventDefault();

    // Check if fields are empty
    if (!title || !description || !returnratio) {
      setError("All fields are required.");
      return;
    }

    try {
      const token = localStorage.getItem("token"); // Get the token from localStorage
      const userId = localStorage.getItem("userId"); // Get the userId from localStorage

      // Ensure token and userId are present
      if (!token) {
        setError("You must be logged in to post an event.");
        return;
      }

      if (!userId) {
        setError("User ID is required.");
        return;
      }

      // Post request to create the event
      const response = await axios.post(
        "https://betting-platform-rpmp.onrender.com/api/events", // API endpoint to post the event
        {
          title,
          description,
          returnratio,
          userId, // Pass the userId in the body
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Send token in the header for authentication
          },
        }
      );

      // Handle successful response
      console.log(response.data); // Handle response (e.g., success message)
      setTitle("");
      setDescription("");
      setReturnratio("");
      navigate("/"); // Redirect to the homepage after success
    } catch (error) {
      setError("Failed to create event.");
      console.error(error);
    }
  };

  return (
    <div className="post-event-page">
      <h2>Create a New Event</h2>
      {error && <p className="error-message">{error}</p>}

      <form onSubmit={handlePostEvent}>
        <div className="form-group">
          <label>Event Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          ></textarea>
        </div>
        <div className="form-group">
          <label>Return</label>
          <input
            type="number"
            value={returnratio}
            onChange={(e) => setReturnratio(e.target.value)}
            required
          />
        </div>
        <button type="submit">Create Event</button>
      </form>
    </div>
  );
};

export default PostEventPage;
