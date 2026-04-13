const bcrypt = require('bcryptjs');
const clientModel = require('../models/clientModel');
const userModel = require('../models/userModel');

const getAll = async (req, res, next) => {
  try {
    const clients = await clientModel.findAll();
    res.json(clients);
  } catch (err) {
    next(err);
  }
};

const getOne = async (req, res, next) => {
  try {
    const client = await clientModel.findById(req.params.id);
    if (!client) return res.status(404).json({ error: 'Client not found' });
    const projects = await clientModel.getProjects(req.params.id);
    res.json({ ...client, projects });
  } catch (err) {
    next(err);
  }
};

const create = async (req, res, next) => {
  try {
    const { company, contact, email, phone, address, notes, createLogin, loginPassword } = req.body;
    if (!company) return res.status(400).json({ error: 'Company name is required' });

    let userId = null;
    if (createLogin && email) {
      const password = loginPassword || 'Client@1234';
      const passwordHash = await bcrypt.hash(password, 10);
      const user = await userModel.create({ name: contact || company, email, passwordHash, role: 'client' });
      userId = user.id;
    }

    const client = await clientModel.create({ user_id: userId, company, contact, email, phone, address, notes });
    res.status(201).json(client);
  } catch (err) {
    next(err);
  }
};

const update = async (req, res, next) => {
  try {
    const { company, contact, email, phone, address, notes } = req.body;
    const client = await clientModel.update(req.params.id, { company, contact, email, phone, address, notes });
    if (!client) return res.status(404).json({ error: 'Client not found' });
    res.json(client);
  } catch (err) {
    next(err);
  }
};

const remove = async (req, res, next) => {
  try {
    const client = await clientModel.remove(req.params.id);
    if (!client) return res.status(404).json({ error: 'Client not found' });
    res.json({ message: 'Client deleted' });
  } catch (err) {
    next(err);
  }
};

module.exports = { getAll, getOne, create, update, remove };
