const bcrypt = require('bcryptjs');
const userModel = require('../models/userModel');

const getAll = async (req, res, next) => {
  try {
    const users = await userModel.findAll();
    res.json(users);
  } catch (err) {
    next(err);
  }
};

const getOne = async (req, res, next) => {
  try {
    const user = await userModel.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    next(err);
  }
};

const create = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password || !role) {
      return res.status(400).json({ error: 'name, email, password, and role are required' });
    }
    const validRoles = ['admin', 'manager', 'employee', 'client'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await userModel.create({ name, email, passwordHash, role });
    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
};

const update = async (req, res, next) => {
  try {
    const { name, role, is_active } = req.body;
    const user = await userModel.update(req.params.id, { name, role, is_active });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    next(err);
  }
};

const remove = async (req, res, next) => {
  try {
    const user = await userModel.softDelete(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ message: 'User deactivated', user });
  } catch (err) {
    next(err);
  }
};

module.exports = { getAll, getOne, create, update, remove };
