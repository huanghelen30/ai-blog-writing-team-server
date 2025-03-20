import express from "express";

const editRoutes = (model) => {
  const router = express.Router();

  router.post("/", async (req, res) => {
    try {
      const { draft, instructions, style } = req.body;
      console.log("[EDIT] Received request with instructions:", instructions);
      
      if (!draft || !instructions) {
        return res.status(400).json({ error: "Both draft and instructions are required" });
      }

      const editPrompt = `You are an expert blog editor. Refine the following draft according to the provided instructions. 
      
      **Draft:**  
      ${draft}  
      
      **Instructions:**  
      ${instructions}  
      
      Make the blog post more engaging, clear, and professional.
      Fix grammar, punctuation, and structural issues.
      Ensure logical flow and a consistent tone.
      
      ${style ? `Adopt a ${style} tone.` : "Maintain the original tone."}
      
      Return only the improved version without additional explanations.`;

      console.log("[EDIT] Constructed edit prompt:", editPrompt.substring(0, 500) + "...");
      
      const result = await model.generateContent(editPrompt);

      let refinedDraft = "No content returned";
      
      if (result && result.response) {
        if (result.response.candidates?.[0]?.content?.parts?.[0]?.text) {
          refinedDraft = result.response.candidates[0].content.parts[0].text.trim();
          console.log("[EDIT] Successfully extracted refined draft");
        } else if (result.response.text) {
          refinedDraft = result.response.text.trim();
        } else {
          console.log("[EDIT] Unexpected response structure:", JSON.stringify(result.response, null, 2).substring(0, 500) + "...");
        }
      }
      
      console.log("[EDIT] Draft refined successfully. Length:", refinedDraft.length);
      res.json({ refinedDraft });
    } catch (error) {
      console.error("[EDIT] Error refining draft:", error);
      res.status(500).json({ error: error.message || "Internal server error" });
    }
  });
    
  return router;
};

export default editRoutes;
