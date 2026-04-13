const { Pool } = require('pg');

// DigitalOcean managed database — connects via DATABASE_URL
const isLocal = process.env.DATABASE_URL?.includes('localhost');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: isLocal ? false : { rejectUnauthorized: false },
  max: 2,
  // Set search_path synchronously at connection time (avoids async race condition
  // that occurs when using pool.on('connect') with client.query())
  options: '-c search_path=saas',
});

// Local DB config (commented out)
// const pool = new Pool({
//   connectionString: 'postgresql://postgres:zaid@localhost:5432/grayphite',
//   options: '-c search_path=saas',
// });

pool.on('error', (err) => {
  console.error('Unexpected error on idle PostgreSQL client', err);
  process.exit(-1);
});

module.exports = pool;
