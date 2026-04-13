const pool = require('../config/db');

const findAll = async (userId, role, projectId) => {
  let conditions = [];
  let params = [];
  let idx = 1;

  if (projectId) {
    conditions.push(`t.project_id = $${idx++}`);
    params.push(projectId);
  }
  if (role === 'employee') {
    conditions.push(`t.assigned_to = $${idx++}`);
    params.push(userId);
  }

  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

  const { rows } = await pool.query(
    `SELECT t.*,
            u.name as assignee_name, u.email as assignee_email,
            p.title as project_title
     FROM tasks t
     LEFT JOIN users u ON t.assigned_to = u.id
     LEFT JOIN projects p ON t.project_id = p.id
     ${where}
     ORDER BY t.created_at DESC`,
    params
  );
  return rows;
};

const findById = async (id) => {
  const { rows } = await pool.query(
    `SELECT t.*,
            u.name as assignee_name, u.email as assignee_email,
            p.title as project_title
     FROM tasks t
     LEFT JOIN users u ON t.assigned_to = u.id
     LEFT JOIN projects p ON t.project_id = p.id
     WHERE t.id = $1`,
    [id]
  );
  return rows[0] || null;
};

const create = async ({ project_id, title, description, status, priority, assigned_to, created_by, due_date }) => {
  const { rows } = await pool.query(
    `INSERT INTO tasks (project_id, title, description, status, priority, assigned_to, created_by, due_date)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
     RETURNING *`,
    [project_id, title, description, status || 'todo', priority || 'medium', assigned_to, created_by, due_date]
  );
  return rows[0];
};

const update = async (id, fields) => {
  const { title, description, status, priority, assigned_to, due_date } = fields;
  const { rows } = await pool.query(
    `UPDATE tasks
     SET title       = COALESCE($1, title),
         description = COALESCE($2, description),
         status      = COALESCE($3, status),
         priority    = COALESCE($4, priority),
         assigned_to = COALESCE($5, assigned_to),
         due_date    = COALESCE($6, due_date),
         updated_at  = NOW()
     WHERE id = $7
     RETURNING *`,
    [title, description, status, priority, assigned_to, due_date, id]
  );
  return rows[0] || null;
};

const updateStatus = async (id, status) => {
  const { rows } = await pool.query(
    `UPDATE tasks SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *`,
    [status, id]
  );
  return rows[0] || null;
};

const remove = async (id) => {
  const { rows } = await pool.query(
    'DELETE FROM tasks WHERE id = $1 RETURNING id',
    [id]
  );
  return rows[0] || null;
};

// For deadline checker
const findOverdue = async () => {
  const { rows } = await pool.query(
    `SELECT t.*, u.name as assignee_name, u.email as assignee_email, p.title as project_title
     FROM tasks t
     LEFT JOIN users u ON t.assigned_to = u.id
     LEFT JOIN projects p ON t.project_id = p.id
     WHERE t.due_date < CURRENT_DATE AND t.status != 'done' AND u.email IS NOT NULL`
  );
  return rows;
};

module.exports = { findAll, findById, create, update, updateStatus, remove, findOverdue };
