const taskModel = require('../models/taskModel');
const userModel = require('../models/userModel');
const { sendTaskAssigned } = require('../services/emailService');

const getAll = async (req, res, next) => {
  try {
    const projectId = req.query.projectId || null;
    const tasks = await taskModel.findAll(req.user.id, req.user.role, projectId);
    res.json(tasks);
  } catch (err) {
    next(err);
  }
};

const getByProject = async (req, res, next) => {
  try {
    const tasks = await taskModel.findAll(req.user.id, req.user.role, req.params.projectId);
    res.json(tasks);
  } catch (err) {
    next(err);
  }
};

const getOne = async (req, res, next) => {
  try {
    const task = await taskModel.findById(req.params.id);
    if (!task) return res.status(404).json({ error: 'Task not found' });
    res.json(task);
  } catch (err) {
    next(err);
  }
};

const create = async (req, res, next) => {
  try {
    const { project_id, title, description, status, priority, assigned_to, due_date } = req.body;
    if (!project_id || !title) {
      return res.status(400).json({ error: 'project_id and title are required' });
    }
    const task = await taskModel.create({
      project_id, title, description, status, priority, assigned_to,
      created_by: req.user.id, due_date,
    });

    // Notify assignee
    if (assigned_to) {
      const assignee = await userModel.findById(assigned_to);
      if (assignee) sendTaskAssigned(task, assignee);
    }

    res.status(201).json(task);
  } catch (err) {
    next(err);
  }
};

const update = async (req, res, next) => {
  try {
    const task = await taskModel.findById(req.params.id);
    if (!task) return res.status(404).json({ error: 'Task not found' });

    // Employees can only update status on tasks assigned to them
    if (req.user.role === 'employee') {
      if (task.assigned_to !== req.user.id) {
        return res.status(403).json({ error: 'You can only update tasks assigned to you' });
      }
      const { status } = req.body;
      if (!status) return res.status(400).json({ error: 'status is required' });
      const updated = await taskModel.updateStatus(req.params.id, status);
      return res.json(updated);
    }

    // Managers / admins can update all fields
    const { title, description, status, priority, assigned_to, due_date } = req.body;
    const updated = await taskModel.update(req.params.id, { title, description, status, priority, assigned_to, due_date });

    // Notify new assignee if changed
    if (assigned_to && assigned_to !== task.assigned_to) {
      const assignee = await userModel.findById(assigned_to);
      if (assignee) sendTaskAssigned(updated, assignee);
    }

    res.json(updated);
  } catch (err) {
    next(err);
  }
};

const remove = async (req, res, next) => {
  try {
    const task = await taskModel.remove(req.params.id);
    if (!task) return res.status(404).json({ error: 'Task not found' });
    res.json({ message: 'Task deleted' });
  } catch (err) {
    next(err);
  }
};

module.exports = { getAll, getByProject, getOne, create, update, remove };
