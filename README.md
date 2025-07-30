# AI Blog Writing Team - Server

This is the backend server for the AI Blog Writing Team application. It provides APIs for blog writing, research, editing, and topic management using Google's Generative AI.

## Prerequisites

- Node.js (v16 or higher)
- MySQL database
- Google Cloud Platform account (for Gemini API access)

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Configuration

Create a `.env` file in the root of the server directory with the following variables:

```env
# Database Configuration
DB_HOST=localhost
DB_NAME=your_database_name
DB_USER=your_database_username
DB_PASSWORD=your_database_password

# Google Generative AI (Gemini)
API_KEY=your_google_generative_ai_api_key

# Server Configuration (optional)
PORT=8082
NODE_ENV=development
```

### 3. API Keys Required

#### Google Generative AI (Gemini)
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the generated API key and add it to your `.env` file as `API_KEY`

**Note:** The Gemini API is free for most use cases, but you may need to enable billing for higher usage limits.

### 4. Database Setup

1. Create a MySQL database
2. Update your `.env` file with the correct database credentials
3. Run the database migrations:

```bash
npm run migrate
```

4. (Optional) Seed the database with sample data:

```bash
npm run seed
```

### 5. Start the Server

```bash
npm start
```

For development with auto-restart:

```bash
npx nodemon server.js
```

The server will start on port 8082 (or the port specified in your `.env` file).

## API Endpoints

- `GET /` - Health check
- `POST /topic` - Generate blog topics
- `POST /research/` - Research topics and gather information
- `POST /write/` - Generate blog content
- `POST /edit/` - Edit existing blog content
- `GET /blog` - Retrieve blog posts
- `POST /blog` - Create new blog posts

## Environment Variables Explained

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `DB_HOST` | MySQL database host | Yes | - |
| `DB_NAME` | MySQL database name | Yes | - |
| `DB_USER` | MySQL database username | Yes | - |
| `DB_PASSWORD` | MySQL database password | Yes | - |
| `API_KEY` | Google Generative AI API key | Yes | - |
| `PORT` | Server port | No | 8082 |
| `NODE_ENV` | Environment mode | No | development |

## Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Verify your MySQL server is running
   - Check that your database credentials are correct
   - Ensure the database exists

2. **API Key Error**
   - Verify your Google Generative AI API key is valid
   - Check that you have enabled the Gemini API in your Google Cloud Console
   - Ensure billing is set up if required

3. **Port Already in Use**
   - Change the `PORT` in your `.env` file
   - Or kill the process using the current port

### Getting Help

If you encounter issues:
1. Check the console logs for error messages
2. Verify all environment variables are set correctly
3. Ensure all dependencies are installed
4. Make sure your database is accessible

## Development

- The server uses ES modules (`"type": "module"` in package.json)
- Database migrations are handled by Knex.js
- CORS is enabled for cross-origin requests
- Error handling middleware is configured for production use 