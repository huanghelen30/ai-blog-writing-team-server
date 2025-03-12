import express from "express";

const researchRoute = (model) => {
  const router = express.Router();

  router.post("/", async (req, res) => {
    try {
      const { topic } = req.body;
      console.log("Received topic:", topic);

      if (!topic) {
        return res.status(400).json({ error: "Topic is required" });
      }

      const prompt = `You are an expert researcher. Provide key facts, trends, and recent updates on the topic: "${topic}" in a bullet point format. 
      
      Your response MUST:
      - Contain exactly 5-7 bullet points
      - Each bullet point should be concise (1-2 sentences)
      - Focus only on the most important information
      - Be organized in order of relevance
      - Include recent developments when applicable
      
      Format your entire response as bullet points only. Do not include any introduction or conclusion paragraphs.`;
      
      console.log("Constructed prompt:", prompt);

      const result = await model.generateContent(prompt);

      let responseText = "No content returned";
      
      if (result && result.response) {
        if (result.response.candidates && 
            result.response.candidates.length > 0 && 
            result.response.candidates[0].content && 
            result.response.candidates[0].content.parts && 
            result.response.candidates[0].content.parts.length > 0 && 
            result.response.candidates[0].content.parts[0].text) {
              
          responseText = result.response.candidates[0].content.parts[0].text.trim();
          console.log("Successfully extracted text from Gemini response structure");
        } else if (result.response.text) {
          responseText = result.response.text.trim();
        } else {
          console.log("Couldn't find text in the expected path, response structure:", 
            JSON.stringify(result.response, null, 2).substring(0, 500) + "...");
        }
      }

      console.log("Extracted response text:", responseText.substring(0, 100) + "...");
      res.json({ research: responseText });

    } catch (error) {
      console.error("Error retrieving research:", error);
      console.error("Error stack:", error.stack);
      res.status(500).json({ error: error.message || "Internal server error" });
    }
  });

  return router;
};

export default researchRoute;