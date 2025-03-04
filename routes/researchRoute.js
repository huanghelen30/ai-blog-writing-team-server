import express from "express";

const researchRoute = (client) => {
	const router = express.Router();

	router.post("/", async (req, res) => {
		try {
			const { topic } = req.body;

			const researchCompletion = await client.textGeneration({
				model: "deepseek-ai/DeepSeek-R1",
				inputs: `Provide key facts, trends, and recent updates on ${topic}.`,
				parameters: { max_new_tokens: 500 }
			});

			res.json({ research: researchCompletion.generated_text });
		} catch (error) {
			res.status(500).json({ error: error.message });
		}
	});

	return router;
};

export default researchRoute;
