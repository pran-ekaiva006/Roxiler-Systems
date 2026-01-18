import React, { useState, useEffect } from "react";
import { usersAPI } from "../services/api";
import "../styles/Modal.css";

export default function UserDetailModal({ userId, onClose }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchUserDetails();
  }, [userId]);

  const fetchUserDetails = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await usersAPI.getUserById(userId);
      setUser(res.data.user);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to fetch user details");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="modal-backdrop">
        <div className="modal-box">
          <p>Loading user details...</p>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="modal-backdrop">
        <div className="modal-box">
          <h2>User Details</h2>
          <div className="error">{error || "User not found"}</div>
          <button onClick={onClose}>Close</button>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-backdrop">
      <div className="modal-box">
        <h2>User Details</h2>
        
        <div className="user-details">
          <div className="detail-row">
            <strong>Name:</strong>
            <span>{user.name}</span>
          </div>
          <div className="detail-row">
            <strong>Email:</strong>
            <span>{user.email}</span>
          </div>
          <div className="detail-row">
            <strong>Address:</strong>
            <span>{user.address || "-"}</span>
          </div>
          <div className="detail-row">
            <strong>Role:</strong>
            <span>{user.role}</span>
          </div>
          {user.role === "store_owner" && user.average_rating !== null && (
            <div className="detail-row">
              <strong>Store Rating:</strong>
              <span>{user.average_rating} ⭐</span>
            </div>
          )}
          <div className="detail-row">
            <strong>Created At:</strong>
            <span>{new Date(user.created_at).toLocaleString()}</span>
          </div>
        </div>

        <div className="modal-actions">
          <button onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}
