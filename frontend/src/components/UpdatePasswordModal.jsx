import React, { useState } from "react";
import { authAPI } from "../services/api";
import "../styles/Modal.css";

export default function UpdatePasswordModal({ onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
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
      case "newPassword":
        const passwordErrors = [];
        if (value.length < 8) passwordErrors.push("At least 8 characters");
        if (value.length > 16) passwordErrors.push("Max 16 characters");
        if (!/[A-Z]/.test(value)) passwordErrors.push("1 uppercase letter");
        if (!/[!@#$%^&*]/.test(value)) passwordErrors.push("1 special character");

        if (passwordErrors.length > 0) {
          newErrors.newPassword = `Password needs: ${passwordErrors.join(", ")}`;
        } else {
          delete newErrors.newPassword;
        }
        break;

      case "confirmPassword":
        if (value !== formData.newPassword) {
          newErrors.confirmPassword = "Passwords do not match";
        } else {
          delete newErrors.confirmPassword;
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

    if (formData.newPassword !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      await authAPI.updatePassword({
        oldPassword: formData.oldPassword,
        newPassword: formData.newPassword,
      });
      onSuccess?.();
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to update password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-box">
        <h2>Update Password</h2>
        {error && <div className="error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <input
            type="password"
            name="oldPassword"
            placeholder="Old Password"
            value={formData.oldPassword}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="newPassword"
            placeholder="New Password (8–16, 1 uppercase, 1 special)"
            value={formData.newPassword}
            onChange={handleChange}
            required
          />
          {errors.newPassword && <span className="field-error">{errors.newPassword}</span>}

          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm New Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
          {errors.confirmPassword && (
            <span className="field-error">{errors.confirmPassword}</span>
          )}

          <div className="modal-actions">
            <button type="submit" disabled={loading || Object.keys(errors).length > 0}>
              {loading ? "Updating..." : "Update Password"}
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
