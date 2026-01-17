import React, { useState, useEffect } from "react";
import { storesAPI, ratingsAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";
import "../styles/StoresList.css";

export default function StoresList() {
  const [stores, setStores] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [ratingForm, setRatingForm] = useState({});
  const { logout } = useAuth();

  useEffect(() => {
    fetchStores();
  }, []);

  const fetchStores = async (searchTerm = "") => {
    setLoading(true);
    try {
      const response = await storesAPI.getStoresForUser({ search: searchTerm });
      setStores(response.data.stores);
    } catch (err) {
      console.error("Error fetching stores:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearch(value);
    fetchStores(value);
  };

  const handleRatingChange = (storeId, value) => {
    setRatingForm({ ...ratingForm, [storeId]: value });
  };

  const submitRating = async (storeId) => {
    try {
      await ratingsAPI.submitRating({
        store_id: storeId,
        rating: parseInt(ratingForm[storeId]),
      });
      fetchStores(search);
      setRatingForm({ ...ratingForm, [storeId]: "" });
    } catch (err) {
      console.error("Error submitting rating:", err);
    }
  };

  return (
    <div className="container">
      <div className="header">
        <h1>Available Stores</h1>
        <button onClick={logout} className="logout-btn">Logout</button>
      </div>
      <input
        type="text"
        placeholder="Search by name or address"
        value={search}
        onChange={handleSearch}
        className="search-input"
      />

      {loading ? (
        <p>Loading stores...</p>
      ) : (
        <div className="stores-grid">
          {stores.map((store) => (
            <div key={store.id} className="store-card">
              <h3>{store.name}</h3>
              <p>📍 {store.address}</p>
              <p>Email: {store.email}</p>
              <div className="rating-section">
                <p>⭐ Rating: {store.average_rating || "No ratings yet"}</p>
                <p>Your Rating: {store.user_rating || "Not rated"}</p>
                <div className="rating-input">
                  <select
                    value={ratingForm[store.id] || ""}
                    onChange={(e) => handleRatingChange(store.id, e.target.value)}
                  >
                    <option value="">Select rating</option>
                    <option value="1">1 - Poor</option>
                    <option value="2">2 - Fair</option>
                    <option value="3">3 - Good</option>
                    <option value="4">4 - Very Good</option>
                    <option value="5">5 - Excellent</option>
                  </select>
                  <button onClick={() => submitRating(store.id)}>Submit Rating</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
