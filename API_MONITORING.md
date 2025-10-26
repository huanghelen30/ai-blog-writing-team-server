# API Monitoring Guide

This document explains how to monitor and test the external API connections in your AI Blog Writing Team application.

## External APIs Used

### 1. Google Generative AI (Gemini API)
- **Purpose**: AI content generation for blog writing, topic generation, and editing
- **Location**: `server.js` (line 12-13)
- **Model**: `gemini-1.5-flash`
- **Environment Variable**: `API_KEY`
- **Documentation**: [Google AI Studio](https://makersuite.google.com/app/apikey)

### 2. Wikipedia API
- **Purpose**: Research data gathering for blog topics
- **Location**: `service/researchService.js`
- **Endpoints**:
  - Search: `https://en.wikipedia.org/w/api.php?action=opensearch`
  - Summary: `https://en.wikipedia.org/api/rest_v1/page/summary/`
- **No API key required**

## Health Check System

### Files Created
- `healthCheck.js` - Main health check class
- `monitor.js` - Monitoring script with logging
- Health endpoint: `GET /health`

### How to Use

#### 1. Command Line Health Check
```bash
# Run full health check
npm run health

# Or run directly
node healthCheck.js
```

#### 2. HTTP Health Check Endpoint
```bash
# Check via HTTP (when server is running)
curl http://localhost:8082/health

# Or visit in browser
http://localhost:8082/health
```

#### 3. Monitoring Script
```bash
# Run with logging
node monitor.js

# Quick check (returns exit code)
node monitor.js --quick
```

### Health Check Output

#### Command Line Output
```
🔍 Starting health checks...

Testing Google Generative AI (Gemini)...
✅ Gemini API: HEALTHY
   Message: Gemini API is responding correctly
   Response Time: 1250ms
   Model: gemini-1.5-flash

Testing Wikipedia API...
✅ Wikipedia API: HEALTHY
   Message: Wikipedia API is responding correctly
   Response Time: 450ms (search) + 320ms (summary)
   Test Topic: artificial intelligence
   Found Title: Artificial intelligence

Testing Database...
✅ Database: HEALTHY
   Message: Database connection is working
   Response Time: 15ms

==================================================
Overall Status: HEALTHY
==================================================
```

#### HTTP Endpoint Response
```json
{
  "status": {
    "gemini": {
      "status": "healthy",
      "message": "Gemini API is responding correctly",
      "responseTime": "1250ms",
      "model": "gemini-1.5-flash"
    },
    "wikipedia": {
      "status": "healthy",
      "message": "Wikipedia API is responding correctly",
      "responseTime": "450ms (search) + 320ms (summary)",
      "testTopic": "artificial intelligence",
      "foundTitle": "Artificial intelligence"
    },
    "database": {
      "status": "healthy",
      "message": "Database connection is working",
      "responseTime": "15ms"
    }
  },
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

## Setting Up Monitoring

### 1. Cron Job (Linux/Mac)
```bash
# Add to crontab to check every 5 minutes
*/5 * * * * cd /path/to/your/server && node monitor.js >> health-monitor.log 2>&1

# Check every hour
0 * * * * cd /path/to/your/server && node monitor.js >> health-monitor.log 2>&1
```

### 2. Windows Task Scheduler
Create a task that runs:
```
node monitor.js
```
Set it to run every 5 minutes or as needed.

### 3. CI/CD Integration
```bash
# In your CI pipeline
node monitor.js --quick
# Exit code 0 = healthy, 1 = unhealthy
```

### 4. Docker Health Check
Add to your Dockerfile:
```dockerfile
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD node monitor.js --quick
```

## Troubleshooting

### Common Issues

#### Gemini API Issues
- **Error**: "API_KEY environment variable not set"
  - **Solution**: Set `API_KEY` in your `.env` file
- **Error**: "API key is invalid"
  - **Solution**: Generate a new API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
- **Error**: "Quota exceeded"
  - **Solution**: Check your usage limits in Google Cloud Console

#### Wikipedia API Issues
- **Error**: "Request timeout"
  - **Solution**: Check your internet connection
- **Error**: "No search results found"
  - **Solution**: Try a different test topic or check if Wikipedia is accessible

#### Database Issues
- **Error**: "Database connection failed"
  - **Solution**: Check your database credentials in `.env`
- **Error**: "Database server not running"
  - **Solution**: Start your MySQL server

### Log Files
- Health check logs: `health-monitor.log`
- Server logs: Check console output when running `npm start`

## API Status Codes

| Status | Description | HTTP Code |
|--------|-------------|-----------|
| `healthy` | API is working correctly | 200 |
| `unhealthy` | API has issues | 503 |
| `unknown` | Status could not be determined | 500 |

## Best Practices

1. **Regular Monitoring**: Run health checks every 5-15 minutes
2. **Alerting**: Set up alerts for unhealthy status
3. **Logging**: Keep logs for debugging and analysis
4. **Testing**: Run health checks before deployments
5. **Documentation**: Update this guide when adding new APIs

## Adding New APIs

To monitor a new external API:

1. Add a new test method to `HealthChecker` class
2. Call the method in `runAllChecks()`
3. Update this documentation
4. Test the new health check

Example:
```javascript
async testNewAPI() {
  try {
    const response = await axios.get('https://api.example.com/health');
    return {
      status: API_STATUS.HEALTHY,
      message: 'New API is working',
      responseTime: `${Date.now() - startTime}ms`
    };
  } catch (error) {
    return {
      status: API_STATUS.UNHEALTHY,
      message: `New API error: ${error.message}`,
      responseTime: null
    };
  }
}
```
