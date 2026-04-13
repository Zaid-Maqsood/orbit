const pool = require('../config/db');

const findByProject = async (projectId) => {
  const { rows } = await pool.query(
    `SELECT d.*, u.name as uploaded_by_name
     FROM deliverables d
     LEFT JOIN users u ON d.uploaded_by = u.id
     WHERE d.project_id = $1
     ORDER BY d.created_at DESC`,
    [projectId]
  );
  return rows;
};

const create = async ({ project_id, name, url, uploaded_by }) => {
  const { rows } = await pool.query(
    `INSERT INTO deliverables (project_id, name, url, uploaded_by)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [project_id, name, url, uploaded_by]
  );
  return rows[0];
};

const remove = async (id) => {
  const { rows } = await pool.query(
    'DELETE FROM deliverables WHERE id = $1 RETURNING id',
    [id]
  );
  return rows[0] || null;
};

module.exports = { findByProject, create, remove };
