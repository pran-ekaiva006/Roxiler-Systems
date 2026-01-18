import React, { useEffect, useState } from "react";
import { usersAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";
import AddUserModal from "../components/AddUserModal";
import "../styles/Dashboard.css";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [filters, setFilters] = useState({
    name: "",
    email: "",
    address: "",
    role: "",
  });
  const [loading, setLoading] = useState(false);
  const [showAddUser, setShowAddUser] = useState(false);
  const { logout } = useAuth();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async (customFilters = filters) => {
    setLoading(true);
    try {
      const res = await usersAPI.getAllUsers(customFilters);
      setUsers(res.data.users || []);
    } catch (err) {
      console.error("Fetch users error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const newFilters = { ...filters, [e.target.name]: e.target.value };
    setFilters(newFilters);
    fetchUsers(newFilters);
  };

  return (
    <div className="container">
      <div className="header">
        <h1>Admin – Users</h1>
        <div>
          <button onClick={() => setShowAddUser(true)}>Add User</button>
          <button onClick={logout} className="logout-btn">Logout</button>
        </div>
      </div>

      {/* Filters */}
      <div className="filter-bar">
        <input name="name" placeholder="Filter by Name" onChange={handleChange} />
        <input name="email" placeholder="Filter by Email" onChange={handleChange} />
        <input name="address" placeholder="Filter by Address" onChange={handleChange} />
        <select name="role" onChange={handleChange}>
          <option value="">All Roles</option>
          <option value="admin">Admin</option>
          <option value="normal_user">Normal User</option>
          <option value="store_owner">Store Owner</option>
        </select>
      </div>

      {loading ? (
        <p>Loading users...</p>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Address</th>
              <th>Role</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>{u.address}</td>
                <td>{u.role}</td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan="4">No users found</td>
              </tr>
            )}
          </tbody>
        </table>
      )}

      {showAddUser && (
        <AddUserModal
          onClose={() => setShowAddUser(false)}
          onSuccess={() => {
            setShowAddUser(false);
            fetchUsers();
          }}
        />
      )}
    </div>
  );
}
