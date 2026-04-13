const pool = require('../config/db');

const findAll = async () => {
  const { rows } = await pool.query(
    `SELECT c.*, u.email as user_email, u.is_active as user_active
     FROM clients c
     LEFT JOIN users u ON c.user_id = u.id
     ORDER BY c.created_at DESC`
  );
  return rows;
};

const findById = async (id) => {
  const { rows } = await pool.query(
    `SELECT c.*, u.email as user_email
     FROM clients c
     LEFT JOIN users u ON c.user_id = u.id
     WHERE c.id = $1`,
    [id]
  );
  return rows[0] || null;
};

const findByUserId = async (userId) => {
  const { rows } = await pool.query(
    'SELECT * FROM clients WHERE user_id = $1',
    [userId]
  );
  return rows[0] || null;
};

const create = async ({ user_id, company, contact, email, phone, address, notes }) => {
  const { rows } = await pool.query(
    `INSERT INTO clients (user_id, company, contact, email, phone, address, notes)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING *`,
    [user_id || null, company, contact, email, phone, address, notes]
  );
  return rows[0];
};

const update = async (id, { company, contact, email, phone, address, notes }) => {
  const { rows } = await pool.query(
    `UPDATE clients
     SET company = COALESCE($1, company),
         contact = COALESCE($2, contact),
         email   = COALESCE($3, email),
         phone   = COALESCE($4, phone),
         address = COALESCE($5, address),
         notes   = COALESCE($6, notes),
         updated_at = NOW()
     WHERE id = $7
     RETURNING *`,
    [company, contact, email, phone, address, notes, id]
  );
  return rows[0] || null;
};

const remove = async (id) => {
  const { rows } = await pool.query(
    'DELETE FROM clients WHERE id = $1 RETURNING id',
    [id]
  );
  return rows[0] || null;
};

const getProjects = async (clientId) => {
  const { rows } = await pool.query(
    `SELECT id, title, status, deadline, budget, created_at
     FROM projects WHERE client_id = $1
     ORDER BY created_at DESC`,
    [clientId]
  );
  return rows;
};

module.exports = { findAll, findById, findByUserId, create, update, remove, getProjects };
