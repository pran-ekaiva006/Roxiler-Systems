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
    const { sortBy = "name", order = "ASC", name, email, address } = req.query;

    let query = `
      SELECT s.*, 
             ROUND(AVG(r.rating)::numeric, 2) as average_rating,
             COUNT(r.id) as total_ratings,
             u.name as owner_name
      FROM stores s
      LEFT JOIN ratings r ON s.id = r.store_id
      LEFT JOIN users u ON s.owner_id = u.id
    `;

    const params = [];
    let paramCount = 1;
    const conditions = [];

    if (name) {
      conditions.push(`s.name ILIKE $${paramCount}`);
      params.push(`%${name}%`);
      paramCount++;
    }

    if (email) {
      conditions.push(`s.email ILIKE $${paramCount}`);
      params.push(`%${email}%`);
      paramCount++;
    }

    if (address) {
      conditions.push(`s.address ILIKE $${paramCount}`);
      params.push(`%${address}%`);
      paramCount++;
    }

    if (conditions.length > 0) {
      query += ` WHERE ${conditions.join(" AND ")}`;
    }

    query += ` GROUP BY s.id, s.name, s.email, s.address, s.owner_id, s.created_at, s.updated_at, u.name ORDER BY s.${sortBy} ${order}`;

    const result = await pool.query(query, params);
    res.json({ stores: result.rows });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Normal User: Get all stores
// Store Owner: Can also use this to view all stores, or get their own store
export const getStoresForUser = async (req, res) => {
  try {
    const { sortBy = "name", order = "ASC", search, owner } = req.query;
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
    const conditions = [];

    // If store owner wants their own store
    if (owner === "true" && req.user.role === "store_owner") {
      conditions.push(`s.owner_id = $${paramCount}`);
      params.push(userId);
      paramCount++;
    }

    if (search) {
      conditions.push(`(s.name ILIKE $${paramCount} OR s.address ILIKE $${paramCount})`);
      params.push(`%${search}%`);
      paramCount++;
    }

    if (conditions.length > 0) {
      query += ` WHERE ${conditions.join(" AND ")}`;
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