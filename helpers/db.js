import knex from 'knex';
import config from '../knexfile.js';
import "dotenv/config";

const environment = process.env.NODE_ENV || 'development';
const db = knex(config[environment]);

// Test connection on startup
db.raw('SELECT 1')
  .then(() => console.log('✅ PostgreSQL connected successfully via Knex'))
  .catch(err => {
    console.error('❌ PostgreSQL connection error:', err.message);
    console.log('💡 Make sure PostgreSQL is running locally or DATABASE_URL is set for production');
  });

export default db;