const nodemailer = require('nodemailer');

// Create transporter only if SMTP credentials are provided
const createTransporter = () => {
  if (!process.env.SMTP_USER) {
    return null;
  }
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

const sendMail = async (options) => {
  const transporter = createTransporter();
  if (!transporter) {
    console.log(`[EMAIL STUB] To: ${options.to} | Subject: ${options.subject}`);
    return;
  }
  try {
    await transporter.sendMail({
      from: process.env.FROM_EMAIL || 'IT Platform <noreply@itplatform.com>',
      ...options,
    });
  } catch (err) {
    console.error('[EMAIL ERROR]', err.message);
  }
};

const sendTaskAssigned = (task, assignee) => {
  sendMail({
    to: assignee.email,
    subject: `New task assigned: ${task.title}`,
    html: `
      <h2>You have been assigned a new task</h2>
      <p><strong>Task:</strong> ${task.title}</p>
      <p><strong>Project:</strong> ${task.project_title || 'N/A'}</p>
      <p><strong>Priority:</strong> ${task.priority}</p>
      ${task.due_date ? `<p><strong>Due Date:</strong> ${task.due_date}</p>` : ''}
      ${task.description ? `<p><strong>Description:</strong> ${task.description}</p>` : ''}
      <p>Log in to your dashboard to view details.</p>
    `,
  });
};

const sendProjectStatusChanged = (project, client) => {
  if (!client?.email) return;
  const statusLabels = {
    todo: 'To Do',
    in_progress: 'In Progress',
    on_hold: 'On Hold',
    completed: 'Completed',
    cancelled: 'Cancelled',
  };
  sendMail({
    to: client.email,
    subject: `Project update: ${project.title}`,
    html: `
      <h2>Project Status Update</h2>
      <p>Dear ${client.company || 'Client'},</p>
      <p>The status of your project <strong>${project.title}</strong> has been updated to:
        <strong>${statusLabels[project.status] || project.status}</strong>
      </p>
      ${project.deadline ? `<p><strong>Deadline:</strong> ${project.deadline}</p>` : ''}
      <p>Log in to your client portal to view the latest updates.</p>
    `,
  });
};

const sendDeadlineAlert = (entity, type, recipients) => {
  recipients.forEach((recipient) => {
    if (!recipient.email) return;
    sendMail({
      to: recipient.email,
      subject: `Missed deadline: ${entity.title || entity.name}`,
      html: `
        <h2>Deadline Alert</h2>
        <p>The following ${type} has passed its deadline:</p>
        <p><strong>${type === 'task' ? 'Task' : 'Project'}:</strong> ${entity.title || entity.name}</p>
        ${type === 'task' ? `<p><strong>Project:</strong> ${entity.project_title}</p>` : ''}
        <p><strong>Due Date:</strong> ${entity.due_date || entity.deadline}</p>
        <p>Please take action immediately.</p>
      `,
    });
  });
};

module.exports = { sendTaskAssigned, sendProjectStatusChanged, sendDeadlineAlert };
