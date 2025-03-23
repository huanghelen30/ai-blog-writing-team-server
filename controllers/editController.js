export const editDraft = async (req, res, model) => {
    try {
      const { id } = req.params;
      const { action, draft, instructions } = req.body;
      
      if (!draft || !instructions) {
        return res.status(400).json({ error: "Both draft and instructions are required" });
      }

      const editPrompt = `
      You are an expert blog editor named Max. 
      The user has requested your help to refine a blog post draft.
      Refine the following draft according to the provided instructions. 
      
      **Draft:**  
      ${draft}  
      
      **Instructions:**  
      ${instructions}  
      
      Fix grammar, punctuation, and structural issues.
      Ensure logical flow and a consistent tone.
      
      Return only suggestions for improvement without additional explanations.`;

      const result = await model.generateContent(editPrompt);
      const responseText = result.response.text().trim();
      let cleanResponse = responseText.replace(/(\*\*|\*|##)/g, "");
      cleanResponse = cleanResponse.replace(/\n+/g, "\n").trim()

      res.json({ cleanResponse });
    } catch (error) {
      console.error("[EDIT] Error refining draft:", error);
      res.status(500).json({ error: error.message || "Internal server error" });
    }
  };