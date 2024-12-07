import React, { useEffect, useState } from 'react';

const Leaderboard = () => {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchLeaderboard = async () => {
    try {
      const response = await fetch('http://localhost:5000/leaderboard', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.ok) {
        const data = await response.json();
        setLeaderboardData(data);
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to fetch leaderboard data.');
      }
    } catch (error) {
      setError('An unexpected error occurred while fetching leaderboard data.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className="leaderboard">
      <h2>Leaderboard</h2>
      {leaderboardData.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Username</th>
              <th>Total Winnings</th>
            </tr>
          </thead>
          <tbody>
            {leaderboardData.map((user, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{user.username}</td>
                <td>{user.totalwinnings}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No leaderboard data available.</p>
      )}
    </div>
  );
};

export default Leaderboard;
