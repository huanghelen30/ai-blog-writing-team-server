import express from "express";

const writeRoute = (model) => {
  const router = express.Router();

  router.post("/", async (req, res) => {
    try {
      const { prompt } = req.body;
      console.log("Received writing prompt:", prompt);

      if (!prompt) {
        return res.status(400).json({ error: "Prompt is required" });
      }

      const articlePrompt = `Write a detailed article based on the following prompt: ${prompt}. 
      
      Your article should:
      - Have a clear, engaging introduction
      - Be well-structured with logical flow between paragraphs
      - Be informative and fact-based
      - Include a concise conclusion
      - Be approximately 500-800 words in length
      - Avoid unnecessary fluff and jargon
      
      Format the article with appropriate headers and paragraph breaks for readability.`;

      console.log("Constructed article prompt");

      const result = await model.generateContent(articlePrompt);

      let articleContent = "No content returned";
      
      if (result && result.response) {
        if (result.response.candidates && 
            result.response.candidates.length > 0 && 
            result.response.candidates[0].content && 
            result.response.candidates[0].content.parts && 
            result.response.candidates[0].content.parts.length > 0 && 
            result.response.candidates[0].content.parts[0].text) {
              
          articleContent = result.response.candidates[0].content.parts[0].text.trim();
          console.log("Successfully extracted article from Gemini response");
        } else if (result.response.text) {
    
          articleContent = result.response.text.trim();
        } else {
          console.log("Couldn't find text in the expected path, response structure:", 
            JSON.stringify(result.response, null, 2).substring(0, 500) + "...");
        }
      }

      console.log("Article generated successfully. Length:", articleContent.length);
      res.json({
        content: articleContent,
      });
    } catch (error) {
      console.error("Error generating content:", error);
      console.error("Error stack:", error.stack);
      res.status(500).json({ error: error.message || "Internal server error" });
    }
  });

  return router;
};

export default writeRoute;