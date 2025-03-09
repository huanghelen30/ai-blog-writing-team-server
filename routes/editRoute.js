import express from "express";

const editRoute = (client) => {
	const router = express.Router();

	router.post("/", async (req, res) => {
		try {
			const { draft, instructions } = req.body;

			if (!draft || !instructions) {
				return res.status(400).json({ error: "Both draft and instructions are required" });
			  }
		
			  // Construct a clear prompt for Gemini
			  const prompt = `You are an expert blog editor. Refine the following draft according to the provided instructions. 
			  
			  **Draft:**  
			  ${draft}  
			  
			  **Instructions:**  
			  ${instructions}  
		
			  Return the improved version of the blog post.`;
		
			  // Generate response from Gemini
			  const result = await model.generateContent(prompt);
			  const responseText = result.response.text();
		
			  res.json({ refinedDraft: responseText });
			} catch (error) {
			  console.error("Error refining draft:", error);
			  res.status(500).json({ error: "Internal server error" });
			}
	});
		
		return router;
};

export default editRoute;
