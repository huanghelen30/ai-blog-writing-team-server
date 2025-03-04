import express from "express";
import { HfInference } from "@huggingface/inference";
import cors from "cors";
import dotenv from "dotenv";
import topicRoute from "./routes/topicRoute.js";
import researchRoute from "./routes/researchRoute.js";
import writeRoute from "./routes/writeRoute.js";
import editRoute from "./routes/editRoute.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;
const client = new HfInference(process.env.HF_API_KEY);

app.use(cors());
app.use(express.json());

app.use("/topic", topicRoute(client));
app.use("/research", researchRoute(client));
app.use("/write", writeRoute(client));
app.use("/edit", editRoute(client));

app.get("/", (req, res) => {
	res.send("Server is running");
});

app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});
