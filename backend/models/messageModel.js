const pool = require('../config/db');

const findByProject = async (projectId) => {
  const { rows } = await pool.query(
    `SELECT m.*, u.name as sender_name, u.role as sender_role
     FROM messages m
     JOIN users u ON m.sender_id = u.id
     WHERE m.project_id = $1
     ORDER BY m.created_at ASC`,
    [projectId]
  );
  return rows;
};

const create = async ({ project_id, sender_id, body }) => {
  const { rows } = await pool.query(
    `INSERT INTO messages (project_id, sender_id, body)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [project_id, sender_id, body]
  );
  return rows[0];
};

module.exports = { findByProject, create };
