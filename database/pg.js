const { Pool, Client } = require('pg');

const pool = new Pool({
  user: 'postgres',
  password: 'alan',
  database: 'QNA',
  host: 'localhost',
  port: 5432
});

pool.on('error', (err, client) => {
  console.error("Unexpected error on the idle client", err);
  process.exit(-1);
});

module.exports = pool;
