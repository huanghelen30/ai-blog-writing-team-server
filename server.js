import express from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import cors from "cors";
import "dotenv/config";
import topicRoutes from "./routes/topicRoutes.js";
import researchRoutes from "./routes/researchRoutes.js";
import writeRoutes from "./routes/writeRoutes.js";
import editRoutes from "./routes/editRoutes.js";
import blogRoutes from "./routes/blogRoutes.js";

const app = express();
const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
const port = process.env.PORT || 8082;

app.locals.model = model;

app.use(cors());
app.use(express.json());

app.use("/topic", topicRoutes(model));
app.use("/research/:blogId", researchRoutes(model));
app.use("/write/:blogId", writeRoutes(model));
app.use("/edit/:blogId", editRoutes(model));
app.use("/blog", blogRoutes());

app.get("/", (req, res) => {
  res.send("Server is running");
});

app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal server error', message: err.message });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});