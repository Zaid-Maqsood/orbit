const errorHandler = (err, req, res, next) => {
  console.error(err);

  // PostgreSQL error codes
  if (err.code === '23505') {
    return res.status(409).json({ error: 'A record with that value already exists' });
  }
  if (err.code === '23503') {
    return res.status(400).json({ error: 'Referenced record does not exist' });
  }
  if (err.code === '23502') {
    return res.status(400).json({ error: 'A required field is missing' });
  }

  // Validation errors from express-validator
  if (err.type === 'validation') {
    return res.status(400).json({ error: err.message, details: err.details });
  }

  const status = err.status || err.statusCode || 500;
  const message = err.message || 'Internal server error';
  res.status(status).json({ error: message });
};

module.exports = errorHandler;
