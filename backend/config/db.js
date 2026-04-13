const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT, 10),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  // Set search_path synchronously at connection time (avoids async race condition
  // that occurs when using pool.on('connect') with client.query())
  options: '-c search_path=saas',
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle PostgreSQL client', err);
  process.exit(-1);
});

module.exports = pool;
