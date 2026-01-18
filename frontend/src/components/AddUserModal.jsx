import React, { useState } from "react";
import { usersAPI } from "../services/api";
import "../styles/Dashboard.css";
import "../styles/Auth.css";

export default function AddUserModal({ onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    password: "",
    role: "normal_user",
  });
  const [error, setError] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    validateField(name, value);
  };

  const validateField = (name, value) => {
    const newErrors = { ...errors };

    switch (name) {
      case "name":
        if (value.length > 0 && value.length < 20) {
          newErrors.name = `Name must be at least 20 characters (${value.length}/20)`;
        } else if (value.length > 60) {
          newErrors.name = "Name must not exceed 60 characters";
        } else {
          delete newErrors.name;
        }
        break;

      case "email":
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (value && !emailRegex.test(value)) {
          newErrors.email = "Invalid email format";
        } else {
          delete newErrors.email;
        }
        break;

      case "address":
        if (value.length > 400) {
          newErrors.address = "Address must not exceed 400 characters";
        } else {
          delete newErrors.address;
        }
        break;

      case "password":
        const passwordErrors = [];
        if (value.length > 0 && value.length < 8) passwordErrors.push("At least 8 characters");
        if (value.length > 16) passwordErrors.push("Max 16 characters");
        if (value && !/[A-Z]/.test(value)) passwordErrors.push("1 uppercase letter");
        if (value && !/[!@#$%^&*]/.test(value)) passwordErrors.push("1 special character");

        if (passwordErrors.length > 0) {
          newErrors.password = `Password needs: ${passwordErrors.join(", ")}`;
        } else {
          delete newErrors.password;
        }
        break;

      default:
        break;
    }

    setErrors(newErrors);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (Object.keys(errors).length > 0) {
      setError("Fix all validation errors");
      return;
    }

    if (formData.name.length < 20) {
      setError("Name must be at least 20 characters");
      return;
    }

    setLoading(true);
    try {
      await usersAPI.createUser(formData);
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to create user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-box">
        <h2>Add New User</h2>
        {error && <div className="error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <input
            name="name"
            placeholder="Full Name (20-60 characters)"
            value={formData.name}
            onChange={handleChange}
            required
          />
          {errors.name && <span className="field-error">{errors.name}</span>}
          
          <input
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          {errors.email && <span className="field-error">{errors.email}</span>}
          
          <input
            name="address"
            placeholder="Address (max 400 chars)"
            value={formData.address}
            onChange={handleChange}
          />
          {errors.address && <span className="field-error">{errors.address}</span>}
          
          <input
            type="password"
            name="password"
            placeholder="Password (8-16, 1 uppercase, 1 special)"
            value={formData.password}
            onChange={handleChange}
            required
          />
          {errors.password && <span className="field-error">{errors.password}</span>}
          <select name="role" value={formData.role} onChange={handleChange}>
            <option value="normal_user">Normal User</option>
            <option value="store_owner">Store Owner</option>
            <option value="admin">Admin</option>
          </select>

          <div className="modal-actions">
            <button type="submit" disabled={loading || Object.keys(errors).length > 0}>
              {loading ? "Creating..." : "Create"}
            </button>
            <button type="button" onClick={onClose} className="cancel-btn">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
