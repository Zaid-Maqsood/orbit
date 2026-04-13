const projectModel = require('../models/projectModel');
const taskModel = require('../models/taskModel');
const deliverableModel = require('../models/deliverableModel');
const messageModel = require('../models/messageModel');
const { sendProjectStatusChanged } = require('../services/emailService');

const getAll = async (req, res, next) => {
  try {
    const projects = await projectModel.findAll(req.user.id, req.user.role);
    res.json(projects);
  } catch (err) {
    next(err);
  }
};

const getOne = async (req, res, next) => {
  try {
    const project = await projectModel.findById(req.params.id);
    if (!project) return res.status(404).json({ error: 'Project not found' });

    const [tasks, members, deliverables, messages] = await Promise.all([
      taskModel.findAll(req.user.id, req.user.role, req.params.id),
      projectModel.getMembers(req.params.id),
      deliverableModel.findByProject(req.params.id),
      messageModel.findByProject(req.params.id),
    ]);

    res.json({ ...project, tasks, members, deliverables, messages });
  } catch (err) {
    next(err);
  }
};

const create = async (req, res, next) => {
  try {
    const { client_id, title, description, status, start_date, deadline, budget } = req.body;
    if (!client_id || !title) {
      return res.status(400).json({ error: 'client_id and title are required' });
    }
    const project = await projectModel.create({
      client_id, title, description, status, start_date, deadline, budget,
      created_by: req.user.id,
    });
    res.status(201).json(project);
  } catch (err) {
    next(err);
  }
};

const update = async (req, res, next) => {
  try {
    const existing = await projectModel.findById(req.params.id);
    if (!existing) return res.status(404).json({ error: 'Project not found' });

    const { title, description, status, start_date, deadline, budget } = req.body;
    const updated = await projectModel.update(req.params.id, { title, description, status, start_date, deadline, budget });

    // Notify client if status changed
    if (status && status !== existing.status) {
      sendProjectStatusChanged(updated, { email: existing.client_email, company: existing.client_name });
    }

    res.json(updated);
  } catch (err) {
    next(err);
  }
};

const remove = async (req, res, next) => {
  try {
    const project = await projectModel.remove(req.params.id);
    if (!project) return res.status(404).json({ error: 'Project not found' });
    res.json({ message: 'Project deleted' });
  } catch (err) {
    next(err);
  }
};

const addMember = async (req, res, next) => {
  try {
    const { user_id } = req.body;
    if (!user_id) return res.status(400).json({ error: 'user_id is required' });
    await projectModel.addMember(req.params.id, user_id);
    res.json({ message: 'Member added' });
  } catch (err) {
    next(err);
  }
};

const removeMember = async (req, res, next) => {
  try {
    await projectModel.removeMember(req.params.id, req.params.userId);
    res.json({ message: 'Member removed' });
  } catch (err) {
    next(err);
  }
};

module.exports = { getAll, getOne, create, update, remove, addMember, removeMember };
