const pool = require('../config/db');

const overview = async (req, res, next) => {
  try {
    const [clients, projects, tasks, invoices] = await Promise.all([
      pool.query('SELECT COUNT(*) FROM clients'),
      pool.query(`
        SELECT status, COUNT(*) as count
        FROM projects
        GROUP BY status
      `),
      pool.query(`
        SELECT
          COUNT(*) FILTER (WHERE status != 'done') as open_tasks,
          COUNT(*) FILTER (WHERE due_date < CURRENT_DATE AND status != 'done') as overdue_tasks,
          COUNT(*) as total_tasks
        FROM tasks
      `),
      pool.query(`
        SELECT
          COUNT(*) FILTER (WHERE status IN ('sent','overdue')) as unpaid,
          COUNT(*) FILTER (WHERE status = 'paid') as paid,
          COALESCE(SUM(amount) FILTER (WHERE status = 'paid'), 0) as revenue
        FROM invoices
      `),
    ]);

    const projectStats = {};
    projects.rows.forEach(r => { projectStats[r.status] = parseInt(r.count); });

    res.json({
      totalClients: parseInt(clients.rows[0].count),
      projects: {
        todo: projectStats.todo || 0,
        in_progress: projectStats.in_progress || 0,
        on_hold: projectStats.on_hold || 0,
        completed: projectStats.completed || 0,
        cancelled: projectStats.cancelled || 0,
        total: Object.values(projectStats).reduce((a, b) => a + b, 0),
      },
      tasks: {
        open: parseInt(tasks.rows[0].open_tasks),
        overdue: parseInt(tasks.rows[0].overdue_tasks),
        total: parseInt(tasks.rows[0].total_tasks),
      },
      invoices: {
        unpaid: parseInt(invoices.rows[0].unpaid),
        paid: parseInt(invoices.rows[0].paid),
        revenue: parseFloat(invoices.rows[0].revenue),
      },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { overview };
