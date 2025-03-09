import express from "express";

const writeRoute = (model) => {
  const router = express.Router();

  router.post("/", async (req, res) => {
    try {
      const { prompt } = req.body; // Get the prompt from the request body

      if (!prompt) {
        return res.status(400).json({ error: "Prompt is required" });
      }

      // Construct the prompt for Gemini to generate a detailed article
      const articlePrompt = `Write a detailed article based on the following prompt: ${prompt}. Make sure the content is clear, well-structured, and informative, with an engaging introduction and conclusion. Avoid unnecessary fluff and keep it concise.`;

      // Generate content using Gemini API
      const result = await model.generateContent(articlePrompt);
      const responseText = result.response.text().trim();

      res.json({
        content: responseText, // Return the generated content
      });
    } catch (error) {
      console.error("Error generating content:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  return router;
};

export default writeRoute;
