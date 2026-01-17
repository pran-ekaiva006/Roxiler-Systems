import React, { useState, useEffect } from "react";
import { usersAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";
import "../styles/Dashboard.css";

export default function AdminDashboard() {
  const [stats, setStats] = useState({ total_users: 0, total_stores: 0, total_ratings: 0 });
  const [loading, setLoading] = useState(false);
  const { logout } = useAuth();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const response = await usersAPI.getDashboardStats();
      setStats(response.data);
    } catch (err) {
      console.error("Error fetching stats:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="header">
        <h1>Admin Dashboard</h1>
        <button onClick={logout} className="logout-btn">Logout</button>
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="stats-grid">
          <div className="stat-card">
            <h3>Total Users</h3>
            <p className="stat-number">{stats.total_users}</p>
          </div>
          <div className="stat-card">
            <h3>Total Stores</h3>
            <p className="stat-number">{stats.total_stores}</p>
          </div>
          <div className="stat-card">
            <h3>Total Ratings</h3>
            <p className="stat-number">{stats.total_ratings}</p>
          </div>
        </div>
      )}
    </div>
  );
}
