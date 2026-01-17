import bcrypt from "bcrypt";
import pool from "../db.js";
import { signupSchema } from "../validators/authValidator.js";

// Admin: Create new user
export const createUser = async (req, res) => {
  try {
    const { name, email, password, address, role } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ error: "Name, email, password, and role are required" });
    }

    if (!["admin", "normal_user", "store_owner"].includes(role)) {
      return res.status(400).json({ error: "Invalid role" });
    }

    const validated = signupSchema.parse({ name, email, password, address: address || "" });
    const hashedPassword = await bcrypt.hash(validated.password, 10);

    const result = await pool.query(
      "INSERT INTO users (name, email, password, address, role) VALUES ($1, $2, $3, $4, $5) RETURNING id, name, email, address, role",
      [validated.name, validated.email, hashedPassword, validated.address || null, role]
    );

    res.status(201).json({ message: "User created successfully", user: result.rows[0] });
  } catch (err) {
    if (err.code === "23505") {
      res.status(400).json({ error: "Email already registered" });
    } else {
      res.status(400).json({ error: err.message });
    }
  }
};

// Admin: Get all users with filters and sorting
export const getAllUsers = async (req, res) => {
  try {
    const { sortBy = "name", order = "ASC", name, email, address, role } = req.query;

    let query = "SELECT id, name, email, address, role, created_at FROM users WHERE 1=1";
    const params = [];
    let paramCount = 1;

    if (name) {
      query += ` AND name ILIKE $${paramCount}`;
      params.push(`%${name}%`);
      paramCount++;
    }

    if (email) {
      query += ` AND email ILIKE $${paramCount}`;
      params.push(`%${email}%`);
      paramCount++;
    }

    if (address) {
      query += ` AND address ILIKE $${paramCount}`;
      params.push(`%${address}%`);
      paramCount++;
    }

    if (role) {
      query += ` AND role = $${paramCount}`;
      params.push(role);
      paramCount++;
    }

    query += ` ORDER BY ${sortBy} ${order}`;

    const result = await pool.query(query, params);
    res.json({ users: result.rows });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Admin: Get user details
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "SELECT id, name, email, address, role, created_at FROM users WHERE id = $1",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const user = result.rows[0];

    // If store owner, get average rating
    if (user.role === "store_owner") {
      const ratingResult = await pool.query(
        `SELECT ROUND(AVG(r.rating)::numeric, 2) as average_rating
         FROM ratings r
         JOIN stores s ON r.store_id = s.id
         WHERE s.owner_id = $1`,
        [id]
      );
      user.average_rating = ratingResult.rows[0].average_rating;
    }

    res.json({ user });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Admin: Get dashboard statistics
export const getDashboardStats = async (req, res) => {
  try {
    const totalUsersResult = await pool.query("SELECT COUNT(*) as count FROM users");
    const totalStoresResult = await pool.query("SELECT COUNT(*) as count FROM stores");
    const totalRatingsResult = await pool.query("SELECT COUNT(*) as count FROM ratings");

    res.json({
      total_users: parseInt(totalUsersResult.rows[0].count),
      total_stores: parseInt(totalStoresResult.rows[0].count),
      total_ratings: parseInt(totalRatingsResult.rows[0].count),
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Admin: Delete user
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query("DELETE FROM users WHERE id = $1", [id]);

    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};