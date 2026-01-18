import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { usersAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";
import AddUserModal from "../components/AddUserModal";
import "../styles/Dashboard.css";

export default function AdminDashboard() {
  const [stats, setStats] = useState({ total_users: 0, total_stores: 0, total_ratings: 0 });
  const [loading, setLoading] = useState(false);
  const [showAddUser, setShowAddUser] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

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
        <div>
          <button onClick={() => setShowAddUser(true)}>Add User</button>
          <button onClick={logout} className="logout-btn">Logout</button>
        </div>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <div className="stats-grid">
            <div className="stat-card" onClick={() => navigate("/admin/users")} style={{ cursor: "pointer" }}>
              <h3>Total Users</h3>
              <p className="stat-number">{stats.total_users}</p>
              <p style={{ marginTop: "10px", fontSize: "14px", color: "#667eea" }}>View Users →</p>
            </div>
            <div className="stat-card" onClick={() => navigate("/admin/stores")} style={{ cursor: "pointer" }}>
              <h3>Total Stores</h3>
              <p className="stat-number">{stats.total_stores}</p>
              <p style={{ marginTop: "10px", fontSize: "14px", color: "#667eea" }}>View Stores →</p>
            </div>
            <div className="stat-card">
              <h3>Total Ratings</h3>
              <p className="stat-number">{stats.total_ratings}</p>
            </div>
          </div>
          <div style={{ marginTop: "30px", display: "flex", gap: "10px" }}>
            <button onClick={() => navigate("/admin/users")}>Manage Users</button>
            <button onClick={() => navigate("/admin/stores")}>Manage Stores</button>
          </div>
        </>
      )}

      {showAddUser && (
        <AddUserModal
          onClose={() => setShowAddUser(false)}
          onSuccess={() => {
            setShowAddUser(false);
            fetchStats();
          }}
        />
      )}
    </div>
  );
}
