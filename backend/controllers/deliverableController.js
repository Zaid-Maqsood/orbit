const deliverableModel = require('../models/deliverableModel');

const getByProject = async (req, res, next) => {
  try {
    const deliverables = await deliverableModel.findByProject(req.params.projectId);
    res.json(deliverables);
  } catch (err) {
    next(err);
  }
};

const create = async (req, res, next) => {
  try {
    const { name, url } = req.body;
    if (!name || !url) {
      return res.status(400).json({ error: 'name and url are required' });
    }
    const deliverable = await deliverableModel.create({
      project_id: req.params.projectId,
      name,
      url,
      uploaded_by: req.user.id,
    });
    res.status(201).json(deliverable);
  } catch (err) {
    next(err);
  }
};

const remove = async (req, res, next) => {
  try {
    const deliverable = await deliverableModel.remove(req.params.id);
    if (!deliverable) return res.status(404).json({ error: 'Deliverable not found' });
    res.json({ message: 'Deliverable removed' });
  } catch (err) {
    next(err);
  }
};

module.exports = { getByProject, create, remove };
