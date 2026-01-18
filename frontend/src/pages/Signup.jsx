import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authAPI } from "../services/api";
import "../styles/Auth.css";

export default function Signup() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    validateField(name, value);
  };

  const validateField = (name, value) => {
    const newErrors = { ...errors };

    switch (name) {
      case "name":
        if (value.length < 20) {
          newErrors.name = `Name must be at least 20 characters (${value.length}/20)`;
        } else if (value.length > 60) {
          newErrors.name = "Name must not exceed 60 characters";
        } else {
          delete newErrors.name;
        }
        break;

      case "email":
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
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
        if (value.length < 8) passwordErrors.push("At least 8 characters");
        if (value.length > 16) passwordErrors.push("Max 16 characters");
        if (!/[A-Z]/.test(value)) passwordErrors.push("1 uppercase letter");
        if (!/[!@#$%^&*]/.test(value)) passwordErrors.push("1 special character");

        if (passwordErrors.length > 0) {
          newErrors.password = `Password needs: ${passwordErrors.join(", ")}`;
        } else {
          delete newErrors.password;
        }
        break;

      case "confirmPassword":
        if (value !== formData.password) {
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

  const validateForm = () => {
    if (Object.keys(errors).length > 0) {
      setError("Fix all validation errors");
      return false;
    }
    if (formData.name.length < 20) {
      setError("Name must be at least 20 characters");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) return;
    setLoading(true);

    try {
      await authAPI.signup({
        name: formData.name,
        email: formData.email,
        address: formData.address,
        password: formData.password,
      });
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.error || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Sign Up</h2>
        {error && <div className="error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Full Name (20–60 characters)"
            value={formData.name}
            onChange={handleChange}
            required
          />
          {errors.name && <span className="field-error">{errors.name}</span>}

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          {errors.email && <span className="field-error">{errors.email}</span>}

          <input
            type="text"
            name="address"
            placeholder="Address (max 400 chars)"
            value={formData.address}
            onChange={handleChange}
          />
          {errors.address && <span className="field-error">{errors.address}</span>}

          <input
            type="password"
            name="password"
            placeholder="Password (8–16, 1 uppercase, 1 special)"
            value={formData.password}
            onChange={handleChange}
            required
          />
          {errors.password && <span className="field-error">{errors.password}</span>}

          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
          {errors.confirmPassword && (
            <span className="field-error">{errors.confirmPassword}</span>
          )}

          <button type="submit" disabled={loading || Object.keys(errors).length > 0}>
            {loading ? "Signing up..." : "Sign Up"}
          </button>
        </form>

        <p>
          Already have account? <a href="/login">Login</a>
        </p>
      </div>
    </div>
  );
}
