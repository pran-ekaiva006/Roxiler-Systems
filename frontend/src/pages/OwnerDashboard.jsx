import React, { useEffect, useState } from "react";
import { ratingsAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function OwnerDashboard() {
  const { auth, logout } = useAuth();
  const [ratings, setRatings] = useState([]);
  const [average, setAverage] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchRatings();
  }, []);

  const fetchRatings = async () => {
    setLoading(true);
    try {
      const res = await ratingsAPI.getStoreRatings(auth.user.id);
      setRatings(res.data.ratings || []);
      setAverage(res.data.average || 0);
    } catch (err) {
      console.error("Owner ratings error:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h2>Store Owner Dashboard</h2>
        <button onClick={logout}>Logout</button>
      </div>

      <p>Average Rating: {average}</p>

      {loading ? (
        <p>Loading ratings...</p>
      ) : (
        <table border="1" cellPadding="8" width="100%">
          <thead>
            <tr>
              <th>User Name</th>
              <th>Rating</th>
            </tr>
          </thead>
          <tbody>
            {ratings.map((r) => (
              <tr key={r.id}>
                <td>{r.user_name}</td>
                <td>{r.rating}</td>
              </tr>
            ))}
            {ratings.length === 0 && (
              <tr>
                <td colSpan="2" align="center">
                  No ratings yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}
