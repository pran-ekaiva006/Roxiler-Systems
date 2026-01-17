import pool from "../db.js";

// Normal User: Submit or update rating
export const submitRating = async (req, res) => {
  try {
    const { store_id, rating } = req.body;
    const user_id = req.user.id;

    if (!store_id || !rating) {
      return res.status(400).json({ error: "Store ID and rating are required" });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ error: "Rating must be between 1 and 5" });
    }

    // Check if store exists
    const storeCheck = await pool.query("SELECT id FROM stores WHERE id = $1", [store_id]);
    if (storeCheck.rows.length === 0) {
      return res.status(404).json({ error: "Store not found" });
    }

    // Upsert rating
    const result = await pool.query(
      `INSERT INTO ratings (user_id, store_id, rating) 
       VALUES ($1, $2, $3)
       ON CONFLICT (user_id, store_id) 
       DO UPDATE SET rating = $3, updated_at = CURRENT_TIMESTAMP
       RETURNING *`,
      [user_id, store_id, rating]
    );

    res.status(201).json({ message: "Rating submitted successfully", rating: result.rows[0] });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get user's rating for a store
export const getUserRating = async (req, res) => {
  try {
    const { store_id } = req.params;
    const user_id = req.user.id;

    const result = await pool.query(
      "SELECT * FROM ratings WHERE user_id = $1 AND store_id = $2",
      [user_id, store_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "No rating found" });
    }

    res.json({ rating: result.rows[0] });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Store Owner: Get ratings for their store
export const getStoreRatings = async (req, res) => {
  try {
    const store_id = req.params.store_id;
    const user_id = req.user.id;

    // Verify store owner
    const storeCheck = await pool.query(
      "SELECT owner_id FROM stores WHERE id = $1",
      [store_id]
    );

    if (storeCheck.rows.length === 0) {
      return res.status(404).json({ error: "Store not found" });
    }

    if (storeCheck.rows[0].owner_id !== user_id) {
      return res.status(403).json({ error: "You are not the owner of this store" });
    }

    const result = await pool.query(
      `SELECT u.id, u.name, u.email, r.rating, r.created_at
       FROM ratings r
       JOIN users u ON r.user_id = u.id
       WHERE r.store_id = $1
       ORDER BY r.created_at DESC`,
      [store_id]
    );

    const avgRating = await pool.query(
      "SELECT ROUND(AVG(rating)::numeric, 2) as average_rating FROM ratings WHERE store_id = $1",
      [store_id]
    );

    res.json({ 
      ratings: result.rows,
      average_rating: avgRating.rows[0].average_rating 
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Admin: Get all ratings
export const getAllRatings = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT r.*, u.name as user_name, u.email as user_email, s.name as store_name
       FROM ratings r
       JOIN users u ON r.user_id = u.id
       JOIN stores s ON r.store_id = s.id
       ORDER BY r.created_at DESC`
    );

    res.json({ ratings: result.rows });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};