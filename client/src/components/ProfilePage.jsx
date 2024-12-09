import React, { useEffect, useState } from "react";
import "../styles/ProfilePage.css";

const ProfilePage = () => {
  const [userInfo, setUserInfo] = useState({});
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [betHistory, setBetHistory] = useState([]);

  const userId = localStorage.getItem("userId"); // Get user ID from local storage

  // Fetch user information
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/user?userId=${userId}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) throw new Error("Failed to fetch user info.");
        const data = await response.json();
        setUserInfo(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchUserInfo();
  }, [userId]);

  // Fetch bet history
  useEffect(() => {
    const fetchBetHistory = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/bets/history?userId=${userId}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) throw new Error("Failed to fetch bet history.");
        const data = await response.json();
        setBetHistory(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchBetHistory();
  }, [userId]);

  // Handle adding balance
  const handleAddBalance = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/user/addbalance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: parseFloat(amount), userId }),
      });

      if (!response.ok) throw new Error("Failed to add balance.");
      const data = await response.json();
      setUserInfo((prev) => ({ ...prev, balance: data.balance }));
      setSuccess(data.message);
      setAmount("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-page">
      <div className="sidebar">
        <h1>Profile</h1>
        {error && <p className="error">{error}</p>}
        {success && <p className="success">{success}</p>}

        <div className="user-details">
          <p><strong>Username:</strong> {userInfo.username}</p>
          <p><strong>Email:</strong> {userInfo.email}</p>
          <p><strong>Balance:</strong> Rs{userInfo.balance}</p>
          <p><strong>Total Winnings:</strong> Rs{userInfo.totalwinnings}</p>
        </div>

        <form className="add-balance-form" onSubmit={handleAddBalance}>
          <h2>Add Balance</h2>
          <input
            type="number"
            placeholder="Enter amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <button type="submit" disabled={loading}>
            {loading ? "Adding..." : "Add Balance"}
          </button>
        </form>
      </div>

      {/* Bet History Section */}
      <div className="bet-history">
        <h2>Bet History</h2>
        <h3>10% of your winnings will be platform charges.</h3>
        {betHistory.length === 0 ? (
          <p>No bet history found.</p>
        ) : (
          <table className="bet-table">
            <thead>
              <tr>
                <th>Event Title</th>
                <th>Description</th>
                <th>Return Ratio</th>
                <th>Bet Amount</th>
                <th>Status</th>
                <th>Winning Amount</th>
              </tr>
            </thead>
            <tbody>
              {betHistory.map((bet, index) => (
                <tr key={index}>
                  <td>{bet.eventId.title}</td>
                  <td>{bet.eventId.description}</td>
                  <td>{bet.eventId.returnratio}x</td>
                  <td>Rs{bet.betamount}</td>
                  <td>{bet.betstatus}</td>
                  <td>Rs{bet.returnamount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
