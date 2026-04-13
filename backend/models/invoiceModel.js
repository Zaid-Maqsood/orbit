const pool = require('../config/db');

const findAll = async () => {
  const { rows } = await pool.query(
    `SELECT i.*, c.company as client_name, p.title as project_title
     FROM invoices i
     JOIN clients c ON i.client_id = c.id
     JOIN projects p ON i.project_id = p.id
     ORDER BY i.created_at DESC`
  );
  return rows;
};

const findById = async (id) => {
  const { rows } = await pool.query(
    `SELECT i.*, c.company as client_name, p.title as project_title,
            u.name as created_by_name
     FROM invoices i
     JOIN clients c ON i.client_id = c.id
     JOIN projects p ON i.project_id = p.id
     LEFT JOIN users u ON i.created_by = u.id
     WHERE i.id = $1`,
    [id]
  );
  return rows[0] || null;
};

const findByClientId = async (clientId) => {
  const { rows } = await pool.query(
    `SELECT i.*, p.title as project_title
     FROM invoices i
     JOIN projects p ON i.project_id = p.id
     WHERE i.client_id = $1
     ORDER BY i.created_at DESC`,
    [clientId]
  );
  return rows;
};

const create = async ({ project_id, client_id, invoice_no, amount, status, issued_date, due_date, notes, created_by }) => {
  const { rows } = await pool.query(
    `INSERT INTO invoices (project_id, client_id, invoice_no, amount, status, issued_date, due_date, notes, created_by)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
     RETURNING *`,
    [project_id, client_id, invoice_no, amount, status || 'draft', issued_date, due_date, notes, created_by]
  );
  return rows[0];
};

const update = async (id, { amount, status, due_date, notes, invoice_no }) => {
  const { rows } = await pool.query(
    `UPDATE invoices
     SET amount     = COALESCE($1, amount),
         status     = COALESCE($2, status),
         due_date   = COALESCE($3, due_date),
         notes      = COALESCE($4, notes),
         invoice_no = COALESCE($5, invoice_no),
         updated_at = NOW()
     WHERE id = $6
     RETURNING *`,
    [amount, status, due_date, notes, invoice_no, id]
  );
  return rows[0] || null;
};

const remove = async (id) => {
  const { rows } = await pool.query(
    'DELETE FROM invoices WHERE id = $1 RETURNING id',
    [id]
  );
  return rows[0] || null;
};

module.exports = { findAll, findById, findByClientId, create, update, remove };
