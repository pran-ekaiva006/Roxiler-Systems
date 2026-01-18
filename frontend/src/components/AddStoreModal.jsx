import React, { useState } from "react";
import { storesAPI } from "../services/api";
import "../styles/Modal.css";

export default function AddStoreModal({ owners, onClose, onSuccess }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    address: "",
    ownerId: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await storesAPI.createStore({
        name: form.name,
        email: form.email,
        address: form.address,
        owner_id: form.ownerId || null,
      });
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to create store");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-box">
        <h2>Add New Store</h2>
        {error && <div className="error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <input
            name="name"
            placeholder="Store Name"
            value={form.name}
            onChange={handleChange}
            required
          />
          <input
            name="email"
            placeholder="Store Email"
            value={form.email}
            onChange={handleChange}
            required
          />
          <input
            name="address"
            placeholder="Store Address"
            value={form.address}
            onChange={handleChange}
            required
          />

          <select name="ownerId" value={form.ownerId} onChange={handleChange}>
            <option value="">Assign Owner (optional)</option>
            {owners.map((o) => (
              <option key={o.id} value={o.id}>
                {o.name} ({o.email})
              </option>
            ))}
          </select>

          <div className="modal-actions">
            <button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Store"}
            </button>
            <button type="button" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
