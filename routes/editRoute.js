import express from "express";

const editRoute = (model) => {
  const router = express.Router();

  router.post("/", async (req, res) => {
    try {
      const { draft, instructions } = req.body;
      console.log("Received edit request with instructions:", instructions);

      if (!draft || !instructions) {
        return res.status(400).json({ error: "Both draft and instructions are required" });
      }

      // Construct a clear prompt for Gemini
      const prompt = `You are an expert blog editor. Refine the following draft according to the provided instructions. 
      
      **Draft:**  
      ${draft}  
      
      **Instructions:**  
      ${instructions}  

      Focus on improving the draft while maintaining its original message and intent.
      Make the blog post more engaging, clear, and professional.
      Fix any grammar, punctuation, or structural issues.
      Ensure the content flows logically and maintains a consistent tone.
      
      Return only the improved version of the blog post without any additional comments or explanations.`;

      console.log("Constructed edit prompt");

      // Generate response from Gemini
      const result = await model.generateContent(prompt);

      // Extract text based on the correct Gemini API response structure
      let refinedDraft = "No content returned";
      
      if (result && result.response) {
        // Based on the structure we identified in previous routes
        if (result.response.candidates && 
            result.response.candidates.length > 0 && 
            result.response.candidates[0].content && 
            result.response.candidates[0].content.parts && 
            result.response.candidates[0].content.parts.length > 0 && 
            result.response.candidates[0].content.parts[0].text) {
              
          refinedDraft = result.response.candidates[0].content.parts[0].text.trim();
          console.log("Successfully extracted refined draft from Gemini response");
        } else if (result.response.text) {
          // Fallback for possible alternative structure
          refinedDraft = result.response.text.trim();
        } else {
          console.log("Couldn't find text in the expected path, response structure:", 
            JSON.stringify(result.response, null, 2).substring(0, 500) + "...");
        }
      }

      console.log("Draft refined successfully. Length:", refinedDraft.length);
      res.json({ refinedDraft: refinedDraft });
    } catch (error) {
      console.error("Error refining draft:", error);
      console.error("Error stack:", error.stack);
      res.status(500).json({ error: error.message || "Internal server error" });
    }
  });
    
  return router;
};

export default editRoute;