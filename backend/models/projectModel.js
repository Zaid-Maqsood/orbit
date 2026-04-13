const pool = require('../config/db');

const findAll = async (userId, role) => {
  let query, params;
  if (role === 'employee') {
    query = `
      SELECT p.*, c.company as client_name
      FROM projects p
      JOIN clients c ON p.client_id = c.id
      JOIN project_members pm ON pm.project_id = p.id
      WHERE pm.user_id = $1
      ORDER BY p.created_at DESC`;
    params = [userId];
  } else {
    query = `
      SELECT p.*, c.company as client_name
      FROM projects p
      JOIN clients c ON p.client_id = c.id
      ORDER BY p.created_at DESC`;
    params = [];
  }
  const { rows } = await pool.query(query, params);
  return rows;
};

const findById = async (id) => {
  const { rows } = await pool.query(
    `SELECT p.*, c.company as client_name, c.email as client_email,
            u.name as created_by_name
     FROM projects p
     JOIN clients c ON p.client_id = c.id
     LEFT JOIN users u ON p.created_by = u.id
     WHERE p.id = $1`,
    [id]
  );
  return rows[0] || null;
};

const create = async ({ client_id, title, description, status, start_date, deadline, budget, created_by }) => {
  const { rows } = await pool.query(
    `INSERT INTO projects (client_id, title, description, status, start_date, deadline, budget, created_by)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
     RETURNING *`,
    [client_id, title, description, status || 'todo', start_date, deadline, budget, created_by]
  );
  return rows[0];
};

const update = async (id, { title, description, status, start_date, deadline, budget }) => {
  const { rows } = await pool.query(
    `UPDATE projects
     SET title       = COALESCE($1, title),
         description = COALESCE($2, description),
         status      = COALESCE($3, status),
         start_date  = COALESCE($4, start_date),
         deadline    = COALESCE($5, deadline),
         budget      = COALESCE($6, budget),
         updated_at  = NOW()
     WHERE id = $7
     RETURNING *`,
    [title, description, status, start_date, deadline, budget, id]
  );
  return rows[0] || null;
};

const remove = async (id) => {
  const { rows } = await pool.query(
    'DELETE FROM projects WHERE id = $1 RETURNING id',
    [id]
  );
  return rows[0] || null;
};

const getMembers = async (projectId) => {
  const { rows } = await pool.query(
    `SELECT u.id, u.name, u.email, u.role, pm.assigned_at
     FROM project_members pm
     JOIN users u ON pm.user_id = u.id
     WHERE pm.project_id = $1`,
    [projectId]
  );
  return rows;
};

const addMember = async (projectId, userId) => {
  await pool.query(
    'INSERT INTO project_members (project_id, user_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
    [projectId, userId]
  );
};

const removeMember = async (projectId, userId) => {
  await pool.query(
    'DELETE FROM project_members WHERE project_id = $1 AND user_id = $2',
    [projectId, userId]
  );
};

module.exports = { findAll, findById, create, update, remove, getMembers, addMember, removeMember };
