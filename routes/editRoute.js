import express from "express";

const editRoute = (client) => {
	const router = express.Router();

	router.post("/", async (req, res) => {
		try {
			const { draft, instructions } = req.body;

			const editCompletion = await client.textGeneration({
				model: "facebook/bart-large-cnn",
				inputs: `Edit this blog post: ${draft}. Follow these instructions: ${instructions}`,
				parameters: { max_new_tokens: 1000 }
			});

			res.json({ refinedDraft: editCompletion.generated_text });
		} catch (error) {
			res.status(500).json({ error: error.message });
		}
	});

	return router;
};

export default editRoute;
