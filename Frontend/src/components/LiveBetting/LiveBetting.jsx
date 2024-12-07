import React, { useState, useEffect } from 'react';
import './LiveBetting.css'
const LiveBetting = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('Upcoming'); 
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('http://localhost:5000/events');
        console.log(response)
        if (response.ok) {
          const eventsData = await response.json();
          console.log(eventsData)
          setEvents(eventsData);
        } else {
          setError('Failed to fetch events');
        }
      } catch (err) {
        setError('An error occurred while fetching events.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const handleBet = async (eventId, userEmail, betAmount, team) => {
    try {
      const response = await fetch('http://localhost:5000/bet', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          eventId,
          userEmail,
          betAmount,
          team,
        }),
      });
      if (response.ok) {
        alert('Bet placed successfully!');
      } else {
        alert('Failed to place bet');
      }
    } catch (err) {
      console.error('Error placing bet:', err);
      alert('An error occurred while placing the bet');
    }
  };

  // Filter events based on the status
  const filterEvents = (status) => {
    return events.filter(event => event.status === status);
  };

  // Handle tab changes
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  if (loading) {
    return <p>Loading events...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  const renderUpcoming = (event) => (
    <div className="event-card" key={event.id}>
      <h3>{event.team1} vs {event.team2}</h3>
      <p>Status: {event.status}</p>
      <img src={event.photo_link} alt={event.title} width="200" />
      <div>
        <label>Bet on {event.team1}</label>
        <input type="checkbox" />
      </div>
      <div>
        <label>Bet Amount:</label>
        <input type="number" placeholder="Enter bet amount" />
      </div>
      <button onClick={() => handleBet(event.id, 'user@example.com', 100, event.team1)}>
        Place Bet on {event.team1}
      </button>
    </div>
  );

  const renderOngoing = (event) => (
    <div className="event-card" key={event.id}>
      <h3>{event.team1} vs {event.team2}</h3>
      <p>Status: {event.status}</p>
      <img src={event.photo_link} alt={event.title} width="200" />
      <p>Bet Amount: {event.betAmount}</p>
      <p>Bet on {event.betonTeam}</p>
    </div>
  );

  const renderCompleted = (event) => (
    <div className="event-card" key={event.id}>
      <h3>{event.team1} vs {event.team2}</h3>
      <p>Date: {event.date}</p>
      <p>Bet Amount: {event.betAmount}</p>
      <p>Winnings: {event.winnings}</p>
      <p>Bet on {event.betonTeam ? event.team1 : event.team2}</p>
    </div>
  );

  return (
    <div className="live-betting">
      {/* Navigation Tabs */}
      <nav className="navbar">
        <ul className="navbar-list">
          <li
            className={activeTab === 'upcoming' ? 'active' : ''}
            onClick={() => handleTabChange('upcoming')}
          >
            Upcoming
          </li>
          <li
            className={activeTab === 'ongoing' ? 'active' : ''}
            onClick={() => handleTabChange('ongoing')}
          >
            Ongoing
          </li>
          <li
            className={activeTab === 'completed' ? 'active' : ''}
            onClick={() => handleTabChange('completed')}
          >
            Completed
          </li>
        </ul>
      </nav>

      {/* Events List */}
      <div className="events-list">
        {activeTab === 'upcoming' && filterEvents('upcoming').map(renderUpcoming)}
        {activeTab === 'ongoing' && filterEvents('ongoing').map(renderOngoing)}
        {activeTab === 'completed' && filterEvents('completed').map(renderCompleted)}
      </div>
    </div>
  );
};

export default LiveBetting;
