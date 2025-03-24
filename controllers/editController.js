export const editDraft = async (req, res, model) => {
    try {
      const { draft, instructions } = req.body;
      
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

      const cleanResponse = (await model.generateContent(editPrompt)).response.text().trim()
        .replace(/(\*\*|\*|##)/g, "")  
        .replace(/\n+/g, "\n")
        .replace(/([a-z0-9])\n([A-Z])/g, "$1\n\n$2")
        .trim();

      res.json({ cleanResponse });
    } catch (error) {
      res.status(500).json({ error: error.message || "Internal server error" });
    }
  };