# Database Management Guide

This guide explains how to manage your database, including clearing data and reseeding with sample entries.

## 🗄️ Database Structure

Your database has **2 main tables**:

### 1. `blogs` Table
- `id` - Primary key (auto-increment)
- `selectedTopic` - Blog topic (string)
- `content` - Blog content (text, nullable)
- `status` - Draft or published (enum)
- `created_at` - Timestamp
- `updated_at` - Timestamp

### 2. `research_data` Table
- `research_data_id` - Primary key (auto-increment)
- `blog_id` - Foreign key to blogs table
- `source` - Research source (string)
- `content` - Research content (text)
- `created_at` - Timestamp

## 🚀 Quick Commands

### Clear and Reseed Database
```bash
# Clear all data and reseed with sample entries
npm run reset-db
```

### Check Database Contents
```bash
# View current database contents
npm run check-db
```

### Complete Fresh Start
```bash
# Run migrations and reset database
npm run fresh-start
```

### Use Original Seed Files
```bash
# Use the original Knex seed files
npm run seed
```

## 📋 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run reset-db` | Clear all data and reseed with sample entries |
| `npm run check-db` | View current database contents |
| `npm run fresh-start` | Run migrations + reset database |
| `npm run migrate` | Run database migrations |
| `npm run seed` | Use original Knex seed files |

## 🗑️ What Gets Cleared

When you run `npm run reset-db`:

1. **All existing blogs** are deleted
2. **All existing research data** is deleted
3. **9 new sample blogs** are inserted
4. **9 new research entries** are inserted

## 📊 Sample Data Included

### Blog Topics (9 entries)
1. Artificial Intelligence
2. Machine Learning
3. Blockchain
4. Data Science
5. Cybersecurity
6. Cloud Computing
7. Virtual Reality
8. Quantum Computing
9. 5G Technology

### Research Data (9 entries)
Each blog gets corresponding research data from sources like:
- AI Trends
- Machine Learning Journal
- Blockchain Revolution
- Data Science Insights
- Cybersecurity Today
- Cloud Computing Review
- VR World
- Quantum Computing Weekly
- 5G Network Solutions

## 🔧 Manual Database Operations

### Clear Specific Tables
```javascript
// Clear only blogs
await db('blogs').del();

// Clear only research data
await db('research_data').del();
```

### Add Custom Data
```javascript
// Add a new blog
await db('blogs').insert({
  selectedTopic: 'Your Topic',
  content: 'Your content...',
  status: 'draft'
});

// Add research data for a blog
await db('research_data').insert({
  blog_id: 1,
  source: 'Your Source',
  content: 'Your research content...'
});
```

## 🚨 Important Notes

### Foreign Key Constraints
- Research data has a foreign key to blogs
- Always clear `research_data` before `blogs`
- The reset script handles this automatically

### Data Loss Warning
- `npm run reset-db` **permanently deletes** all existing data
- Make sure to backup important data before running
- Consider using `npm run check-db` first to see what you have

### Environment Variables
Make sure your `.env` file has the correct database credentials:
```env
DB_HOST=localhost
DB_NAME=your_database_name
DB_USER=your_database_username
DB_PASSWORD=your_database_password
```

## 🔍 Troubleshooting

### Database Connection Issues
```bash
# Test database connection
npm run health
```

### Migration Issues
```bash
# Check migration status
npx knex migrate:status --env development

# Rollback migrations if needed
npx knex migrate:rollback --env development
```

### Permission Issues
Make sure your database user has:
- `SELECT` permissions
- `INSERT` permissions
- `UPDATE` permissions
- `DELETE` permissions

## 📈 Monitoring Database

### Check Database Size
```sql
SELECT 
  table_name,
  ROUND(((data_length + index_length) / 1024 / 1024), 2) AS 'Size (MB)'
FROM information_schema.tables
WHERE table_schema = 'your_database_name';
```

### Check Table Row Counts
```bash
npm run check-db
```

### View Recent Activity
```sql
SELECT * FROM blogs ORDER BY created_at DESC LIMIT 10;
SELECT * FROM research_data ORDER BY created_at DESC LIMIT 10;
```

## 🎯 Best Practices

1. **Always backup** before major operations
2. **Use transactions** for complex operations
3. **Test on development** before production
4. **Monitor database size** regularly
5. **Keep migrations simple** and reversible
6. **Document custom changes**

## 🔄 Regular Maintenance

### Weekly Tasks
- Check database size and performance
- Review recent data entries
- Clean up old test data if needed

### Monthly Tasks
- Review and optimize queries
- Check for unused data
- Update sample data if needed

### Before Deployments
- Run `npm run health` to check APIs
- Run `npm run check-db` to verify data
- Test all database operations
