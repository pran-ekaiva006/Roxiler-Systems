import React, { useEffect, useState } from "react";
import { ratingsAPI, storesAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";
import UpdatePasswordModal from "../components/UpdatePasswordModal";
import "../styles/Dashboard.css";

export default function OwnerDashboard() {
  const { user, logout } = useAuth();
  const [store, setStore] = useState(null);
  const [ratings, setRatings] = useState([]);
  const [average, setAverage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  useEffect(() => {
    fetchMyStore();
  }, []);

  const fetchMyStore = async () => {
    try {
      const res = await storesAPI.getStoresForUser({ owner: true });
      const myStore = res.data.stores?.[0];
      if (myStore) {
        setStore(myStore);
        fetchRatings(myStore.id);
      }
    } catch (err) {
      console.error("Owner store fetch error:", err.response?.data || err.message);
    }
  };

  const fetchRatings = async (storeId) => {
    setLoading(true);
    try {
      const res = await ratingsAPI.getStoreRatings(storeId);
      setRatings(res.data.ratings || []);
      setAverage(res.data.average_rating || 0);
    } catch (err) {
      console.error("Ratings fetch error:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="header">
        <h1>Store Owner Dashboard</h1>
        <div>
          <button onClick={() => setShowPasswordModal(true)}>Update Password</button>
          <button onClick={logout} className="logout-btn">Logout</button>
        </div>
      </div>

      {showPasswordModal && (
        <UpdatePasswordModal
          onClose={() => setShowPasswordModal(false)}
          onSuccess={() => {
            setShowPasswordModal(false);
            alert("Password updated successfully!");
          }}
        />
      )}

      {!store ? (
        <p>No store assigned to you.</p>
      ) : (
        <>
          <h2>{store.name}</h2>
          <p>📍 {store.address}</p>
          <p>⭐ Average Rating: {average}</p>

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
                    <td>{r.name || r.user_name}</td>
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
