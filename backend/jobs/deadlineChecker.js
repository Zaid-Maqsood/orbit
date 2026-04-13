const pool = require('../config/db');
const { sendDeadlineAlert } = require('../services/emailService');

const CHECK_INTERVAL_MS = 60 * 60 * 1000; // 1 hour

const checkOverdueTasks = async () => {
  try {
    const { rows } = await pool.query(`
      SELECT t.id, t.title, t.due_date, p.title as project_title,
             u.name as assignee_name, u.email as assignee_email
      FROM tasks t
      JOIN projects p ON t.project_id = p.id
      LEFT JOIN users u ON t.assigned_to = u.id
      WHERE t.due_date < CURRENT_DATE
        AND t.status != 'done'
        AND u.email IS NOT NULL
    `);

    for (const task of rows) {
      sendDeadlineAlert(
        { title: task.title, due_date: task.due_date, project_title: task.project_title },
        'task',
        [{ email: task.assignee_email, name: task.assignee_name }]
      );
    }

    if (rows.length > 0) {
      console.log(`[DEADLINE CHECKER] Alerted ${rows.length} overdue task(s)`);
    }
  } catch (err) {
    console.error('[DEADLINE CHECKER] Task check error:', err.message);
  }
};

const checkOverdueProjects = async () => {
  try {
    const { rows } = await pool.query(`
      SELECT p.id, p.title, p.deadline,
             c.email as client_email, c.company
      FROM projects p
      JOIN clients c ON p.client_id = c.id
      WHERE p.deadline < CURRENT_DATE
        AND p.status NOT IN ('completed', 'cancelled')
    `);

    for (const project of rows) {
      const recipients = [];
      if (project.client_email) {
        recipients.push({ email: project.client_email, name: project.company });
      }
      if (recipients.length > 0) {
        sendDeadlineAlert(
          { title: project.title, deadline: project.deadline },
          'project',
          recipients
        );
      }
    }

    if (rows.length > 0) {
      console.log(`[DEADLINE CHECKER] Alerted ${rows.length} overdue project(s)`);
    }
  } catch (err) {
    console.error('[DEADLINE CHECKER] Project check error:', err.message);
  }
};

const runCheck = async () => {
  console.log('[DEADLINE CHECKER] Running deadline check...');
  await checkOverdueTasks();
  await checkOverdueProjects();
};

const startDeadlineChecker = () => {
  // Run once on startup, then every hour
  runCheck();
  setInterval(runCheck, CHECK_INTERVAL_MS);
  console.log('[DEADLINE CHECKER] Started — checking every hour');
};

module.exports = { startDeadlineChecker };
