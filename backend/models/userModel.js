const pool = require('../config/db');

const findAll = async () => {
  const { rows } = await pool.query(
    `SELECT id, name, email, role, is_active, created_at
     FROM users
     WHERE role != 'client'
     ORDER BY created_at DESC`
  );
  return rows;
};

const findById = async (id) => {
  const { rows } = await pool.query(
    'SELECT id, name, email, role, is_active, created_at FROM users WHERE id = $1',
    [id]
  );
  return rows[0] || null;
};

const findByEmail = async (email) => {
  const { rows } = await pool.query(
    'SELECT * FROM users WHERE email = $1',
    [email]
  );
  return rows[0] || null;
};

const create = async ({ name, email, passwordHash, role }) => {
  const { rows } = await pool.query(
    `INSERT INTO users (name, email, password_hash, role)
     VALUES ($1, $2, $3, $4)
     RETURNING id, name, email, role, is_active, created_at`,
    [name, email, passwordHash, role]
  );
  return rows[0];
};

const update = async (id, { name, role, is_active }) => {
  const { rows } = await pool.query(
    `UPDATE users
     SET name = COALESCE($1, name),
         role = COALESCE($2, role),
         is_active = COALESCE($3, is_active),
         updated_at = NOW()
     WHERE id = $4
     RETURNING id, name, email, role, is_active, created_at`,
    [name, role, is_active, id]
  );
  return rows[0] || null;
};

const softDelete = async (id) => {
  const { rows } = await pool.query(
    `UPDATE users SET is_active = false, updated_at = NOW()
     WHERE id = $1
     RETURNING id, name, email, role, is_active`,
    [id]
  );
  return rows[0] || null;
};

module.exports = { findAll, findById, findByEmail, create, update, softDelete };
