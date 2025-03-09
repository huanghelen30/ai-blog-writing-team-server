import express from "express";

const researchRoute = (client) => {
	const router = express.Router();

	router.post("/", async (req, res) => {
		try {
		  const { topic } = req.body;
	
		  if (!topic) {
			return res.status(400).json({ error: "Topic is required" });
		  }
	
		  // Constructing a prompt for Gemini API
		  const prompt = `You are an expert researcher. Provide key facts, trends, and recent updates on the topic: "${topic}". Make sure the information is recent and relevant.`;
	
		  // Generate response using Gemini model
		  const result = await model.generateContent(prompt);
		  const responseText = result.response.text();
	
		  res.json({ research: responseText });
		} catch (error) {
		  console.error("Error retrieving research:", error);
		  res.status(500).json({ error: "Internal server error" });
		}
	});
	  
		return router;
};

export default researchRoute;
