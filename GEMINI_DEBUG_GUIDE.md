# Gemini API Debugging Guide

This guide helps you troubleshoot Gemini API issues in your AI Blog Writing Team application.

## ✅ Issues Fixed

### 1. Model Name Issue (FIXED)
**Problem**: `gemini-1.5-flash` model not found
**Solution**: Updated to `gemini-2.0-flash`
**Files Changed**: 
- `server.js` (line 14)
- `healthCheck.js` (line 36)

### 2. Database Import Issue (FIXED)
**Problem**: Incorrect destructuring of database helper
**Solution**: Fixed import syntax
**Files Changed**: 
- `healthCheck.js` (line 123)

## 🔍 API Call Locations

Here are all the places where Gemini API is called in your codebase:

### 1. Server Initialization
**File**: `server.js:13-14`
```javascript
const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
```

### 2. Topic Generation
**File**: `routes/topicRoutes.js:12`
```javascript
const result = await model.generateContent(prompt);
```

### 3. Blog Writing
**File**: `controllers/writeController.js:34`
```javascript
const cleanResponse = (await model.generateContent(articlePrompt)).response.text().trim()
```

### 4. Content Editing
**File**: `controllers/editController.js:25`
```javascript
const cleanResponse = (await model.generateContent(editPrompt)).response.text().trim()
```

### 5. Research Keyword Extraction
**File**: `controllers/researchController.js:22`
```javascript
const relevantKeyword = (await model.generateContent(KeywordPrompt)).response.text()
```

## 🛠️ How to Debug Gemini API Issues

### 1. Check API Key
```bash
# Make sure your .env file has the API key
echo $API_KEY
# or check the .env file directly
cat .env | grep API_KEY
```

### 2. Test API Connection
```bash
# Run the health check
npm run health

# Or test specific models
node testGeminiModels.js
```

### 3. Check Available Models
The API provides these models (as of 2024):
- `gemini-2.0-flash` ✅ (Currently using)
- `gemini-2.0-flash-001`
- `gemini-2.5-flash`
- `gemini-2.5-pro`
- `gemini-pro-latest`

### 4. Common Error Messages

#### Model Not Found (404)
```
Error fetching from https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent: [404 Not Found]
```
**Solution**: Update model name to a valid one

#### API Key Invalid (401)
```
Error fetching from https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent: [401 Unauthorized]
```
**Solution**: Check your API key in Google AI Studio

#### Quota Exceeded (429)
```
Error fetching from https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent: [429 Too Many Requests]
```
**Solution**: Check your usage limits in Google Cloud Console

#### Rate Limited (429)
```
Error fetching from https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent: [429 Rate Limit Exceeded]
```
**Solution**: Add delays between requests or upgrade your plan

## 🔧 Testing Your API

### Quick Test
```bash
# Test all APIs
npm run health

# Test just Gemini
node -e "
import { GoogleGenerativeAI } from '@google/generative-ai';
import 'dotenv/config';
const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
model.generateContent('Hello').then(r => console.log(r.response.text()));
"
```

### HTTP Endpoint Test
```bash
# Start your server
npm start

# Test via HTTP
curl http://localhost:8082/health
```

## 📊 Monitoring Your API

### 1. Health Check Logs
```bash
# Run with logging
node monitor.js

# Check log file
tail -f health-monitor.log
```

### 2. Real-time Monitoring
```bash
# Watch health status
watch -n 30 'curl -s http://localhost:8082/health | jq .'
```

### 3. Cron Job Monitoring
```bash
# Add to crontab for every 5 minutes
*/5 * * * * cd /path/to/server && node monitor.js >> health-monitor.log 2>&1
```

## 🚨 Troubleshooting Steps

### Step 1: Verify Environment
```bash
# Check if .env file exists and has API_KEY
ls -la .env
grep API_KEY .env
```

### Step 2: Test API Key
```bash
# Test with curl
curl -H "x-goog-api-key: YOUR_API_KEY" \
  "https://generativelanguage.googleapis.com/v1beta/models"
```

### Step 3: Check Model Availability
```bash
# Run model test
node testGeminiModels.js
```

### Step 4: Test Individual Components
```bash
# Test topic generation
curl -X POST http://localhost:8082/topic \
  -H "Content-Type: application/json" \
  -d '{"action": "generate", "userInput": "test topic"}'
```

## 📝 Logging and Debugging

### Enable Debug Logging
Add this to your server startup:
```javascript
// In server.js
process.env.DEBUG = 'google-generative-ai';
```

### Check Console Logs
```bash
# Start server with debug output
DEBUG=* npm start
```

### Monitor API Calls
```javascript
// Add to your controllers for debugging
console.log('Making API call with prompt:', prompt);
const result = await model.generateContent(prompt);
console.log('API response received:', result.response.text().substring(0, 100));
```

## 🔄 Updating Model Names

If Google releases new models, update these files:
1. `server.js` - Main model initialization
2. `healthCheck.js` - Health check model
3. `testGeminiModels.js` - Test script

## 📞 Getting Help

### Google AI Studio
- [Google AI Studio](https://makersuite.google.com/app/apikey) - Manage API keys
- [Documentation](https://ai.google.dev/docs) - Official docs
- [Status Page](https://status.cloud.google.com/) - Service status

### Community Support
- [Google AI Developers Forum](https://discuss.ai.google.dev/)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/google-generative-ai)

## 🎯 Best Practices

1. **Always test after model updates**
2. **Monitor API usage and quotas**
3. **Implement proper error handling**
4. **Use health checks in production**
5. **Keep API keys secure**
6. **Log API calls for debugging**

## 📈 Performance Tips

1. **Use appropriate models** - `gemini-2.0-flash` for speed, `gemini-2.5-pro` for quality
2. **Implement caching** for repeated requests
3. **Add retry logic** for transient failures
4. **Monitor response times** and optimize prompts
5. **Batch requests** when possible
