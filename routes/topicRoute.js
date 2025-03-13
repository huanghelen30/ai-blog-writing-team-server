import express from "express";

const topicRoute = (model) => {
  const router = express.Router();

  router.post("/", async (req, res) => {
    try {
      const { userInput } = req.body;

      if (!userInput) {
        return res.status(400).json({ error: "User input is required" });
      }

      const prompt = 
      `Generate a list of 5 distinct and actionable topic 
      ideas based on the following keywords: ${userInput}. 
      Please format the topics in a concise, clear,
       bullet-point list with no explanations or reasoning included.`;

      const result = await model.generateContent(prompt);
      const responseText = result.response.text().trim();

      const topics = responseText.split("\n").map((topic) => topic.trim()).filter(Boolean);

      res.json({ topics });
    } catch (error) {
      console.error("Error generating topics:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  return router;
};

export default topicRoute;
