import express from "express";

const topicRoutes = (model) => {
  const router = express.Router();

  router.post("/", async (req, res) => {
    try {
      let { action, userInput, selectedTopic } = req.body;

      if (action === "generate" && userInput) {
        const prompt = `Generate a list of short, clear, and engaging blog topics based on the following: ${userInput}`;
        const result = await model.generateContent(prompt);
        const responseText = result.response.text().trim();

        let cleanResponse = responseText.replace(/(\*\*|\*|##)/g, ""); // Remove markdown symbols
        cleanResponse = cleanResponse.replace(/\n+/g, "\n").trim()

        const topics = cleanResponse
          .split("\n") 
          .map((topic, index) => `${index + 1}. ${topic.trim()}`)  
          .join("\n");

        return res.json({
          message: "Topics generated successfully",
          topics: topics
        });
      }

      if (selectedTopic) {
        return res.json({
          message: `You selected the topic: "${selectedTopic}". Please click 'Save' to create your blog post.`,
          selectedTopic
        });
      }

      return res.status(400).json({ error: "Invalid request" });
    } catch (error) {
      console.error("Server error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });


  return router;
};

export default topicRoutes;
