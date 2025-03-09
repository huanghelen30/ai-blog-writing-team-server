import express from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import cors from "cors";
import "dotenv/config"
import topicRoute from "./routes/topicRoute.js";
import researchRoute from "./routes/researchRoute.js";
import writeRoute from "./routes/writeRoute.js";
import editRoute from "./routes/editRoute.js";

const app = express();
const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
const port = process.env.PORT || 8082;


app.use(cors());
app.use(express.json());

app.use("/topic", topicRoute(model));
app.use("/research", researchRoute(model));
app.use("/write", writeRoute(model));
app.use("/edit", editRoute(model));

app.get("/", (req, res) => {
	res.send("Server is running");
});

app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});
