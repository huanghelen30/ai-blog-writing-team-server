import express from "express";
import { HfInference } from "@huggingface/inference";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

const client = new HfInference(process.env.HF_API_KEY);

app.use(express.json());

app.post("/chat", async (req, res) => {
	try {
		const { userMessage } = req.body;
	
	const chatCompletion = await client.chatCompletion({
		model: "deepseek-ai/DeepSeek-R1",
		messages: [
			{
				role: "user",
				content: "What is the capital of France?"
			}
		],
		provider: "fireworks-ai",
		max_tokens: 500,
	});

	res.json({
		reply: chatCompletion.choices[0].message.content,
	});
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});
