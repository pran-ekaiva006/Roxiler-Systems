import React, { useEffect, useState } from "react";
import { storesAPI, usersAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";
import AddStoreModal from "../components/AddStoreModal";
import "../styles/Dashboard.css";

export default function AdminStores() {
  const [stores, setStores] = useState([]);
  const [owners, setOwners] = useState([]);
  const [filters, setFilters] = useState({ name: "", email: "", address: "" });
  const [loading, setLoading] = useState(false);
  const [showAddStore, setShowAddStore] = useState(false);
  const { logout } = useAuth();

  useEffect(() => {
    fetchStores();
    fetchOwners();
  }, []);

  const fetchStores = async (custom = filters) => {
    setLoading(true);
    try {
      const res = await storesAPI.getAllStores(custom);
      setStores(res.data.stores || []);
    } catch (err) {
      console.error("Fetch stores error:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchOwners = async () => {
    try {
      const res = await usersAPI.getAllUsers({ role: "store_owner" });
      setOwners(res.data.users || []);
    } catch (err) {
      console.error("Fetch owners error:", err);
    }
  };

  const handleFilterChange = (e) => {
    const newFilters = { ...filters, [e.target.name]: e.target.value };
    setFilters(newFilters);
    fetchStores(newFilters);
  };

  return (
    <div className="container">
      <div className="header">
        <h1>Admin – Stores</h1>
        <div>
          <button onClick={() => setShowAddStore(true)}>Add Store</button>
          <button onClick={logout} className="logout-btn">Logout</button>
        </div>
      </div>

      <div className="filter-bar">
        <input name="name" placeholder="Name" onChange={handleFilterChange} />
        <input name="email" placeholder="Email" onChange={handleFilterChange} />
        <input name="address" placeholder="Address" onChange={handleFilterChange} />
      </div>

      {loading ? (
        <p>Loading stores...</p>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Address</th>
              <th>Owner</th>
            </tr>
          </thead>
          <tbody>
            {stores.map((s) => (
              <tr key={s.id}>
                <td>{s.name}</td>
                <td>{s.email}</td>
                <td>{s.address}</td>
                <td>{s.owner_name || "-"}</td>
              </tr>
            ))}
            {stores.length === 0 && (
              <tr>
                <td colSpan="4" align="center">No stores found</td>
              </tr>
            )}
          </tbody>
        </table>
      )}

      {showAddStore && (
        <AddStoreModal
          owners={owners}
          onClose={() => setShowAddStore(false)}
          onSuccess={() => {
            setShowAddStore(false);
            fetchStores();
          }}
        />
      )}
    </div>
  );
}
