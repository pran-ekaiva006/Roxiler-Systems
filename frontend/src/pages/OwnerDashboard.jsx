import React, { useEffect, useState } from "react";
import { ratingsAPI, storesAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function OwnerDashboard() {
  const { auth, logout } = useAuth();
  const [ratings, setRatings] = useState([]);
  const [average, setAverage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [storeId, setStoreId] = useState(null);

  useEffect(() => {
    fetchMyStore();
  }, []);

  const fetchMyStore = async () => {
    try {
      // assuming backend has route: /stores/owner
      const res = await storesAPI.getStoresForUser({ owner: true });
      const myStore = res.data.stores?.[0];
      if (myStore) {
        setStoreId(myStore.id);
        fetchRatings(myStore.id);
      }
    } catch (err) {
      console.error("Fetch owner store failed:", err.response?.data || err.message);
    }
  };

  const fetchRatings = async (id) => {
    setLoading(true);
    try {
      const res = await ratingsAPI.getStoreRatings(id);
      setRatings(res.data.ratings || []);
      setAverage(res.data.average || 0);
    } catch (err) {
      console.error("Fetch ratings failed:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="header">
        <h1>Store Owner Dashboard</h1>
        <button onClick={logout} className="logout-btn">Logout</button>
      </div>

      {!storeId ? (
        <p>No store assigned to you.</p>
      ) : (
        <>
          <h3>Average Rating: {average}</h3>

          {loading ? (
            <p>Loading ratings...</p>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>User</th>
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
                    <td colSpan="2">No ratings yet</td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </>
      )}
    </div>
  );
}
