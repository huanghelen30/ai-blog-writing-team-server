# Knex.js PostgreSQL Migration Guide

This guide documents the complete migration from MySQL to PostgreSQL using Knex.js for Render deployment.

## ✅ Migration Completed Successfully

### What Was Changed

1. **Knex Configuration** (`knexfile.js`)
   - ✅ Changed client from `mysql2` to `pg`
   - ✅ Updated connection to use `DATABASE_URL` for production
   - ✅ Added SSL configuration for Render deployment
   - ✅ Maintained development fallback options

2. **Database Helper** (`helpers/db.js`)
   - ✅ Reverted to Knex.js instead of raw PostgreSQL
   - ✅ Added connection testing on startup
   - ✅ Proper error handling and logging

3. **Models** (`models/blogModel.js`, `models/researchModel.js`)
   - ✅ Reverted to Knex query builder syntax
   - ✅ Used `.returning('*')` for PostgreSQL compatibility
   - ✅ Maintained all existing functionality

4. **Database Scripts** (`resetDatabase.js`, `checkDatabase.js`)
   - ✅ Updated to use Knex instead of raw SQL
   - ✅ Maintained all existing functionality
   - ✅ Proper connection cleanup

5. **Health Check** (`healthCheck.js`)
   - ✅ Updated to use Knex for database testing
   - ✅ Maintained existing health check functionality

6. **Environment Template** (`.env.example`)
   - ✅ Created comprehensive environment variable template
   - ✅ Included both production and development options

## 🔧 New Configuration

### Knex Configuration
```javascript
// knexfile.js
export default {
  development: {
    client: 'pg',
    connection: process.env.DATABASE_URL || {
      host: process.env.DB_HOST || 'localhost',
      database: process.env.DB_NAME || 'ai_blog_writing_team',
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'password',
      port: process.env.DB_PORT || 5432,
    },
    // ... migrations and seeds
  },
  production: {
    client: 'pg',
    connection: {
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false }
    },
    // ... migrations and seeds
  },
};
```

### Database Helper
```javascript
// helpers/db.js
import knex from 'knex';
import config from '../knexfile.js';

const environment = process.env.NODE_ENV || 'development';
const db = knex(config[environment]);

// Test connection on startup
db.raw('SELECT 1')
  .then(() => console.log('✅ PostgreSQL connected successfully via Knex'))
  .catch(err => console.error('❌ PostgreSQL connection error:', err.message));

export default db;
```

## 🚀 Render Deployment

### Environment Variables
Set these in your Render dashboard:
```env
DATABASE_URL=postgresql://username:password@host:port/database
API_KEY=your_gemini_api_key
NODE_ENV=production
PORT=8082
```

### Build & Deploy Commands
```bash
# Build Command
npm install

# Start Command
npm start
```

### Database Setup
After deployment, run migrations:
```bash
npm run migrate
```

## 🧪 Testing Results

### Health Check Results
```
✅ Gemini API: HEALTHY (1601ms)
✅ Wikipedia API: HEALTHY (1408ms + 276ms)
✅ Database: HEALTHY (2666ms)
==================================================
Overall Status: HEALTHY
==================================================
```

### Available Commands
```bash
# Test all APIs and database
npm run health

# Check database contents
npm run check-db

# Reset and reseed database
npm run reset-db

# Run migrations
npm run migrate

# Run seeds
npm run seed
```

## 📊 Key Benefits of This Approach

### 1. **Maintainability**
- Uses Knex.js query builder (database-agnostic)
- Consistent API across all database operations
- Easy to read and maintain code

### 2. **PostgreSQL Compatibility**
- Proper SSL configuration for Render
- Uses `DATABASE_URL` for production
- Handles connection pooling automatically

### 3. **Development Flexibility**
- Works with local PostgreSQL
- Falls back to individual environment variables
- Easy to switch between environments

### 4. **Production Ready**
- SSL configuration for secure connections
- Proper error handling and logging
- Connection testing on startup

## 🔍 Code Examples

### Before (Raw PostgreSQL)
```javascript
const result = await pool.query('SELECT * FROM blogs WHERE id = $1', [id]);
return result.rows[0];
```

### After (Knex.js)
```javascript
return await db.select('*').from('blogs').where({ id }).first();
```

### Insert with Returning
```javascript
// PostgreSQL-compatible insert with returning
const [newBlog] = await db('blogs').insert(blogData).returning('*');
```

## 🚨 Important Notes

### 1. **SSL Configuration**
PostgreSQL on Render requires SSL:
```javascript
ssl: { rejectUnauthorized: false }
```

### 2. **Connection String**
Use `DATABASE_URL` for production:
```javascript
connection: {
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
}
```

### 3. **Knex Compatibility**
- Knex.js handles PostgreSQL differences automatically
- No need to change SQL syntax
- Automatic parameter binding

### 4. **Migration Compatibility**
- Existing migrations work with PostgreSQL
- No changes needed to migration files
- Knex handles database-specific syntax

## 📋 Migration Checklist

- [x] Update Knex configuration for PostgreSQL
- [x] Revert models to use Knex query builder
- [x] Update database scripts to use Knex
- [x] Update health check to use Knex
- [x] Create environment variable template
- [x] Test all functionality
- [x] Verify production configuration
- [x] Document all changes

## 🎯 Next Steps

1. **Deploy to Render** with PostgreSQL database
2. **Set environment variables** in Render dashboard
3. **Run migrations** to create tables
4. **Test all endpoints** to ensure functionality
5. **Monitor logs** for any issues

## 🔄 Rollback Plan

If you need to rollback to MySQL:

1. Change `knexfile.js` client back to `mysql2`
2. Update connection configuration
3. Install `mysql2` package
4. Update environment variables
5. Test all functionality

## 📞 Support

The migration is complete and tested! All systems are healthy and ready for Render deployment. 🚀

### Quick Test Commands
```bash
# Test everything
npm run health

# Check database
npm run check-db

# Reset database
npm run reset-db
```

Your backend is now fully migrated to PostgreSQL using Knex.js and ready for Render deployment! 🎉
