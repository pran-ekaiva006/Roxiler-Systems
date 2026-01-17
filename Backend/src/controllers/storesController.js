import pool from "../db.js";

// Admin: Create new store
export const createStore = async (req, res) => {
  try {
    const { name, email, address, owner_id } = req.body;

    if (!name || !email || !address) {
      return res.status(400).json({ error: "Name, email, and address are required" });
    }

    const result = await pool.query(
      "INSERT INTO stores (name, email, address, owner_id) VALUES ($1, $2, $3, $4) RETURNING *",
      [name, email, address, owner_id || null]
    );

    res.status(201).json({ message: "Store created successfully", store: result.rows[0] });
  } catch (err) {
    if (err.code === "23505") {
      res.status(400).json({ error: "Store email already exists" });
    } else {
      res.status(400).json({ error: err.message });
    }
  }
};

// Admin: Get all stores with ratings
export const getAllStores = async (req, res) => {
  try {
    const { sortBy = "name", order = "ASC", search } = req.query;

    let query = `
      SELECT s.*, 
             ROUND(AVG(r.rating)::numeric, 2) as average_rating,
             COUNT(r.id) as total_ratings
      FROM stores s
      LEFT JOIN ratings r ON s.id = r.store_id
    `;

    const params = [];

    if (search) {
      query += ` WHERE s.name ILIKE $1 OR s.address ILIKE $1`;
      params.push(`%${search}%`);
    }

    query += ` GROUP BY s.id ORDER BY s.${sortBy} ${order}`;

    const result = await pool.query(query, params);
    res.json({ stores: result.rows });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Normal User: Get all stores
export const getStoresForUser = async (req, res) => {
  try {
    const { sortBy = "name", order = "ASC", search } = req.query;
    const userId = req.user.id;

    let query = `
      SELECT s.*, 
             ROUND(AVG(r.rating)::numeric, 2) as average_rating,
             ur.rating as user_rating
      FROM stores s
      LEFT JOIN ratings r ON s.id = r.store_id
      LEFT JOIN ratings ur ON s.id = ur.store_id AND ur.user_id = $1
    `;

    const params = [userId];
    let paramCount = 2;

    if (search) {
      query += ` WHERE s.name ILIKE $${paramCount} OR s.address ILIKE $${paramCount}`;
      params.push(`%${search}%`);
      paramCount++;
    }

    query += ` GROUP BY s.id, ur.rating ORDER BY s.${sortBy} ${order}`;

    const result = await pool.query(query, params);
    res.json({ stores: result.rows });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get single store details
export const getStoreById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `SELECT s.*, ROUND(AVG(r.rating)::numeric, 2) as average_rating, COUNT(r.id) as total_ratings
       FROM stores s
       LEFT JOIN ratings r ON s.id = r.store_id
       WHERE s.id = $1
       GROUP BY s.id`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Store not found" });
    }

    res.json({ store: result.rows[0] });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Admin: Delete store
export const deleteStore = async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query("DELETE FROM stores WHERE id = $1", [id]);

    res.json({ message: "Store deleted successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};