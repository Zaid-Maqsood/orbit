const messageModel = require('../models/messageModel');

const getByProject = async (req, res, next) => {
  try {
    const messages = await messageModel.findByProject(req.params.projectId);
    res.json(messages);
  } catch (err) {
    next(err);
  }
};

const create = async (req, res, next) => {
  try {
    const { body } = req.body;
    if (!body || !body.trim()) {
      return res.status(400).json({ error: 'Message body is required' });
    }
    const message = await messageModel.create({
      project_id: req.params.projectId,
      sender_id: req.user.id,
      body: body.trim(),
    });
    // Attach sender info for immediate UI use
    const full = { ...message, sender_name: req.user.name, sender_role: req.user.role };
    res.status(201).json(full);
  } catch (err) {
    next(err);
  }
};

module.exports = { getByProject, create };
