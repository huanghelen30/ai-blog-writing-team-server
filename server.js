import express from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import cors from "cors";
import "dotenv/config";
import topicRoutes from "./routes/topicRoutes.js";
import researchRoutes from "./routes/researchRoutes.js";
import writeRoutes from "./routes/writeRoutes.js";
import editRoutes from "./routes/editRoutes.js";
import blogRoutes from "./routes/blogRoutes.js";
import HealthChecker from "./healthCheck.js";
import db from "./helpers/db.js";

const app = express();
const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
const port = process.env.PORT || 8082;

app.locals.model = model;

app.use(cors());
app.use(express.json());

app.use("/topic", topicRoutes(model));
app.use("/research", researchRoutes(model));
app.use("/write/", writeRoutes(model));
app.use("/edit/", editRoutes(model));
app.use("/blog", blogRoutes());

app.get("/", (_req, res) => {
  res.send("Server is running");
});

// Health check endpoint
app.get("/health", async (_req, res) => {
  try {
    const checker = new HealthChecker();
    const healthStatus = await checker.getHealthStatus();
    
    const allHealthy = Object.values(healthStatus.status).every(result => result.status === 'healthy');
    const statusCode = allHealthy ? 200 : 503;
    
    res.status(statusCode).json(healthStatus);
  } catch (error) {
    res.status(500).json({
      error: "Health check failed",
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

app.use((err, _req, res) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal server error', message: err.message });
});

// Test database connection
db.raw('SELECT NOW()')
  .then(res => console.log('Database connected successfully at', res.rows[0].now))
  .catch(err => console.error('Database connection error:', err));

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});