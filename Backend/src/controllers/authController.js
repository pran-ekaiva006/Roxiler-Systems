import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import pool from "../db.js";
import { signupSchema, loginSchema, updatePasswordSchema } from "../validators/authValidator.js";

export const signup = async (req, res) => {
  try {
    const validated = signupSchema.parse(req.body);
    const hashedPassword = await bcrypt.hash(validated.password, 10);

    const result = await pool.query(
      "INSERT INTO users (name, email, address, password, role) VALUES ($1, $2, $3, $4, $5) RETURNING id, name, email, role",
      [validated.name, validated.email, validated.address, hashedPassword, "normal_user"]
    );

    res.status(201).json({ message: "User registered successfully", user: result.rows[0] });
  } catch (err) {
    if (err.code === "23505") {
      res.status(400).json({ error: "Email already registered" });
    } else {
      res.status(400).json({ error: err.message });
    }
  }
};

export const login = async (req, res) => {
  try {
    const validated = loginSchema.parse(req.body);

    const result = await pool.query("SELECT * FROM users WHERE email = $1", [validated.email]);

    if (result.rows.length === 0) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const user = result.rows[0];
    const passwordMatch = await bcrypt.compare(validated.password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || "secret_key",
      { expiresIn: "24h" }
    );

    res.json({
      message: "Login successful",
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const updatePassword = async (req, res) => {
  try {
    const validated = updatePasswordSchema.parse(req.body);
    const userId = req.user.id;

    const result = await pool.query("SELECT password FROM users WHERE id = $1", [userId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const passwordMatch = await bcrypt.compare(validated.oldPassword, result.rows[0].password);

    if (!passwordMatch) {
      return res.status(401).json({ error: "Old password is incorrect" });
    }

    const hashedPassword = await bcrypt.hash(validated.newPassword, 10);
    await pool.query("UPDATE users SET password = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2", [
      hashedPassword,
      userId,
    ]);

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};