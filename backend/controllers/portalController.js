const clientModel = require('../models/clientModel');
const projectModel = require('../models/projectModel');
const invoiceModel = require('../models/invoiceModel');
const messageModel = require('../models/messageModel');
const deliverableModel = require('../models/deliverableModel');

// Helper: get client record for the logged-in user
const getClientRecord = async (userId, res) => {
  const client = await clientModel.findByUserId(userId);
  if (!client) {
    res.status(404).json({ error: 'Client profile not found' });
    return null;
  }
  return client;
};

const getProjects = async (req, res, next) => {
  try {
    const client = await getClientRecord(req.user.id, res);
    if (!client) return;

    const { rows } = await require('../config/db').query(
      `SELECT p.*, c.company as client_name
       FROM projects p
       JOIN clients c ON p.client_id = c.id
       WHERE p.client_id = $1
       ORDER BY p.created_at DESC`,
      [client.id]
    );
    res.json(rows);
  } catch (err) {
    next(err);
  }
};

const getProjectDetail = async (req, res, next) => {
  try {
    const client = await getClientRecord(req.user.id, res);
    if (!client) return;

    const project = await projectModel.findById(req.params.id);
    if (!project || project.client_id !== client.id) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const [deliverables, messages] = await Promise.all([
      deliverableModel.findByProject(req.params.id),
      messageModel.findByProject(req.params.id),
    ]);

    res.json({ ...project, deliverables, messages });
  } catch (err) {
    next(err);
  }
};

const getInvoices = async (req, res, next) => {
  try {
    const client = await getClientRecord(req.user.id, res);
    if (!client) return;
    const invoices = await invoiceModel.findByClientId(client.id);
    res.json(invoices);
  } catch (err) {
    next(err);
  }
};

const getMessages = async (req, res, next) => {
  try {
    const client = await getClientRecord(req.user.id, res);
    if (!client) return;

    // Verify project belongs to this client
    const project = await projectModel.findById(req.params.projectId);
    if (!project || project.client_id !== client.id) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const messages = await messageModel.findByProject(req.params.projectId);
    res.json(messages);
  } catch (err) {
    next(err);
  }
};

const sendMessage = async (req, res, next) => {
  try {
    const client = await getClientRecord(req.user.id, res);
    if (!client) return;

    const project = await projectModel.findById(req.params.projectId);
    if (!project || project.client_id !== client.id) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const { body } = req.body;
    if (!body || !body.trim()) {
      return res.status(400).json({ error: 'Message body is required' });
    }

    const message = await messageModel.create({
      project_id: req.params.projectId,
      sender_id: req.user.id,
      body: body.trim(),
    });
    const full = { ...message, sender_name: req.user.name, sender_role: req.user.role };
    res.status(201).json(full);
  } catch (err) {
    next(err);
  }
};

module.exports = { getProjects, getProjectDetail, getInvoices, getMessages, sendMessage };
