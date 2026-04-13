const invoiceModel = require('../models/invoiceModel');

const getAll = async (req, res, next) => {
  try {
    const invoices = await invoiceModel.findAll();
    res.json(invoices);
  } catch (err) {
    next(err);
  }
};

const getOne = async (req, res, next) => {
  try {
    const invoice = await invoiceModel.findById(req.params.id);
    if (!invoice) return res.status(404).json({ error: 'Invoice not found' });
    res.json(invoice);
  } catch (err) {
    next(err);
  }
};

const create = async (req, res, next) => {
  try {
    const { project_id, client_id, invoice_no, amount, status, issued_date, due_date, notes } = req.body;
    if (!project_id || !client_id || !invoice_no || !amount) {
      return res.status(400).json({ error: 'project_id, client_id, invoice_no, and amount are required' });
    }
    const invoice = await invoiceModel.create({
      project_id, client_id, invoice_no, amount, status, issued_date, due_date, notes,
      created_by: req.user.id,
    });
    res.status(201).json(invoice);
  } catch (err) {
    next(err);
  }
};

const update = async (req, res, next) => {
  try {
    const { amount, status, due_date, notes, invoice_no } = req.body;
    const invoice = await invoiceModel.update(req.params.id, { amount, status, due_date, notes, invoice_no });
    if (!invoice) return res.status(404).json({ error: 'Invoice not found' });
    res.json(invoice);
  } catch (err) {
    next(err);
  }
};

const remove = async (req, res, next) => {
  try {
    const invoice = await invoiceModel.remove(req.params.id);
    if (!invoice) return res.status(404).json({ error: 'Invoice not found' });
    res.json({ message: 'Invoice deleted' });
  } catch (err) {
    next(err);
  }
};

module.exports = { getAll, getOne, create, update, remove };
