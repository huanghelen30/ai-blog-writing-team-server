# PostgreSQL Migration Guide

This guide documents the migration from MySQL to PostgreSQL for Render deployment.

## ✅ Migration Completed

### Changes Made

1. **Installed PostgreSQL package**
   - Added `pg` package for PostgreSQL connectivity
   - Removed `mysql2` dependency

2. **Updated Database Connection**
   - **File**: `helpers/db.js`
   - **Before**: Knex with MySQL2
   - **After**: PostgreSQL Pool with connection string

3. **Updated Knex Configuration**
   - **File**: `knexfile.js`
   - **Before**: MySQL2 client
   - **After**: PostgreSQL client with production SSL support

4. **Converted All Database Queries**
   - **Models**: `blogModel.js`, `researchModel.js`
   - **Scripts**: `resetDatabase.js`, `checkDatabase.js`
   - **Health Check**: `healthCheck.js`
   - **Before**: Knex query builder
   - **After**: Raw PostgreSQL queries with parameterized statements

5. **Added Connection Testing**
   - **File**: `server.js`
   - Added database connection test on startup

## 🔧 New Database Connection

### Connection String Format
```javascript
// For Render deployment
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});
```

### Environment Variables
```env
# For Render deployment
DATABASE_URL=postgresql://username:password@host:port/database

# For local development (optional)
DB_HOST=localhost
DB_NAME=ai_blog_writing_team
DB_USER=postgres
DB_PASSWORD=password
DB_PORT=5432
```

## 📊 Query Changes

### Before (MySQL/Knex)
```javascript
// Knex query builder
const blogs = await db('blogs').select('*').orderBy('updated_at', 'desc');
const blog = await db('blogs').where({ id }).first();
await db('blogs').insert(blogData);
```

### After (PostgreSQL)
```javascript
// Raw PostgreSQL queries
const result = await pool.query('SELECT * FROM blogs ORDER BY updated_at DESC');
const blogs = result.rows;
const result = await pool.query('SELECT * FROM blogs WHERE id = $1', [id]);
const blog = result.rows[0];
await pool.query('INSERT INTO blogs (title, content) VALUES ($1, $2)', [title, content]);
```

## 🚀 Deployment on Render

### 1. Environment Variables
Set these in your Render dashboard:
```
DATABASE_URL=postgresql://username:password@host:port/database
API_KEY=your_gemini_api_key
NODE_ENV=production
PORT=8082
```

### 2. Build Command
```bash
npm install
```

### 3. Start Command
```bash
npm start
```

### 4. Database Setup
After deployment, run migrations:
```bash
npm run migrate
```

## 🧪 Testing the Migration

### 1. Test Database Connection
```bash
npm run health
```

### 2. Test Database Operations
```bash
# Check current data
npm run check-db

# Reset and reseed
npm run reset-db
```

### 3. Test API Endpoints
```bash
# Start server
npm start

# Test health endpoint
curl http://localhost:8082/health

# Test blog endpoints
curl http://localhost:8082/blog
```

## 🔍 Key Differences

### Parameter Binding
- **MySQL**: `?` placeholders
- **PostgreSQL**: `$1, $2, $3` placeholders

### Data Types
- **MySQL**: `AUTO_INCREMENT`
- **PostgreSQL**: `SERIAL` or `GENERATED ALWAYS AS IDENTITY`

### Functions
- **MySQL**: `NOW()`
- **PostgreSQL**: `NOW()` (same)

### Boolean Values
- **MySQL**: `0/1` or `true/false`
- **PostgreSQL**: `true/false`

## 📋 Migration Checklist

- [x] Install PostgreSQL package (`pg`)
- [x] Remove MySQL dependencies (`mysql2`)
- [x] Update database connection (`helpers/db.js`)
- [x] Update Knex configuration (`knexfile.js`)
- [x] Convert blog model queries
- [x] Convert research model queries
- [x] Update health check queries
- [x] Update database reset script
- [x] Update database check script
- [x] Add connection test to server
- [x] Test all functionality

## 🚨 Important Notes

### 1. SSL Configuration
PostgreSQL on Render requires SSL:
```javascript
ssl: { rejectUnauthorized: false }
```

### 2. Connection Pooling
Using PostgreSQL Pool for better performance:
```javascript
const pool = new Pool({ ... });
```

### 3. Error Handling
All database operations now use try/catch blocks for proper error handling.

### 4. Parameterized Queries
All queries use parameterized statements to prevent SQL injection:
```javascript
await pool.query('SELECT * FROM blogs WHERE id = $1', [id]);
```

## 🔄 Rollback Plan

If you need to rollback to MySQL:

1. Reinstall MySQL dependencies:
   ```bash
   npm install mysql2
   ```

2. Revert `helpers/db.js` to Knex configuration
3. Revert `knexfile.js` to MySQL client
4. Revert all model files to Knex queries
5. Update environment variables

## 📈 Performance Considerations

### Connection Pooling
- PostgreSQL Pool manages connections efficiently
- Automatic connection reuse
- Better for high-traffic applications

### Query Optimization
- Raw SQL queries are often faster than ORM
- Direct parameter binding
- Better query planning

### Memory Usage
- Pool connection management
- Reduced memory footprint
- Better garbage collection

## 🎯 Next Steps

1. **Deploy to Render** with PostgreSQL database
2. **Run migrations** to create tables
3. **Test all endpoints** thoroughly
4. **Monitor performance** and logs
5. **Set up monitoring** for database health

## 📞 Support

If you encounter issues:

1. Check Render logs for database connection errors
2. Verify `DATABASE_URL` is correctly set
3. Ensure PostgreSQL database is accessible
4. Test connection with `npm run health`
5. Check SSL configuration for production

The migration is complete and ready for Render deployment! 🚀
