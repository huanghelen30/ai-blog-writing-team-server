import express from "express";

const topicRoute = (client) => {
	const router = express.Router();
	
	router.post("/", async (req, res) => {
		try {
			const { userInput } = req.body;
		
			const topicCompletion = await client.chatCompletion({
				model: "deepseek-ai/DeepSeek-R1",
				messages: [
					{
						role: "user",
						content: `Generate a list of 5 distinct and actionable topic ideas based on the following keywords: ${userInput}. Please format the topics in a concise, clear, bullet-point list with no explanations or reasoning included.`,

					}
				],
				provider: "sambanova",
				max_tokens: 500,
			});

			const topics = topicCompletion.choices[0].message.content.trim().split("\n");
	
			res.json({
				topics: topics,
			});
		} catch (error) {
			res.status(500).json({ error: error.message });
		}
	});

	return router;
};

export default topicRoute;
